import React from "react";
import { connect } from "react-redux";
import "./Style.css";
function ChatPage({ ...props }) {
    return (
        <div className="unauthorized-message">
            <h1>Please Wait</h1>
            <br></br>
        </div>
    );
}
const mapStateToProp = (state) => {
    return {
        state: state,
    };
};
export default connect(mapStateToProp)(ChatPage);
