import React, { useState } from "react";
import Popup from "../Popup";
import "./Style.css";
function CopyItem(props) {
  const { title, hidePopup, itemDetails } = props;
  const [itemlink, setitemlink] = useState(itemDetails.link);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setitemlink(value);
  };
  const handleCopyItem = (itemid) => {
    let copyText = document.getElementById("copytext-container");
    copyText.value = itemlink;
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
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
          <div className="row copycontainer frm-field">
            <div className="col-md-12">
              <input
                id="copytext-container"
                type="text"
                name="link"
                value={itemlink}
                onChange={handleChange}
              ></input>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div
                className="btn-container"
                style={{ justifyContent: "center" }}
              >
                <button className={`btn-blue`} onClick={handleCopyItem}>
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default CopyItem;
