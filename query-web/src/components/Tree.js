import {useState} from "react";

function Tree({nodes}){
    if(nodes===undefined){
        return <div>

        </div>
    }
   const nodeData =  nodes.map(node=><TreeNode node={node}/>)
    return(
        <div>
            {nodeData}
        </div>
    )
}

function RightIcon({hidden}) {
    let downClass='';
    if(hidden){
        downClass = 'w-5 h-5';
    }else{
        downClass = 'w-5 h-5 origin-center rotate-90';
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
             className={downClass}>
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5
            4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
    )
}

function TreeNode({node}){

    const [isHidden,setIsHidden] = useState(true)

    const nodeDetails = node.cols.map(nodeData=>
        <li className='px-5 mx-1 my-1 font-medium'>{nodeData.name}</li>)

    function setHidden() {
        setIsHidden(!isHidden);
    }

    return(
        <ul className='my-1 font-bold' style={{'font-family' : 'consolas'}}>
            <li className='flex flex-row hover:bg-gray-100 cursor-pointer' onClick={setHidden}>
                <RightIcon hidden={isHidden}/>
                <div>
                    {node.name}
                </div>
            </li>
            <ul className={isHidden ? 'hidden' : ''}>
                {nodeDetails}
            </ul>

        </ul>
    )

}

export default Tree;