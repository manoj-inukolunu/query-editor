import React from "react";

class Button extends React.Component {
    render() {
        return (
            <>
                <button
                    type={this.props.type}
                    onClick={this.props.onClick}
                    className="rounded border border-blue-500 bg-transparent py-2 px-4 font-semibold
                    text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white">{this.props.name}
                </button>
            </>
        )
    }
}

export default Button