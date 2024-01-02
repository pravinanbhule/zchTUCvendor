import React, { useState } from "react";
import FrmInput from "../../common-components/frminput/FrmInput";
import Popup from "../../common-components/Popup";
// import FrmDatePicker from "../../common-components/frmdatepicker/FrmDatePicker";
import moment from "moment";

function AddEditForm(props) {
  const {
    title,
    hideAddPopup,
    postItem,
    putItem,
    isEditMode,
    formIntialState
  } = props;
  const [formfield, setformfield] = useState(formIntialState);
  const [issubmitted, setissubmitted] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false)
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (name === 'emailAddress') {
      if (value.match(mailformat)) {
        setIsEmailError(false)
      } else {
        setIsEmailError(true)
      }
    }
    setformfield({ ...formfield, [name]: value });
  };

  // const handleDateSelectChange = (name, value) => {
  //   let dateval = value ? moment(value).format("YYYY-MM-DD") : "";
  //   setformfield({ ...formfield, [name]: dateval });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setissubmitted(true);
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (formfield.applicationId && formfield.emailAddress) {
      if (formfield.emailAddress.match(mailformat)) {
        if (isEditMode) {
          putItem(formfield);
        } else {
          postItem(formfield);
        }
      } else {
        setIsEmailError(true)
      }
    }
  };
  return (
    <Popup {...props}>
      <div className="popup-box">
        <div className="popup-header-container">
          <div className="popup-header-title">{title}</div>
          <div className="popup-close" onClick={() => hideAddPopup()}>
            X
          </div>
        </div>
        <div className="popup-formitems">
          <form onSubmit={handleSubmit} id="myForm">
            <FrmInput
              title={"Email Address"}
              name={"emailAddress"}
              value={formfield.emailAddress}
              type={"email"}
              handleChange={handleChange}
              isRequired={true}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
              iserror={isEmailError}
              errormsg={"Please input valid email"}
            />
            <FrmInput
              title={"Application ID"}
              name={"applicationId"}
              value={formfield.applicationId}
              type={"text"}
              handleChange={handleChange}
              isRequired={true}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
            />
            {/* <FrmDatePicker
              title={"Expiry Date"}
              name={"expirydate"}
              value={formfield.expirydate}
              type={"date"}
              handleChange={handleDateSelectChange}
              isRequired={true}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
              maxDate={moment().toDate()}
            /> */}
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
