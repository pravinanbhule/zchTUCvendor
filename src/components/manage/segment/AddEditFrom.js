import React, { useState, useEffect } from "react";
import FrmInput from "../../common-components/frminput/FrmInput";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
import FrmTextArea from "../../common-components/frmtextarea/FrmTextArea";
import FrmMultiselect from "../../common-components/frmmultiselect/FrmMultiselect";
import Popup from "../../common-components/Popup";
import FrmCheckbox from "../../common-components/frmcheckbox/FrmCheckbox";
import './Segment.css'

function AddEditForm(props) {
  const {
    title,
    hideAddPopup,
    postItem,
    putItem,
    isEditMode,
    formIntialState,
    frmCountrySelectOpts,
    segmentTypeOpts
  } = props;
  const [formfield, setformfield] = useState(formIntialState);
  const [issubmitted, setissubmitted] = useState(false);
  const [frmCountryOpts, setfrmCountryOpts] = useState([]);
  const [isErrorCheck, setIsErrorCheck] = useState(false);
  const [frmLogTypeOpts, setfrmLogTypeOpts] = useState([
    { label: "Breach log", value: "breachlogs" },
    { label: "Rfe log", value: "rfelogs" },
  ]);
  useEffect(() => {
    fnOnInit();
  }, []);
  const fnOnInit = () => {
    let tempotps = [];
    let selectedcountrylist = formIntialState.countryList;
    frmCountrySelectOpts.forEach((item) => {
      if (isEditMode) {
        let isselected = false;
        selectedcountrylist.forEach((country) => {
          if (item.countryID === country.value) {
            isselected = true;
          }
        });
        if (item.isActive || isselected) {
          tempotps.push(item);
        }
      } else if (item.isActive) {
        tempotps.push(item);
      }
    });
    setfrmCountryOpts(tempotps);
    setformfield(formIntialState);
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    if (isErrorCheck && issubmitted && (name === 'Breach Segment' || name === 'RfE (Australia)' || name === 'RfE (Germany)' || name === 'RfE (LATAM)') && value === true ) {
      setIsErrorCheck(false)
    } 
    if (!isErrorCheck && issubmitted && value === false && (name === 'Breach Segment' || name === 'RfE (Australia)' || name === 'RfE (Germany)' || name === 'RfE (LATAM)')) {
      setIsErrorCheck(true)
    }
    setformfield({ ...formfield, [name]: value });
  };
  const handleSelectChange = (name, value) => {
    setformfield({ ...formfield, [name]: value });
  };
  const handleMultiSelectChange = (name, value) => {
    //const tempval = value.map((item) => item.value);
    setformfield({ ...formfield, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setissubmitted(true);
    if (formfield.segmentName && formfield.countryList.length) {
      formfield.logType = ""
      if (formfield['Breach Segment']) {
        formfield.logType = "7A6294F2-F4CC-4136-AEDC-69056FE245EC"
      }
      if (formfield['RfE (Australia)']) {
        if (formfield.logType === "") {
          formfield.logType = formfield.logType + "391141A0-468E-4462-917F-9F2620D5F51E"
        } else {
          formfield.logType = formfield.logType + ",391141A0-468E-4462-917F-9F2620D5F51E"
        }
      }
      if (formfield['RfE (Germany)']) {
        if (formfield.logType === "") {
          formfield.logType = formfield.logType + "7202C3C8-D380-4F59-AA0B-A94FCF4D1A82"
        } else {
          formfield.logType = formfield.logType + ",7202C3C8-D380-4F59-AA0B-A94FCF4D1A82"
        }
      }
      if (formfield['RfE (LATAM)']) {
        if (formfield.logType === "") {
          formfield.logType = formfield.logType + "FECB51BC-6D06-405D-9415-80A4B92347A9"
        } else {
          formfield.logType = formfield.logType + ",FECB51BC-6D06-405D-9415-80A4B92347A9"
        }
      }
      if (formfield.logType === "") {
        setIsErrorCheck(true);
      } else {
        if (isEditMode) {
          putItem(formfield);
        } else {
          postItem(formfield);
        }
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
              title={"Segment"}
              name={"segmentName"}
              value={formfield.segmentName}
              type={"text"}
              handleChange={handleChange}
              isRequired={true}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
            />
            <FrmMultiselect
              title={"Country"}
              name={"countryList"}
              value={formfield.countryList}
              handleChange={handleMultiSelectChange}
              isRequired={true}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
              selectopts={frmCountryOpts}
            />
            {/*<FrmSelect
              title={"Log Type"}
              name={"logType"}
              value={formfield.logType}
              handleChange={handleSelectChange}
              isRequired={false}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
              selectopts={frmLogTypeOpts}
  />*/}
            <div className="lookup-country">
              {segmentTypeOpts.map((item, i) => {
                return <FrmCheckbox
                  title={item.label}
                  name={item.label}
                  value={formfield[item.label]}
                  handleChange={handleChange}
                  isRequired={false}
                  issubmitted={issubmitted}
                  selectopts={[
                    {
                      label: "",
                      value: true,
                    },
                  ]}
                />
              })}
              {issubmitted && isErrorCheck && (
               <div class="validationError" style={{marginTop: '-17px', marginBottom: '20px'}}>Mandatory field</div>
              )}
            </div>
            <FrmTextArea
              title={"Description"}
              name={"segmentDescription"}
              value={formfield.segmentDescription}
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
