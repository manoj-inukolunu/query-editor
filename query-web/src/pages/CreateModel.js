import {useLocation} from "react-router-dom";

export default function CreateModel(){
    const location = useLocation();
    const state = location?.state;
    console.log(state);
    return (
        <div>
            <ModelTraining state={state}></ModelTraining>
            <LogComponent></LogComponent>
            <ResultComponent></ResultComponent>
        </div>
    )
}

function ModelTraining({state}){
    return(
        <div className="flex flex-col">
            <textarea>{state.query}</textarea>
            <textarea>{state.features}</textarea>
            <input type="text" value="Numeric Features"/>
            <input type="text" value="Categorical Features"/>
            <input type="text" value="Label Column"/>
        </div>
    )
}

function LogComponent(){
    return(
        <div>Logs</div>
    )
}

function ResultComponent(){
    return(
        <div>API Gateway deployment result</div>
    )
}