import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

function AddEditForm(props) {

  const {
    title,
    hideAddPopup
  } = props;

  const hidePopup = () => {
    hideAddPopup();
  };

  return (
    <div className="addedit-logs-container">
      <div className="addedit-header-container">
        <div className="addedit-header-title">New View for {title}</div>
        <div className="header-btn-container">
          <div className="addedit-close btn-blue" onClick={() => hidePopup()}>
            Back
          </div>
        </div>
      </div>
    </div>
  );
}
const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
const mapActions = {};
export default connect(mapStateToProp, mapActions)(AddEditForm);
