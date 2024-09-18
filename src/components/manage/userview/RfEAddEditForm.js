import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
    rfelogActions,
    countryActions,
    regionActions,
    lookupActions,
    lobActions,
    commonActions,
    dashboardActions,
    userViewActions,
    currencyActions,
    branchActions,
    sublobActions,
    segmentActions,
} from "../../../actions";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmMultiselect from "../../common-components/frmmultiselect/FrmMultiselect";
import FrmDatePicker from "../../common-components/frmdatepicker/FrmDatePicker";
import moment from "moment";
import {
    alertMessage,
    dynamicSort,
    formatDate,
    getUrlParameter,
    isEmptyObjectKeys,
    isNotEmptyValue,
} from "../../../helpers";
import {
    filterfieldsmapping,
    intialFilterState,
} from "../../rfelog/Rfelogconstants";
import FrmInput from "../../common-components/frminput/FrmInput";
import FrmInputAutocomplete from "../../common-components/frminputautocomplete/FrmInputAutocomplete";
import FrmCheckbox from "../../common-components/frmcheckbox/FrmCheckbox";
import FrmToggleSwitch from "../../common-components/frmtoggelswitch/FrmToggleSwitch";
import Loading from "../../common-components/Loading";

function RfelogAddEditForm({ ...props }) {
    const { rfelogState, regionState, countryState, lobState, dashboardState, currencyState, branchState, sublobState,
        segmentState } =
        props.state;
    const {
        hideAddPopup,
        getallDeletedLogs,
        getallLogs,
        getallunderwriter,
        getAllEntryNumbers,
        getallCount,
        getLogFields,
        getAllCountry,
        getAllRegion,
        getAlllob,
        getLookupByType,
        postItem,
        getLogUsers,
        userProfile,
        clearDashboardClick,
        isEditMode,
        isReadMode,
        formIntialState,
        handleEdit,
        getAllCurrency,
        getAllBranch,
        getAllSublob,
        getAllSegment,
    } = props;
    const [logstate, setlogstate] = useState({
        loading: true,
        error: "",
        data: [],
        header: [],
        loadedAll: false,
        isDataImported: false,
    });
    useSetNavMenu({ currentMenu: "Rfelog", isSubmenu: false }, props.menuClick);
    //initialize filter/search functionality
    const selectInitiVal = {
        label: "Select",
        value: "",
    };
    const [isLogInitcall, setisLogInitcall] = useState(true);
    const [isViewHide, setIsViewHide] = useState(false)
    const [commonfilterOpts, setcommonfilterOpts] = useState({
        underwriterFilterOpts: [],
        statusFilterOpts: [],
        rolesFilterOpts: [
            selectInitiVal,
            { label: "All", value: "all" },
            { label: "Approver", value: "approver" },
            {
                label: "Empowerment CC",
                value: "ccuser",
            },
            {
                label: "Underwriter",
                value: "underwriter",
            },
        ],
        entryNumberOpts: [],
        organizationalAlignmentOpts: [],
        requestForEmpowermentReasonOpts: [],
        chzOpts: [],
        requestForEmpowermentCCOpts: [],
        creatorFilterOpts: [],
        underwriterGrantingEmpowermentOpts: [],
        views: [{ label: "All", value: "gn" }],
        currencyOpts: [],
        branchOpts: [],
        durationofApprovalOpts: [],
        newRenewalOpts: [],
        customerSegmentOpts: [],
        conditionApplicableToOpts: [],
    });
    const [isfilterApplied, setisfilterApplied] = useState();
    const [dashboardStateApplied, setdashboardStateApplied] = useState(false);
    const [isAdvfilterApplied, setisAdvfilterApplied] = useState(true);
    const [isInCountryfilterApplied, setisInCountryfilterApplied] = useState(true);
    const [countryFilterOpts, setcountryFilterOpts] = useState([]);
    const [countryAllFilterOpts, setcountryAllFilterOpts] = useState([]);
    const [regionFilterOpts, setregionFilterOpts] = useState([]);
    const [regionOptsAll, setregionOptsAll] = useState([]);
    const [lobFilterOpts, setlobFilterOpts] = useState([]);
    const [sublobFilterOpts, setsublobFilterOpts] = useState([]);
    const [allsublobFilterOpts, setallsublobFilterOpts] = useState([]);
    const [accountOpts, setaccountOpts] = useState({});
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
    const [userRoles, setUserRoles] = useState([])

    const [formfield, setformfield] = useState({viewName: '', isPrivate: false, ...intialFilterState});

    const [filterdomfields, setfilterdomfields] = useState({
        common: [],
        advance: [],
        Incountry: []
    });
    const [filterfieldslist, setfilterfieldslist] = useState();
    const [loading, setLoading] = useState(false)

    useEffect(async () => {
        if (isEditMode || isReadMode) {
            setLoading(true)
            let response = formIntialState
            response.isSuperAdmin = response?.userRoles?.split(',').includes('1')
            response.isGlobalAdmin = response?.userRoles?.split(',').includes('2')
            response.isRegionAdmin = response?.userRoles?.split(',').includes('3')
            response.isCountryAdmin = response?.userRoles?.split(',').includes('4')
            response.isNormalUser = response?.userRoles?.split(',').includes('8')
            response.isCountrySuperAdmin = response?.userRoles?.split(',').includes('9')
            response.CHZ = response?.chzSustainabilityDeskCHZGICreditRis
            response.CreatedToDate = response?.createdDateTo
            response.CreatedFromDate = response?.createdDateFrom
            response.BoundToDate = response?.boundToDate
            response.BoundFromDate = response?.boundFromDate
            response.ReferenceID = response?.referenceID
            response.RequestForEmpowermentCC = response?.requestforempowermentCC
            response.Underwriter = response?.underwriter
            response.UnderwriterGrantingEmpowerment = response?.underwritergrantingempowerment
            response.Creator = response?.creator
            response.Role = response?.role
            response.AccountName = response?.accountName
            response.EntryNumber = response?.entryNumber
            response.ZurichShare = response?.zurichShare
            response.Limit = response?.limit
            response.AccountNumber = response?.accountNumber
            response.PolicyPeriod = response?.policyPeriod
            response.GWP = response?.gwp

            if (response.isPrivate === true) {
                setShowUserRoles(false)
            } else {
                let Roles = response?.userRoles?.split(",")
                if (Roles?.length > 0) {
                    setSelectedUserRoles(Roles)
                }
            }
            setformfield(response)
            setLoading(false)
        }
    }, [])

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
        setformfield({
            ...formfield,
            [name]: value,
        });
    };
    const onSearchFilterSelect = (name, value) => {
        if (name === "role" && value === "underwriter") {
            setformfield({
                ...formfield,
                underwriter: "",
                [name]: value,
            });
        } else {
            setformfield({
                ...formfield,
                [name]: value,
            });
        }
    };
    const handleMultiSelectChange = (name, value) => {
        if (name === "RegionId") {
            let countryopts = [...formfield.CountryId];
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
                CountryId: countryopts,
            });
        } else if (name === "CountryId") {
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
                RegionId: regionOpts,
            });
        } else {
            setformfield({
                ...formfield,
                [name]: value,
            });
        }
    };

    useEffect(() => {
        let tempfields = { common: [], advance: [], Incountry: [] };
        filterfieldslist?.forEach((item) => {
            if (item.isActive) {
                let tempfilterobj = filterfieldsmapping[item.fieldName];
                if (tempfilterobj) {
                    let tempobj = {
                        componenttype: tempfilterobj["componenttype"],
                        title: item.displayName,
                        name: item.fieldName,
                        colspan: tempfilterobj["colspan"] ? tempfilterobj["colspan"] : 3,
                        eventhandler: tempfilterobj["eventhandler"],
                    };
                    if (tempfilterobj["options"]) {
                        tempobj = {
                            ...tempobj,
                            options: tempfilterobj["options"],
                        };
                    }
                    if (tempfilterobj["minDate"]) {
                        tempobj = {
                            ...tempobj,
                            minDate: tempfilterobj["minDate"],
                        };
                    }
                    if (tempfilterobj["titlelinespace"]) {
                        tempobj = {
                            ...tempobj,
                            titlelinespace: tempfilterobj["titlelinespace"],
                        };
                    }
                    if (tempfilterobj["datefieldfrom"]) {
                        tempobj = {
                            ...tempobj,
                            datefieldfrom: tempfilterobj["datefieldfrom"],
                        };
                    }
                    if (tempfilterobj["datefieldto"]) {
                        tempobj = {
                            ...tempobj,
                            datefieldto: tempfilterobj["datefieldto"],
                        };
                    }
                    if (item["formatting"] === "TitleHTML") {
                        tempobj = {
                            ...tempobj,
                            fieldTitleHtml: true,
                        };
                    }
                    if (tempfilterobj["filtertype"] === "common") {
                        tempfields.common.push(tempobj);
                    } else if (tempfilterobj["filtertype"] === "advance") {
                        tempfields.advance.push(tempobj);
                    } else if (tempfilterobj["filtertype"] === "Incountry") {
                        tempfields.Incountry.push(tempobj);
                    }
                }
            }
        });
        setfilterdomfields(tempfields);
    }, [filterfieldslist]);


    const [isPaginationSort, setisPaginationSort] = useState(false);
    const [selSortFiled, setselSortFiled] = useState({
        name: "ModifiedDate",
        order: "desc",
    });
    const [paginationdata, setpaginationdata] = useState([]);
    const [logTypes, setlogTypes] = useState([]);
    const [sellogTabType, setsellogTabType] = useState("");
    const [logItmes, setlogItmes] = useState([]);
    const [alllogsloaded, setalllogsloaded] = useState(false);
    const [isLoadingStarted, setisLoadingStarted] = useState(false);

    useEffect(() => {
        if (isLoadingStarted && logItmes) {
            setlogstate({
                ...logstate,
                loading: false,
                data: [...logItmes?.FieldValues],
                header: [...logItmes?.FieldList],
                loadedAll: true,
            });
            setalllogsloaded(true);
            setisLoadingStarted(false);
            setisPaginationSort(false);
        }
    }, [logItmes]);

    useEffect(() => {
        fnsetPaginationData(logstate.data);
    }, [logstate.data]);


    const [showDraft, setshowDraft] = useState(false);
    const [showDeletedLogs, setshowDeletedLogs] = useState(false);
    useEffect(() => {
        let tempStatus = [{ label: "All", value: "all" }];
        setlogTypes(tempStatus);
    }, [showDraft, showDeletedLogs]);

    const openlogTab = (type) => {
        if (!isLoadingStarted) {
            setsellogTabType(type);
        }
    };

    useEffect(() => {
        const fnOnInit = async () => {
            getAllCountry();
            getAllRegion();
            getAllCurrency();
            getAllBranch();
            getAllSublob();
            getAllSegment({ logType: "rfelogsAll" });
            getAlllob({ isActive: true });
            loadCreatorUsers();
            loadUnderwriterUsers();
            loadCCUsers();
            loadApproverUsers();
            loadfilterdata();
            let tempStatus = [{ label: "All", value: "all" }];
            setlogTypes(tempStatus);
            setsellogTabType(tempStatus[0].value);
            setisLogInitcall(false);
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
        fnOnInit();
    }, []);

    const setOpts = (varValue, item, name) => {
        varValue.push({
            cat: name,
            label: item.lookUpValue,
            value: item.lookupID,
        })
    }

    const loadfilterdata = async () => {
        const lookupvalues = await Promise.all([
            getLookupByType({
                LookupType: "RFEEmpowermentStatusRequest",
            }),
            getLookupByType({
                LookupType: "RFEOrganizationalAlignment",
            }),
            getLookupByType({
                LookupType: "RFECHZ",
            }),
            getLookupByType({
                LookupType: "RFEEmpowermentReasonRequestAll",
            }),
            getLookupByType({
                LookupType: "DurationofApproval"
            }),
            getLookupByType({
                LookupType: "RFELogNewRenewal"
            }),
            getLookupByType({
                LookupType: "ConditionApplicableTo"
            }),
        ]);

        let tempStatus = lookupvalues[0];
        let temporgnizationalalignment = lookupvalues[1];
        let temprfechz = lookupvalues[2];
        let temprfeempourment = lookupvalues[3];
        let tempDurationOfApproval = lookupvalues[4];
        let tempNewRenewal = lookupvalues[5];
        let tempCondition = lookupvalues[6];
        let tempopts = [];
        let selectedArray = [];
        tempStatus.forEach((item) => {
            if (item.isActive) {
                if ((isEditMode || isReadMode) && typeof formIntialState?.requestforempowermentstatus === 'string' && formIntialState?.requestforempowermentstatus !== null) {
                    formIntialState?.requestforempowermentstatus?.split(',')?.map((id) => {
                        if (id === item.lookupID) {
                            selectedArray.push({
                                label: item.lookUpValue,
                                value: item.lookupID,
                            });
                        }
                    })
                }
                tempopts.push({
                    label: item.lookUpValue,
                    value: item.lookupID,
                });
            }
        });
        setformfield((prevfilter) => ({
            ...prevfilter,
            RequestForEmpowermentStatus: selectedArray,
        }));
        selectedArray = [];
        tempStatus = [...tempopts];
        tempopts = [];

        tempopts = [];
        temporgnizationalalignment.forEach((item) => {
            if (item.isActive) {
                if ((isEditMode || isReadMode) && typeof formIntialState?.organizationalalignment === 'string' && formIntialState?.organizationalalignment !== null) {
                    formIntialState?.organizationalalignment?.split(',')?.map((id) => {
                        if (id === item.lookupID) {
                            selectedArray.push({
                                label: item.lookUpValue,
                                value: item.lookupID,
                            });
                        }
                    })
                }
                tempopts.push({
                    label: item.lookUpValue,
                    value: item.lookupID,
                });
            }
        });
        setformfield((prevfilter) => ({
            ...prevfilter,
            OrganizationalAlignment: selectedArray,
        }));
        selectedArray = [];
        temporgnizationalalignment = [...tempopts];

        tempopts = [];
        temprfechz.forEach((item) => {
            if (item.isActive) {
                tempopts.push({
                    label: item.lookUpValue,
                    value: item.lookupID,
                });
            }
        });
        temprfechz = [...tempopts];

        tempopts = [];
        temprfeempourment.forEach((item) => {
            if (item.isActive) {
                if ((isEditMode || isReadMode) && typeof formIntialState?.requestforempowermentreason === 'string' && formIntialState?.requestforempowermentreason !== null) {
                    formIntialState?.requestforempowermentreason?.split(',')?.map((id) => {
                        if (id === item.lookupID) {
                            selectedArray.push({
                                label: item.lookUpValue,
                                value: item.lookupID,
                            });
                        }
                    })
                }
                if (item.lookUpType.includes("Australia")) {
                    setOpts(tempopts, item, 'Australia')
                }
                if (item.lookUpType.includes("Benelux")) {
                    setOpts(tempopts, item, 'Benelux')
                }
                if (item.lookUpType.includes("China")) {
                    setOpts(tempopts, item, 'China')
                }
                if (item.lookUpType.includes("France")) {
                    setOpts(tempopts, item, 'France')
                }
                if (item.lookUpType.includes("Germany")) {
                    setOpts(tempopts, item, 'Germany')
                }
                if (item.lookUpType.includes("HongKong")) {
                    setOpts(tempopts, item, 'HongKong')
                }
                if (item.lookUpType.includes("India")) {
                    setOpts(tempopts, item, 'India')
                }
                if (item.lookUpType.includes("Indonesia")) {
                    setOpts(tempopts, item, 'Indonesia')
                }
                if (item.lookUpType.includes("Italy")) {
                    setOpts(tempopts, item, 'Italy')
                }
                if (item.lookUpType.includes("LatAm")) {
                    setOpts(tempopts, item, 'LatAm')
                }
                if (item.lookUpType.includes("Malaysia")) {
                    setOpts(tempopts, item, 'Malaysia')
                }
                if (item.lookUpType.includes("MiddleEast")) {
                    setOpts(tempopts, item, 'MiddleEast')
                }
                if (item.lookUpType.includes("Nordic")) {
                    setOpts(tempopts, item, 'Nordic')
                }
                if (item.lookUpType.includes("Singapore")) {
                    setOpts(tempopts, item, 'Singapore')
                }
                if (item.lookUpType.includes("Spain")) {
                    setOpts(tempopts, item, 'Spain')
                }
                if (item.lookUpType.includes("UK")) {
                    setOpts(tempopts, item, 'UK')
                }
                if (item.lookUpType.length === 27) {
                    setOpts(tempopts, item, 'Global')
                }
            }
        });
        setformfield((prevfilter) => ({
            ...prevfilter,
            RequestForEmpowermentReason: selectedArray,
        }));
        selectedArray = [];
        temprfeempourment = [...tempopts];

        tempopts = [];
        tempDurationOfApproval.forEach((item) => {
            if (item.isActive) {
                if ((isEditMode || isReadMode) && typeof formIntialState?.durationofApproval === 'string' && formIntialState?.durationofApproval !== null) {
                    formIntialState?.durationofApproval?.split(',')?.map((id) => {
                        if (id === item.lookupID) {
                            selectedArray.push({
                                label: item.lookUpValue,
                                value: item.lookupID,
                            });
                        }
                    })
                }
                tempopts.push({
                    label: item.lookUpValue,
                    value: item.lookupID,
                });
            }
        });
        setformfield((prevfilter) => ({
            ...prevfilter,
            DurationofApproval: selectedArray,
        }));
        selectedArray = [];
        tempDurationOfApproval = [...tempopts];

        tempopts = [];
        tempNewRenewal.forEach((item) => {
            if (item.isActive) {
                if ((isEditMode || isReadMode) && typeof formIntialState?.newRenewal === 'string' && formIntialState?.newRenewal !== null) {
                    formIntialState?.newRenewal?.split(',')?.map((id) => {
                        if (id === item.lookupID) {
                            selectedArray.push({
                                label: item.lookUpValue,
                                value: item.lookupID,
                            });
                        }
                    })
                }
                tempopts.push({
                    label: item.lookUpValue,
                    value: item.lookupID,
                });
            }
        });
        setformfield((prevfilter) => ({
            ...prevfilter,
            NewRenewal: selectedArray,
        }));
        selectedArray = [];
        tempNewRenewal = [...tempopts];

        tempopts = [];
        tempCondition.forEach((item) => {
            if (item.isActive) {
                if ((isEditMode || isReadMode) && typeof formIntialState?.conditionApplicableTo === 'string' && formIntialState?.conditionApplicableTo !== null) {
                    formIntialState?.conditionApplicableTo?.split(',')?.map((id) => {
                        if (id === item.lookupID) {
                            selectedArray.push({
                                label: item.lookUpValue,
                                value: item.lookupID,
                            });
                        }
                    })
                }
                tempopts.push({
                    label: item.lookUpValue,
                    value: item.lookupID,
                });
            }
        });
        setformfield((prevfilter) => ({
            ...prevfilter,
            ConditionApplicableTo: selectedArray,
        }));
        selectedArray = [];
        tempCondition = [...tempopts];

        tempopts = [];

        tempStatus.sort(dynamicSort("label"));
        temporgnizationalalignment.sort(dynamicSort("label"));
        temprfechz.sort(dynamicSort("label"));
        tempDurationOfApproval.sort(dynamicSort("label"));
        tempNewRenewal.sort(dynamicSort("label"));
        tempCondition.sort(dynamicSort("label"));
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            statusFilterOpts: [...tempStatus],
            organizationalAlignmentOpts: [...temporgnizationalalignment],
            requestForEmpowermentReasonOpts: [...temprfeempourment],
            chzOpts: [selectInitiVal, ...temprfechz],
            durationofApprovalOpts: [...tempDurationOfApproval],
            newRenewalOpts: [...tempNewRenewal],
            conditionApplicableToOpts: [...tempCondition]
        }));
        const tempfilterfields = await getLogFields({
            IncountryFlag: "",
            FieldType: "Filter",
        });
        setfilterfieldslist(tempfilterfields);
        if (dashboardState.status) {
            setformfield((prevfilter) => ({
                ...prevfilter,
                requestForEmpowermentStatus: dashboardState.status,
            }));
            clearDashboardClick();
            setisfilterApplied(true);
            setdashboardStateApplied(true);
        }
    };

    const loadCreatorUsers = async () => {
        let tempCreator = await getLogUsers({
            LogType: "rfelogs",
            FieldName: "CreatedBy",
            userId: userProfile.userId,
        });
        tempCreator = tempCreator.map((item) => ({
            label: item.userName,
            value: item.emailAddress,
        }));
        tempCreator.sort();
        tempCreator = tempCreator.map((item) => item.label);
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            creatorFilterOpts: [...tempCreator],
        }));
    };
    const loadUnderwriterUsers = async () => {
        let tempUnderwritter = await getallunderwriter({
            RequesterUserId: userProfile.userId,
        });
        tempUnderwritter = tempUnderwritter.map((item) => ({
            label: item.userName,
            value: item.emailAddress,
        }));
        tempUnderwritter.sort(dynamicSort("label"));
        tempUnderwritter = tempUnderwritter.map((item) => item.label);
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            underwriterFilterOpts: [...tempUnderwritter],
        }));
    };
    const loadCCUsers = async () => {
        let tempCCUsers = await getLogUsers({
            LogType: "rfelogs",
            FieldName: "RequestForEmpowermentCC",
            userId: userProfile.userId,
        });
        tempCCUsers = tempCCUsers.map((item) => ({
            label: item.userName,
            value: item.emailAddress,
        }));
        tempCCUsers.sort();
        tempCCUsers = tempCCUsers.map((item) => item.label);

        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            requestForEmpowermentCCOpts: [...tempCCUsers],
        }));
    };
    const loadApproverUsers = async () => {
        let tempUsers = await getLogUsers({
            LogType: "rfelogs",
            FieldName: "UnderwriterGrantingEmpowerment",
            userId: userProfile.userId,
        });
        tempUsers = tempUsers.map((item) => ({
            label: item.userName,
            value: item.emailAddress,
        }));
        tempUsers = tempUsers.map((item) => item.label);
        tempUsers.sort();
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            underwriterGrantingEmpowermentOpts: [...tempUsers],
        }));
    };
    useEffect(() => {
        if (dashboardStateApplied && isfilterApplied) {
            handleFilterSearch();
        }
    }, [dashboardStateApplied]);

    const [countrymapping, setcountrymapping] = useState([]);
    const [frmCountrySelectOpts, setfrmCountrySelectOpts] = useState([]);

    useEffect(() => {
        let selectOpts = [];
        let tempCountryMapping = [];
        let selectedArray = [];
        countryState.countryItems.forEach((item) => {
            if ((isEditMode || isReadMode) && typeof formIntialState?.country === 'string' && formIntialState?.country !== null) {
                formIntialState?.country?.split(',')?.map((id) => {
                    if (id === item.countryID) {
                        selectedArray.push({
                            label: item.countryName.trim(),
                            value: item.countryID,
                            regionId: item.regionID,
                        });
                    }
                })
            }
            selectOpts.push({
                label: item.countryName.trim(),
                value: item.countryID,
                regionId: item.regionID,
            });
        });
        setformfield((prevfilter) => ({
            ...prevfilter,
            CountryId: selectedArray,
        }));
        selectOpts.sort(dynamicSort("label"));
        setfrmCountrySelectOpts([...selectOpts]);
        setcountrymapping([...tempCountryMapping]);
        setcountryFilterOpts([...selectOpts]);
        setcountryAllFilterOpts([...selectOpts]);
    }, [countryState.countryItems]);

    const [frmRegionSelectOpts, setfrmRegionSelectOpts] = useState([]);
    useEffect(() => {
        let selectOpts = [];
        let selectedArray = [];
        regionState.regionItems.forEach((item) => {
            if ((isEditMode || isReadMode) && typeof formIntialState?.region === 'string' && formIntialState?.region !== null) {
                formIntialState?.region?.split(',')?.map((id) => {
                    if (id === item.regionID) {
                        selectedArray.push({
                            ...item,
                            label: item.regionName.trim(),
                            value: item.regionID,
                        });
                    }
                })
            }
            selectOpts.push({
                ...item,
                label: item.regionName.trim(),
                value: item.regionID,
            });
        });
        setformfield((prevfilter) => ({
            ...prevfilter,
            RegionId: selectedArray,
        }));
        selectOpts.sort(dynamicSort("label"));
        setfrmRegionSelectOpts([...selectOpts]);
        setregionFilterOpts([...selectOpts]);
        setregionOptsAll([...selectOpts]);
    }, [regionState.regionItems]);

    useEffect(() => {
        let tempItems = []
        let loBArray = []
        lobState.lobItems.map((item) => {
            if ((isEditMode || isReadMode) && typeof formIntialState?.loB === 'string' && formIntialState?.loB !== null) {
                formIntialState?.loB?.split(',')?.map((id) => {
                    if (id === item.lobid) {
                        loBArray.push({
                            label: item.lobName,
                            value: item.lobid,
                        });
                    }
                })
            }
            tempItems.push({
                label: item.lobName,
                value: item.lobid,
            })
        });
        setformfield((prevfilter) => ({
            ...prevfilter,
            LOBId: loBArray,
        }));
        tempItems.sort(dynamicSort("label"));
        setlobFilterOpts([...tempItems]);
    }, [lobState.lobItems]);

    useEffect(() => {
        if (Array.isArray(rfelogState.accounts) && rfelogState.accounts.length) {
            let tempAccObj = {};
            rfelogState.accounts.forEach((iteam) => {
                // if (isNaN(iteam.charAt(0))) {
                if (tempAccObj[iteam.charAt(0).toLowerCase()]) {
                    tempAccObj[iteam.charAt(0).toLowerCase()].push(iteam);
                } else {
                    tempAccObj[iteam.charAt(0).toLowerCase()] = [];
                }
                //}
            });
            setaccountOpts({ ...tempAccObj });
        }
    }, [rfelogState.accounts]);

    useEffect(() => {
        let tempopts = [];
        let selectedArray = [];
        currencyState.currencyItems.forEach((item) => {
            if (item.isActive) {
                if ((isEditMode || isReadMode) && typeof formIntialState?.currency === 'string' && formIntialState?.currency !== null) {
                    formIntialState?.currency?.split(',')?.map((id) => {
                        if (id === item.currencyID) {
                            selectedArray.push({
                                ...item,
                                label: item.currencyName,
                                value: item.currencyID,
                            });
                        }
                    })
                }
                tempopts.push({
                    ...item,
                    label: item.currencyName,
                    value: item.currencyID,
                });
            }
        });
        setformfield((prevfilter) => ({
            ...prevfilter,
            Currency: selectedArray,
        }));
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            currencyOpts: [...tempopts],
        }));
    }, [currencyState.currencyItems]);

    useEffect(() => {
        if (branchState.branchItems.length) {
            let tempopts = [];
            let selectedArray = [];
            branchState.branchItems.forEach((item) => {
                if (item.isActive) {
                    if ((isEditMode || isReadMode) && typeof formIntialState?.branch === 'string' && formIntialState?.branch !== null) {
                        formIntialState?.branch?.split(',')?.map((id) => {
                            if (id === item.branchId) {
                                selectedArray.push({
                                    ...item,
                                    label: item.branchName,
                                    value: item.branchId,
                                });
                            }
                        })
                    }
                    tempopts.push({
                        ...item,
                        label: item.branchName,
                        value: item.branchId,
                    });
                }
            });
            setformfield((prevfilter) => ({
                ...prevfilter,
                Branch: selectedArray,
            }));
            tempopts.sort(dynamicSort("label"));
            setcommonfilterOpts((prevstate) => ({
                ...prevstate,
                branchOpts: [...tempopts],
            }));
        }
    }, [branchState.branchItems]);

    useEffect(() => {
        let tempopts = [];
        let temGermany = [];
        let selectedArray = [];
        segmentState.segmentItems.forEach((item) => {
            if (item.isActive) {
                if ((isEditMode || isReadMode) && typeof formIntialState?.customerSegment === 'string' && formIntialState?.customerSegment !== null) {
                    formIntialState?.customerSegment?.split(',')?.map((id) => {
                        if (id === item.segmentID) {
                            selectedArray.push({
                                ...item,
                                label: item.segmentName,
                                value: item.segmentID,
                                country: item.countryList,
                                cat: item.logType && item.logType === "rfelogsGermany" ? 'Germany' : 'Global'
                            });
                        }
                    })
                }
                if (item.logType && item.logType === "rfelogsGermany") {
                    temGermany.push({
                        ...item,
                        label: item.segmentName,
                        value: item.segmentID,
                        country: item.countryList,
                        cat: 'Germany'
                    })
                } else {
                    tempopts.push({
                        ...item,
                        label: item.segmentName,
                        value: item.segmentID,
                        country: item.countryList,
                        cat: 'Global'
                    });
                }
            }
        });
        setformfield((prevfilter) => ({
            ...prevfilter,
            CustomerSegment: selectedArray,
        }));
        tempopts.sort(dynamicSort("label"));
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            customerSegmentOpts: [...tempopts, ...temGermany],
        }));
    }, [segmentState.segmentItems]);

    useEffect(() => {
        let tempopts = [];
        let selectedArray = [];
        sublobState.sublobitems.forEach((item) => {
            if (item.isActive) {
                if ((isEditMode || isReadMode) && typeof formIntialState?.sublobid === 'string' && formIntialState?.sublobid !== null) {
                    formIntialState?.sublobid?.split(',')?.map((id) => {
                        if (id === item.subLOBID) {
                            selectedArray.push({
                                ...item,
                                label: item.subLOBName,
                                value: item.subLOBID,
                                lob: item.lobid,
                            });
                        }
                    })
                }
                tempopts.push({
                    ...item,
                    label: item.subLOBName,
                    value: item.subLOBID,
                    lob: item.lobid,
                });
            }
        });
        setformfield((prevfilter) => ({
            ...prevfilter,
            SUBLOBID: selectedArray,
        }));
        tempopts.sort(dynamicSort("label"));
        setallsublobFilterOpts(tempopts)
        setsublobFilterOpts(tempopts);
    }, [sublobState.sublobitems]);

    const fnsetPaginationData = (data) => {
        //if (data.length) {
        setpaginationdata(data);
        //}
    };

    useEffect(() => {
        const getEntryNumbers = async () => {
            if (!sellogTabType) {
                return;
            }
            let entityNumberArr = [];
            let reqparam = { LogType: "rfelogs" };
            reqparam =
                sellogTabType === "draft"
                    ? { ...reqparam, IsSubmit: false }
                    : sellogTabType === "delete"
                        ? { ...reqparam, IsDelete: true }
                        : { ...reqparam, IsSubmit: true };

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
        };
        getEntryNumbers();
    }, [sellogTabType]);
    const [filterbox, setfilterbox] = useState(true);


    const Filterdomobj = (obj) => {
        switch (obj.componenttype) {
            case "FrmInput":
                return (
                    <FrmInput
                        title={
                            obj.fieldTitleHtml ? (
                                <span dangerouslySetInnerHTML={{ __html: obj.title }}></span>
                            ) : (
                                obj.title
                            )
                        }
                        name={obj.name}
                        type={"input"}
                        handleChange={eval(obj.eventhandler)}
                        value={formfield[obj.name]}
                        titlelinespace={obj.titlelinespace ? true : false}
                        isReadMode={isReadMode}
                    />
                );
            case "FrmInputAutocomplete":
                return (
                    <FrmInputAutocomplete
                        title={
                            obj.fieldTitleHtml ? (
                                <span dangerouslySetInnerHTML={{ __html: obj.title }}></span>
                            ) : (
                                obj.title
                            )
                        }
                        name={obj.name}
                        type={"input"}
                        handleChange={eval(obj.eventhandler)}
                        value={formfield[obj.name]}
                        options={eval(obj.options)}
                        titlelinespace={obj.titlelinespace ? true : false}
                        isReadMode={isReadMode}
                    />
                );
            case "FrmSelect":
                return (
                    <FrmSelect
                        title={
                            obj.fieldTitleHtml ? (
                                <span dangerouslySetInnerHTML={{ __html: obj.title }}></span>
                            ) : (
                                obj.title
                            )
                        }
                        name={obj.name}
                        value={formfield[obj.name] || []}
                        handleChange={eval(obj.eventhandler)}
                        selectopts={eval(obj.options)}
                        titlelinespace={obj.titlelinespace ? true : false}
                        isReadMode={isReadMode}
                    />
                );
            case "FrmMultiselect":
                return (
                    <FrmMultiselect
                        title={
                            obj.fieldTitleHtml ? (
                                <span dangerouslySetInnerHTML={{ __html: obj.title }}></span>
                            ) : (
                                obj.title
                            )
                        }
                        groupBy={obj.name === "RequestForEmpowermentReason" || obj.name === "CustomerSegment" ? 'cat' : ''}
                        name={obj.name}
                        value={formfield[obj.name] || []}
                        handleChange={eval(obj.eventhandler)}
                        selectopts={eval(obj.options)}
                        titlelinespace={obj.titlelinespace ? true : false}
                        isReadMode={isReadMode}
                        isAllOptNotRequired={true}
                    />
                );
            case "FrmDatePicker":
                return (
                    <div className="col-md-6 filter-date-container">
                        <div className="frm-filter">
                            <FrmDatePicker
                                title={obj.title}
                                name={obj.datefieldfrom.fieldname}
                                value={formfield[obj.datefieldfrom.fieldname]}
                                type={"date"}
                                handleChange={handleDateSelectChange}
                                isReadMode={isReadMode}
                            />
                        </div>

                        <div className="daterange-title">to</div>

                        <div className="frm-filter">
                            <FrmDatePicker
                                title={""}
                                name={obj.datefieldto.fieldname}
                                value={formfield[obj.datefieldto.fieldname]}
                                type={"date"}
                                handleChange={handleDateSelectChange}
                                minDate={moment(
                                    formfield[obj.datefieldfrom.fieldname]
                                ).toDate()}
                                isReadMode={isReadMode}
                            />
                        </div>
                    </div>
                );
            default:
                break;
        }
    };

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
            if (issubmitted && showError === false && selectedValue.length === 0) {
                setShowError(true)
            } else if(issubmitted && showError && selectedValue.length > 0 ){
                setShowError(false)
            }
            setSelectedUserRoles(selectedValue)
        }
        setformfield({
            ...formfield,
            [name]: value
        });
    }

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

    const [showUserRoles, setShowUserRoles] = useState(true)
    const [selectedUserRoles, setSelectedUserRoles] = useState([])

    const [issubmitted, setissubmitted] = useState(false);
    const [mandatoryFields, setmandatoryFields] = useState(['viewName']);
    const validateform = () => {
        let isvalidated = true;
        for (let key in formfield) {
            if (mandatoryFields.includes(key) && isvalidated) {
                let value = formfield[key];
                value = value.trim()
                if (value.length === 0) {
                    setformfield({
                        ...formfield,
                        [key]: "",
                    });
                    isvalidated = false;
                }
                if (!isNotEmptyValue(value)) {
                    isvalidated = false;
                }
            }
        }
        return isvalidated;
    };
    const [showError, setShowError] = useState(false)
    const handleFilterSearch = async () => {
        let data = formfield
        setissubmitted(true);
        if (validateform()) {
            if (formfield.isPrivate === false && selectedUserRoles.length === 0) {
                setShowError(true)
            } else {
                let tempFilterOpts = {};
                for (let key in formfield) {
                    if (formfield[key]) {
                        tempFilterOpts[key] = formfield[key];
                        let value = formfield[key];
                        if (key === "CountryId" || key === "RegionId" ||
                            key === "LOBId" || key === "RequestForEmpowermentStatus" ||
                            key === "OrganizationalAlignment" || key === "RequestForEmpowermentReason" ||
                            key === "DurationofApproval" || key === "Currency" || key === "Branch" ||
                            key === "NewRenewal" || key === "CustomerSegment" || key === "SUBLOBID" ||
                            key === "ConditionApplicableTo") {
                            const tmpval = value.map((item) => item.value);
                            tempFilterOpts[key] = tmpval.join(",");
                        }
                    } else {
                        delete formfield[key]
                    }
                }
                data = {
                    ...data,
                    ...tempFilterOpts,
                    userRoles: selectedUserRoles.toString(),
                    requesterUserId: userProfile.userId,
                    UserViewType: 'rfelog'
                }
                data.chzSustainabilityDeskCHZGICreditRisk = data?.CHZ
                data.customerSegment = data?.CustomerSegment
                data.createdDateTo = data?.CreatedToDate
                data.createdDateFrom = data?.CreatedFromDate
                data.referenceID = data?.ReferenceID
                data.boundToDate = data?.BoundToDate
                data.boundFromDate = data?.BoundFromDate
                data.requestforempowermentCC = data?.RequestForEmpowermentCC
                data.requestforempowermentreason = data?.RequestForEmpowermentReason
                data.requestforempowermentstatus = data?.RequestForEmpowermentStatus
                data.underwriter = data?.Underwriter
                data.underwritergrantingempowerment = data?.UnderwriterGrantingEmpowerment
                data.creator = data?.Creator
                data.organizationalalignment = data?.OrganizationalAlignment
                data.role = data?.Role
                data.loB = data?.LOBId
                data.accountName = data?.AccountName
                data.entryNumber = data?.EntryNumber
                data.country = data?.CountryId
                data.region = data?.RegionId
                data.zurichShare = data?.ZurichShare
                data.currency = data?.Currency
                data.branch = data?.Branch
                data.durationofApproval = data?.DurationofApproval
                data.newRenewal = data?.NewRenewal
                data.limit = data?.Limit
                data.accountNumber = data?.AccountNumber
                data.policyPeriod = data?.PolicyPeriod
                data.conditionApplicableTo = data?.ConditionApplicableTo
                data.sublobid = data?.SUBLOBID
                data.gwp = data?.GWP
                delete data?.CHZ
                delete data?.CustomerSegment
                delete data?.BoundFromDate
                delete data?.BoundToDate
                delete data?.ReferenceID
                delete data?.CreatedToDate
                delete data?.CreatedFromDate
                delete data?.RequestForEmpowermentCC
                delete data?.RequestForEmpowermentReason
                delete data?.RequestForEmpowermentStatus
                delete data?.Underwriter
                delete data?.UnderwriterGrantingEmpowerment
                delete data?.Creator
                delete data?.OrganizationalAlignment
                delete data?.Role
                delete data?.LOBId
                delete data?.AccountName
                delete data?.EntryNumber
                delete data?.CountryId
                delete data?.RegionId
                delete data?.ZurichShare
                delete data?.Currency
                delete data?.Branch
                delete data?.DurationofApproval
                delete data?.NewRenewal
                delete data?.Limit
                delete data?.AccountNumber
                delete data?.PolicyPeriod
                delete data?.ConditionApplicableTo
                delete data?.SUBLOBID
                delete data?.GWP
                let response = await postItem(data)
                if (response) {
                    if (data.rfeViewsId) {
                        alert(alertMessage.userview.update);
                    } else {
                        alert(alertMessage.userview.add);
                    }
                    hideAddPopup()
                }
            }
        }
    };

    return (
        <div className="addedit-logs-container">
            <div className="addedit-header-container">
                <div className="addedit-header-title">New/Edit View for RfE Log</div>
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
                                isRequired={true}
                                validationmsg={"Mandatory field"}
                                isReadMode={isReadMode}
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
                                isReadMode={isReadMode}
                                selectopts={switchOpts}
                            />
                        </div>
                    </div>
                    {showUserRoles &&
                        <>
                            <div className="border-top font-weight-bold frm-container-bgwhite d-flex">
                                <div className="mb-4"> User Roles</div>
                                {showError ?
                                    <div className="validationError">Please select at least one user role</div>
                                :(
                                    ""
                                )}
                            </div>
                            <div className="border-bottom border-top frm-container-bggray">
                                <div className="m-1 mt-4 d-flex" style={userProfile.isCountrySuperAdmin ? {} : { justifyContent: 'space-between' }}>
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
                                            <div className="" style={userProfile.isCountrySuperAdmin ? { marginRight: '10%' } : {}}>
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
                                {filterdomfields.common.length
                                    ? filterdomfields.common.map((item) => (
                                        <div
                                            className={`frm-filter col-md-${item.colspan}`}
                                        >
                                            {Filterdomobj(item)}
                                        </div>
                                    ))
                                    : "Loading..."}
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
                                    {filterdomfields.advance.length
                                        ? filterdomfields.advance.map((item) =>
                                            item.componenttype === "FrmDatePicker" ? (
                                                Filterdomobj(item)
                                            ) : (
                                                <div
                                                    className={`frm-filter col-md-${item.colspan}`}
                                                >
                                                    {Filterdomobj(item)}
                                                </div>
                                            )
                                        )
                                        : "Loading..."}
                                </div>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                    <div className="user-view-advance-filter-btn-container mt-5">
                        <div
                            className={`user-view-advance-filter-btn`}
                        >
                            Incountry Search
                        </div>
                    </div>
                    {isInCountryfilterApplied ? (
                        <div className="filter-advance">
                            <div className="filter-container">
                                <div className="row">
                                    {filterdomfields?.Incountry?.length
                                        ? filterdomfields.Incountry.map((item) =>
                                            item.componenttype === "FrmDatePicker" ? (
                                                Filterdomobj(item)
                                            ) : (
                                                <div
                                                    className={`frm-filter col-md-${item.colspan}`}
                                                >
                                                    {Filterdomobj(item)}
                                                </div>
                                            )
                                        )
                                        : "Loading..."}
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
                                        className={`btn-blue`}
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
    getAll: rfelogActions.getAll,
    getallDeletedLogs: rfelogActions.getallDeletedLogs,
    getallCount: rfelogActions.getallCount,
    getallLogs: rfelogActions.getallLogs,
    getAllCountry: countryActions.getAllCountry,
    getAllRegion: regionActions.getAllRegions,
    getAlllob: lobActions.getAlllob,
    getById: rfelogActions.getById,
    postItem: userViewActions.postItem,
    deleteItem: rfelogActions.deleteItem,
    getallunderwriter: rfelogActions.getallunderwriter,
    exportReportLogs: rfelogActions.exportReportLogs,
    getLookupByType: lookupActions.getLookupByType,
    getDataVersion: commonActions.getDataVersion,
    deleteLog: commonActions.deleteLog,
    getLogUsers: commonActions.getLogUsers,
    getAllEntryNumbers: commonActions.getAllEntryNumbers,
    getLogCount: commonActions.getLogCount,
    getLogFields: commonActions.getLogFields,
    clearDashboardClick: dashboardActions.clearDashboardClick,
    getAllCurrency: currencyActions.getAllCurrency,
    getAllBranch: branchActions.getAllBranch,
    getAllSublob: sublobActions.getAllSublob,
    getAllSegment: segmentActions.getAllSegment,
};

export default connect(mapStateToProp, mapActions)(RfelogAddEditForm);
