import decimal
import json
import urllib.parse

import jwt
import jaydebeapi
import requests
from flask_cors import CORS, cross_origin
from requests_oauthlib import OAuth2Session
import redis

from flask import Flask, request, session, redirect, url_for, render_template, make_response
from flask import Response
from salesforcecdpconnector.connection import SalesforceCDPConnection

app = Flask(__name__,
            static_url_path='/',
            static_folder='/opt/query/build')
cors = CORS(app)
connections = {}

red = redis.Redis(host='localhost', port=6379, db=0)

states = {}
tokens = {}


def handle_get():
    state = request.args['state']
    client_id = states[state]['clientId']
    client_secret = states[state]['clientSecret']
    resp = requests.post(url="https://login.salesforce.com/services/oauth2/token",
                         data={'grant_type': 'authorization_code',
                               'code': request.args['code'],
                               'client_id': client_id,
                               'client_secret': client_secret,
                               'redirect_uri': states[state]['redirectUri']
                               })
    data = resp.json()
    tokens[data['access_token']] = data
    properties = {
        'instanceUrl': data['instance_url'],
        'coreToken': data['access_token'],
        'refreshToken': data['refresh_token'],
        'clientId': client_id,
        'clientSecret': client_secret
    }

    conn = jaydebeapi.connect("com.salesforce.cdp.queryservice.QueryServiceDriver",
                              "jdbc:queryService-jdbc:" + data['instance_url'],
                              properties, "/opt/query/Salesforce-CDP-jdbc-1.19.0-java8.jar")
    red.hset(data['access_token'], 'client_id', client_id)
    red.hset(data['access_token'], 'client_secret', client_secret)
    red.hset(data['access_token'], 'refresh_token', data['refresh_token'])

    connections[data['access_token']] = conn
    response = make_response(redirect('https://app.query.migtunnel.net/queryPage'))
    response.set_cookie('access_token', data['access_token'])
    return response


def is_loggedin():
    return request.cookies.get('access_token') is not None


@app.route('/', methods=['GET'])
@cross_origin()
def home():
    return app.send_static_file('index.html')


@app.route('/login/', methods=['POST', 'GET'])
@cross_origin()
def login():
    if request.method == 'POST':
        return handle_post()
    else:
        return handle_get()


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


@app.route('/callback/', methods=['GET'])
@cross_origin()
def callback():
    return handle_get()


def handle_post():
    print(request.form)
    client_id = request.form.get('clientId')
    redirect_uri = request.form.get('redirectUri')
    scope = 'api refresh_token cdp_profile_api cdp_query_api'

    salesforce = OAuth2Session(client_id, scope=scope, redirect_uri=redirect_uri)
    authorization_url, state = salesforce.authorization_url('https://login.salesforce.com/services/oauth2/authorize')
    print(authorization_url)
    # State is used to prevent CSRF, keep this for later.
    states[state] = request.form
    print(states[state])
    return redirect(authorization_url)


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    cookie = request.cookies.get('access_token')
    if cookie is None:
        return redirect(url_for('home', _scheme='https', _external=True))
    red.delete(cookie)
    tokens[cookie] = None
    connections[cookie] = None
    response = redirect(url_for('home', _scheme='https', _external=True))
    response.delete_cookie('access_token')
    return response


def get_token():
    header = request.headers.get('access_token')
    if header is not None and header != 'null':
        return header
    cookie = request.cookies.get('access_token')
    if cookie is not None:
        return cookie
    return None


@app.route('/listTables', methods=['GET'])
def list_tables():
    token = get_token()
    conn = connections[token]
    results = conn.jconn.getMetaData().getTables(None, None, "%", None)
    results.getMetaData()
    schema = []
    while results.next():
        table_name = results.getObject('TABLE_NAME')
        d = {'name': table_name, 'cols': []}
        cols = conn.jconn.getMetaData().getColumns(None, None, table_name, '%')
        while cols.next():
            d['cols'].append({"name": cols.getObject('COLUMN_NAME'), "type": cols.getObject('SQL_DATA_TYPE')})
        schema.append(d)

    return json.loads(json.dumps(schema, default=vars))


@app.route('/query', methods=['GET', 'POST'])
def query():
    try:
        access_token = request.cookies.get('access_token')
        client_id = red.hget(access_token, 'client_id')
        client_secret = red.hget(access_token, 'client_secret')
        refresh_token = red.hget(access_token, 'refresh_token')
        conn = SalesforceCDPConnection("https://login.salesforce.com",
                                       client_id=client_id,
                                       client_secret=client_secret,
                                       core_token=access_token,
                                       refresh_token=refresh_token
                                       )
        # print(request.json())
        query_str = request.get_json()['query']
        print(query_str)
        df = conn.get_pandas_dataframe(query_str)
        data = []
        cols = {}
        rev = {}
        idx = 0
        for col in df.columns.to_list():
            cols[idx] = col
            rev[col] = idx
            idx += 1
        data.append(cols)
        for i in range(len(df)):
            curr = {}
            for key in df.iloc[i].keys().to_list():
                curr[rev[key]] = df.iloc[i][key]
            data.append(curr)
        return Response(json.dumps(data, cls=DecimalEncoder), headers={"Content-type": "application/json"})
    except Exception as e:
        return e.__str__(), 400


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return str(o)
        return super(DecimalEncoder, self).default(o)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3030)
