import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import FrmInput from "../../common-components/frminput/FrmInput";
import FrmToggleSwitch from "../../common-components/frmtoggelswitch/FrmToggleSwitch";
import FrmCheckbox from "../../common-components/frmcheckbox/FrmCheckbox";
import FrmMultiselect from "../../common-components/frmmultiselect/FrmMultiselect";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmInputSearch from "../../common-components/frmpeoplepicker/FrmInputSearch";
import FrmDatePicker from "../../common-components/frmdatepicker/FrmDatePicker";
import FrmInputAutocomplete from "../../common-components/frminputautocomplete/FrmInputAutocomplete";
import moment from "moment";

function BreachAddEditForm(props) {

  const {
    hideAddPopup,
    isReadMode
  } = props;

  const [formfield, setformfield] = useState({})
  const [issubmitted, setissubmitted] = useState(false);
  const [commonfilterOpts, setcommonfilterOpts] = useState({
    classificationFilterOpts: [],
    groupFilterOpts: [],
    entriesFilterOpts: [
      {
        label: "My Entries",
        value: "My Entries",
      },
      {
        label: "All Entries",
        value: "All Entries",
      },
    ],
    customerSegmentFilterOpts: [],
    natureOfBreachFilterOpts: [],
    lobFilterOpts: [],
    sublobFilterOpts: [],
    actionResponsibleFilterOpts: [],
    statusFilterOpts: [],
    entryNumberOpts: [],
    typeOfBreachOpts: [],
    rootCauseBreachOpts: [],
    rangeOfFinancialImpactOpts: [],
    howDetectedOpts: [],
    creatorFilterOpts: [],
    uwrInvolvedOpts: [],
    officeOpts: [],
    ZNASegmentOpts: [],
    ZNASBUOpts: [],
    ZNAMarketBasketOpts: [],
  });
  const [switchOpts, setSwitchOpts] = useState([
    {
      label: "Private",
      value: false,
    },
    {
      label: "Public",
      value: true,
    },
  ]);
  const [accessBreachLogOpts, setaccessBreachLogOpts] = useState([
    {
      label: "",
      value: true,
    },
  ]);
  const [userRoles, setUserRoles] = useState([
    {
      label: "Super Admin",
      name: "isSuperAdmin"
    },
    {
      label: "Global Admin",
      name: "isGlobalAdmin"
    },
    {
      label: "Region Admin",
      name: "isRegionAdmin"
    },
    {
      label: "Country Admin",
      name: "isCountryAdmin"
    },
    {
      label: "Normal User",
      name: "isNormalUser"
    },
  ])
  const [regionopts, setRegionopts] = useState([
    {
      label: "APAC",
      value: "apac"
    },
    {
      label: "EMEA",
      value: "emea"
    },
    {
      label: "Global",
      value: "global"
    },
    {
      label: "LATAM",
      value: "latam"
    },
    {
      label: "ZNA",
      value: "zna"
    },
    {
      label: "Others",
      value: "others"
    }
  ])
  const [statusopts, seStatusopts] = useState([
    {
      label: "Closed",
      value: "closed"
    },
    {
      label: "Pending",
      value: "pending"
    },
    {
      label: "Reopen",
      value: "reopen"
    }
  ])

  const hidePopup = () => {
    hideAddPopup();
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    console.log(name, value);
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    setformfield({ ...formfield, [name]: value });
  }

  const handleSelectChange = (name, value) => {
    setformfield({
      ...formfield,
      [name]: value,
    });
  };

  const handleMultiSelectChange = (name, value) => {
    //const tempval = value.map((item) => item.value);
    setformfield({ ...formfield, [name]: value });
  };

  const handleApproverChange = (name, value) => {
    setformfield({ ...formfield, [name]: value });
  };

  const handleInputSearchChange = (e) => {
    const searchval = e.target.value ? e.target.value : "#$%";
    console.log("searchval", searchval);
    // getAllUsers({ UserName: searchval });
  };

  const handleDateSelectChange = (name, value) => {
    let dateval = value ? moment(value).format("YYYY-MM-DD") : "";
    setformfield({
      ...formfield,
      [name]: dateval,
    });
  };
  const onSearchFilterInputAutocomplete = (name, value) => {
    //const { name, value } = e.target;
    setformfield({
      ...formfield,
      [name]: value,
    });
  };

  const onSearchFilterInput = (e) => {
    const { name, value } = e.target;
    setformfield({
      ...formfield,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    console.log("formfield>>>>", formfield);
    e.preventDefault();
    // setissubmitted(true);
    // if (formfield.znaSegmentId && formfield.sbuName) {
    //   if (isEditMode) {
    //     putItem(formfield);
    //   } else {
    //     postItem(formfield);
    //   }
    // }
  }

  return (
    <div className="addedit-logs-container">
      <div className="addedit-header-container">
        <div className="addedit-header-title">New View for Breach Log</div>
        <div className="header-btn-container">
          <div className="addedit-close btn-blue" onClick={() => hidePopup()}>
            Back
          </div>
        </div>
      </div>
      <div className="popup-formitems logs-form">
        <form onSubmit={handleSubmit} id="myForm">
          <div className="row">
            <div className="col-md-3">
              <FrmInput
                title={"View Name"}
                name={"viewName"}
                value={formfield?.viewName}
                type={"text"}
                handleChange={handleChange}
                isRequired={false}
                issubmitted={issubmitted}
              />
            </div>
            <div className="col-md-3">
              <FrmToggleSwitch
                title={''}
                name={"switch"}
                value={formfield.switch}
                handleChange={handleSelectChange}
                isRequired={false}
                issubmitted={issubmitted}
                selectopts={switchOpts}
              />
            </div>
          </div>
          <div className="border-top font-weight-bold frm-container-bgwhite">
            <div className="mb-4"> User Roles</div>
          </div>
          <div className="border-bottom border-top frm-container-bggray">
            <div className="row m-1 mt-4">
              {userRoles.map((item, i) => {
                return (
                  <div className="col-md-2">
                    <FrmCheckbox
                      title={item.label}
                      name={item.name}
                      value={formfield[item.name]}
                      handleChange={handleChange}
                      isRequired={false}
                      issubmitted={issubmitted}
                      selectopts={accessBreachLogOpts}
                      inlinetitle={true}
                      aftercheckbox={true}
                    />
                  </div>
                )
              })}
            </div>
          </div>
          <div className="frm-container-bgwhite">
            <div className="row">
              <div className="col-md-3">
                <div className="frm-filter">
                  <FrmInputAutocomplete
                    title={"Entry Number"}
                    name={"entityNumber"}
                    type={"input"}
                    handleChange={onSearchFilterInputAutocomplete}
                    value={formfield.entityNumber}
                    options={commonfilterOpts.entryNumberOpts}
                    issubmitted={issubmitted}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <FrmInput
                  title={"Title"}
                  name={"title"}
                  type={"input"}
                  issubmitted={issubmitted}
                  handleChange={onSearchFilterInput}
                  value={formfield.title}
                />
              </div>
              <div className="col-md-3">
                <FrmMultiselect
                  title={"Region"}
                  name={"regionList"}
                  value={formfield.regionList ? formfield.regionList : []}
                  handleChange={handleMultiSelectChange}
                  isRequired={false}
                  issubmitted={issubmitted}
                  selectopts={regionopts}
                />
              </div>
              <div className="col-md-3">
                <FrmMultiselect
                  title={"Country"}
                  name={"countryList"}
                  value={formfield.countryList ? formfield.countryList : []}
                  handleChange={handleMultiSelectChange}
                  isRequired={false}
                  issubmitted={issubmitted}
                  selectopts={regionopts}
                />
              </div>
              <div className="col-md-3">
                <FrmSelect
                  title={"Status"}
                  name={"status"}
                  value={formfield.status}
                  handleChange={handleSelectChange}
                  isRequired={false}
                  issubmitted={issubmitted}
                  selectopts={statusopts}
                />
              </div>
              <div className="col-md-3">
                <FrmInputAutocomplete
                  title={"Action Responsible"}
                  name={"actionResponsible"}
                  type={"input"}
                  handleChange={onSearchFilterInputAutocomplete}
                  value={formfield.actionResponsible}
                  options={
                    commonfilterOpts.actionResponsibleFilterOpts
                  }
                />
              </div>
              <div className="col-md-3">
                <FrmSelect
                  title={"LoB"}
                  name={"lob"}
                  value={formfield.lob}
                  handleChange={handleSelectChange}
                  isRequired={false}
                  issubmitted={issubmitted}
                  selectopts={statusopts}
                />
              </div>
              <div className="col-md-3">
                <FrmSelect
                  title={"Sub LoB"}
                  name={"sublob"}
                  value={formfield.sublob}
                  handleChange={handleSelectChange}
                  isRequired={false}
                  issubmitted={issubmitted}
                  selectopts={statusopts}
                />
              </div>
            </div>
          </div>
          <div className="frm-container-bgwhite">
            <div className="user-view-advance-filter-btn-container">
              <div
                className={`user-view-advance-filter-btn`}
              >
                Advance Search
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <FrmSelect
                  title={"Type of Breach"}
                  name={"typeOfBreach"}
                  value={formfield.typeOfBreach}
                  handleChange={handleSelectChange}
                  isRequired={false}
                  issubmitted={issubmitted}
                  selectopts={statusopts}
                />
              </div>
              <div className="col-md-3">
                <FrmSelect
                  title={"Classification"}
                  name={"classification"}
                  value={formfield.classification}
                  handleChange={handleSelectChange}
                  isRequired={false}
                  issubmitted={issubmitted}
                  selectopts={statusopts}
                />
              </div>
              <div className="col-md-3">
                <FrmSelect
                  title={"Material Breach"}
                  name={"materialbreach"}
                  value={formfield.materialbreach}
                  handleChange={handleSelectChange}
                  isRequired={false}
                  issubmitted={issubmitted}
                  selectopts={statusopts}
                />
              </div>
              <div className="col-md-3">
                <FrmSelect
                  title={"Customer Segment"}
                  name={"customersegment"}
                  value={formfield.customersegment}
                  handleChange={handleSelectChange}
                  isRequired={false}
                  issubmitted={issubmitted}
                  selectopts={statusopts}
                />
              </div>
              <div className="col-md-3">
                <FrmSelect
                  title={"Nature of Breach"}
                  name={"natureofbreach"}
                  value={formfield.natureofbreach}
                  handleChange={handleSelectChange}
                  isRequired={false}
                  issubmitted={issubmitted}
                  selectopts={statusopts}
                />
              </div>
              <div className="col-md-3">
                <FrmSelect
                  title={"How detected"}
                  name={"howdetected"}
                  value={formfield.howdetected}
                  handleChange={handleSelectChange}
                  isRequired={false}
                  issubmitted={issubmitted}
                  selectopts={statusopts}
                />
              </div>
              <div className="col-md-3">
                <FrmSelect
                  title={"Root Cause of the Breach"}
                  name={"rootcauseofthebreach"}
                  value={formfield.rootcauseofthebreach}
                  handleChange={handleSelectChange}
                  isRequired={false}
                  issubmitted={issubmitted}
                  selectopts={statusopts}
                />
              </div>
              <div className="col-md-3">
                <FrmSelect
                  title={"Range of finacial impact"}
                  name={"rangeoffinacialimpact"}
                  value={formfield.rangeoffinacialimpact}
                  handleChange={handleSelectChange}
                  isRequired={false}
                  issubmitted={issubmitted}
                  selectopts={statusopts}
                />
              </div>
              <div className="col-md-3">
                <FrmInputAutocomplete
                  title={"Creator"}
                  name={"creatorName"}
                  type={"input"}
                  handleChange={onSearchFilterInputAutocomplete}
                  value={formfield.creatorName}
                  options={commonfilterOpts.creatorFilterOpts}
                  issubmitted={issubmitted}
                />
              </div>
              <div className="col-md-6 filter-date-container">
                <div className="frm-filter">
                  <FrmDatePicker
                    title={"Date Breach Occurred"}
                    name={"BreachOccurredFromDate"}
                    value={formfield.BreachOccurredFromDate}
                    type={"date"}
                    handleChange={handleDateSelectChange}
                  />
                </div>

                <div className="daterange-title">to</div>

                <div className="frm-filter">
                  <FrmDatePicker
                    title={""}
                    name={"BreachOccurredToDate"}
                    value={formfield.BreachOccurredToDate}
                    type={"date"}
                    handleChange={handleDateSelectChange}
                    minDate={moment(
                      formfield.BreachOccurredFromDate
                    ).toDate()}
                  />
                </div>
              </div>
              <div className="col-md-6 filter-date-container">
                <div className="frm-filter">
                  <FrmDatePicker
                    title={"Due Date"}
                    name={"dueFromDate"}
                    value={formfield.dueFromDate}
                    type={"date"}
                    handleChange={handleDateSelectChange}
                  />
                </div>

                <div className="daterange-title">to</div>

                <div className="frm-filter">
                  <FrmDatePicker
                    title={""}
                    name={"dueToDate"}
                    value={formfield.dueToDate}
                    type={"date"}
                    handleChange={handleDateSelectChange}
                    minDate={moment(formfield.dueFromDate).toDate()}
                  />
                </div>
              </div>
              <div className="col-md-6 filter-date-container">
                <div className="frm-filter">
                  <FrmDatePicker
                    title={"Date Action Closed"}
                    name={"ActionClosedFromDate"}
                    value={formfield.ActionClosedFromDate}
                    type={"date"}
                    handleChange={handleDateSelectChange}
                  />
                </div>

                <div className="daterange-title">to</div>

                <div className="frm-filter">
                  <FrmDatePicker
                    title={""}
                    name={"ActionClosedToDate"}
                    value={formfield.ActionClosedToDate}
                    type={"date"}
                    handleChange={handleDateSelectChange}
                    minDate={moment(
                      formfield.ActionClosedFromDate
                    ).toDate()}
                  />
                </div>
              </div>
              <div className="col-md-6 filter-date-container">
                <div className="frm-filter">
                  <FrmDatePicker
                    title={"Created Date"}
                    name={"createdFromDate"}
                    value={formfield.createdFromDate}
                    type={"date"}
                    handleChange={handleDateSelectChange}
                  />
                </div>

                <div className="daterange-title">to</div>

                <div className="frm-filter">
                  <FrmDatePicker
                    title={""}
                    name={"createdToDate"}
                    value={formfield.createdToDate}
                    type={"date"}
                    handleChange={handleDateSelectChange}
                    minDate={moment(
                      formfield.createdFromDate
                    ).toDate()}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      {!isReadMode ? (
        <div className="popup-footer-container">
          <div className="btn-container">
            {/* {!isEditMode ? (
              <>
                <button
                  className={`btn-blue ${isfrmdisabled && "disable"}`}
                  onClick={handleSaveLog}
                >
                  Save
                </button>
              </>
            ) : (
              ""
            )} */}
            <button
              className={`btn-blue`}
              type="submit"
              form="myForm"
            >
              Submit
            </button>
            <div className="btn-blue" onClick={() => hidePopup()}>
              Cancel
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
const mapActions = {};
export default connect(mapStateToProp, mapActions)(BreachAddEditForm);
