import React, { useState, useEffect } from "react";
import FrmInput from "../../common-components/frminput/FrmInput";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
import FrmTextArea from "../../common-components/frmtextarea/FrmTextArea";
import Popup from "../../common-components/Popup";

function AddEditForm(props) {
  const {
    title,
    hideAddPopup,
    postItem,
    putItem,
    isEditMode,
    formIntialState,
    frmRegionSelectOpts,
  } = props;
  const [formfield, setformfield] = useState({});
  const [issubmitted, setissubmitted] = useState(false);
  const [frmregionopts, setfrmregionopts] = useState([]);
  useEffect(() => {
    fnOnInit();
  }, []);
  const fnOnInit = () => {
    let regionotps = [];
    frmRegionSelectOpts.forEach((item) => {
      if (isEditMode) {
        if (item.isActive || item.regionID === formIntialState.regionID) {
          regionotps.push(item);
        }
      } else if (item.isActive) {
        regionotps.push(item);
      }
    });
    setfrmregionopts(regionotps);
    setformfield(formIntialState);
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    setformfield({ ...formfield, [name]: value });
  };
  const handleSelectChange = (name, value) => {
    setformfield({ ...formfield, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setissubmitted(true);
    if (formfield.regionID && formfield.countryName) {
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
          <div className="popup-header-title">{title}</div>
          <div className="popup-close" onClick={() => hideAddPopup()}>
            X
          </div>
        </div>
        <div className="popup-formitems">
          <form onSubmit={handleSubmit} id="myForm">
            <FrmInput
              title={"Country"}
              name={"countryName"}
              value={formfield.countryName}
              type={"text"}
              handleChange={handleChange}
              isRequired={true}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
            />
            <FrmSelect
              title={"Region"}
              name={"regionID"}
              value={formfield.regionID}
              handleChange={handleSelectChange}
              isRequired={true}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
              selectopts={frmregionopts}
            />
            <FrmTextArea
              title={"Description"}
              name={"countryDescription"}
              value={formfield.countryDescription}
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
              isdisabled={!formfield.isActiveEnable}
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
