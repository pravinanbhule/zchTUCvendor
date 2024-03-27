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
import { breachlogActions, commonActions, countryActions, dashboardActions, lobActions, lookupActions, officeActions, regionActions, segmentActions, sublobActions, userActions, znaorgnization1Actions, znaorgnization2Actions, znaorgnization3Actions } from "../../../actions";
import { dynamicSort, isNotEmptyValue } from "../../../helpers";
import { REGION_EMEA, REGION_ZNA } from "../../../constants";

function BreachAddEditForm(props) {

  const {
    breachlogState,
    countryState,
    regionState,
    segmentState,
    lobState,
    sublobState,
    dashboardState,
    officeState,
    znaorgnization1State,
    znaorgnization2State,
    znaorgnization3State,
  } = props.state;

  const {
    hideAddPopup,
    isReadMode,
    getAllCountry,
    getAllRegion,
    getAlllob,
    getAllSublob,
    getAllSegment,
    getLookupByType,
    clearDashboardClick,
    getAllOffice,
    getallZNASegments,
    getallZNASBU,
    getallZNAMarketBasket,
    getLogUsers,
    getActionResponsible,
  } = props;

  const [formfield, setformfield] = useState({})
  const [issubmitted, setissubmitted] = useState(false);
  const selectInitiVal = {
    label: "Select",
    value: "",
  };
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
  const [regionFilterOpts, setregionFilterOpts] = useState([]);
  const [regionOptsAll, setregionOptsAll] = useState([]);
  useEffect(() => {
    let selectOpts = [];
    regionState.regionItems.forEach((item) => {
      selectOpts.push({
        ...item,
        label: item.regionName.trim(),
        value: item.regionID,
      });
    });
    selectOpts.sort(dynamicSort("label"));
    setregionFilterOpts([...selectOpts]);
    setregionOptsAll([...selectOpts]);
  }, [regionState.regionItems]);

  const [countryFilterOpts, setcountryFilterOpts] = useState([]);
  const [countrymapping, setcountrymapping] = useState([]);

  useEffect(() => {
    let selectOpts = [];
    let tempCountryMapping = [];
    let tempRegionListObj = {};

    countryState.countryItems.forEach((item) => {
      selectOpts.push({
        ...item,
        label: item.countryName.trim(),
        value: item.countryID,
        regionId: item.regionID,
      });

      if (!tempRegionListObj[item.regionID]) {
        tempCountryMapping.push({
          region: item.regionID,
          country: [
            {
              label: item.countryName,
              value: item.countryID,
            },
          ],
        });
      } else {
        tempCountryMapping.forEach((countryitem) => {
          if (countryitem.region === item.regionID) {
            countryitem.country.push({
              label: item.countryName,
              value: item.countryID,
            });
          }
        });
      }
      tempRegionListObj[item.regionID] = item.countryName;
    });
    selectOpts.sort(dynamicSort("label"));
    setcountrymapping([...tempCountryMapping]);
    setcountryFilterOpts([...selectOpts]);
  }, [countryState.countryItems]);
  

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

  useEffect(() => {
    fnOnInit();
  }, []);

  const fnOnInit = async () => {
    getAllCountry();
    getAllRegion();
    getAllSegment({ isActive: true });
    getAlllob({ isActive: true });
    getAllSublob({ isActive: true });
    getAllOffice({ isActive: true });
    getallZNASegments();
    getallZNASBU();
    getallZNAMarketBasket();
    loadCreatorUsers();
    loadActionResponsibleUser();
    loadUWRInvolvedUser();
    const lookupvalues = await Promise.all([
      getLookupByType({ LookupType: "BreachClassification" }),
      getLookupByType({ LookupType: "BreachNature" }),
      getLookupByType({ LookupType: "BreachStatus" }),
      getLookupByType({ LookupType: "BreachType" }),
      getLookupByType({ LookupType: "BreachRootCause" }),
      getLookupByType({ LookupType: "BreachFinancialRange" }),
      getLookupByType({ LookupType: "BreachDetection" }),
    ]);
    let tempClassification = lookupvalues[0];
    let tempNatureOfBreach = lookupvalues[1];
    let tempStatus = lookupvalues[2];
    let tempTypeOfBreach = lookupvalues[3];
    let tempRootCauseBreach = lookupvalues[4];
    let tempRangeFinImpact = lookupvalues[5];
    let tempHowDetected = lookupvalues[6];

    tempClassification = tempClassification.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    tempNatureOfBreach = tempNatureOfBreach.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    tempStatus = tempStatus.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    tempTypeOfBreach = tempTypeOfBreach.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    tempRootCauseBreach = tempRootCauseBreach.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    tempRangeFinImpact = tempRangeFinImpact.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    tempHowDetected = tempHowDetected.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));

    //tempClassification.sort(dynamicSort("label"));
    tempNatureOfBreach.sort(dynamicSort("label"));
    tempStatus.sort(dynamicSort("label"));
    tempTypeOfBreach.sort(dynamicSort("label"));
    tempRootCauseBreach.sort(dynamicSort("label"));
    tempRangeFinImpact.sort(dynamicSort("label"));
    tempHowDetected.sort(dynamicSort("label"));
    setcommonfilterOpts((prevstate) => ({
      ...prevstate,
      classificationFilterOpts: [selectInitiVal, ...tempClassification],
      natureOfBreachFilterOpts: [selectInitiVal, ...tempNatureOfBreach],
      statusFilterOpts: [selectInitiVal, ...tempStatus],
      typeOfBreachOpts: [selectInitiVal, ...tempTypeOfBreach],
      rootCauseBreachOpts: [selectInitiVal, ...tempRootCauseBreach],
      rangeOfFinancialImpactOpts: [selectInitiVal, ...tempRangeFinImpact],
      howDetectedOpts: [selectInitiVal, ...tempHowDetected],
    }));
    if (dashboardState.status) {
      setformfield((prevfilter) => ({
        ...prevfilter,
        breachStatus: dashboardState.status,
      }));
      clearDashboardClick();
    }
  };

  const loadCreatorUsers = async () => {
    let tempCreator = await getLogUsers({
      LogType: "breachlogs",
      FieldName: "CreatedBy",
    });
    tempCreator = tempCreator?.map((item) => ({
      label: item.userName,
      value: item.emailAddress,
    }));
    tempCreator.sort(dynamicSort("label"));
    tempCreator = tempCreator.map((item) => item.label);
    setcommonfilterOpts((prevstate) => ({
      ...prevstate,
      creatorFilterOpts: [...tempCreator],
    }));
  };

  const loadActionResponsibleUser = async () => {
    let tempActionResponsible = await getActionResponsible();
    tempActionResponsible = tempActionResponsible.map((item) => ({
      label: item.userName,
      value: item.emailAddress,
    }));
    tempActionResponsible.sort(dynamicSort("label"));
    //added below line to change filter type to input search
    tempActionResponsible = tempActionResponsible.map((item) => item.label);
    setcommonfilterOpts((prevstate) => ({
      ...prevstate,
      actionResponsibleFilterOpts: [...tempActionResponsible],
    }));
  };

  const loadUWRInvolvedUser = async () => {
    let tempuwrInvolved = await getLogUsers({
      LogType: "breachlogs",
      FieldName: "UWRInvolved",
    });
    tempuwrInvolved = tempuwrInvolved?.map((item) => ({
      label: item.userName,
      value: item.emailAddress,
    }));
    tempuwrInvolved.sort(dynamicSort("label"));
    tempuwrInvolved = tempuwrInvolved.map((item) => item.label);
    setcommonfilterOpts((prevstate) => ({
      ...prevstate,
      uwrInvolvedOpts: [...tempuwrInvolved],
    }));
  };

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
    if (name === "regionId") {
      let countryopts = formfield.countryId ? [...formfield.countryId] : [];
      let regionopts = value;
      let removeValFromIndex = [];
      countryopts.forEach((countryitem, index) => {
        let isExist = false;
        regionopts.forEach((item) => {
          if (item.value === countryitem.regionId) {
            isExist = true;
          }
        });
        if (!isExist) {
          removeValFromIndex.push(index);
        }
      });
      removeValFromIndex.forEach((item) => {
        countryopts.splice(item, 1);
      });
      setformfield({
        ...formfield,
        [name]: value,
        countryId: countryopts,
      });
    }
    if (name === "countryId") {
      let country = value;
      let regionOpts = [];
      let selectedRegionopts = [];
      country.forEach((countryitem) => {
        regionOptsAll.forEach((item) => {
          if (
            item.value === countryitem.regionId &&
            !selectedRegionopts.includes(item.value)
          ) {
            selectedRegionopts.push(item.value);
            regionOpts.push(item);
          }
        });
      });
      //setregionFilterOpts([...regionOpts]);
      setformfield({
        ...formfield,
        [name]: value,
        regionId: regionOpts,
      });
    }
  };

  useEffect(() => {
    if (formfield.regionId !== REGION_ZNA) {
      setformfield((prevstate) => ({
        ...prevstate,
        UWRInvolvedName: "",
        policyName: "",
        policyNumber: "",
        turNumber: "",
        office: "",
        dateIdentifiedTo: "",
        dateIdentifiedFrom: "",
        znaSegmentId: "",
        znasbuId: "",
        marketBasketId: "",
      }));
    } else if (formfield.customersegment && formfield.regionId === REGION_ZNA) {
      setformfield((prevstate) => ({
        ...prevstate,
        customersegment: "",
      }));
    }
    if (
      isNotEmptyValue(formfield.nearMisses) &&
      formfield.regionId !== REGION_EMEA
    ) {
      setformfield((prevstate) => ({
        ...prevstate,
        nearMisses: "",
      }));
    }
  }, [formfield.regionId]);

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
                  name={"regionId"}
                  value={formfield.regionId || []}
                  handleChange={handleMultiSelectChange}
                  isRequired={false}
                  issubmitted={issubmitted}
                  selectopts={regionFilterOpts}
                />
              </div>
              <div className="col-md-3">
                <FrmMultiselect
                  title={"Country"}
                  name={"countryId"}
                  value={formfield.countryId || []}
                  handleChange={handleMultiSelectChange}
                  isRequired={false}
                  issubmitted={issubmitted}
                  selectopts={countryFilterOpts}
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
const mapActions = {
  getAllUsers: userActions.getAllUsers,
  getAllCountry: countryActions.getAllCountry,
  getAllRegion: regionActions.getAllRegions,
  getAlllob: lobActions.getAlllob,
  getAllSublob: sublobActions.getAllSublob,
  getAllSegment: segmentActions.getAllSegment,
  getAllStatus: breachlogActions.getAllStatus,
  getLookupByType: lookupActions.getLookupByType,
  getAllEntryNumbers: commonActions.getAllEntryNumbers,
  clearDashboardClick: dashboardActions.clearDashboardClick,
  getAllOffice: officeActions.getAllOffice,
  getallZNASegments: znaorgnization1Actions.getAllOrgnization,
  getallZNASBU: znaorgnization2Actions.getAllOrgnization,
  getallZNAMarketBasket: znaorgnization3Actions.getAllOrgnization,
  getLogUsers: commonActions.getLogUsers,
  getActionResponsible: breachlogActions.getActionResponsible,
};
export default connect(mapStateToProp, mapActions)(BreachAddEditForm);
