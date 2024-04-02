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
} from "../../../actions";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmMultiselect from "../../common-components/frmmultiselect/FrmMultiselect";
import FrmDatePicker from "../../common-components/frmdatepicker/FrmDatePicker";
import moment from "moment";
import Pagination from "../../common-components/pagination/Pagination";
import {
    alertMessage,
    dynamicSort,
    formatDate,
    getUrlParameter,
    isEmptyObjectKeys,
    isNotEmptyValue,
} from "../../../helpers";
import {
    SHAREPOINT_LINKS,
    INCOUNTRY_FLAG,
    INCOUNTRY_FLAG_OPTS,
} from "../../../constants";
import {
    intialFilterState,
    filterfieldsmapping,
} from "../../rfelog/Rfelogconstants";
import FrmInput from "../../common-components/frminput/FrmInput";
import FrmInputAutocomplete from "../../common-components/frminputautocomplete/FrmInputAutocomplete";
import { RFE_LOG_STATUS } from "../../../constants"
import { useHistory } from "react-router-dom";
import FrmCheckbox from "../../common-components/frmcheckbox/FrmCheckbox";
import FrmToggleSwitch from "../../common-components/frmtoggelswitch/FrmToggleSwitch";
let pageIndex = 1;
let pagesize = 10;
let totalLogCount = 0;
function RfelogAddEditForm({ ...props }) {
    const { rfelogState, regionState, countryState, lobState, dashboardState } =
        props.state;
    const {
        getAll,
        getallDeletedLogs,
        getallLogs,
        getAllPolicy360Accounts,
        getallunderwriter,
        getAllEntryNumbers,
        getallCount,
        getLogCount,
        getLogFields,
        getAllCountry,
        getAllRegion,
        getAlllob,
        getById,
        getLookupByType,
        checkIsInUse,
        postItem,
        deleteItem,
        deleteLog,
        getLogUsers,
        userProfile,
        getDataVersion,
        clearDashboardClick,
        exportReportLogs,
    } = props;
    const [logstate, setlogstate] = useState({
        loading: true,
        error: "",
        data: [],
        header: [],
        loadedAll: false,
        isDataImported: false,
    });
    const rfelog_status = {
        Pending: RFE_LOG_STATUS.Pending,
        More_information_needed: RFE_LOG_STATUS.More_information_needed,
        Empowerment_granted: RFE_LOG_STATUS.Empowerment_granted,
        Empowerment_granted_with_conditions:
            RFE_LOG_STATUS.Empowerment_granted_with_conditions,
        Empowerment_not_granted: RFE_LOG_STATUS.Empowerment_not_granted,
        Withdrawn: RFE_LOG_STATUS.Withdrawn,
    };
    const rfelogActiveSharePointLink = SHAREPOINT_LINKS.RFElogActive;
    const rfelogArchiveSharePointLink = SHAREPOINT_LINKS.RFElogArchive;
    const rfelogLATAMActiveSharePointLink = SHAREPOINT_LINKS.RFElogLATAMActive;
    const rfelogUKActiveSharePointLink = SHAREPOINT_LINKS.RFEUKlogActive;
    const rfeARClogUKActiveSharePointLink = SHAREPOINT_LINKS.RFEARCUKlogActive;
    const rfelogNordicActiveSharePointLink = SHAREPOINT_LINKS.RFENordiclogActive;
    const rfelogItalyActiveSharePointLink = SHAREPOINT_LINKS.RFEItalylogActive;
    const rfelogGermanyActiveSharePointLink = SHAREPOINT_LINKS.RFEGermanylogActive;
    const InCountryViewOpts = [
        INCOUNTRY_FLAG_OPTS.Indonesia,
        INCOUNTRY_FLAG_OPTS.UK,
        INCOUNTRY_FLAG_OPTS.LATAM,
        INCOUNTRY_FLAG_OPTS.SINGAPORE,
        INCOUNTRY_FLAG_OPTS.ITALY,
        INCOUNTRY_FLAG_OPTS.BENELUX,
        INCOUNTRY_FLAG_OPTS.NORDIC,
        INCOUNTRY_FLAG_OPTS.AUSTRALIA,
        INCOUNTRY_FLAG_OPTS.CHINA,
        INCOUNTRY_FLAG_OPTS.HONGKONG,
        INCOUNTRY_FLAG_OPTS.MALAYSIA,
        INCOUNTRY_FLAG_OPTS.FRANCE,
        INCOUNTRY_FLAG_OPTS.MIDDLEEAST,
        INCOUNTRY_FLAG_OPTS.GERMANY,
        INCOUNTRY_FLAG_OPTS.SPAIN
    ];
    const [logsDraftData, setlogsDraftData] = useState([]);
    useSetNavMenu({ currentMenu: "Rfelog", isSubmenu: false }, props.menuClick);
    const FileDownload = require("js-file-download");
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
    });
    const [isfilterApplied, setisfilterApplied] = useState();
    const [dashboardStateApplied, setdashboardStateApplied] = useState(false);
    const [isAdvfilterApplied, setisAdvfilterApplied] = useState(true);
    const [countryFilterOpts, setcountryFilterOpts] = useState([]);
    const [countryAllFilterOpts, setcountryAllFilterOpts] = useState([]);
    const [regionFilterOpts, setregionFilterOpts] = useState([]);
    const [regionOptsAll, setregionOptsAll] = useState([]);
    const [lobFilterOpts, setlobFilterOpts] = useState([]);
    const [accountOpts, setaccountOpts] = useState({});
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

    const [selfilter, setselfilter] = useState(intialFilterState);

    const [filterdomfields, setfilterdomfields] = useState({
        common: [],
        advance: [],
    });
    const [filterfieldslist, setfilterfieldslist] = useState();

    const onSearchFilterInput = (e) => {
        const { name, value } = e.target;
        setselfilter({
            ...selfilter,
            [name]: value,
        });
    };
    const handleDateSelectChange = (name, value) => {
        let dateval = value ? moment(value).format("YYYY-MM-DD") : "";
        setselfilter({
            ...selfilter,
            [name]: dateval,
        });
    };
    const onSearchFilterInputAutocomplete = (name, value) => {
        //const { name, value } = e.target;
        setselfilter({
            ...selfilter,
            [name]: value,
        });
    };
    const onSearchFilterSelect = (name, value) => {
        // const { name, value } = e.target;
        setselfilter({
            ...selfilter,
            [name]: value,
        });
        if (name === "role" && value === "underwriter") {
            setselfilter({
                ...selfilter,
                underwriter: "",
                [name]: value,
            });
        }
        /*if (name === "regionId" && value !== "") {
          let countryopts = countryAllFilterOpts.filter(
            (item) => item.regionId === value
          );
          setcountryFilterOpts([...countryopts]);
          setselfilter({
            ...selfilter,
            [name]: value,
            countryId: "",
          });
        } else if (name === "regionId" && value === "") {
          setcountryFilterOpts([...countryAllFilterOpts]);
          setregionFilterOpts([...regionOptsAll]);
          setselfilter({
            ...selfilter,
            [name]: value,
            countryId: "",
          });
        }
        if (name === "countryId" && value !== "") {
          let country = countryAllFilterOpts.filter((item) => item.value === value);
          let regionOpts = regionOptsAll.filter(
            (item) => item.value === country[0].regionId
          );
          setregionFilterOpts([selectInitiVal, ...regionOpts]);
          setselfilter({
            ...selfilter,
            [name]: value,
            regionId: regionOpts[0].value,
          });
        } else if (name === "countryId" && value === "") {
          setregionFilterOpts([selectInitiVal, ...regionOptsAll]);
          setselfilter({
            ...selfilter,
            [name]: value,
            regionId: "",
          });
        }*/
    };
    const handleMultiSelectChange = (name, value) => {
        if (name === "RegionId") {
            let countryopts = [...selfilter.CountryId];
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
            setselfilter({
                ...selfilter,
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
            setselfilter({
                ...selfilter,
                [name]: value,
                RegionId: regionOpts,
            });
        }
    };
    const handleFilterSearch = async () => {
        let data = selfilter
        if (!isEmptyObjectKeys(selfilter)) {
            let tempFilterOpts = {};
            for (let key in selfilter) {
                if (selfilter[key]) {
                    tempFilterOpts[key] = selfilter[key];
                    let value = selfilter[key];
                    if (key === "CountryId" || key === "RegionId") {
                        const tmpval = value.map((item) => item.value);
                        tempFilterOpts[key] = tmpval.join(",");
                    }
                }
            }
            data = {
                ...data,
                ...tempFilterOpts,
                UserViewType: 'rfelog'
            }
            console.log("data", data);
            let response = await postItem(data)
            console.log('response', response);
        }
    };


    useEffect(() => {
        let tempfields = { common: [], advance: [] };
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
                    } else {
                        tempfields.advance.push(tempobj);
                    }
                }
            }
        });
        setfilterdomfields(tempfields);
    }, [filterfieldslist]);

    //code for changing view
    const [selectedview, setselectedview] = useState("gn");
    useEffect(() => {
        const fnloadcountryview = async () => {
            const tempfilterfields = await getLogFields({
                IncountryFlag: selectedview === "gn" ? "" : selectedview,
                FieldType: "Filter",
            });
            setfilterfieldslist(tempfilterfields);
            pageIndex = 1;
        };
        if (!isLogInitcall) {
            fnloadcountryview();
            getallDraftItems();
            getallDeletedItems();
        }
    }, [selectedview]);

    const [isPaginationSort, setisPaginationSort] = useState(false);
    const [selSortFiled, setselSortFiled] = useState({
        name: "ModifiedDate",
        order: "desc",
    });
    useEffect(() => {
        if (isPaginationSort) {
            pageIndex = 1;
        }
    }, [isPaginationSort]);
    const [paginationdata, setpaginationdata] = useState([]);
    const [logTypes, setlogTypes] = useState([]);
    const [sellogTabType, setsellogTabType] = useState("");
    const [logItmes, setlogItmes] = useState([]);
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
            IncountryFlag: selectedview === "gn" ? "" : selectedview,
            UserRole:
                userProfile?.userRoles[userProfile?.userRoles?.length - 1].displayRole,
        };
        setisLoadingStarted(true);
        if (sellogTabType === "draft") {
            reqParam = {
                ...reqParam,
                IsSubmit: false,
            };
        } else if (sellogTabType === "all") {
            reqParam = {
                ...reqParam,
                IsSubmit: true,
            };
        }
        if (!isEmptyObjectKeys(selfilter)) {
            let tempFilterOpts = {};
            for (let key in selfilter) {
                if (selfilter[key]) {
                    tempFilterOpts[key] = selfilter[key];
                    let value = selfilter[key];
                    if (key === "CountryId" || key === "RegionId") {
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
            const dbvalues = await Promise.all([
                sellogTabType === "delete"
                    ? getallCount({ ...reqParam, IsDelete: true })
                    : getallCount(reqParam),
                sellogTabType === "delete"
                    ? getallDeletedLogs(reqParam)
                    : getallLogs(reqParam),
            ]);
            totalLogCount = dbvalues[0];
            setlogItmes(dbvalues[1]);
        } catch (error) {
            console.log(error);
        }
    };
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
        if (showDraft) {
            tempStatus.push({
                label: "Draft",
                value: "draft",
            });
        }
        if (showDeletedLogs) {
            tempStatus.push({
                label: "Deleted",
                value: "delete",
            });
        }
        setlogTypes(tempStatus);
    }, [showDraft, showDeletedLogs]);

    const getallDraftItems = async () => {
        let tempdraftItems = await getallCount({
            RequesterUserId: userProfile.userId,
            isSubmit: false,
            UserEmail: userProfile.emailAddress,
            IncountryFlag: selectedview === "gn" ? "" : selectedview,
            UserRole:
                userProfile?.userRoles[userProfile?.userRoles?.length - 1].displayRole,
        });
        if (tempdraftItems) {
            setshowDraft(true);
        } else {
            setshowDraft(false);
        }
    };
    const getallDeletedItems = async () => {
        let tempItems = await getallCount({
            RequesterUserId: userProfile.userId,
            IsDelete: true,
            UserEmail: userProfile.emailAddress,
            IncountryFlag: selectedview === "gn" ? "" : selectedview,
            UserRole:
                userProfile?.userRoles[userProfile?.userRoles?.length - 1].displayRole,
        });
        if (tempItems) {
            setshowDeletedLogs(true);
        } else {
            setshowDeletedLogs(false);
        }
    };
    const openlogTab = (type) => {
        if (!isLoadingStarted) {
            setsellogTabType(type);
        }
    };
    useEffect(() => {
        if (sellogTabType && !dashboardState.status) {
            pageIndex = 1;
        }
    }, [sellogTabType]);

    useEffect(() => {
        const fnOnInit = async () => {
            pageIndex = 1;
            pagesize = 10;
            totalLogCount = 0;
            getAllCountry();
            getAllRegion();
            getAlllob({ isActive: true });
            loadCreatorUsers();
            loadUnderwriterUsers();
            loadCCUsers();
            loadApproverUsers();
            //uncomment below code to work on zurich env
            // getAllPolicy360Accounts();
            loadfilterdata();
            getallDraftItems();
            let incountryopts = [];
            if (userProfile.isAdminGroup) {
                const UserRole = userProfile?.userRoles[userProfile?.userRoles?.length - 1].displayRole
                if (userProfile.isGlobalAdmin || UserRole === "GlobalUW") {
                    setIsViewHide(true)
                } else {
                    InCountryViewOpts.forEach((item) => {
                        if (userProfile.isSuperAdmin || userProfile.isGlobalAdmin) {
                            incountryopts.push(item);
                        } else if (userProfile.isRegionAdmin) {
                            let ispresent = false;
                            item.id.split(",").forEach((countryid) => {
                                if (userProfile.scopeCountryList.indexOf(countryid) !== -1) {
                                    ispresent = true;
                                }
                            });
                            if (
                                userProfile.regionId.indexOf(item.id) !== -1 ||
                                (userProfile.scopeCountryList && ispresent)
                            )
                                incountryopts.push(item);
                        } else if (userProfile.isCountryAdmin) {
                            let ispresent = false;
                            item.id.split(",").forEach((countryid) => {
                                if (userProfile.scopeCountryList.indexOf(countryid) !== -1) {
                                    ispresent = true;
                                }
                                if (userProfile.regionId === countryid) {
                                    incountryopts.push(item);
                                }
                            });
                            if (userProfile.scopeCountryList && ispresent) {
                                incountryopts.push(item);
                            }
                        }
                    });
                    incountryopts.sort(dynamicSort("label"));
                    setcommonfilterOpts((prevstate) => ({
                        ...prevstate,
                        views: [{ label: "All", value: "gn" }, ...incountryopts],
                    }));
                }
            }
            getallDeletedItems();
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
        ]);

        let tempStatus = lookupvalues[0];
        let temporgnizationalalignment = lookupvalues[1];
        let temprfechz = lookupvalues[2];
        let temprfeempourment = lookupvalues[3];

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
        tempStatus.sort(dynamicSort("label"));
        temporgnizationalalignment.sort(dynamicSort("label"));
        temprfechz.sort(dynamicSort("label"));
        temprfeempourment.sort(dynamicSort("label"));
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            statusFilterOpts: [selectInitiVal, ...tempStatus],
            organizationalAlignmentOpts: [...temporgnizationalalignment],
            requestForEmpowermentReasonOpts: [...temprfeempourment],
            chzOpts: [...temprfechz],
        }));
        const tempfilterfields = await getLogFields({
            IncountryFlag: "",
            FieldType: "Filter",
        });
        setfilterfieldslist(tempfilterfields);
        if (dashboardState.status) {
            setselfilter((prevfilter) => ({
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
                        value={selfilter[obj.name]}
                        titlelinespace={obj.titlelinespace ? true : false}
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
                        value={selfilter[obj.name]}
                        options={eval(obj.options)}
                        titlelinespace={obj.titlelinespace ? true : false}
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
                        value={selfilter[obj.name]}
                        handleChange={eval(obj.eventhandler)}
                        selectopts={eval(obj.options)}
                        titlelinespace={obj.titlelinespace ? true : false}
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
                        value={selfilter[obj.name]}
                        handleChange={eval(obj.eventhandler)}
                        selectopts={eval(obj.options)}
                        titlelinespace={obj.titlelinespace ? true : false}
                    />
                );
            case "FrmDatePicker":
                return (
                    <div className="col-md-6 filter-date-container">
                        <div className="frm-filter">
                            <FrmDatePicker
                                title={obj.title}
                                name={obj.datefieldfrom.fieldname}
                                value={selfilter[obj.datefieldfrom.fieldname]}
                                type={"date"}
                                handleChange={handleDateSelectChange}
                            />
                        </div>

                        <div className="daterange-title">to</div>

                        <div className="frm-filter">
                            <FrmDatePicker
                                title={""}
                                name={obj.datefieldto.fieldname}
                                value={selfilter[obj.datefieldto.fieldname]}
                                type={"date"}
                                handleChange={handleDateSelectChange}
                                minDate={moment(
                                    selfilter[obj.datefieldfrom.fieldname]
                                ).toDate()}
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
        console.log(name, value);
        if (e.target.type === "checkbox") {
            value = e.target.checked;
        }
        setselfilter({
            ...selfilter,
            [name]: value
        });
    }

    const handleSelectChange = (name, value) => {
        setselfilter({
            ...selfilter,
            [name]: value,
        });
    };

    return (
        <>
            <>
                <div className="container">
                    <div className="row">
                        <div className="page-title col-md-9">RfE Log</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <FrmInput
                            title={"View Name"}
                            name={"viewName"}
                            value={selfilter?.viewName}
                            type={"text"}
                            handleChange={handleChange}
                            isRequired={false}
                            // issubmitted={issubmitted}
                        />
                    </div>
                    <div className="col-md-3">
                        <FrmToggleSwitch
                            title={''}
                            name={"switch"}
                            value={selfilter.switch}
                            handleChange={handleSelectChange}
                            isRequired={false}
                            // issubmitted={issubmitted}
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
                                        value={selfilter[item.name]}
                                        handleChange={handleChange}
                                        isRequired={false}
                                        // issubmitted={issubmitted}
                                        selectopts={accessBreachLogOpts}
                                        inlinetitle={true}
                                        aftercheckbox={true}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="page-filter-outercontainer">
                    <div className="page-filter-positioncontainer">
                        <div className="page-filter collapsable">
                            <div className="filter-normal">
                                <div className="filter-container container">
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
                            <div className="advance-filter-btn-container">
                                <div
                                    className={`advance-filter-btn selected`}
                                // onClick={handlesetAdvSearch}
                                >
                                    Advance Search
                                </div>
                            </div>
                            {isAdvfilterApplied ? (
                                <div className="filter-advance">
                                    <div className="filter-container container">
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
                            <div className="btn-container">
                                <div
                                    className={`btn-blue ${!isEmptyObjectKeys(selfilter) ? "" : "disable"
                                        }`}
                                    onClick={handleFilterSearch}
                                >
                                    Search
                                </div>
                                <div className="btn-blue">
                                    Clear
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </>
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
};

export default connect(mapStateToProp, mapActions)(RfelogAddEditForm);
