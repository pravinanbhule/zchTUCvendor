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
import { breachlogActions, commonActions, countryActions, dashboardActions, lobActions, lobchapterActions, lookupActions, officeActions, regionActions, segmentActions, sublobActions, userActions, znaorgnization1Actions, znaorgnization2Actions, znaorgnization3Actions } from "../../../actions";
import { dynamicSort, isNotEmptyValue } from "../../../helpers";
import { REGION_EMEA, REGION_ZNA } from "../../../constants";

function ExemptionAddEditForm(props) {

    const {
        countryState,
        regionState,
        lobchapterState
    } = props.state;

    const {
        hideAddPopup,
        // isReadMode,
        getAllCountry,
        getAllRegion,
        getLookupByType,
        getLogUsers,
        getAlllobChapter,
        getAllEntryNumbers,
        userProfile,
        getExemptionUserView
    } = props;

    const [formfield, setformfield] = useState({
        isPrivate: true,
        entryNumber: "",
        countryId: [],
        regionId: [],
        LOBChapter: "",
        section: "",
        role: "",
        status: "",
        typeOfExemption: "",
        individualGrantedEmpowerment: "",
        approver: "",
        zugChapterVersion: "",
        empowermentRequestedBy: "",
        createdFromDate: "",
        createdToDate: "",
        ciGuidlineId: "",
        PC_URPMExemptionRequired: "",
    })
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
    const [isReadMode, setIsReadmode] = useState(false)

    useEffect(async()=>{
        const response = await getExemptionUserView();
        setformfield(response[0])
        setIsReadmode(false)
        console.log("response??", response);
    },[])
    
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

    useEffect(() => {
        let selectOpts = [];
        let tempCountryMapping = [];
        let tempRegionListObj = {};

        countryState.countryItems.forEach((item) => {
            selectOpts.push({
                ...item,
                label: item.countryName.trim(),
                value: item.countryId,
                regionId: item.regionID,
            });

            if (!tempRegionListObj[item.regionID]) {
                tempCountryMapping.push({
                    region: item.regionID,
                    country: [
                        {
                            label: item.countryName,
                            value: item.countryId,
                        },
                    ],
                });
            } else {
                tempCountryMapping.forEach((countryitem) => {
                    if (countryitem.region === item.regionID) {
                        countryitem.country.push({
                            label: item.countryName,
                            value: item.countryId,
                        });
                    }
                });
            }
            tempRegionListObj[item.regionID] = item.countryName;
        });
        selectOpts.sort(dynamicSort("label"));
        setcountryFilterOpts([...selectOpts]);
    }, [countryState.countryItems]);

    useEffect(() => {
        let selectOpts = [];
        lobchapterState.lobChapterItems.forEach((item) => {
            selectOpts.push({
                label: item.lobChapterName.trim(),
                value: item.lobChapterID,
            });
        });
        selectOpts.sort(dynamicSort("label"));
        setlobChapterFilterOpts([selectInitiVal, ...selectOpts]);
    }, [lobchapterState.lobChapterItems]);


    useEffect(() => {
        fnOnInit();
    }, []);

    const fnOnInit = async () => {
        getAllCountry();
        getAllRegion();
        getAlllobChapter();
        loadIndividualGrantedEmpowermentUsers();
        loadApproverUsers();
        fnOnLogSpecData();
        let tempopts = [];
        const lookupvalues = await Promise.all([
            getLookupByType({
                LookupType: "EXMPZUGStatus",
            }),
            getLookupByType({
                LookupType: "EXMPURPMSection",
            }),
            getLookupByType({
                LookupType: "EXMPTypeOfExemption",
            }),
        ]);
        let tempZUGStatus = lookupvalues[0];
        let tempURPMSection = lookupvalues[1];
        let tempTypeOfExemption = lookupvalues[2];
        tempZUGStatus.forEach((item) => {
            if (item.isActive) {
                tempopts.push({
                    label: item.lookUpValue,
                    value: item.lookupID,
                });
            }
        });
        tempZUGStatus = [...tempopts];
        tempopts = [];
        tempURPMSection.forEach((item) => {
            if (item.isActive) {
                tempopts.push({
                    label: item.lookUpValue,
                    value: item.lookupID,
                });
            }
        });
        tempURPMSection = [...tempopts];
        tempopts = [];
        tempTypeOfExemption.forEach((item) => {
            if (item.isActive) {
                tempopts.push({
                    label: item.lookUpValue,
                    value: item.lookupID,
                });
            }
        });
        tempTypeOfExemption = [...tempopts];
        tempZUGStatus.sort(dynamicSort("label"));
        //tempURPMStatus.sort(dynamicSort("label"));
        tempURPMSection.sort(dynamicSort("label"));
        tempTypeOfExemption.sort(dynamicSort("label"));
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            ZUGstatusFilterOpts: [selectInitiVal, ...tempZUGStatus],
            typeOfExemptionOpts: [selectInitiVal, ...tempTypeOfExemption],
        }));
    };

    const loadIndividualGrantedEmpowermentUsers = async () => {
        let logType = "zug";
        let tempIndividualGrantedEmpowerment = await getLogUsers({
            LogType: logType,
            FieldName: "IndividualGrantedEmpowerment",
            userId: userProfile.userId,
        });
        tempIndividualGrantedEmpowerment = tempIndividualGrantedEmpowerment.map(
            (item) => ({
                label: item.userName,
                value: item.emailAddress,
            })
        );
        tempIndividualGrantedEmpowerment = tempIndividualGrantedEmpowerment.map(
            (item) => item.label
        );
        tempIndividualGrantedEmpowerment.sort();
        console.log("tempIndividualGrantedEmpowerment>>", [...tempIndividualGrantedEmpowerment]);
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            individualGrantedEmpowermentOpts: [...tempIndividualGrantedEmpowerment],
        }));
    };
    const loadApproverUsers = async () => {
        let logType = "zug";
        let tempApprovers = await getLogUsers({
            LogType: logType,
            FieldName: "Approver",
            userId: userProfile.userId,
        });
        tempApprovers = tempApprovers.map((item) => ({
            label: item.userName,
            value: item.emailAddress,
        }));
        tempApprovers = tempApprovers.map((item) => item.label);
        tempApprovers.sort();
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            approverOpts: [...tempApprovers],
        }));
    };
    const fnOnLogSpecData = async () => {
        let logType = "zug";
        loadApproverUsers();
        loadIndividualGrantedEmpowermentUsers();
        let tempEmpowermentRequestedBy = await getLogUsers({
            LogType: logType,
            FieldName: "EmpowermentRequestedBy",
            userId: userProfile.userId,
        });

        tempEmpowermentRequestedBy = tempEmpowermentRequestedBy.map((item) => ({
            label: item.userName,
            value: item.emailAddress,
        }));

        tempEmpowermentRequestedBy = tempEmpowermentRequestedBy.map(
            (item) => item.label
        );
        tempEmpowermentRequestedBy.sort();
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            empowermentRequestedByOpts: [...tempEmpowermentRequestedBy],
        }));
    };
    useEffect(async() => {
        let entityNumberArr = [];
        let reqparam = {
          logType: "zug",
        };
        reqparam = { ...reqparam, isSubmit: true };
        let tempEntries = await getAllEntryNumbers(reqparam);
        if (tempEntries.length) {
          tempEntries.forEach((item) => {
            entityNumberArr.push(item.entryNumber);
          });
          entityNumberArr.sort();
          setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            entryNumberOpts: [...entityNumberArr],
          }));
        }
      }, []);

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
                <div className="addedit-header-title">New View for Exemption Log</div>
                <div className="header-btn-container">
                    <div className="addedit-close btn-blue" onClick={() => hidePopup()}>
                        Back
                    </div>
                </div>
            </div>
            <div className="exemption-popup-formitems logs-form">
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
                                name={"isPrivate"}
                                value={formfield.isPrivate}
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
                    <div className="">
                        <div className="row">
                            <div className="col-md-3">
                                <FrmInputAutocomplete
                                    title={"Entry Number"}
                                    name={"entryNumber"}
                                    type={"input"}
                                    handleChange={onSearchFilterInputAutocomplete}
                                    value={formfield.entryNumber}
                                    options={commonfilterOpts.entryNumberOpts}
                                    isReadMode={isReadMode}
                                />
                            </div>
                            <div className="col-md-3">
                                <FrmMultiselect
                                    title={"Region"}
                                    name={"regionId"}
                                    selectopts={regionFilterOpts}
                                    handleChange={handleMultiSelectChange}
                                    value={formfield.regionId || []}
                                    isReadMode={isReadMode}
                                />
                            </div>
                            <div className="col-md-3">
                                <FrmMultiselect
                                    title={"Country"}
                                    name={"countryId"}
                                    selectopts={countryFilterOpts}
                                    handleChange={handleMultiSelectChange}
                                    value={formfield.countryId || []}
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
                            className={`advance-filter-btn`}
                        >
                            Advance Search
                        </div>
                    </div>
                    <div className="filter-advance">
                        <div className="">
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
                                <div className="col-md-3">
                                    <FrmInput
                                        title={"Previous Exemption ID"}
                                        name={"ciGuidlineId"}
                                        type={"input"}
                                        handleChange={onSearchFilterInput}
                                        value={formfield.ciGuidlineId}
                                    />
                                </div>
                                <div className="col-md-3 frm-filter">
                                    <FrmSelect
                                        title={"P&C URPM exemption required"}
                                        name={"PC_URPMExemptionRequired"}
                                        selectopts={yesnoopts}
                                        handleChange={onSearchFilterSelect}
                                        value={formfield.PC_URPMExemptionRequired}
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
    getAllStatus: breachlogActions.getAllStatus,
    getLookupByType: lookupActions.getLookupByType,
    getAllEntryNumbers: commonActions.getAllEntryNumbers,
    getLogUsers: commonActions.getLogUsers,
    getAlllobChapter: lobchapterActions.getAlllobChapter,
    getExemptionUserView: commonActions.getExemptionUserView
};
export default connect(mapStateToProp, mapActions)(ExemptionAddEditForm);
