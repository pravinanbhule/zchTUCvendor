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

function ExemptionAddEditForm(props) {

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
    const [yesnoopts, setyesnoopts] = useState([
        selectInitiVal,
        {
            label: "Yes",
            value: "1",
        },
        {
            label: "No",
            value: "0",
        },
    ]);
    const [commonfilterOpts, setcommonfilterOpts] = useState({
        ZUGstatusFilterOpts: [],
        URPMstatusFilterOpts: [],
        URPMSectionFilterOps: [],
        rolesFilterOpts: [
            { label: "All", value: "all" },
            { label: "Approver", value: "approver" },
            {
                label: "Initiator",
                value: "initiator",
            },
        ],
        entryNumberOpts: [],
        typeOfExemptionOpts: [],
        individualGrantedEmpowermentOpts: [],
        approverOpts: [],
        zugChapterVersionOpts: [],
        empowermentRequestedByOpts: [],
    });
    const [lobChapterFilterOpts, setlobChapterFilterOpts] = useState([]);
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

    const onSearchFilterSelect = (name, value) => {
        //const { name, value } = e.target;
        setformfield({
            ...formfield,
            [name]: value,
        })
        // if (name === "exemptionLogType") {
        //   if (
        //     (value === "zug" && !logstate.ZUGLoadedAll) ||
        //     (value === "urpm" && !logstate.URPMLoadedAll)
        //   ) {
        //     setlogItmes([]);
        //     setlogstate({ ...logstate, loading: true });
        //   }
        //   setExemLogTypeFn(value);
        // }
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
                    <div className="filter-container container">
                        <div className="row">
                            <div className="col-md-3">
                                <FrmInputAutocomplete
                                    title={"Entry Number"}
                                    name={"entryNumber"}
                                    type={"input"}
                                    handleChange={onSearchFilterInputAutocomplete}
                                    value={formfield.entryNumber}
                                    options={commonfilterOpts.entryNumberOpts}
                                />
                            </div>
                            <div className="col-md-3">
                                <FrmMultiselect
                                    title={"Region"}
                                    name={"regionId"}
                                    selectopts={regionFilterOpts}
                                    handleChange={handleMultiSelectChange}
                                    value={formfield.regionId || []}
                                />
                            </div>
                            <div className="col-md-3">
                                <FrmMultiselect
                                    title={"Country"}
                                    name={"countryID"}
                                    selectopts={countryFilterOpts}
                                    handleChange={handleMultiSelectChange}
                                    value={formfield.countryID || []}
                                    isAllOptNotRequired={true}
                                />
                            </div>
                            <div className="col-md-3">
                                <FrmSelect
                                    title={"LoB Chapter"}
                                    name={"LOBChapter"}
                                    selectopts={lobChapterFilterOpts}
                                    handleChange={onSearchFilterSelect}
                                    value={formfield.LOBChapter}
                                />
                            </div>
                            <div className="col-md-3">
                                <FrmInput
                                    title={"Section"}
                                    name={"section"}
                                    type={"input"}
                                    handleChange={onSearchFilterInput}
                                    value={formfield.section}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <FrmSelect
                                    title={"Type of Exemption"}
                                    name={"typeOfExemption"}
                                    selectopts={commonfilterOpts.typeOfExemptionOpts}
                                    handleChange={onSearchFilterSelect}
                                    value={formfield.typeOfExemption}
                                />
                            </div>
                            <div className="col-md-3">
                                <FrmInputAutocomplete
                                    title={"Individual Granted Empowerment"}
                                    name={"individualGrantedEmpowerment"}
                                    type={"input"}
                                    handleChange={onSearchFilterInputAutocomplete}
                                    value={formfield.individualGrantedEmpowerment}
                                    options={
                                        commonfilterOpts.individualGrantedEmpowermentOpts
                                    }
                                />
                            </div>
                            <div className="col-md-3">
                                <FrmInputAutocomplete
                                    title={"Approver"}
                                    name={"approver"}
                                    type={"input"}
                                    handleChange={onSearchFilterInputAutocomplete}
                                    value={formfield.approver}
                                    options={commonfilterOpts.approverOpts}
                                />
                            </div>
                            <div className="col-md-3">
                                <FrmSelect
                                    title={"Role"}
                                    name={"role"}
                                    selectopts={commonfilterOpts.rolesFilterOpts}
                                    handleChange={onSearchFilterSelect}
                                    value={formfield.role}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <FrmSelect
                                    title={"Status"}
                                    name={"status"}
                                    selectopts={commonfilterOpts.ZUGstatusFilterOpts}
                                    handleChange={onSearchFilterSelect}
                                    value={formfield.status}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="advance-filter-btn-container">
                        <div
                            className={`advance-filter-btn selected`}
                        >
                            Advance Search
                        </div>
                    </div>
                    <div className="filter-advance">
                        <div className="filter-container container">
                            <div className="row">
                                <div className="col-md-3">
                                    <FrmInput
                                        title={"ZUG Chapter Version"}
                                        name={"zugChapterVersion"}
                                        type={"input"}
                                        handleChange={onSearchFilterInput}
                                        value={formfield.zugChapterVersion}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmInputAutocomplete
                                        title={"Empowerment Requested By"}
                                        name={"empowermentRequestedBy"}
                                        type={"input"}
                                        handleChange={onSearchFilterInputAutocomplete}
                                        value={formfield.empowermentRequestedBy}
                                        options={
                                            commonfilterOpts.empowermentRequestedByOpts
                                        }
                                    />
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
                            <div className="row">
                                <>
                                    <div className="col-md-3">
                                        <FrmInput
                                            title={"Previous Exemption ID"}
                                            name={"ciGuidlineId"}
                                            type={"input"}
                                            handleChange={onSearchFilterInput}
                                            value={formfield.ciGuidlineId}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <FrmSelect
                                            title={"P&C URPM exemption required"}
                                            name={"PC_URPMExemptionRequired"}
                                            selectopts={yesnoopts}
                                            handleChange={onSearchFilterSelect}
                                            value={formfield.PC_URPMExemptionRequired}
                                        />
                                    </div>
                                </>
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
export default connect(mapStateToProp, mapActions)(ExemptionAddEditForm);
