import React, {useState} from "react";
import Button from './button'
import Table from './components/Table'

import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-github";

import {Form, useNavigate} from "react-router-dom";


export default function MiddleComponent() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState("")
    const [error, setError] = useState(undefined)

    function updateResult(data) {
        setResults("Executing query-web " + data)
        fetch('/query', {
            method: "POST",
            body: JSON.stringify({
                "query": data
            }),
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            }
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.text();
            }
        }).then((response) => {
            setResults(response)
        });
    }

    return (
        <div className="flex w-3/5 h-auto flex-col mx-10">
            <QueryTextComponent query={query} result={results} setResult={updateResult}></QueryTextComponent>
            <QueryResultComponent tableData={results}update={updateResult}></QueryResultComponent>
        </div>
    )

}


class QueryTextComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: undefined,
            result: props.result
        }
    }


    handleAceText(value) {
        this.setState({
            query: value
        });
    }

    executeQuery(query) {
        this.setState({
            result: query,
            query: query
        })
        this.props.setResult(query)
    }

    logout(){
        localStorage.clear();
        window.location='/logout'
    }

    render() {
        return (

            <div className='flex flex-col py-4 h-1/3'>
                <div id="editor"></div>
                <AceEditor
                    ref="aceEditor"
                    mode="mysql"
                    fontSize={16}
                    minLines={15}
                    maxLines={10}
                    width="100%"
                    theme="github"
                    className="border-2  mx-2 my-2"
                    name="editor"
                    onChange={(value) => this.handleAceText(value)}
                    placeholder="Write your Query here..."
                    showGutter
                    showLineNumbers
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                    }}
                    editorProps={{$blockScrolling: true}}
                />
                <div className=" flex flex-row-reverse">
                    <Button name="Logout" onClick={() => {
                        this.logout()
                    }}/>
                    <Button name="Execute" onClick={() => {
                        this.executeQuery(this.state.query)
                    }}/>
                </div>
            </div>
        )
    }
}


function QueryResultComponent({tableData, error}) {

    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        navigate('/createModel', {
            state: {
                query: "Hello"
            },
        })
    }

    return (
        <div className="flex flex-col  h-2/3 mx-2 my-2">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <Table data={tableData}/>
            </div>
            <div className="grid place-items-end mx-2 my-2">
                {/*<Form method="get" action="/createModel" onSubmit={handleSubmit}>*/}
                {/*    <Button name="Create Model" type="submit"/>*/}
                {/*</Form>*/}

            </div>
        </div>

    )

}