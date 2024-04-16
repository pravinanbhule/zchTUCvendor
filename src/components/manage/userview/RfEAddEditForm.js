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
    const [userRoles, setUserRoles] = useState([
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

    const [formfield, setformfield] = useState(intialFilterState);

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

            if (regionState?.regionItems && typeof response?.region === 'string' && response?.region !== null) {
                let selectedRegionArray = response?.region?.split(',')
                let regionArray = []
                selectedRegionArray?.map((id, j) => {
                    regionState.regionItems.map((item, i) => {
                        if (id === item.regionID) {
                            regionArray.push({
                                label: item.regionName.trim(),
                                value: item.regionID,
                            })
                        }
                    })
                })
                response.RegionId = typeof response?.region === 'string' && regionArray.length === 0 ? response?.region : regionArray
            } else {
                response.RegionId = []
            }
            response.isSuperAdmin = response?.userRoles?.split(',').includes('1')
            response.isGlobalAdmin = response?.userRoles?.split(',').includes('2')
            response.isRegionAdmin = response?.userRoles?.split(',').includes('3')
            response.isCountryAdmin = response?.userRoles?.split(',').includes('4')
            response.isNormalUser = response?.userRoles?.split(',').includes('8')
            response.isCountrySuperAdmin = response?.userRoles?.split(',').includes('9')
            response.CHZ = response?.chzSustainabilityDeskCHZGICreditRisk
            response.CustomerSegment = response?.customerSegment
            response.CreatedToDate = response?.createdDateTo
            response.CreatedFromDate = response?.createdDateFrom
            response.RequestForEmpowermentCC = response?.requestforempowermentCC
            response.RequestForEmpowermentReason = response?.requestforempowermentreason
            response.RequestForEmpowermentStatus = response?.requestforempowermentstatus
            response.Underwriter = response?.underwriter
            response.UnderwriterGrantingEmpowerment = response?.underwritergrantingempowerment
            response.CreatorName = response?.creatorName
            response.OrganizationalAlignment = response?.organizationalalignment
            response.RoleData = response?.role
            response.LOBId = response?.loB
            response.AccountName = response?.accountName
            response.EntryNumber = response?.entryNumber

            response.ZurichShare = response?.zurichShare
            response.Currency = response?.currency
            response.Branch = response?.branch
            response.DurationofApproval = response?.durationofApproval
            response.NewRenewal = response?.newRenewal
            response.Limit = response?.limit
            response.AccountNumber = response?.accountNumber
            response.PolicyPeriod = response?.policyPeriod
            response.ConditionApplicableTo = response?.conditionApplicableTo
            response.SUBLOBID = response?.sublobid
            response.GWP = response?.gwp

            if (response.isPrivate === true) {
                setShowUserRoles(false)
            } else {
                let Roles = response?.userRoles?.split(",")
                if (Roles?.length > 0) {
                    setSelectedUserRoles(Roles)
                }
            }
            setTimeout(async () => {
                if (typeof response?.country === 'string' && response?.country !== null) {
                    let selectedCountryArray = response?.country.split(',')
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
                    response.CountryId = countryArray
                } else {
                    response.CountryId = []
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
        setformfield({
            ...formfield,
            [name]: value,
        });
    };
    const onSearchFilterSelect = (name, value) => {
        setformfield({
            ...formfield,
            [name]: value,
        });
        if (name === "role" && value === "underwriter") {
            setformfield({
                ...formfield,
                underwriter: "",
                [name]: value,
            });
        }
        if (name === "LOBId") {
            if (value === "") {
                setsublobFilterOpts(allsublobFilterOpts);
            } else {
                let sublobopts = allsublobFilterOpts.filter(
                    (item) => item.lob === formfield.LOBId
                );
                setsublobFilterOpts([...sublobopts]);
            }
            setformfield({
                ...formfield,
                SUBLOBID: "",
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
        }
        if (name === "CountryId") {
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
            getAllSegment({ logType: "rfelogs" });
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
        };
        fnOnInit();
    }, []);

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
                LookupType: "RFEEmpowermentReasonRequest",
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
        tempStatus.forEach((item) => {
            if (item.isActive) {
                tempopts.push({
                    label: item.lookUpValue,
                    value: item.lookupID,
                });
            }
        });
        tempStatus = [...tempopts];
        tempopts = [];

        tempopts = [];
        temporgnizationalalignment.forEach((item) => {
            if (item.isActive) {
                tempopts.push({
                    label: item.lookUpValue,
                    value: item.lookupID,
                });
            }
        });
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
                tempopts.push({
                    label: item.lookUpValue,
                    value: item.lookupID,
                });
            }
        });
        temprfeempourment = [...tempopts];
        tempopts = [];
        tempDurationOfApproval.forEach((item) => {
            if (item.isActive) {
                tempopts.push({
                    label: item.lookUpValue,
                    value: item.lookupID,
                });
            }
        });
        tempDurationOfApproval = [...tempopts];
        tempopts = [];
        tempNewRenewal.forEach((item) => {
            if (item.isActive) {
                tempopts.push({
                    label: item.lookUpValue,
                    value: item.lookupID,
                });
            }
        });
        tempNewRenewal = [...tempopts];
        tempopts = [];
        tempCondition.forEach((item) => {
            if (item.isActive) {
                tempopts.push({
                    label: item.lookUpValue,
                    value: item.lookupID,
                });
            }
        });
        tempCondition = [...tempopts];
        tempopts = [];

        tempStatus.sort(dynamicSort("label"));
        temporgnizationalalignment.sort(dynamicSort("label"));
        temprfechz.sort(dynamicSort("label"));
        temprfeempourment.sort(dynamicSort("label"));
        tempDurationOfApproval.sort(dynamicSort("label"));
        tempNewRenewal.sort(dynamicSort("label"));
        tempCondition.sort(dynamicSort("label"));
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            statusFilterOpts: [selectInitiVal, ...tempStatus],
            organizationalAlignmentOpts: [selectInitiVal, ...temporgnizationalalignment],
            requestForEmpowermentReasonOpts: [selectInitiVal, ...temprfeempourment],
            chzOpts: [selectInitiVal, ...temprfechz],
            durationofApprovalOpts: [selectInitiVal, ...tempDurationOfApproval],
            newRenewalOpts: [selectInitiVal, ...tempNewRenewal],
            conditionApplicableToOpts: [selectInitiVal, ...tempCondition]
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
        let tempRegionListObj = {};
        countryState.countryItems.forEach((item) => {
            selectOpts.push({
                label: item.countryName.trim(),
                value: item.countryID,
                regionId: item.regionID,
            });
        });

        selectOpts.sort(dynamicSort("label"));
        setfrmCountrySelectOpts([...selectOpts]);
        setcountrymapping([...tempCountryMapping]);
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
        let tempItems = lobState.lobItems.map((item) => ({
            label: item.lobName,
            value: item.lobid,
        }));
        tempItems.sort(dynamicSort("label"));
        setlobFilterOpts([selectInitiVal, ...tempItems]);
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
        currencyState.currencyItems.forEach((item) => {
            if (item.isActive) {
                tempopts.push({
                    ...item,
                    label: item.currencyName,
                    value: item.currencyID,
                });
            }
        });
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            currencyOpts: [selectInitiVal, ...tempopts],
        }));
    }, [currencyState.currencyItems]);

    useEffect(() => {
        if (branchState.branchItems.length) {
            let tempopts = [];
            branchState.branchItems.forEach((item) => {
                if (item.isActive) {
                    tempopts.push({
                        ...item,
                        label: item.branchName,
                        value: item.branchId,
                    });
                }
            });
            tempopts.sort(dynamicSort("label"));
            setcommonfilterOpts((prevstate) => ({
                ...prevstate,
                branchOpts: [selectInitiVal, ...tempopts],
            }));
        }
    }, [branchState.branchItems]);

    useEffect(() => {
        let tempopts = [];
        segmentState.segmentItems.forEach((item) => {
            if (item.isActive) {
                tempopts.push({
                    ...item,
                    label: item.segmentName,
                    value: item.segmentID,
                    country: item.countryList,
                });
            }
        });
        tempopts.sort(dynamicSort("label"));
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            customerSegmentOpts: [selectInitiVal, ...tempopts],
        }));
    }, [segmentState.segmentItems]);

    useEffect(() => {
        let tempopts = [];
        sublobState.sublobitems.forEach((item) => {
            if (item.isActive) {
                tempopts.push({
                    ...item,
                    label: item.subLOBName,
                    value: item.subLOBID,
                    lob: item.lobid,
                });
            }
        });
        tempopts.sort(dynamicSort("label"));
        setallsublobFilterOpts(tempopts)
        setsublobFilterOpts(tempopts);
        if (formfield.LOBId) {
            let sublobopts = tempopts.filter(
                (item) => item.lob === formfield.LOBId
            );
            setsublobFilterOpts([selectInitiVal, ...sublobopts]);
        }
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
                        name={obj.name}
                        value={formfield[obj.name] || []}
                        handleChange={eval(obj.eventhandler)}
                        selectopts={eval(obj.options)}
                        titlelinespace={obj.titlelinespace ? true : false}
                        isReadMode={isReadMode}
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

    const handleFilterSearch = async () => {
        let data = formfield
        if (!isEmptyObjectKeys(formfield)) {
            let tempFilterOpts = {};
            for (let key in formfield) {
                if (formfield[key]) {
                    tempFilterOpts[key] = formfield[key];
                    let value = formfield[key];
                    if (key === "CountryId" || key === "RegionId") {
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
            data.requestforempowermentCC = data?.RequestForEmpowermentCC
            data.requestforempowermentreason = data?.RequestForEmpowermentReason
            data.requestforempowermentstatus = data?.RequestForEmpowermentStatus
            data.underwriter = data?.Underwriter
            data.underwritergrantingempowerment = data?.UnderwriterGrantingEmpowerment
            data.creatorName = data?.CreatorName
            data.organizationalalignment = data?.OrganizationalAlignment
            data.role = data?.RoleData
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
            delete data?.CreatedToDate
            delete data?.CreatedFromDate
            delete data?.RequestForEmpowermentCC
            delete data?.RequestForEmpowermentReason
            delete data?.RequestForEmpowermentStatus
            delete data?.Underwriter
            delete data?.UnderwriterGrantingEmpowerment
            delete data?.CreatorName
            delete data?.OrganizationalAlignment
            delete data?.RoleData
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
                    </div>
                    {showUserRoles &&
                        <>
                            <div className="border-top font-weight-bold frm-container-bgwhite">
                                <div className="mb-4"> User Roles</div>
                            </div>
                            <div className="border-bottom border-top frm-container-bggray">
                                <div className="m-1 mt-4" style={{display: 'flex', justifyContent: 'space-between'}}>
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
                                            <div className="">
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
