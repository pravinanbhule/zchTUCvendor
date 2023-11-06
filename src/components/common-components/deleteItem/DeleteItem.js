import React, { useState } from "react";
import Popup from "../Popup";
import { alertMessage } from "../../../helpers";
function DeleteItem(props) {
  const { title, deleteItem, hidePopup, itemDetails } = props;
  const handleDelete = () => {
    deleteItem(itemDetails.id, itemDetails.isSubmit);
  };
  return (
    <Popup {...props}>
      <div
        className="popup-box small"
        style={{
          position: "relative",
          left: "0",
          margin: "0 auto",
          top: "100px",
        }}
      >
        <div className="popup-header-container">
          <div className="popup-header-title">{title}</div>
          <div className="popup-close" onClick={() => hidePopup()}>
            X
          </div>
        </div>

        <div className="popup-content">
          <div className="row">
            <div
              className="col-md-12"
              style={{ marginBottom: "20px", textAlign: "center" }}
            >
              {alertMessage.commonmsg.deleteConfirm}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div
                className="btn-container"
                style={{ justifyContent: "center" }}
              >
                <button className={`btn-blue`} onClick={handleDelete}>
                  Ok
                </button>
                <button className={`btn-blue`} onClick={() => hidePopup()}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default DeleteItem;
