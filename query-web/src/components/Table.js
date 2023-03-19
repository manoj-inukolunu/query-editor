function Table({data}) {
    if (data === undefined || data === "") {
        return (
            <div>
            </div>
        )
    } else if (typeof data === 'string' || data instanceof String) {
        return (
            <div>
                {data}
            </div>
        )
    }
    const th = data[0];
    const rows = data.slice(1, data.length);
    return (
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400 overflow-scroll'>
            <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                {Object.keys(th).map(r => <th scope="col" className='sticky top-0 px-6 py-3 bg-red-300'>{th[r]}</th>)}
            </tr>
            </thead>
            {rows.map(r => <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                {Object.keys(r).map(t => <td className="px-6 py-4 border-2 ">{r[t]}</td>)}
            </tr>)}
        </table>
    )
}

export default Table;