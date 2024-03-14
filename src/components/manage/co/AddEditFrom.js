import React, { useState, useEffect } from "react";
import FrmInput from "../../common-components/frminput/FrmInput";
import FrmTextArea from "../../common-components/frmtextarea/FrmTextArea";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
import Popup from "../../common-components/Popup";

function AddEditForm(props) {
  const { hideAddPopup, postItem, putItem, isEditMode, formIntialState } =
    props;

  const [formfield, setformfield] = useState(formIntialState);
  const [issubmitted, setissubmitted] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    setformfield({ ...formfield, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setissubmitted(true);
    if (formfield.coName) {
      formfield.coName = formfield.coName.replace(/\s+$/, '')
      if (isEditMode) {
        putItem(formfield);
      } else {
        postItem(formfield);
      }
    }
  };
  return (
    <Popup {...props}>
      <div className="popup-box">
        <div className="popup-header-container">
          <div className="popup-header-title">Add/Edit CO</div>
          <div className="popup-close" onClick={() => hideAddPopup()}>
            X
          </div>
        </div>
        <div className="popup-formitems">
          <form onSubmit={handleSubmit} id="myForm">
            <FrmInput
              title={"CO Name"}
              name={"coName"}
              value={formfield.coName}
              type={"text"}
              handleChange={handleChange}
              isRequired={true}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
            />
            <FrmTextArea
              title={"Description"}
              name={"coDescription"}
              value={formfield.coDescription}
              handleChange={handleChange}
              isRequired={false}
              validationmsg={""}
              issubmitted={issubmitted}
            />
            <FrmActiveCheckbox
              title={"isActive"}
              name={"isActive"}
              value={formfield.isActive}
              handleChange={handleChange}
              isdisabled={false}
              isRequired={false}
              validationmsg={""}
              issubmitted={issubmitted}
            />
          </form>
        </div>
        <div className="popup-footer-container">
          <div className="btn-container">
            <button className="btn-blue" type="submit" form="myForm">
              {isEditMode ? "Apply" : "Submit"}
            </button>
            <div className="btn-blue" onClick={() => hideAddPopup()}>
              Cancel
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default AddEditForm;
