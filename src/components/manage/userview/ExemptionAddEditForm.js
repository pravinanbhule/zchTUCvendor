import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
    exemptionlogActions,
    countryActions,
    regionActions,
    lobchapterActions,
    lookupActions,
    lobActions,
    commonActions,
    dashboardActions,
    userViewActions,
} from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmMultiselect from "../../common-components/frmmultiselect/FrmMultiselect";
import FrmRadio from "../../common-components/frmradio/FrmRadio";
import FrmDatePicker from "../../common-components/frmdatepicker/FrmDatePicker";
import moment from "moment";
import {
    alertMessage,
    dynamicSort,
    formatDate,
    isEmptyObjectKeys,
    isNotEmptyValue,
} from "../../../helpers";
import FrmInput from "../../common-components/frminput/FrmInput";
import FrmInputAutocomplete from "../../common-components/frminputautocomplete/FrmInputAutocomplete";
import FrmToggleSwitch from "../../common-components/frmtoggelswitch/FrmToggleSwitch";
import FrmCheckbox from "../../common-components/frmcheckbox/FrmCheckbox";
let pageIndex = 1;
let pagesize = 10;
let totalLogCount = 0;
function Exemptionlog({ ...props }) {
    const {
        exemptionlogState,
        countryState,
        regionState,
        lobchapterState,
        lobState,
        dashboardState,
    } = props.state;
    const {
        getAll,
        getallZUGLogs,
        getallZUGDeletedLogs,
        getallURPMDeletedLogs,
        getByIdZUG,
        getallZUGunderwriter,
        postItemZUG,
        getallURPMLogs,
        getByIdURPM,
        postItemURPM,
        getAllCountry,
        getAllRegion,
        getAlllobChapter,
        getLookupByType,
        getAllEntryNumbers,
        checkIsInUse,
        deleteItem,
        deleteLog,
        getLogUsers,
        userProfile,
        getDataVersion,
        clearDashboardClick,
        exportReportZUGLogs,
        exportReportURPMLogs,
        getallZUGCount,
        getallURPMCount,
        isEditMode,
        isReadMode,
        formIntialState,
        handleEdit,
        hideAddPopup,
        postItem,
        exemptionType
    } = props;

    const [logstate, setlogstate] = useState({
        loading: true,
        error: "",
        ZUGLoadedAll: false,
        URPMLoadedAll: false,
        ZUGdata: [],
        URPMdata: [],
    });

    useSetNavMenu(
        { currentMenu: "Exemptionlog", isSubmenu: false },
        props.menuClick
    );
    //initialize filter/search functionality
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
    const [exemptionlogsType, setexemptionlogsType] = useState([
        {
            label: "ZUG",
            value: "zug",
        },
        {
            label: "URPM",
            value: "urpm",
        },
    ]);
    const [selectedExemptionLog, setselectedExemptionLog] = useState(exemptionType);
    const [countryFilterOpts, setcountryFilterOpts] = useState([]);
    const [countryAllFilterOpts, setcountryAllFilterOpts] = useState([]);
    const [regionFilterOpts, setregionFilterOpts] = useState([]);
    const [regionOptsAll, setregionOptsAll] = useState([]);
    const [lobChapterFilterOpts, setlobChapterFilterOpts] = useState([]);
    const intialFilterState = {
        entryNumber: "",
        countryID: [],
        regionId: [],
        loBChapter: "",
        section: "",
        role: "",
        status: "",
        typeofExemption: "",
        individualGrantedEmpowerment: "",
        approver: "",
        zugChapterVersion: "",
        empowermentRequestedBy: "",
        createdDateFrom: "",
        createdDateTo: "",
        previousExemptionID: "",
        pC_URPMExemptionRequired: "",
        isPrivate: false
    };

    const [userRoles, setUserRoles] = useState([])
    const [switchOpts, setSwitchOpts] = useState([
        {
            label: "Public",
            value: false,
        },
        {
            label: "Private",
            value: true,
        },
    ]);

    const [accessBreachLogOpts, setaccessBreachLogOpts] = useState([
        {
            label: "",
            value: true,
        },
    ]);

    const [formfield, setformfield] = useState(intialFilterState);
    const [isfilterApplied, setisfilterApplied] = useState(false);
    const [dashboardStateApplied, setdashboardStateApplied] = useState(false);
    const [isAdvfilterApplied, setisAdvfilterApplied] = useState(true);
    const [loading, setLoading] = useState(false)

    useEffect(async () => {
        if (isEditMode || isReadMode) {
            setLoading(true)
            let response = formIntialState

            if (response.region && regionState.regionItems && typeof response.region === 'string') {
                let selectedRegionArray = response.region.split(',')
                let regionArray = []
                selectedRegionArray.map((id, j) => {
                    regionState.regionItems.map((item, i) => {
                        if (id === item.regionID) {
                            regionArray.push({
                                label: item.regionName.trim(),
                                value: item.regionID,
                            })
                        }
                    })
                })
                response.regionId = typeof response.region === 'string' && regionArray.length === 0 ? response.region : regionArray
            } else if (response.region === null || response.region === undefined) {
                response.regionId = []
            }
            response.isSuperAdmin = response?.userRoles?.split(',').includes('1')
            response.isGlobalAdmin = response?.userRoles?.split(',').includes('2')
            response.isRegionAdmin = response?.userRoles?.split(',').includes('3')
            response.isCountryAdmin = response?.userRoles?.split(',').includes('4')
            response.isNormalUser = response?.userRoles?.split(',').includes('8')
            response.isCountrySuperAdmin = response?.userRoles?.split(',').includes('9')
            if (response.isPrivate === true) {
                setShowUserRoles(false)
            } else {
                let Roles = response?.userRoles?.split(",")
                if (Roles?.length > 0) {
                    setSelectedUserRoles(Roles)
                }
            }
            setTimeout(async () => {
                if (response.country && typeof response.country === 'string') {
                    let selectedCountryArray = response.country.split(',')
                    let countryArray = []
                    selectedCountryArray.map((id, j) => {
                        countryState.countryItems.map((item, i) => {
                            if (id === item.countryID) {
                                countryArray.push({
                                    label: item.countryName.trim(),
                                    value: item.countryID,
                                })
                            }
                        })
                    })
                    response.countryID = countryArray
                } else if (response.country === null || response.country === undefined) {
                    response.countryID = []
                }
                setLoading(false)
                setformfield(response)
            }, 5000);
        }
    }, [regionState.regionItems])


    const onSearchFilterInput = (e) => {
        const { name, value } = e.target;
        setformfield({
            ...formfield,
            [name]: value,
        });
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
    const onExemptionlogSelection = (e) => {
        let { name, value } = e.target;
        if (
            (value === "zug" && !logstate.ZUGLoadedAll) ||
            (value === "urpm" && !logstate.URPMLoadedAll)
        ) {
            setlogItmes([]);
            setlogstate({ ...logstate, loading: true });
        }
        setExemLogTypeFn(value);
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
        });
        if (name === "exemptionLogType") {
            if (
                (value === "zug" && !logstate.ZUGLoadedAll) ||
                (value === "urpm" && !logstate.URPMLoadedAll)
            ) {
                setlogItmes([]);
                setlogstate({ ...logstate, loading: true });
            }
            setExemLogTypeFn(value);
        }
    };

    const handleMultiSelectChange = (name, value) => {
        if (name === "regionId") {
            let countryopts = [...formfield.countryID];
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
                countryID: countryopts,
            });
        }
        if (name === "countryID") {
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
            setformfield({
                ...formfield,
                [name]: value,
                regionId: regionOpts,
            });
        }
    };

    const handleFilterSearch = async () => {
        if (!isEmptyObjectKeys(formfield)) {
            let tempFilterOpts = {};
            for (let key in formfield) {
                if (formfield[key]) {
                    let value = formfield[key];
                    tempFilterOpts[key] = value;
                    if (key === "pC_URPMExemptionRequired") {
                        tempFilterOpts[key] = value === "1" ? true : false;
                    }
                    if (key === "countryID" || key === "regionId") {
                        const tmpval = value.map((item) => item.value);
                        tempFilterOpts[key] = tmpval.join(",");
                    }
                }
            }
            tempFilterOpts.userRoles = selectedUserRoles.toString()
            tempFilterOpts.UserViewType = 'exemptionlog'
            tempFilterOpts.exemptiontype = selectedExemptionLog
            tempFilterOpts.country = tempFilterOpts?.countryID
            tempFilterOpts.region = tempFilterOpts?.regionId
            tempFilterOpts.requesterUserId = userProfile.userId
            let response = await postItem(tempFilterOpts)
            if (response) {
                if (tempFilterOpts.zugExemptionViewsId || tempFilterOpts.urpmExemptionViewsId) {
                    alert(alertMessage.userview.update);
                } else {
                    alert(alertMessage.userview.add);
                }
                hideAddPopup()
            }
        }
    };
    const clearFilter = () => {

        setformfield(intialFilterState);
        setisfilterApplied(false);
        setfilterbox(false);
        setregionFilterOpts([...regionOptsAll]);
    };

    useEffect(() => {
        //on clear filter load data
        if (isNotEmptyValue(isfilterApplied) && isfilterApplied === false) {
            pageIndex = 1;
            loadAPIData();
        }
    }, [isfilterApplied]);

    //set pagination data and functionality
    const [isPaginationSort, setisPaginationSort] = useState(false);
    const [selSortFiled, setselSortFiled] = useState({
        name: "modifiedDate",
        order: "desc",
    });

    useEffect(() => {
        if (isPaginationSort) {
            pageIndex = 1;
            loadAPIData();
        }
    }, [isPaginationSort]);
    // const [data, setdata] = useState([]);
    const [paginationdata, setpaginationdata] = useState([]);
    const [logTypes, setlogTypes] = useState([]);
    const [sellogTabType, setsellogTabType] = useState("");

    //set selected exemption log type
    const setExemLogTypeFn = (value) => {
        setselectedExemptionLog(value);
    };
    //load logs data in recurrsive
    const [logItmes, setlogItmes] = useState([]);
    //const [pagesize, setpagesize] = useState(500);
    const [alllogsloaded, setalllogsloaded] = useState(false);
    const [isLoadingStarted, setisLoadingStarted] = useState(false);

    const getAllLogsInRecurssion = async () => {
        if (!sellogTabType) {
            return;
        }

        let reqParam = {
            RequesterUserId: userProfile.userId,
            PageIndex: pageIndex,
            PageSize: pagesize,
        };
        setisLoadingStarted(true);
        if (sellogTabType === "draft") {
            reqParam = {
                ...reqParam,
                isSubmit: false,
            };
        } else if (sellogTabType === "all") {
            reqParam = {
                ...reqParam,
                isSubmit: true,
            };
        }

        if (!isEmptyObjectKeys(formfield)) {
            let tempFilterOpts = {};
            for (let key in formfield) {
                if (formfield[key]) {
                    let value = formfield[key];
                    tempFilterOpts[key] = value;
                    if (key === "pC_URPMExemptionRequired") {
                        tempFilterOpts[key] = value === "1" ? true : false;
                    }
                    if (key === "countryID" || key === "regionId") {
                        const tmpval = value.map((item) => item.value);
                        tempFilterOpts[key] = tmpval.join(",");
                    }
                }
            }
            reqParam = {
                ...reqParam,
                ...tempFilterOpts,
                sortExp: selSortFiled.name + " " + selSortFiled.order,
            };
        } else {
            reqParam = {
                ...reqParam,
                sortExp: selSortFiled.name + " " + selSortFiled.order,
            };
        }
        try {
            let tempItems = [];
            const dbvalues = await Promise.all([
                sellogTabType === "delete"
                    ? selectedExemptionLog === "zug"
                        ? getallZUGCount({ ...reqParam, IsDelete: true })
                        : getallURPMCount({ ...reqParam, IsDelete: true })
                    : selectedExemptionLog === "zug"
                        ? getallZUGCount(reqParam)
                        : getallURPMCount(reqParam),
                sellogTabType === "delete"
                    ? selectedExemptionLog === "zug"
                        ? getallZUGDeletedLogs(reqParam)
                        : getallURPMDeletedLogs(reqParam)
                    : selectedExemptionLog === "zug"
                        ? getallZUGLogs(reqParam)
                        : getallURPMLogs(reqParam),
            ]);

            totalLogCount = dbvalues[0];
            setlogItmes(dbvalues[1]);
        } catch (error) {
            console.log(error);
        }
    };
    const loadAPIData = () => {
        setlogstate({
            ...logstate,
            loading: true,
            data: [],
            loadedAll: false,
            isDataImported: false,
        });
        getAllLogsInRecurssion();
    };

    useEffect(() => {
        if (isLoadingStarted) {
            setlogstate({
                ...logstate,
                loading: false,
                data: [...logItmes],
                loadedAll: true,
            });
            setalllogsloaded(true);
            setisLoadingStarted(false);
            setisPaginationSort(false);
        }
    }, [logItmes]);

    useEffect(() => {
        let tempStatus = [{ label: "All", value: "all" }];
        setlogTypes(tempStatus);
        if (!sellogTabType || tempStatus.length === 1) {
            setsellogTabType(tempStatus[0].value);
        }
    }, []);

    const openlogTab = (type) => {
        if (!isLoadingStarted) {
            setsellogTabType(type);
        }
    };

    useEffect(() => {
        if (sellogTabType && !dashboardState.status && selectedExemptionLog) {
            pageIndex = 1;
            loadAPIData();
        }
    }, [sellogTabType]);
    useEffect(() => {
        const getEntryNumbers = async () => {
            if (!sellogTabType || !selectedExemptionLog) {
                return;
            }
            let entityNumberArr = [];
            let reqparam = {
                logType: selectedExemptionLog === "urpm" ? "urpm" : "zug",
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
            setformfield(intialFilterState)
        };
        getEntryNumbers();
    }, [sellogTabType, selectedExemptionLog]);

    useEffect(() => {
        fnOnInit();
    }, []);

    const fnOnInit = async () => {
        let tempopts = [];
        // setselectedExemptionLog(exemptionType)
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
            URPMstatusFilterOpts: [selectInitiVal, ...tempZUGStatus],
            URPMSectionFilterOps: [selectInitiVal, ...tempURPMSection],
            typeOfExemptionOpts: [selectInitiVal, ...tempTypeOfExemption],
        }));
        if (userProfile.isCountrySuperAdmin) {
            setUserRoles([
                {
                    label: "Country Super Admin",
                    name: "isCountrySuperAdmin",
                    filedValue: '9'
                },
                {
                    label: "Country Admin",
                    name: "isCountryAdmin",
                    filedValue: '4'
                },
                {
                    label: "Normal User",
                    name: "isNormalUser",
                    filedValue: '8'
                },
            ])
        } else {
            setUserRoles([
                {
                    label: "Super Admin",
                    name: "isSuperAdmin",
                    filedValue: '1'
                },
                {
                    label: "Global Admin",
                    name: "isGlobalAdmin",
                    filedValue: '2'
                },
                {
                    label: "Region Admin",
                    name: "isRegionAdmin",
                    filedValue: '3'
                },
                {
                    label: "Country Super Admin",
                    name: "isCountrySuperAdmin",
                    filedValue: '9'
                },
                {
                    label: "Country Admin",
                    name: "isCountryAdmin",
                    filedValue: '4'
                },
                {
                    label: "Normal User",
                    name: "isNormalUser",
                    filedValue: '8'
                },
            ])
        }
    };


    const loadApproverUsers = async () => {
        let logType = selectedExemptionLog === "zug" ? "zug" : "urpm";
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
    const loadIndividualGrantedEmpowermentUsers = async () => {
        let logType = selectedExemptionLog === "zug" ? "zug" : "urpm";
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
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            individualGrantedEmpowermentOpts: [...tempIndividualGrantedEmpowerment],
        }));
    };

    const fnOnLogSpecData = async () => {
        let logType = selectedExemptionLog === "zug" ? "zug" : "urpm";
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

    useEffect(() => {
        fnOnLogSpecData()
    }, [selectedExemptionLog])

    const [countrymapping, setcountrymapping] = useState([]);
    const [frmCountrySelectOpts, setfrmCountrySelectOpts] = useState([]);

    //get all country
    useEffect(() => {
        getAllCountry();
        getAllRegion();
        getAlllobChapter();
    }, []);

    useEffect(() => {
        let selectOpts = [];
        let tempCountryMapping = [];
        let tempRegionListObj = {};
        countryState.countryItems.forEach((item) => {
            selectOpts.push({
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
        });
        selectOpts.sort(dynamicSort("label"));
        setcountrymapping([...tempCountryMapping]);
        setfrmCountrySelectOpts([...selectOpts]);
        setcountryFilterOpts([...selectOpts]);
        setcountryAllFilterOpts([...selectOpts]);
    }, [countryState.countryItems]);

    const [frmRegionSelectOpts, setfrmRegionSelectOpts] = useState([]);
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
        setfrmRegionSelectOpts([...selectOpts]);
        setregionFilterOpts([...selectOpts]);
        setregionOptsAll([...selectOpts]);
    }, [regionState.regionItems]);

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
        if (logstate.isDataImported) {
            /* setlogstate((prevstate) => ({
              ...prevstate,
              isDataImported: false,
            }));*/
            pageIndex = 1;
            loadAPIData();
        }
    }, [logstate.isDataImported]);

    const [filterbox, setfilterbox] = useState(true);

    const [selectedUserRoles, setSelectedUserRoles] = useState([])

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (e.target.type === "checkbox") {
            value = e.target.checked;
            let selectedValue = selectedUserRoles
            userRoles.map((item, i) => {
                if (value === true && item.name === name) {
                    selectedValue.push(item.filedValue)
                }
                if (value === false && item.name === name) {
                    selectedValue = selectedUserRoles.filter((num, j) => {
                        return num !== item.filedValue
                    })
                }
            })
            setSelectedUserRoles(selectedValue)
        }
        setformfield({
            ...formfield,
            [name]: value
        });
    }

    const [showUserRoles, setShowUserRoles] = useState(true)

    const handleSelectChange = (name, value) => {
        if (name === "isPrivate" && value === true) {
            setSelectedUserRoles([])
            setformfield({
                ...formfield,
                [name]: value,
                isSuperAdmin: false,
                isGlobalAdmin: false,
                isRegionAdmin: false,
                isCountryAdmin: false,
                isNormalUser: false,
                isCountrySuperAdmin: false,
            })
            setShowUserRoles(false)
        } else {
            setformfield({
                ...formfield,
                [name]: value,
            });
            setShowUserRoles(true)
        }
    };

    return (
        <div className="addedit-logs-container">
            <div className="addedit-header-container">
                <div className="addedit-header-title">New/Edit View for Exemption Log</div>
                <div className="header-btn-container">
                    {isReadMode &&
                        <div className="addedit-close-view btn-blue" onClick={() => handleEdit(formfield, 'edit')}>
                            Edit
                        </div>
                    }
                    <div className="addedit-close-view btn-blue" onClick={() => hideAddPopup()}>
                        Back
                    </div>
                </div>
            </div>
            {loading ? (
                <Loading />
            ) : (
                <div className="popup-formitems logs-form">
                    <div className="row">
                        <div className="col-md-3">
                            <FrmInput
                                title={"View Name"}
                                name={"viewName"}
                                value={formfield?.viewName}
                                type={"text"}
                                handleChange={handleChange}
                                isRequired={false}
                                isReadMode={isReadMode}
                            // issubmitted={issubmitted}
                            />
                        </div>
                        <div className="col-md-3">
                            <FrmToggleSwitch
                                title={''}
                                name={"isPrivate"}
                                value={formfield.isPrivate}
                                handleChange={handleSelectChange}
                                isRequired={false}
                                isReadMode={isReadMode}
                                selectopts={switchOpts}
                            />
                        </div>
                        {/* <div className="col-md-3">
                            <FrmRadio
                                title={"Exemption Log Type"}
                                name={"exemptionLogType"}
                                selectopts={exemptionlogsType}
                                handleChange={onExemptionlogSelection}
                                value={selectedExemptionLog}
                                isReadMode={isReadMode}
                            // isdisabled={!alllogsloaded}
                            />
                        </div> */}
                    </div>
                    {showUserRoles &&
                        <>
                            <div className="border-top font-weight-bold frm-container-bgwhite">
                                <div className="mb-4"> User Roles</div>
                            </div>
                            <div className="border-bottom border-top frm-container-bggray">
                            <div className="m-1 mt-4 d-flex" style={userProfile.isCountrySuperAdmin ? {} : {justifyContent: 'space-between'}}>
                                    {isReadMode &&
                                        userRoles.map((item, i) => {
                                            return (
                                                formfield[item.name] &&
                                                <div className="col-md-2">
                                                    {item.label}
                                                </div>
                                            )
                                        })
                                    }
                                    {!isReadMode && userRoles.map((item, i) => {
                                        return (
                                            <div className="" style={userProfile.isCountrySuperAdmin ? {marginRight: '10%'} : {}}>
                                                <FrmCheckbox
                                                    title={item.label}
                                                    name={item.name}
                                                    value={formfield[item.name]}
                                                    handleChange={handleChange}
                                                    isRequired={false}
                                                    selectopts={accessBreachLogOpts}
                                                    inlinetitle={true}
                                                    aftercheckbox={true}
                                                    isReadMode={isReadMode}
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </>
                    }
                    <div className="filter-normal">
                        <div className="filter-container">
                            <div className="row">
                                <div className="frm-filter col-md-3">
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
                                <div className="frm-filter col-md-3">
                                    <FrmMultiselect
                                        title={"Region"}
                                        name={"regionId"}
                                        selectopts={regionFilterOpts}
                                        handleChange={handleMultiSelectChange}
                                        value={formfield.regionId}
                                        isReadMode={isReadMode}
                                    />
                                </div>
                                <div className="frm-filter col-md-3">
                                    <FrmMultiselect
                                        title={"Country"}
                                        name={"countryID"}
                                        selectopts={countryFilterOpts}
                                        handleChange={handleMultiSelectChange}
                                        value={formfield.countryID}
                                        isAllOptNotRequired={true}
                                        isReadMode={isReadMode}
                                    />
                                </div>
                                {selectedExemptionLog === "zug" ? (
                                    <div className="frm-filter col-md-3">
                                        <FrmSelect
                                            title={"LoB Chapter"}
                                            name={"loBChapter"}
                                            selectopts={lobChapterFilterOpts}
                                            handleChange={onSearchFilterSelect}
                                            value={formfield.loBChapter}
                                            isReadMode={isReadMode}
                                        />
                                    </div>
                                ) : (
                                    <div className="frm-filter col-md-3">
                                        <FrmInput
                                            title={"Section"}
                                            name={"section"}
                                            type={"input"}
                                            handleChange={onSearchFilterInput}
                                            value={formfield.section}
                                            isReadMode={isReadMode}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="row">
                                <div className="frm-filter col-md-3">
                                    <FrmSelect
                                        title={"Type of Exemption"}
                                        name={"typeofExemption"}
                                        selectopts={commonfilterOpts.typeOfExemptionOpts}
                                        handleChange={onSearchFilterSelect}
                                        value={formfield.typeofExemption}
                                        isReadMode={isReadMode}
                                    />
                                </div>
                                <div className="frm-filter col-md-3">
                                    <FrmInputAutocomplete
                                        title={"Individual Granted Empowerment"}
                                        name={"individualGrantedEmpowerment"}
                                        type={"input"}
                                        handleChange={onSearchFilterInputAutocomplete}
                                        value={formfield.individualGrantedEmpowerment}
                                        options={
                                            commonfilterOpts.individualGrantedEmpowermentOpts
                                        }
                                        isReadMode={isReadMode}
                                    />
                                </div>
                                <div className="frm-filter col-md-3">
                                    <FrmInputAutocomplete
                                        title={"Approver"}
                                        name={"approver"}
                                        type={"input"}
                                        handleChange={onSearchFilterInputAutocomplete}
                                        value={formfield.approver}
                                        options={commonfilterOpts.approverOpts}
                                        isReadMode={isReadMode}
                                    />
                                </div>
                                <div className="frm-filter col-md-3">
                                    <FrmSelect
                                        title={"Role"}
                                        name={"role"}
                                        selectopts={commonfilterOpts.rolesFilterOpts}
                                        handleChange={onSearchFilterSelect}
                                        value={formfield.role}
                                        isReadMode={isReadMode}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="frm-filter col-md-3">
                                    <FrmSelect
                                        title={"Status"}
                                        name={"status"}
                                        selectopts={
                                            selectedExemptionLog === "zug"
                                                ? commonfilterOpts.ZUGstatusFilterOpts
                                                : commonfilterOpts.URPMstatusFilterOpts
                                        }
                                        handleChange={onSearchFilterSelect}
                                        value={formfield.status}
                                        isReadMode={isReadMode}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="user-view-advance-filter-btn-container">
                        <div
                            className={`user-view-advance-filter-btn`}
                        // onClick={handlesetAdvSearch}
                        >
                            Advance Search
                        </div>
                    </div>
                    {isAdvfilterApplied ? (
                        <div className="filter-advance">
                            <div className="filter-container">
                                <div className="row">
                                    {selectedExemptionLog === "zug" && (
                                        <div className="frm-filter col-md-3">
                                            <FrmInput
                                                title={"ZUG Chapter Version"}
                                                name={"zugChapterVersion"}
                                                type={"input"}
                                                handleChange={onSearchFilterInput}
                                                value={formfield.zugChapterVersion}
                                                isReadMode={isReadMode}
                                            />
                                        </div>
                                    )}

                                    <div className="frm-filter col-md-3">
                                        <FrmInputAutocomplete
                                            title={"Empowerment Requested By"}
                                            name={"empowermentRequestedBy"}
                                            type={"input"}
                                            handleChange={onSearchFilterInputAutocomplete}
                                            value={formfield.empowermentRequestedBy}
                                            options={
                                                commonfilterOpts.empowermentRequestedByOpts
                                            }
                                            isReadMode={isReadMode}
                                        />
                                    </div>
                                    <div className="col-md-6 filter-date-container">
                                        <div className="frm-filter">
                                            <FrmDatePicker
                                                title={"Created Date"}
                                                name={"createdDateFrom"}
                                                value={formfield.createdDateFrom}
                                                type={"date"}
                                                handleChange={handleDateSelectChange}
                                                isReadMode={isReadMode}
                                            />
                                        </div>

                                        <div className="daterange-title">to</div>

                                        <div className="frm-filter">
                                            <FrmDatePicker
                                                title={""}
                                                name={"createdDateTo"}
                                                value={formfield.createdDateTo}
                                                type={"date"}
                                                handleChange={handleDateSelectChange}
                                                minDate={moment(
                                                    formfield.createdDateFrom
                                                ).toDate()}
                                                isReadMode={isReadMode}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    {selectedExemptionLog === "zug" && (
                                        <>
                                            <div className="frm-filter col-md-3">
                                                <FrmInput
                                                    title={"Previous Exemption ID"}
                                                    name={"previousExemptionID"}
                                                    type={"input"}
                                                    handleChange={onSearchFilterInput}
                                                    value={formfield.previousExemptionID}
                                                    isReadMode={isReadMode}
                                                />
                                            </div>
                                            <div className="frm-filter col-md-3">
                                                <FrmSelect
                                                    title={"P&C URPM exemption required"}
                                                    name={"pC_URPMExemptionRequired"}
                                                    selectopts={yesnoopts}
                                                    handleChange={onSearchFilterSelect}
                                                    value={formfield.pC_URPMExemptionRequired}
                                                    isReadMode={isReadMode}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                    {
                        !isReadMode ? (
                            <div className="popup-footer-container">
                                <div className="btn-container">
                                    <button
                                        className={`btn-blue ${!isEmptyObjectKeys(formfield) ? "" : "disable"
                                            }`}
                                        type="submit"
                                        onClick={handleFilterSearch}
                                    >
                                        Submit
                                    </button>
                                    <div className="btn-blue" onClick={() => hideAddPopup()}>
                                        Cancel
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ""
                        )
                    }
                </div>
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
    getAll: exemptionlogActions.getAll,
    getallZUGLogs: exemptionlogActions.getallZUGLogs,
    getallZUGDeletedLogs: exemptionlogActions.getallZUGDeletedLogs,
    getallURPMDeletedLogs: exemptionlogActions.getallURPMDeletedLogs,
    getallZUGunderwriter: exemptionlogActions.getallZUGunderwriter,
    getByIdZUG: exemptionlogActions.getByIdZUG,
    postItemZUG: exemptionlogActions.postItemZUG,
    deleteItemZUG: exemptionlogActions.deleteItemZUG,
    getallURPMLogs: exemptionlogActions.getallURPMLogs,
    getByIdURPM: exemptionlogActions.getByIdURPM,
    postItemURPM: exemptionlogActions.postItemURPM,
    exportReportZUGLogs: exemptionlogActions.exportReportZUGLogs,
    exportReportURPMLogs: exemptionlogActions.exportReportURPMLogs,
    getallZUGCount: exemptionlogActions.getallZUGCount,
    getallURPMCount: exemptionlogActions.getallURPMCount,
    getAllCountry: countryActions.getAllCountry,
    getAllRegion: regionActions.getAllRegions,
    getAlllobChapter: lobchapterActions.getAlllobChapter,
    getAlllob: lobActions.getAlllob,
    getLookupByType: lookupActions.getLookupByType,
    getDataVersion: commonActions.getDataVersion,
    deleteLog: commonActions.deleteLog,
    getLogUsers: commonActions.getLogUsers,
    getAllEntryNumbers: commonActions.getAllEntryNumbers,
    clearDashboardClick: dashboardActions.clearDashboardClick,
    postItem: userViewActions.postItem,
};

export default connect(mapStateToProp, mapActions)(Exemptionlog);
