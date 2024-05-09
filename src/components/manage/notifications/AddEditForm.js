import React, { useState, useEffect } from "react";
import FrmInput from "../../common-components/frminput/FrmInput";
import FrmTextArea from "../../common-components/frmtextarea/FrmTextArea";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
import Popup from "../../common-components/Popup";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmMultiselect from "../../common-components/frmmultiselect/FrmMultiselect";

function AddEditForm(props) {
  const {
    hideAddPopup,
    postItem,
    putItem,
    isEditMode,
    formIntialState,
    logTypeOps,
    countryAllOpts,
    logNotificationOpts
  } = props;

  const [formfield, setformfield] = useState(formIntialState);
  const [issubmitted, setissubmitted] = useState(false);

  useEffect(() => {
    console.log("formIntialState>>>", formIntialState);
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    setissubmitted(true);
    if (isEditMode) {
      putItem(formfield);
    } else {
      postItem(formfield);
    }
  };

  const handleSelectChange = (name, value, _, label) => {
    setformfield({
      ...formfield,
      [name]: value,
    });
  };

  const handleMultiSelectChange = (name, value) => {
    //const tempval = value.map((item) => item.value);
    setformfield({ ...formfield, [name]: value });
  };

  return (
    <Popup {...props}>
      <div className="popup-box">
        <div className="popup-header-container">
          <div className="popup-header-title">Add/Edit Notifications</div>
          <div className="popup-close" onClick={() => hideAddPopup()}>
            X
          </div>
        </div>
        <div className="popup-formitems">
          <form onSubmit={handleSubmit} id="myForm">

            <FrmSelect
              title={"Log Type"}
              name={"logType"}
              value={formfield.logType}
              handleChange={handleSelectChange}
              isRequired={false}
              issubmitted={issubmitted}
              selectopts={logTypeOps}
            />

            <FrmMultiselect
              title={"Notification"}
              name={"logNotification"}
              value={formfield.logNotification ? formfield.logNotification : []}
              handleChange={handleMultiSelectChange}
              issubmitted={issubmitted}
              selectopts={logNotificationOpts}
              isAllOptNotRequired={true}
            />

            <FrmSelect
              title={"Country"}
              name={"countryId"}
              value={formfield.countryId}
              handleChange={handleSelectChange}
              isRequired={false}
              issubmitted={issubmitted}
              selectopts={countryAllOpts}
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
