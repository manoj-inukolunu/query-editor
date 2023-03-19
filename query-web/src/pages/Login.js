import {useState} from "react";

export default function Login() {
    return (
        <div className="grid h-screen place-content-center">
            <div className="w-96 border-cyan-800">
                <form className="mb-4 rounded bg-white px-8 pt-6 pb-8 shadow-md" action="/login/" method="POST">
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="username"> Client
                            Id </label>
                        <input name="clientId"
                               className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                               id="username" type="text" placeholder="Client Id"/>
                    </div>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="password"> Client
                            Secret </label>
                        <input name="clientSecret"
                               className="focus:shadow-outline mb-3 w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                               id="password" type="password" placeholder="******************"/>
                    </div>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="username"> Redirect
                            URI </label>
                        <input name="redirectUri"
                               className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                               id="redirect_uri" type="text" placeholder="Redirect URI"
                               value="https://query.migtunnel.net/callback"/>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
                            type="submit">Authorize
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}