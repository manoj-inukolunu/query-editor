import LeftSideBar from './LeftSideBar'
import MiddleComponent from './MiddleComponent'
import React from "react";
import {useSearchParams} from "react-router-dom";

export default function Main() {

    return (
        <div className="flex h-screen">
            <LeftSideBar></LeftSideBar>
            <MiddleComponent></MiddleComponent>
        </div>
    )
}

