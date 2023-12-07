import React from "react";
import Popup from "../Popup";
import { useHistory } from "react-router-dom";
function ConfirmPopup(props) {
  const { title, hidePopup, itemDetails } = props;
  const history = useHistory()
  const handleConfirm = () => {
    history.push("/exemptionlogs")
    hidePopup()
  };
  const handleCancel = ()=>{
    hidePopup()
  }
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
          <div className="row copycontainer frm-field">
            <div className="col-md-12">
                {itemDetails}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div
                className="btn-container"
                style={{ justifyContent: "center" }}
              >
                <button className={`btn-blue`} onClick={handleConfirm}>
                    YES
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div
                className="btn-container"
                style={{ justifyContent: "center" }}
              >
                <button className={`btn-blue`} onClick={handleCancel}>
                    NO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default ConfirmPopup;
