import React, {useEffect, useState} from "react";

import Tree from "./components/Tree";
import {useNavigate} from "react-router-dom";

const tables = [
    {
        "name": "Individual",
        "cols": [
            {"name": "firstname", type: "text"},
            {"name": "email", type: "text"},
            {"name": "id", type: "numeric"}
        ]
    },
    {
        "name": "Order",
        "cols": [
            {"name": "ordername", type: "text"},
            {"name": "order_id", type: "numeric"},
            {"name": "individual_id", type: "numeric"}
        ]
    }
]

function LeftSideBar() {
    const [data, setData] = useState(undefined);
    const navigate = useNavigate();

    useEffect(()=>{
        fetch('/listTables', {
        method: 'GET'
    }).then(response => {
        if (response.status === 401) {
            navigate("/");
        }
        return response.json()
    }).then(d => setData(d));
    },[])




    return (
        <div className="h-auto w-2/5 mx-5 my-5 overflow-scroll ">
            <Tree nodes={data}/>
        </div>
    )

}

export default LeftSideBar