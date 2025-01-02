import React, { useState, useEffect, useRef } from "react";
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
} from "../../actions";
import Loading from "../common-components/Loading";
import useSetNavMenu from "../../customhooks/useSetNavMenu";
import FrmSelect from "../common-components/frmselect/FrmSelect";
import FrmMultiselect from "../common-components/frmmultiselect/FrmMultiselect";
import FrmDatePicker from "../common-components/frmdatepicker/FrmDatePicker";
import moment from "moment";
import Pagination from "../common-components/pagination/Pagination";
import {
  alertMessage,
  dynamicSort,
  formatDate,
  getUrlParameter,
  isEmptyObjectKeys,
  isNotEmptyValue,
} from "../../helpers";
import {
  SHAREPOINT_LINKS,
  INCOUNTRY_FLAG,
  INCOUNTRY_FLAG_OPTS,
} from "../../constants";
import {
  intialFilterState,
  filterfieldsmapping,
  versionHistoryexportFieldTitles,
  versionHistoryExcludeFields,
  versionHistoryexportDateFields,
  versionHistoryexportHtmlFields,
} from "./Rfelogconstants";
import AddEditForm from "./AddEditForm";
import AddImportLogs from "./AddImportLogs";
import FrmInput from "../common-components/frminput/FrmInput";
import FrmInputAutocomplete from "../common-components/frminputautocomplete/FrmInputAutocomplete";
import { RFE_LOG_STATUS } from "../../constants";
import CustomToolTip from "../common-components/tooltip/CustomToolTip";
import parse from "html-react-parser";
import VersionHistoryPopupRfe from "../versionhistorypopup/VersionHistoryPopupRfe";
import MoreActions from "../common-components/moreactions/MoreActions";
import ShareItem from "../common-components/shareitem/ShareItem";
import DeleteItem from "../common-components/deleteItem/DeleteItem";
import CopyItem from "../common-components/copyitem/CopyItem";
import { useHistory } from "react-router-dom";
import { handlePermission } from "../../permissions/Permission";
import FrmToggleSwitch from "../common-components/frmtoggelswitch/FrmToggleSwitch";
import { handleGetChatToken } from "./chatFunction";
import axios from "axios";
import ChatUserList from "./ChatUserList";
let pageIndex = 1;
let pagesize = 10;
let totalLogCount = 0;
function Rfelog({ ...props }) {
  const {
    rfelogState,
    regionState,
    countryState,
    lobState,
    dashboardState,
    currencyState,
    branchState,
    sublobState,
    segmentState,
  } = props.state;
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
    getViewsByUserId,
    addEditUserView,
    getAllCurrency,
    getAllBranch,
    getAllSublob,
    getAllSegment,
    groupDetailsBaseOnEntryNumber,
    groupChatAccessTokenDetails,
    groupChatAuthentication,
    generateTokenForGroupChat,
    createGroupChat,
    getGroupchatDetailsWithMembers,
    addMemberToGroupChat,
    getinvolveuserlist
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
  const rfelogGermanyActiveSharePointLink =
    SHAREPOINT_LINKS.RFEGermanylogActive;
  const rfelogUKZMActiveSharePointLink =
    SHAREPOINT_LINKS.rfelogUKZMActiveSharePointLink;
  const InCountryViewOpts = [
    INCOUNTRY_FLAG_OPTS.Indonesia,
    INCOUNTRY_FLAG_OPTS.UK,
    INCOUNTRY_FLAG_OPTS.LATAM,
    INCOUNTRY_FLAG_OPTS.SINGAPORE,
    INCOUNTRY_FLAG_OPTS.INDIA,
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
    INCOUNTRY_FLAG_OPTS.SPAIN,
    INCOUNTRY_FLAG_OPTS.UKZM,
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
  const [isViewHide, setIsViewHide] = useState(false);
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
    userViews: [{ label: "All", value: null }],
    currencyOpts: [],
    branchOpts: [],
    durationofApprovalOpts: [],
    newRenewalOpts: [],
    customerSegmentOpts: [],
    conditionApplicableToOpts: [],
    acturisCode: [],
    requiredAuthority: [],
    submitterAuthority: [],
    zmSubLoBProduct: []
  });
  const [isfilterApplied, setisfilterApplied] = useState();
  const [dashboardStateApplied, setdashboardStateApplied] = useState(false);
  const [isAdvfilterApplied, setisAdvfilterApplied] = useState(false);
  const [isInCountryfilterApplied, setisInCountryfilterApplied] = useState(false);
  const [countryFilterOpts, setcountryFilterOpts] = useState([]);
  const [countryAllFilterOpts, setcountryAllFilterOpts] = useState([]);
  const [regionFilterOpts, setregionFilterOpts] = useState([]);
  const [regionOptsAll, setregionOptsAll] = useState([]);
  const [lobFilterOpts, setlobFilterOpts] = useState([]);
  const [sublobFilterOpts, setsublobFilterOpts] = useState([]);
  const [allsublobFilterOpts, setallsublobFilterOpts] = useState([]);
  const [accountOpts, setaccountOpts] = useState({});

  const [selfilter, setselfilter] = useState(intialFilterState);

  const [filterdomfields, setfilterdomfields] = useState({
    common: [],
    advance: [],
    Incountry: [],
  });
  const [filterfieldslist, setfilterfieldslist] = useState();
  const [nolonger, setnolonger] = useState(false);
  const [withOutWithdrawn, setWithOutWithdrawn] = useState('FA04DC3E-028E-43FB-820A-B8FAFE7E44F9,C8D5D3C6-07AC-45D4-BF4F-739302937904,9C619D9F-2CC7-4C3C-9DA6-1CA9592D922B,244A22AD-A1E3-409E-BB77-A0C069AD377A,8BC958F0-677E-43AD-9886-D719082D21BD');

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
    //const { name, value } = e.target;
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
      setselfilter({
        ...selfilter,
        [name]: value,
        RegionId: regionOpts,
      });
    } else {
      setselfilter({
        ...selfilter,
        [name]: value,
      });
    }
  };
  const handleFilterSearch = () => {
    if (!isEmptyObjectKeys(selfilter)) {
      setisfilterApplied(true);
      setfilterbox(false);
      setisAdvfilterApplied(false);
      setisInCountryfilterApplied(false);
      pageIndex = 1;
      loadAPIData();
    }
  };
  const clearFilter = () => {
    setselfilter(intialFilterState);
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

  //code for changing view
  const [selectedview, setselectedview] = useState("gn");
  const onViewFilterSelect = (name, value) => {
    setselectedview(value);
    setsellogTabType(logTypes[0].value);
  };
  useEffect(() => {
    const fnloadcountryview = async () => {
      //clearFilter();
      const tempfilterfields = await getLogFields({
        IncountryFlag: selectedview === "gn" ? "" : selectedview,
        FieldType: "Filter",
      });
      if (selectedview === 'DE001') {
        getAllSegment({ logType: "rfelogsGermany" });
      } else {
        getAllSegment({ logType: "rfelogs" });
      }
      setfilterfieldslist(tempfilterfields);
      pageIndex = 1;
      loadAPIData();
    };
    if (!isLogInitcall) {
      fnloadcountryview();
      getallDraftItems();
      getallDeletedItems();
    }
  }, [selectedview]);

  const fnIsEditAccess = (row) => {
    let isedit = false;
    let loggeduser = userProfile.emailAddress;
    if (row.isSubmit) {
      if (
        row.underwriterGrantingEmpowerment.indexOf(loggeduser) !== -1 ||
        row.underwriter.indexOf(loggeduser) !== -1 ||
        userProfile.isSuperAdmin ||
        userProfile.isGlobalAdmin
      ) {
        isedit = true;
      }
    } else {
      isedit = true;
    }
    if (
      userProfile.isAdminGroup &&
      userProfile.scopeCountryList &&
      userProfile.scopeCountryList.indexOf(row.countryId) !== -1
    ) {
      isedit = true;
    }
    return isedit;
  };
  const [isPaginationSort, setisPaginationSort] = useState(false);
  const [selSortFiled, setselSortFiled] = useState({
    name: "ModifiedDate",
    order: "desc",
  });
  //set pagination data and functionality
  const onPaginationSort = (field, order) => {
    if (field) {
      setselSortFiled({ name: field, order: order });
      setisPaginationSort(true);
    }
  };
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
  const getpaginationheaders = () => {
    const headers = logstate.header;
    let columns = [];
    if (headers.length) {
      columns = [
        sellogTabType !== "delete"
          ? {
            dataField: "editaction",
            text: "Edit",
            hidden:
              handlePermission(
                window.location.pathname.slice(1),
                "isEdit"
              ) === true
                ? false
                : true,
            formatter: (cell, row, rowIndex, formatExtraData) => {
              let isedit = fnIsEditAccess(row);

              return isedit ? (
                <div
                  className={`edit-icon`}
                  onClick={handleEdit}
                  rowid={row.RFELogId}
                  IncountryFLag={row.IncountryFLag}
                  mode={"edit"}
                ></div>
              ) : (
                ""
              );
            },
            sort: false,
            headerStyle: (colum, colIndex) => {
              return {
                width: "70px",
                textAlign: "center",
              };
            },
          }
          : {
            dataField: "editaction",
            text: "Restore",
            hidden:
              handlePermission(
                window.location.pathname.slice(1),
                "isEdit"
              ) === true
                ? false
                : true,
            formatter: (cell, row, rowIndex, formatExtraData) => {
              return (
                <div
                  className="restore-icon"
                  onClick={() =>
                    handleRestoreItem(row.RFELogId, row.IsSubmit)
                  }
                  rowid={row.RFELogId}
                ></div>
              );
            },
            sort: false,
            headerStyle: (colum, colIndex) => {
              return {
                width: "90px",
                textAlign: "center",
              };
            },
          },
        {
          dataField: "viewaction",
          text: "View",
          formatter: (cell, row, rowIndex, formatExtraData) => {
            return (
              <div
                className="view-icon"
                onClick={handleEdit}
                rowid={row.RFELogId}
                mode={"view"}
              ></div>
            );
          },
          sort: false,
          headerStyle: (colum, colIndex) => {
            return {
              width: "70px",
              textAlign: "center",
            };
          },
        },
        {
          dataField: "DataVersion",
          text: "Data Version",
          formatter: (cell, row, rowIndex, formatExtraData) => {
            return (
              <div
                className="versionhistory-icon"
                onClick={() => handleDataVersion(row.RFELogId, row.IsSubmit)}
                mode={"view"}
              ></div>
            );
          },
          sort: false,
          headerStyle: (colum, colIndex) => {
            return {
              width: "100px",
              textAlign: "center",
            };
          },
        },
        {
          dataField: "Chat",
          text: "Chat",
          formatter: (cell, row, rowIndex, formatExtraData) => {
            return (
              <div
                className="chat-icon"
                onClick={() => handleChat(row)}
                mode={"chat"}
              ></div>
            );
          },
          sort: false,
          headerStyle: (colum, colIndex) => {
            return {
              width: "100px",
              textAlign: "center",
            };
          },
        },
        sellogTabType !== "delete"
          ? {
            dataField: "MoreActions",
            text: "More Actions",
            formatter: (cell, row, rowIndex, formatExtraData) => {
              return (
                <>
                  <MoreActions
                    rowid={row.RFELogId}
                    isSubmit={row.IsSubmit}
                    handleCopyItem={handleCopyItem}
                    handleShareItem={openShareItem}
                    handleDeleteItem={openDeleteItem}
                    handleLinkItem={sellogTabType === "all" ? handleLinkLog : false}
                    userProfile={userProfile}
                    isDelete={fnIsEditAccess(row) && handlePermission(window.location.pathname.slice(1), "isDelete") === true ? true : false}
                  ></MoreActions>
                </>
              );
            },
            sort: false,
            headerStyle: (colum, colIndex) => {
              return {
                width: "100px",
                textAlign: "center",
              };
            },
          }
          : {},
      ];
      headers.forEach((item) => {
        let headerobj = {};
        if (item.isActive) {
          headerobj = {
            dataField: item.fieldName,
            text: item.displayName,
            sort: item.isSort ? true : false,
            onSort: (field, order) => {
              if (
                field &&
                (selSortFiled.name !== field || selSortFiled.order !== order)
              ) {
                onPaginationSort(field, order);
              }
            },
            headerStyle: (colum, colIndex) => {
              return { width: "200px" };
            },
          };
          if (item.formatting) {
            if (item.formatting === "tooltip") {
              headerobj = {
                ...headerobj,
                formatter: (cell, row, rowIndex, formatExtraData) => {
                  return (
                    <>
                      <CustomToolTip
                        content={
                          <>
                            <table>
                              <tr>
                                <td>
                                  <div className="tooltip-content">
                                    <b>Details</b>
                                    <br></br>
                                    {row.RFELogDetails
                                      ? parse(row.RFELogDetails)
                                      : ""}
                                  </div>
                                </td>
                                <td>
                                  <div className="tooltip-content">
                                    <b>Comments</b>
                                    <br></br>
                                    {row.UnderwriterGrantingEmpowermentComments
                                      ? parse(
                                        row.UnderwriterGrantingEmpowermentComments
                                      )
                                      : ""}
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </>
                        }
                        direction="right"
                      >
                        <div className="breach-title" rowid={row.RFELogId}>
                          {row.AccountName}
                        </div>
                      </CustomToolTip>
                    </>
                  );
                },
              };
            } else if (item.formatting === "link") {
              headerobj = {
                ...headerobj,
                formatter: (cell, row, rowIndex, formatExtraData) => {
                  return row.IsArchived && !row.EntryNumber.includes("POL_") ? (
                    <span
                      className="link"
                      onClick={() => handleOpenSharePointLink(row.EntryNumber)}
                    >
                      link
                    </span>
                  ) : (
                    ""
                  );
                },
              };
            } else if (item.formatting === "Date") {
              headerobj = {
                ...headerobj,
                formatter: (cell, row, rowIndex, formatExtraData) => {
                  return <span>{cell ? formatDate(cell) : ""}</span>;
                },
              };
            }
          }
          columns.push(headerobj);
        }
      });
    }
    return columns;
  };

  const defaultSorted = [
    {
      dataField: selSortFiled.name,
      order: selSortFiled.order,
    },
  ];

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
      IncountryFlag: selectedview === "gn" ? "" : selectedview,
      UserRole:
        userProfile?.userRoles[userProfile?.userRoles?.length - 1].displayRole,
    };
    setisLoadingStarted(true);
    // if (userProfile.isSuperAdmin === false && userProfile.isGeneralUser === false) {
    //   reqParam = {
    //     ...reqParam,
    //     IncountryFlag: await handleUserIncountryFlag()
    //   }
    // }
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
          if (key === "CountryId" || key === "RegionId" ||
            key === "LOBId" || key === "RequestForEmpowermentStatus" ||
            key === "OrganizationalAlignment" || key === "RequestForEmpowermentReason" ||
            key === "DurationofApproval" || key === "Currency" || key === "Branch" ||
            key === "NewRenewal" || key === "CustomerSegment" || key === "SUBLOBID" ||
            key === "ConditionApplicableTo" || key === 'ActurisCode' ||
            key === "RequiredAuthority" || key === "SubmitterAuthority" || key === 'ZMSubLoBProduct') {
            const tmpval = value.map((item) => item.value);
            tempFilterOpts[key] = tmpval.join(",");
          }
        }
      }
      if (sellogTabType === 'all' && nolonger === false) {
        if (tempFilterOpts?.RequestForEmpowermentStatus === '' || tempFilterOpts?.RequestForEmpowermentStatus === undefined) {
          reqParam = {
            ...reqParam,
            ...tempFilterOpts,
            RequestForEmpowermentStatus: withOutWithdrawn,
            sortExp: selSortFiled.name + " " + selSortFiled.order,
          }
        } else if (tempFilterOpts?.RequestForEmpowermentStatus) {
          let selectedStatus = tempFilterOpts?.RequestForEmpowermentStatus.split(",");
          selectedStatus = selectedStatus.filter((item) => item !== "F2623BCB-50B7-467B-AF06-E4A5ECFB29A4");
          reqParam = {
            ...reqParam,
            ...tempFilterOpts,
            RequestForEmpowermentStatus: selectedStatus.length > 0 ? selectedStatus.toString() : "00000001",
            sortExp: selSortFiled.name + " " + selSortFiled.order,
          }
        }
      } else {
        reqParam = {
          ...reqParam,
          ...tempFilterOpts,
          sortExp: selSortFiled.name + " " + selSortFiled.order,
        };
      }
    } else {
      if (sellogTabType === 'all' && nolonger === false) {
        reqParam = {
          ...reqParam,
          RequestForEmpowermentStatus: withOutWithdrawn,
          sortExp: selSortFiled.name + " " + selSortFiled.order,
        }
      } else {
        reqParam = {
          ...reqParam,
          sortExp: selSortFiled.name + " " + selSortFiled.order,
        };
      }
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

  const onPaginationPageChange = (page) => {
    pageIndex = page;
    loadAPIData();
  };
  const onPageSizeChange = (psize) => {
    //pageIndex = 1;
    pagesize = psize;
    //pageIndex =      pageIndex <= totalLogCount / pagesize        ? pageIndex        : Math.ceil(totalLogCount / pagesize);
    pageIndex = 1;
    loadAPIData();
  };

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

    /* if (!sellogTabType || tempStatus.length === 1) {
      setsellogTabType(tempStatus[0].value);
    }*/
  }, [showDraft, showDeletedLogs]);

  const getallDraftItems = async () => {
    /*let tempdraftItems = await getallLogs({
      RequesterUserId: userProfile.userId,
      isSubmit: false,
    });*/
    let tempdraftItems = await getallCount({
      RequesterUserId: userProfile.userId,
      isSubmit: false,
      UserEmail: userProfile.emailAddress,
      IncountryFlag: selectedview === "gn" ? "" : selectedview,
      UserRole:
        userProfile?.userRoles[userProfile?.userRoles?.length - 1].displayRole,
    });
    /*let tempdraftItems = await getLogCount({
      LogType: "RfeLogs",
      LogCategory: "Draft",
      UserEmail: userProfile.emailAddress,
      IncountryFlag: selectedview === "gn" ? "" : selectedview,
      UserRole:
        userProfile?.userRoles[userProfile?.userRoles?.length - 1].displayRole,
    });*/

    if (tempdraftItems) {
      setshowDraft(true);
    } else {
      setshowDraft(false);
    }
  };
  const getallDeletedItems = async () => {
    /*let tempItems = await getallDeletedLogs({
      RequesterUserId: userProfile.userId,
    });*/

    let tempItems = await getallCount({
      RequesterUserId: userProfile.userId,
      IsDelete: true,
      UserEmail: userProfile.emailAddress,
      IncountryFlag: selectedview === "gn" ? "" : selectedview,
      UserRole:
        userProfile?.userRoles[userProfile?.userRoles?.length - 1].displayRole,
    });
    /*let tempItems = await getLogCount({
      LogType: "RfeLogs",
      LogCategory: "Delete",
      UserEmail: userProfile.emailAddress,
      IncountryFlag: selectedview === "gn" ? "" : selectedview,
      UserRole:
        userProfile?.userRoles[userProfile?.userRoles?.length - 1].displayRole,
    });*/
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
    if (sellogTabType && !dashboardState.status && (!userProfile?.rfeViewsId || userProfile?.rfeViewsId === 'null')) {
      pageIndex = 1;
      loadAPIData();
    }
  }, [sellogTabType]);

  useEffect(() => {
    const fnOnInit = async () => {
      pageIndex = 1;
      pagesize = 10;
      totalLogCount = 0;
      handleViews()
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
      //uncomment below code to work on zurich env
      // getAllPolicy360Accounts();
      loadfilterdata();
      getallDraftItems();
      let incountryopts = [];
      if (userProfile.isAdminGroup) {
        const UserRole =
          userProfile?.userRoles[userProfile?.userRoles?.length - 1]
            .displayRole;
        if (userProfile.isGlobalAdmin || UserRole === "GlobalUW") {
          setIsViewHide(true);
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
    localStorage.removeItem("id");
    localStorage.removeItem("status");
    localStorage.removeItem("in-app");
    localStorage.removeItem("type");
  }, []);



  const [selectedUserView, setSelectedUserview] = useState(null);
  const [viewData, setViewData] = useState([]);
  const [viewResponse, setViewResponse] = useState(false);
  const [isReset, setIsReset] = useState(false);

  useEffect(() => {
    if (userProfile?.rfeViewsId && viewResponse && viewData.length !== 0) {
      onUserViewFilterSelect("", userProfile?.rfeViewsId)
    } else if (viewResponse && (userProfile?.rfeViewsId && userProfile?.rfeViewsId !== 'null')) {
      pageIndex = 1;
      loadAPIData();
    }
  }, [viewData, sellogTabType, viewResponse])

  useEffect(() => {
    if (selectedUserView && sellogTabType) {
      handleFilterSearch();
    }
  }, [selectedUserView, sellogTabType]);

  useEffect(() => {
    if (selfilter && isReset) {
      setIsReset(false);
      setfilterbox(false);
      handleFilterSearch();
    }
  }, [selfilter, isReset])

  const handleSelectedItemArray = (selectedArray, data, field, label) => {
    let arrayData = [];
    selectedArray.map((id, j) => {
      data.map((item, i) => {
        if (item.isActive && id === item[field]) {
          arrayData.push({
            ...item,
            label: item[label],
            value: item[field],
          })
        }
      })
    })
    return arrayData
  }

  const onUserViewFilterSelect = async (name, value) => {
    setselfilter(intialFilterState);
    let selectedViewData = viewData.filter((item, i) => {
      if (item.rfeViewsId === value) {
        return item
      }
    })
    if (selectedViewData.length !== 0) {
      let countryArray = []
      if (selectedViewData[0]?.countryId?.length && selectedViewData[0]?.countryId?.length !== 0 && typeof selectedViewData[0]?.countryId === 'string') {
        let selectedCountryArray = selectedViewData[0]?.countryId?.split(',')
        if (selectedCountryArray) {
          selectedCountryArray.map((id, j) => {
            countryState.countryItems.map((item, i) => {
              if (item.isActive && id === item.countryID) {
                countryArray.push({
                  ...item,
                  label: item.countryName.trim(),
                  value: item.countryID,
                  regionId: item.regionID,
                })
              }
            })
          })
        }
      }
      let regionArray = []
      if (selectedViewData[0]?.regionId?.length && selectedViewData[0]?.regionId?.length !== 0 && typeof selectedViewData[0]?.regionId === 'string') {
        let selectedRegionArray = selectedViewData[0]?.regionId?.split(',')
        if (selectedRegionArray) {
          let regionData = await getAllRegion();
          selectedRegionArray.map((id, j) => {
            regionData.map((item, i) => {
              if (item.isActive && id === item.regionID) {
                regionArray.push({
                  ...item,
                  label: item.regionName.trim(),
                  value: item.regionID,
                })
              }
            })
          })
        }
      }

      let loBArray = []
      if (selectedViewData[0]?.lobId?.length && selectedViewData[0]?.lobId?.length !== 0 && typeof selectedViewData[0]?.lobId === 'string') {
        let selectedloBArray = selectedViewData[0]?.lobId?.split(',')
        if (selectedloBArray) {
          let loBData = await getAlllob({ isActive: true });
          loBArray = handleSelectedItemArray(selectedloBArray, loBData, 'lobid', 'lobName')
        }
      }

      let statusArray = [];
      if (selectedViewData[0]?.requestForEmpowermentStatus?.length && selectedViewData[0]?.requestForEmpowermentStatus?.length !== 0 && typeof selectedViewData[0]?.requestForEmpowermentStatus === 'string') {
        let selectedstatusArray = selectedViewData[0]?.requestForEmpowermentStatus?.split(',')
        if (selectedstatusArray) {
          let statusData = await getLookupByType({
            LookupType: "RFEEmpowermentStatusRequest",
          });
          statusArray = handleSelectedItemArray(selectedstatusArray, statusData, 'lookupID', 'lookUpValue')
        }
      }

      let orgArray = [];
      if (selectedViewData[0]?.organizationalAlignment?.length && selectedViewData[0]?.organizationalAlignment?.length !== 0 && typeof selectedViewData[0]?.organizationalAlignment === 'string') {
        let selectedstatusArray = selectedViewData[0]?.organizationalAlignment?.split(',')
        if (selectedstatusArray) {
          let statusData = await getLookupByType({
            LookupType: "RFEOrganizationalAlignment",
          });
          orgArray = handleSelectedItemArray(selectedstatusArray, statusData, 'lookupID', 'lookUpValue')
        }
      }

      let reasonArray = [];
      if (selectedViewData[0]?.requestForEmpowermentReason?.length && selectedViewData[0]?.requestForEmpowermentReason?.length !== 0 && typeof selectedViewData[0]?.requestForEmpowermentReason === 'string') {
        let selectedstatusArray = selectedViewData[0]?.requestForEmpowermentReason?.split(',')
        if (selectedstatusArray) {
          let statusData = await getLookupByType({
            LookupType: "RFEEmpowermentReasonRequestAll",
          });
          reasonArray = handleSelectedItemArray(selectedstatusArray, statusData, 'lookupID', 'lookUpValue')
        }
      }

      let duarationArray = [];
      if (selectedViewData[0]?.durationofApproval?.length && selectedViewData[0]?.durationofApproval?.length !== 0 && typeof selectedViewData[0]?.durationofApproval === 'string') {
        let selectedstatusArray = selectedViewData[0]?.durationofApproval?.split(',')
        if (selectedstatusArray) {
          let statusData = await getLookupByType({
            LookupType: "DurationofApproval",
          });
          duarationArray = handleSelectedItemArray(selectedstatusArray, statusData, 'lookupID', 'lookUpValue')
        }
      }

      let conditionArray = [];
      if (selectedViewData[0]?.conditionApplicableTo?.length && selectedViewData[0]?.conditionApplicableTo?.length !== 0 && typeof selectedViewData[0]?.conditionApplicableTo === 'string') {
        let selectedstatusArray = selectedViewData[0]?.conditionApplicableTo?.split(',')
        if (selectedstatusArray) {
          let statusData = await getLookupByType({
            LookupType: "ConditionApplicableTo",
          });
          conditionArray = handleSelectedItemArray(selectedstatusArray, statusData, 'lookupID', 'lookUpValue')
        }
      }

      let acturisCodeArray = [];
      if (selectedViewData[0]?.acturisCode?.length && selectedViewData[0]?.acturisCode?.length !== 0 && typeof selectedViewData[0]?.acturisCode === 'string') {
        let selectedstatusArray = selectedViewData[0]?.acturisCode?.split(',')
        if (selectedstatusArray) {
          let statusData = await getLookupByType({
            LookupType: "ActurisCode",
          });
          acturisCodeArray = handleSelectedItemArray(selectedstatusArray, statusData, 'lookupID', 'lookUpValue')
        }
      }

      let requiredAuthorityArray = [];
      if (selectedViewData[0]?.requiredAuthority?.length && selectedViewData[0]?.requiredAuthority?.length !== 0 && typeof selectedViewData[0]?.requiredAuthority === 'string') {
        let selectedstatusArray = selectedViewData[0]?.requiredAuthority?.split(',')
        if (selectedstatusArray) {
          let statusData = await getLookupByType({
            LookupType: "RequiredAuthority",
          });
          requiredAuthorityArray = handleSelectedItemArray(selectedstatusArray, statusData, 'lookupID', 'lookUpValue')
        }
      }

      let submitterAuthorityArray = [];
      if (selectedViewData[0]?.submitterAuthority?.length && selectedViewData[0]?.submitterAuthority?.length !== 0 && typeof selectedViewData[0]?.submitterAuthority === 'string') {
        let selectedstatusArray = selectedViewData[0]?.submitterAuthority?.split(',')
        if (selectedstatusArray) {
          let statusData = await getLookupByType({
            LookupType: "SubmitterAuthority",
          });
          submitterAuthorityArray = handleSelectedItemArray(selectedstatusArray, statusData, 'lookupID', 'lookUpValue')
        }
      }

      let zMSubLoBProductArray = [];
      if (selectedViewData[0]?.zmSubLoBProduct?.length && selectedViewData[0]?.zmSubLoBProduct?.length !== 0 && typeof selectedViewData[0]?.zmSubLoBProduct === 'string') {
        let selectedstatusArray = selectedViewData[0]?.zmSubLoBProduct?.split(',')
        if (selectedstatusArray) {
          let statusData = await getLookupByType({
            LookupType: "ZMSubLoBProduct",
          });
          zMSubLoBProductArray = handleSelectedItemArray(selectedstatusArray, statusData, 'lookupID', 'lookUpValue')
        }
      }

      let newRenewalArray = [];
      if (selectedViewData[0]?.newRenewal?.length && selectedViewData[0]?.newRenewal?.length !== 0 && typeof selectedViewData[0]?.newRenewal === 'string') {
        let selectedstatusArray = selectedViewData[0]?.newRenewal?.split(',')
        if (selectedstatusArray) {
          let statusData = await getLookupByType({
            LookupType: "RFELogNewRenewal",
          });
          newRenewalArray = handleSelectedItemArray(selectedstatusArray, statusData, 'lookupID', 'lookUpValue')
        }
      }

      let currencyArray = [];
      if (selectedViewData[0]?.currency?.length && selectedViewData[0]?.currency?.length !== 0 && typeof selectedViewData[0]?.currency === 'string') {
        let selectedstatusArray = selectedViewData[0]?.currency?.split(',')
        if (selectedstatusArray) {
          let statusData = await getAllCurrency();
          currencyArray = handleSelectedItemArray(selectedstatusArray, statusData, 'currencyID', 'currencyName')
        }
      }

      let branchArray = [];
      if (selectedViewData[0]?.branch?.length && selectedViewData[0]?.branch?.length !== 0 && typeof selectedViewData[0]?.branch === 'string') {
        let selectedstatusArray = selectedViewData[0]?.branch?.split(',')
        if (selectedstatusArray) {
          let statusData = await getAllBranch();
          branchArray = handleSelectedItemArray(selectedstatusArray, statusData, 'branchId', 'branchName')
        }
      }

      let customerSegmentArray = [];
      if (selectedViewData[0]?.customerSegment?.length && selectedViewData[0]?.customerSegment?.length !== 0 && typeof selectedViewData[0]?.customerSegment === 'string') {
        let selectedstatusArray = selectedViewData[0]?.customerSegment?.split(',')
        if (selectedstatusArray) {
          let statusData = await getAllSegment({ logType: "rfelogsAll" });
          selectedstatusArray.map((id, j) => {
            statusData?.map((item, i) => {
              if (item.isActive && id === item.segmentID) {
                customerSegmentArray.push({
                  ...item,
                  label: item.segmentName,
                  value: item.segmentID,
                  country: item.countryList,
                })
              }
            })
          })
        }
      }

      let subloBArray = [];
      if (selectedViewData[0]?.sublobid?.length && selectedViewData[0]?.sublobid?.length !== 0 && typeof selectedViewData[0]?.sublobid === 'string') {
        let selectedstatusArray = selectedViewData[0]?.sublobid?.split(',')
        if (selectedstatusArray) {
          let sublobData = await getAllSublob();
          selectedstatusArray.map((id, j) => {
            sublobData?.map((item, i) => {
              if (item.isActive && id === item.subLOBID) {
                subloBArray.push({
                  ...item,
                  label: item.subLOBName,
                  value: item.subLOBID,
                  lob: item.lobid,
                });
              }
            })
          })
        }
      }

      const FilterState = {
        EntryNumber: selectedViewData[0]?.entryNumber,
        AccountName: selectedViewData[0]?.accountName,
        LOBId: loBArray,
        CountryId: countryArray,
        RegionId: regionArray,
        Underwriter: selectedViewData[0]?.underwriter,
        Role: selectedViewData[0]?.role,
        RequestForEmpowermentStatus: statusArray,
        OrganizationalAlignment: orgArray,
        RequestForEmpowermentReason: reasonArray,
        CHZ: selectedViewData[0]?.chz,
        RequestForEmpowermentCC: selectedViewData[0]?.requestForEmpowermentCC,
        UnderwriterGrantingEmpowerment: selectedViewData[0]?.underwriterGrantingEmpowerment,
        Creator: selectedViewData[0]?.creator,
        CreatedFromDate: selectedViewData[0]?.createdFromDate,
        CreatedToDate: selectedViewData[0]?.createdToDate,
        Currency: currencyArray,
        Branch: branchArray,
        DurationofApproval: duarationArray,
        NewRenewal: newRenewalArray,
        Limit: selectedViewData[0]?.limit,
        ZurichShare: selectedViewData[0]?.zurichShare,
        AccountNumber: selectedViewData[0]?.accountNumber,
        CustomerSegment: customerSegmentArray,
        PolicyPeriod: selectedViewData[0]?.policyPeriod,
        ConditionApplicableTo: conditionArray,
        GWP: selectedViewData[0]?.gwp,
        SUBLOBID: subloBArray,
        ActurisCode: acturisCodeArray,
        RequiredAuthority: requiredAuthorityArray,
        SubmitterAuthority: submitterAuthorityArray,
        InceptionRenewalFromDate: selectedViewData[0].inceptionRenewalFromDate,
        InceptionRenewalToDate: selectedViewData[0].inceptionRenewalToDate,
        PolicyNumberQuoteId: selectedViewData[0].policyNumberQuoteId,
        ZMSubLoBProduct: zMSubLoBProductArray
      };
      setselfilter(FilterState)
      if (value !== selectedUserView) {
        setSelectedUserview(value);
      } else {
        setIsReset(true);
      }
    } else {
      value = null;
      pageIndex = 1;
      clearFilter();
    }
    if (value === null) {
      setSelectedUserview(value);
    }
    let data = commonfilterOpts.userViews.filter((item) => item.label !== "All")
    setcommonfilterOpts((prevstate) => ({
      ...prevstate,
      userViews: value !== null ? [{ label: "All", value: null }, ...data] : [...data],
    }));
    await addEditUserView({ LogType: 'rfelogs', UserId: userProfile.userId, ViewId: value })
    let updatedUserProfileData = userProfile
    updatedUserProfileData.rfeViewsId = value
    localStorage.setItem("UserProfile", JSON.stringify(updatedUserProfileData))
  };

  const handleViews = async () => {
    const response = await getViewsByUserId({ RequesterUserId: userProfile.userId, UserViewType: 'rfelog' })
    setViewData(response)
    let viewFilterOpts = []
    response.map((item, i) => {
      viewFilterOpts.push({
        label: item.viewName,
        value: item.rfeViewsId
      })
    })
    viewFilterOpts.sort(dynamicSort("label"));
    setcommonfilterOpts((prevstate) => ({
      ...prevstate,
      userViews: userProfile?.rfeViewsId && userProfile?.rfeViewsId !== 'null' ? [{ label: "All", value: null }, ...viewFilterOpts] : [...viewFilterOpts],
    }));
    setViewResponse(true)
  }

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
        IncountryFLag: 'UKZM001'
      }),
      getLookupByType({
        LookupType: "RFEEmpowermentReasonRequestAll",
      }),
      getLookupByType({
        LookupType: "DurationofApproval",
      }),
      getLookupByType({
        LookupType: "RFELogNewRenewal",
        IncountryFLag: 'UKZM001'
      }),
      getLookupByType({
        LookupType: "ConditionApplicableTo",
      }),
      getLookupByType({
        LookupType: "ActurisCode"
      }),
      getLookupByType({
        LookupType: "RequiredAuthority"
      }),
      getLookupByType({
        LookupType: "SubmitterAuthority"
      }),
      getLookupByType({
        LookupType: "ZMSubLoBProduct"
      }),
    ]);

    let tempStatus = lookupvalues[0];
    let temporgnizationalalignment = lookupvalues[1];
    let temprfechz = lookupvalues[2];
    let temprfeempourment = lookupvalues[3];
    let tempDurationOfApproval = lookupvalues[4];
    let tempNewRenewal = lookupvalues[5];
    let tempCondition = lookupvalues[6];
    let temprfeempourmentActurisCode = lookupvalues[7];
    let temprfeempourmentRequiredAuthority = lookupvalues[8];
    let temprfeempourmentSubmitterAuthority = lookupvalues[9];
    let temprfeempourmentZMSubLoBProduct = lookupvalues[10];

    let tempopts = [];
    let statusWithdrawn = [];
    tempStatus.forEach((item) => {
      if (item.isActive) {
        if (item.lookUpName !== 'Withdrawn') {
          statusWithdrawn.push(item.lookupID)
        }
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
      }
    });
    statusWithdrawn = statusWithdrawn.toString();
    setWithOutWithdrawn(statusWithdrawn)
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
        if (item.lookUpType.substr(item.lookUpType.length - 2) === "UK") {
          setOpts(tempopts, item, 'UK')
        }
        if (item.lookUpType.includes("UKZM")) {
          setOpts(tempopts, item, 'UKZM')
        }
        if (item.lookUpType.length === 27) {
          setOpts(tempopts, item, 'Global')
        }
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

    temprfeempourmentActurisCode.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
      }
    });
    temprfeempourmentActurisCode = [...tempopts];

    tempopts = [];
    temprfeempourmentRequiredAuthority.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
      }
    });
    temprfeempourmentRequiredAuthority = [...tempopts];

    tempopts = [];
    temprfeempourmentSubmitterAuthority.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
      }
    });
    temprfeempourmentSubmitterAuthority = [...tempopts];

    tempopts = [];
    temprfeempourmentZMSubLoBProduct.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
      }
    });
    temprfeempourmentZMSubLoBProduct = [...tempopts];

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
      chzOpts: [...temprfechz],
      durationofApprovalOpts: [...tempDurationOfApproval],
      newRenewalOpts: [...tempNewRenewal],
      conditionApplicableToOpts: [...tempCondition],
      acturisCode: [...temprfeempourmentActurisCode],
      requiredAuthority: [...temprfeempourmentRequiredAuthority],
      submitterAuthority: [...temprfeempourmentSubmitterAuthority],
      zmSubLoBProduct: [...temprfeempourmentZMSubLoBProduct]
    }));

    let Flag = await handleUserIncountryFlag()
    const tempfilterfields = await getLogFields({
      IncountryFlag: Flag,
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

  useEffect(() => {
    if (nolonger === true) {
      loadAPIData();
    } else {
      loadAPIData();
    }
  }, [nolonger])

  const handleUserIncountryFlag = async () => {
    let IncountryFlag = '';
    let CountryList = []
    if (countryState?.countryItems?.length !== 0) {
      CountryList = countryState.countryItems;
    } else {
      CountryList = await getAllCountry();
    }
    if (userProfile?.isSuperAdmin === false && userProfile.isGeneralUser === false) {
      let userInCountryFlag = []
      userProfile?.scopeCountryList?.split(",")?.map((userCountry) => {
        CountryList.map((country, i) => {
          if (country.countryID === userCountry) {
            userInCountryFlag.push(country.incountryFlag)
          }
        })
      })
      userInCountryFlag = userInCountryFlag.filter((item,
        index) => userInCountryFlag.indexOf(item) === index && item !== null)
      if (userInCountryFlag?.length === 1 && userInCountryFlag[0] === 'DE001') {
        getAllSegment({ logType: "rfelogsGermany" });
      }
      IncountryFlag = userInCountryFlag?.toString()
    }
    return IncountryFlag
  }

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

  const [queryparam, setqueryparam] = useState({
    id: "",
    status: "",
  });
  const [queryparamloaded, setqueryparamloaded] = useState(false);
  useEffect(() => {
    let itemid = getUrlParameter("id");
    let status = getUrlParameter("status");
    setqueryparam({ id: itemid, status: status });
  }, []);

  useEffect(() => {
    setqueryparamloaded(true);
    if (queryparam.id) {
      history.push("/rfelogs/create-rfelog");
      localStorage.setItem("id", queryparam.id);
      localStorage.setItem("status", "view");
      localStorage.setItem("type", sellogTabType);
    }
  }, [queryparam]);

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
      currencyOpts: [...tempopts],
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
        branchOpts: [...tempopts],
      }));
    }
  }, [branchState.branchItems]);

  useEffect(() => {
    let tempopts = [];
    let temGermany = [];
    let temUKZM = [];
    segmentState.segmentItems.forEach((item) => {
      if (item.isActive) {
        if (item.logType && item.logType === "7202C3C8-D380-4F59-AA0B-A94FCF4D1A82") {
          temGermany.push({
            ...item,
            label: item.segmentName,
            value: item.segmentID,
            country: item.countryList,
            cat: 'Germany'
          })
        } if (item.logType && item.logType === "060191P0-2212-2018-222H-7V2620D5I6M") {
          temUKZM.push({
            ...item,
            label: item.segmentName,
            value: item.segmentID,
            country: item.countryList,
            cat: 'UKZM'
          })
        }
        else {
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
    tempopts.sort(dynamicSort("label"));
    setcommonfilterOpts((prevstate) => ({
      ...prevstate,
      customerSegmentOpts: [...tempopts, ...temGermany, ...temUKZM],
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
    setallsublobFilterOpts(tempopts);
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

  /* Add Edit Delete functionality & show popup*/

  const [isshowAddPopup, setshowAddPopup] = useState(false);
  const [isshowImportLogsPopup, setshowImportLogsPopup] = useState(false);
  const [isDataImported, setisDataImported] = useState(false);
  const history = useHistory();
  const showAddPopup = () => {
    localStorage.setItem("in-app", true);
    history.push("/rfelogs/create-rfelog");
    // setshowAddPopup(true);
  };
  const hideAddPopup = () => {
    setshowAddPopup(false);
    setformIntialState(formInitialValue);
    setisEditMode(false);
    setisReadMode(false);
    if (window.location.search) {
      removeQueryParams();
    }
  };

  const removeQueryParams = () => {
    history.replace({
      pathname: window.location.pathname,
      search: "",
    });
  };

  const showImportLogsPopup = () => {
    setshowImportLogsPopup(true);
  };
  const hideImportLogsPopup = () => {
    setshowImportLogsPopup(false);
    if (isDataImported) {
      //window.location = "/rfelogs";
      setlogItmes([]);
      setalllogsloaded(false);
      setisLoadingStarted(false);
      setlogstate({
        loading: true,
        error: "",
        data: [],
        loadedAll: false,
        isDataImported: true,
      });
    }
  };
  useEffect(() => {
    if (logstate.isDataImported) {
      /*setlogstate((prevstate) => ({
        ...prevstate,
        isDataImported: false,
      }));*/
      pageIndex = 1;
      loadAPIData();
    }
  }, [logstate.isDataImported]);

  const setInEditMode = () => {
    setisEditMode(true);
    setisReadMode(false);
  };
  const [isEditMode, setisEditMode] = useState(false);
  const [isReadMode, setisReadMode] = useState(false);
  const formInitialValue = {
    AccountName: "",
    OrganizationalAlignment: "",
    CountryId: "",
    CountryList: [],
    countryCode: "",
    RegionList: [],
    Underwriter: userProfile.emailAddress,
    UnderwriterName: userProfile.firstName + " " + userProfile.lastName,
    UnderwriterAD: {
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      userName: userProfile.firstName + " " + userProfile.lastName,
      emailAddress: userProfile.emailAddress,
    },
    CHZ: "",
    LOBId: "",
    RequestForEmpowermentReason: "",
    RFELogDetails: "",
    UnderwriterGrantingEmpowerment: "",
    UnderwriterGrantingEmpowermentAD: [],
    UnderwriterGrantingEmpowermentName: "",
    RequestForEmpowermentCC: "",
    RequestForEmpowermentCCAD: [],
    RequestForEmpowermentCCName: "",
    RequestForEmpowermentStatus: "",
    RFEAttachmentList: [],
    ResponseDate: null,
    ReceptionInformationDate: null,
    UnderwriterGrantingEmpowermentComments: "",
    FullFilePath: "",
    IsSubmit: false,
    RFELogEmailLink: window.location.origin + "/rfelogs",
    isdirty: false,
    IsArchived: false,
    ConditionApplicableTo: "",
    DurationofApproval: "",
    Branch: "",
    CustomerSegment: "",
    NewRenewal: "",
    PolicyPeriod: "",
    Currency: "",
    Limit: "",
    GWP: "",
    ZurichShare: "",
    DecisionDate: null,
    IncountryFlag: "",
    SUBLOBID: "",
    mappedLOBs: "",
    PolicyTermId: "",
    invokedAPIFrom: "",
  };
  const [formIntialState, setformIntialState] = useState(formInitialValue);
  const [isFlow3, setIsFlow3] = useState(false);
  const [linkSpecificDetails, setLinkSpecificDetails] = useState("")

  const handleEdit = async (e, hasqueryparam) => {
    let itemid;
    let mode;
    if (hasqueryparam) {
      itemid = queryparam.id;
      if (queryparam.status) {
        mode = "edit";
      } else {
        mode = "view";
      }
    } else {
      itemid = e.target.getAttribute("rowid");
      mode = e.target.getAttribute("mode");
    }
    localStorage.setItem("id", itemid);
    localStorage.setItem("status", mode);
    localStorage.setItem("type", sellogTabType);
    localStorage.setItem("in-app", true);
    showAddPopup();
    // let response = await getById({
    //   rfeLogId: itemid,
    // });
    // if (response.FieldValues) {
    //   response = response.FieldValues;
    //   response.UnderwriterName = response.UnderwriterAD
    //     ? response.UnderwriterAD.userName
    //     : "";

    //   if (
    //     response.RequestForEmpowermentCCAD &&
    //     response.RequestForEmpowermentCCAD.length
    //   ) {
    //     let users = "";
    //     users = response.RequestForEmpowermentCCAD.map((item) => item.userName);
    //     response.RequestForEmpowermentCCName = users.join(",");
    //   }
    //   if (
    //     response.UnderwriterGrantingEmpowermentAD &&
    //     response.UnderwriterGrantingEmpowermentAD.length
    //   ) {
    //     let users = "";
    //     users = response.UnderwriterGrantingEmpowermentAD.map(
    //       (item) => item.userName
    //     );
    //     response.UnderwriterGrantingEmpowermentName = users.join(",");
    //   }
    //   let countryList = response.CountryList;
    //   countryList = countryList.map((country) => ({
    //     label: country.countryName,
    //     value: country.countryID,
    //     regionId: country.regionID,
    //   }));
    //   response["CountryList"] = [...countryList];
    //   if (mode === "edit" && response.IsSubmit) {
    //     setisEditMode(true);
    //   }
    //   if (mode === "view") {
    //     setisReadMode(true);
    //   }
    //   if (queryparam.status) {
    //     //uncomment below line if status need to set according to query param
    //     //response.requestForEmpowermentStatus = queryparam.status;
    //   }
    //   setformIntialState({
    //     ...response,
    //     isdirty: false,
    //   });
    //   showAddPopup();
    // }
  };

  const putItemHandler = async (item) => {
    let tempfullPathArr = item.RFEAttachmentList.map((item) => item.filePath);
    let fullFilePath = tempfullPathArr.join(",");
    item.FullFilePath = fullFilePath;
    if (
      item.RequestForEmpowermentStatus !==
      rfelog_status.Empowerment_granted_with_conditions
    ) {
      item.ConditionApplicableTo = "";
    }
    //item.RFELogEmailLink = window.location.href + "?id=" + item.rfeLogId;
    let response = await postItem({
      ...item,
      ModifiedByID: userProfile.userId,
    });

    if (response) {
      alert(alertMessage.rfelog.update);

      getallDraftItems();
      onPaginationSort("ModifiedDate", "desc");
      hideAddPopup();
    }
    setisEditMode(false);
  };
  const postItemHandler = async (item) => {
    let tempfullPathArr = item.RFEAttachmentList.map((item) => item.filePath);
    let fullFilePath = tempfullPathArr.join(",");
    item.FullFilePath = fullFilePath;
    if (
      item.RequestForEmpowermentStatus !==
      rfelog_status.Empowerment_granted_with_conditions
    ) {
      item.ConditionApplicableTo = "";
    }
    let response = await postItem({
      ...item,
      CreatedByID: userProfile.userId,
      ModifiedByID: userProfile.userId,
    });

    if (response) {
      if (item.IsSubmit) {
        alert(alertMessage.rfelog.add);
      } else {
        alert(alertMessage.rfelog.draft);
      }

      onPaginationSort("ModifiedDate", "desc");
      getallDraftItems();
      hideAddPopup();
    }
    setisEditMode(false);
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.rfelog.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({
      UserId: itemid,
    });
    if (!resonse) {
      resonse = await deleteItem({
        UserId: itemid,
      });
      if (resonse) {
        getAll({
          RequesterUserId: userProfile.userId,
        });
        alert(alertMessage.rfelog.delete);
      }
    } else {
      alert(alertMessage.rfelog.isInUse);
    }
  };

  const [filterbox, setfilterbox] = useState(false);
  const handleFilterBoxState = () => {
    setfilterbox(!filterbox);
    setisAdvfilterApplied(false);
    setisInCountryfilterApplied(false);
  };
  const handlesetAdvSearch = (e) => {
    setisAdvfilterApplied(!isAdvfilterApplied);
  };
  const handlesetInCountrySearch = (e) => {
    setisInCountryfilterApplied(!isInCountryfilterApplied);
  };
  //version history
  const [showVersionHistory, setshowVersionHistory] = useState(false);
  const [versionHistoryData, setversionHistoryData] = useState([]);
  const [isDraftVersionHistory, setisDraftVersionHistory] = useState(false);

  const hideVersionHistoryPopup = () => {
    setshowVersionHistory(false);
  };
  const handleDataVersion = async (itemid, isSubmit) => {
    let versiondata = await getDataVersion({
      TempId: itemid,
      LogType: "rfelogs",
      IncountryFlag: selectedview === "gn" ? "" : selectedview,
      UserRole:
        userProfile?.userRoles[userProfile?.userRoles?.length - 1].displayRole,
    });
    setversionHistoryData(versiondata ? versiondata : []);
    if (isSubmit) {
      setisDraftVersionHistory(false);
    } else {
      setisDraftVersionHistory(true);
    }
    setshowVersionHistory(true);
  };

  const handleOpenSharePointLink = (itemid) => {
    let id = itemid;
    let link;
    let splink = rfelogActiveSharePointLink;
    if (itemid.indexOf("ACT_") !== -1) {
      id = itemid.split("ACT_")[1];
      splink = rfelogActiveSharePointLink;
      link = `${splink}?ID=${id}&isDlg=1`;
    }
    if (itemid.indexOf("ARC_") !== -1) {
      id = itemid.split("ARC_")[1];
      splink = rfelogArchiveSharePointLink;
      link = `${splink}?ID=${id}&isDlg=1`;
    }
    if (itemid.indexOf("ARC_02") !== -1) {
      id = itemid.split("ARC_02")[1];
      splink = rfeARClogUKActiveSharePointLink;
      link = `${splink}?ID=${id}`;
    }
    if (itemid.indexOf("ACT_01") !== -1) {
      id = itemid.split("ACT_01")[1];
      splink = rfelogLATAMActiveSharePointLink;
      link = `${splink}?ID=${id}&isDlg=1`;
    }
    if (itemid.indexOf("ACT_02") !== -1) {
      id = itemid.split("ACT_02")[1];
      splink = rfelogUKActiveSharePointLink;
      link = `${splink}?ID=${id}`;
    }
    if (itemid.indexOf("ACT_05") !== -1) {
      id = itemid.split("ACT_05")[1];
      splink = rfelogNordicActiveSharePointLink;
      link = `${splink}?ID=${id}`;
    }
    if (itemid.indexOf("ACT_03") !== -1) {
      id = itemid.split("ACT_03")[1];
      splink = rfelogItalyActiveSharePointLink;
      link = `${splink}?ID=${id}`;
    }
    if (itemid.indexOf("ACT_06") !== -1) {
      id = itemid.split("ACT_06")[1];
      splink = rfelogGermanyActiveSharePointLink;
      link = `${splink}?ID=${id}`;
    }
    if (itemid.indexOf("ACT_07") !== -1) {
      id = itemid.split("ACT_07")[1];
      splink = rfelogUKZMActiveSharePointLink;
      link = `${splink}?ID=${id}`;
    }
    if (itemid.indexOf("GI-") !== -1) {
      link = `https://apps.powerapps.com/play/e/6c477b0d-de3f-4698-96b5-1f55000794bf/a/fe1a79ec-1bb2-4529-b48f-f26191b77032?FormID=${itemid}`;
    }
    window.open(link);
  };

  // chat 
  const [isRunning, setIsRunning] = useState(false);
  const [tokenGenerate, setTokenGenerate] = useState(false);
  const [selectedChatTopic, setSelectedChatTopic] = useState('');
  const [selectedRfE, setSelectedRfE] = useState({});
  const [chatMembers, setChatMembers] = useState([]);
  const [chatAddedMembers, setChatAddedMembers] = useState([]);
  const [openChatPopup, setOpenChatPopup] = useState(false);
  const [groupChatId, setGroupChatId] = useState('')
  const [microSoftURL, setMicroSoftURL] = useState('')
  const [groupDetails, setGroupDetails] = useState({})
  const [isGroupExist, setIsGroupExist] = useState(false);

  const newWindowRef = useRef();
  // Check Existing Group Chat
  const handleChat = async (row) => {
    localStorage.removeItem('code')
    setSelectedRfE(row)
    setSelectedChatTopic(row.EntryNumber)
  }

  useEffect(async () => {
    if (selectedChatTopic) {
      let requestParam = {
        EntryNumber: selectedChatTopic
      };
      let logMemebers = await getinvolveuserlist({ RFELogId: selectedRfE.RFELogId })
      const exists = logMemebers.some(obj => obj.emailAddress?.toLowerCase() === userProfile.emailAddress?.toLowerCase());
      if (!exists) {
        alert(alertMessage.rfelog.uninvoledChatUsermsg);
        return;
      }
      const response = await groupDetailsBaseOnEntryNumber(requestParam);
      // If the group chat does not exist: Returns null.
      if (response == null) {
        setIsGroupExist(false)
        //let logMemebers = await getinvolveuserlist({ RFELogId: selectedRfE.RFELogId })
        setChatMembers(logMemebers)
        setOpenChatPopup(true)
      } else {
        setIsGroupExist(true)
        // If the group chat exists: Return the group chat details.
        setGroupChatId(response?.groupChatId)
        setMicroSoftURL(response.groupChatwebUrl)
      }
    }
  }, [selectedChatTopic])

  useEffect(() => {
    if (groupChatId) {
      handleMemebersList()
    }
  }, [groupChatId])

  const handleMemebersList = async () => {
    let details = await getGroupchatDetailsWithMembers({ chatId: groupChatId })
    let logMemebers = await getinvolveuserlist({ RFELogId: selectedRfE.RFELogId })
    setGroupDetails(details)
    setMicroSoftURL(details?.chatDetails.webUrl)
    let groupAddedMembers = details?.chatDetails?.members;
    if (logMemebers?.length && groupAddedMembers?.length) {
      const array1Emails = new Set(logMemebers?.map((item) => item.emailAddress));
      const emailsToRemove = new Set(
        groupAddedMembers.filter((item) => array1Emails.has(item.email)).map((item) => item.email)
      );

      const filteredArray = logMemebers.filter((item) => !emailsToRemove.has(item.emailAddress));
      setChatMembers(filteredArray)
      const filteredAddedMembers = logMemebers.filter((item) => emailsToRemove.has(item.emailAddress));
      setChatAddedMembers(filteredAddedMembers)
      setOpenChatPopup(true)
    } else {
      setChatMembers(logMemebers)
      setOpenChatPopup(true)
    }
  }

  const [newMemberList, setNewMemberList] = useState([])

  useEffect(() => {
    let intervalId = setInterval(async () => {
      if (isRunning) {
        // console.log("function is Running", newWindowRef.current);
        if (localStorage.getItem('code')) {
          setIsRunning(false);
          newWindowRef.current.close()
          let code = localStorage.getItem('code')
          const resonse = await generateTokenForGroupChat({ authorizationCode: code });
          if (resonse) {
            setTokenGenerate(true)
          }
        }
      }
    }, 1000);
    return () => clearInterval(intervalId)
  }, [isRunning])

  useEffect(() => {
    if (tokenGenerate === true) {
      handleCreateGroupChat()
    }
  }, [tokenGenerate])


  const handleCreateGroupChat = async () => {
    const response = await createGroupChat({
      emails: newMemberList,
      chatTopic: selectedChatTopic + '-' + selectedRfE.AccountName,
      entryNumber: selectedChatTopic
    })
    if (response) {
      let url = response.webUrl
      window.open(url, "_blank", "noopener,noreferrer");
      if (isGroupExist) {
        let requestParam = {
          EntryNumber: selectedChatTopic
        };
        const chatData = await groupDetailsBaseOnEntryNumber(requestParam);
        setGroupChatId(chatData.groupChatId)
      } else {
        alert('Member(s) added into the Group chat')
        handleCloseChat();
      }
    }
  }

  const handleAddMemberToGroup = async (email) => {
    let newEmailsData = email.join(",");
    let addedMemberList = Array.from(new Set(newEmailsData.split(','))).join(',');
    if (isGroupExist) {
      let response = await addMemberToGroupChat({
        chatId: groupChatId,
        chatTopic: selectedChatTopic + '-' + selectedRfE.AccountName,
        emails: addedMemberList,
        entryNumber: selectedChatTopic
      })
      if (response) {
        window.open(microSoftURL, "_blank", "noopener,noreferrer");
        alert('Member(s) added into the Group chat')
        handleCloseChat();
      }
    }
    if (!isGroupExist) {
      const accessTokenDetails = await groupChatAccessTokenDetails({ userEmailAddress: userProfile.emailAddress });
      // If a token does not exist: Return null.
      let newEmails = addedMemberList + ',' + userProfile.emailAddress
      let memberListGroup = Array.from(new Set(newEmails.split(','))).join(',');
      if (accessTokenDetails == null) {
        setNewMemberList(memberListGroup)
        const chatAuthentication = await groupChatAuthentication({ UserEmail: userProfile.emailAddress });
        setIsRunning(true)
        newWindowRef.current = window.open(chatAuthentication, '_blank', 'width=400,height=300,top=100,left=100,resizable=no');
      } else {
        const response = await createGroupChat({
          emails: memberListGroup,
          chatTopic: selectedChatTopic + '-' + selectedRfE.AccountName,
          entryNumber: selectedChatTopic
        })
        if (response) {
          let url = response.webUrl
          window.open(url, "_blank", "noopener,noreferrer");
          alert('Member(s) added into the Group chat')
          handleCloseChat();
        }
      }
    }
  }

  const handleCloseChat = () => {
    setTokenGenerate(false)
    setSelectedChatTopic(null)
    setChatMembers([])
    setChatAddedMembers([])
    setGroupChatId(null)
    setMicroSoftURL(null)
    setGroupDetails(null)
    setOpenChatPopup(false)
    setIsGroupExist(false)
  }




  //more action functionality
  const [showShareLog, setshowShareLog] = useState(false);
  const [showDeleteLog, setshowDeleteLog] = useState(false);
  const [showCopyLog, setshowCopyLog] = useState(false);
  const [shareitemDetails, setshareitemDetails] = useState({});
  const handleCopyItem = (itemid) => {
    setshareitemDetails({
      id: itemid,
      link: `${window.location.href}?id=${itemid}`,
    });
    setshowCopyLog(true);
  };
  const openShareItem = (itemid, isSubmit) => {
    const link = `${window.location.href}?id=${itemid}`;
    setshareitemDetails({
      id: itemid,
      link: link,
      isSubmit: isSubmit,
    });
    setshowShareLog(true);
  };
  const openDeleteItem = (itemid, isSubmit) => {
    setshareitemDetails({
      id: itemid,
      isSubmit: isSubmit,
    });
    setshowDeleteLog(true);
  };
  const handleLinkLog = async (itemid) => {
    localStorage.setItem("id", itemid);
    localStorage.setItem("status", 'add');
    showAddPopup();
    // let response = await getById({
    //   rfeLogId: itemid,
    // });
    // setIsFlow3(true)
    // if (response.FieldValues) {
    //   response = response.FieldValues;
    //   let countryList = response.CountryList;
    //   countryList = countryList.map((country) => ({
    //     label: country.countryName,
    //     value: country.countryID,
    //     regionId: country.regionID,
    //   }));
    //   response["CountryList"] = [...countryList];
    //   setLinkSpecificDetails(response.RFELogDetails)
    //   setformIntialState({
    //     ...formInitialValue,
    //     LinkedRFEEntryNumber: response.EntryNumber,
    //     AccountName: response.AccountName,
    //     CountryList: response.CountryList,
    //     LOBId: response.LOBId,
    //     CountryId: response.CountryId
    //   });
    //   showAddPopup();
    // }
  }
  const hidelogPopup = () => {
    setshowShareLog(false);
    setshowDeleteLog(false);
    setshowCopyLog(false);
  };
  const handleDeleteItem = async (itemid, isSubmit) => {
    /*if (!window.confirm(alertMessage.commonmsg.deleteConfirm)) {
      return;
    }*/
    let requestParam = {
      tempId: itemid,
      logType: "rfelogs",
      isDelete: true,
    };
    const response = await deleteLog(requestParam);
    if (response) {
      hidelogPopup();

      alert(alertMessage.commonmsg.deleteLog);
      if (!isSubmit) {
        getallDraftItems();
      }
      getallDeletedItems();
      loadAPIData();
    }
  };
  const handleRestoreItem = async (itemid, isSubmit) => {
    if (!window.confirm(alertMessage.commonmsg.restoreConfirm)) {
      return;
    }
    let requestParam = {
      tempId: itemid,
      logType: "rfelogs",
      isDelete: false,
    };
    const response = await deleteLog(requestParam);
    if (response) {
      alert(alertMessage.commonmsg.restoreLog);
      if (!isSubmit) {
        getallDraftItems();
      }
      getallDeletedItems();
      loadAPIData();
    }
  };
  const exportReportLogsHandler = async () => {
    let reqParam = {
      RequesterUserId: userProfile.userId,
      IncountryFlag: selectedview === "gn" ? "" : selectedview,
      UserRole:
        userProfile?.userRoles[userProfile?.userRoles?.length - 1].displayRole,
    };
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
    if (sellogTabType === "delete") {
      reqParam = {
        ...reqParam,
        isDelete: true,
      };
    }
    if (sellogTabType === 'all' && nolonger === false) {
      reqParam = {
        ...reqParam,
        RequestForEmpowermentStatus: withOutWithdrawn,
      }
    }
    if (!isEmptyObjectKeys(selfilter)) {
      let tempFilterOpts = {};
      for (let key in selfilter) {
        let value = selfilter[key];
        if (selfilter[key]) {
          tempFilterOpts[key] = selfilter[key];
        }
        if (key === "CountryId" || key === "RegionId" ||
          key === "LOBId" || key === "RequestForEmpowermentStatus" ||
          key === "OrganizationalAlignment" || key === "RequestForEmpowermentReason" ||
          key === "DurationofApproval" || key === "Currency" || key === "Branch" ||
          key === "NewRenewal" || key === "CustomerSegment" || key === "SUBLOBID" ||
          key === "ConditionApplicableTo" || key === 'ActurisCode' ||
          key === "RequiredAuthority" || key === "SubmitterAuthority" || key === 'ZMSubLoBProduct') {
          if (value) {
            const tmpval = value?.map((item) => item.value);
            tempFilterOpts[key] = tmpval.join(",");
          }
        }
      }
      if (sellogTabType === 'all' && nolonger === false) {
        if (tempFilterOpts?.RequestForEmpowermentStatus === '' || tempFilterOpts?.RequestForEmpowermentStatus === undefined) {
          reqParam = {
            ...reqParam,
            ...tempFilterOpts,
            RequestForEmpowermentStatus: withOutWithdrawn,
          }
        } else if (tempFilterOpts?.RequestForEmpowermentStatus) {
          let selectedStatus = tempFilterOpts?.RequestForEmpowermentStatus.split(",");
          selectedStatus = selectedStatus.filter((item) => item !== "F2623BCB-50B7-467B-AF06-E4A5ECFB29A4");
          reqParam = {
            ...reqParam,
            ...tempFilterOpts,
            RequestForEmpowermentStatus: selectedStatus.length > 0 ? selectedStatus.toString() : "00000001",
          }
        }
      } else {
        reqParam = {
          ...reqParam,
          ...tempFilterOpts,
        };
      }
    }
    try {
      alert(alertMessage.commonmsg.reportDownlaod);
      const responseblob = await exportReportLogs(reqParam);
      const filename = "RfELogReport.xlsx";
      FileDownload(responseblob, filename);
      alert(alertMessage.commonmsg.reportDownlaodComplete);
    } catch (errormsg) {
      console.log(errormsg);
    }
  };
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
            groupBy={obj.name === "RequestForEmpowermentReason" || obj.name === "CustomerSegment" ? 'cat' : ''}
            name={obj.name}
            value={selfilter[obj.name]}
            handleChange={eval(obj.eventhandler)}
            selectopts={eval(obj.options)}
            titlelinespace={obj.titlelinespace ? true : false}
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
  return (
    <>
      {/* {isshowAddPopup && (
        <AddEditForm
          title={isReadMode ? "View RfE Log" : "Add/Edit RfE Log"}
          hideAddPopup={hideAddPopup}
          postItem={postItemHandler}
          putItem={putItemHandler}
          isEditMode={isEditMode}
          isReadMode={isReadMode}
          formIntialState={formIntialState}
          frmCountrySelectOpts={frmCountrySelectOpts}
          accountOpts={accountOpts}
          userProfile={userProfile}
          setInEditMode={setInEditMode}
          queryparam={queryparam}
          handleDataVersion={handleDataVersion}
          isDraft={isDraft}
          sellogTabType={sellogTabType}
          setInAddMode={setInAddMode}
          isFlow3={isFlow3}
          linkSpecificDetails={linkSpecificDetails}
        ></AddEditForm>
      )} */}
      {isshowImportLogsPopup && (
        <AddImportLogs
          title={"Bulk import RFE"}
          hideImportLogsPopup={hideImportLogsPopup}
          formIntialState={formIntialState}
          userProfile={userProfile}
          setisDataImported={setisDataImported}
          exportFileName={"RFELogsImportData"}
          incountryopts={commonfilterOpts.views}
        />
      )}
      {!isshowAddPopup && !isshowImportLogsPopup && (
        <>
          <div className="">
            <div className="title-rfe">
              <div className="page-title-rfe">RfE Log</div>
              <div className="" style={{ display: 'flex' }}>
                {viewData.length > 0 && (
                  <div className="title-dropdown-rfe">
                    <FrmSelect
                      title={"Switch view"}
                      name={"switchview"}
                      selectopts={commonfilterOpts.userViews}
                      handleChange={onUserViewFilterSelect}
                      value={selectedUserView}
                      inlinetitle={true}
                      isdisabled={isLoadingStarted}
                    />
                  </div>
                )}
                {userProfile.isAdminGroup && !isViewHide && commonfilterOpts.views.length > 1 && (
                  <div className="title-dropdown-rfe">
                    <FrmSelect
                      title={"Change view"}
                      name={"IncountryFlag"}
                      selectopts={commonfilterOpts.views}
                      handleChange={onViewFilterSelect}
                      value={selectedview}
                      inlinetitle={true}
                    />
                  </div>
                )}
              </div>
            </div>
            <p className="info-p">Disclaimer - By default the withdrawn logs are not displayed. Please use the toggle button to view all logs.</p>
          </div>
          <div className="page-filter-outercontainer">
            <div className="page-filter-positioncontainer">
              {filterbox ? (
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
                      {/*<div className="row">
                        <div className="frm-filter col-md-3">
                          <FrmInputAutocomplete
                            title={"Entry Number"}
                            name={"entryNumber"}
                            type={"input"}
                            handleChange={onSearchFilterInputAutocomplete}
                            value={selfilter.entryNumber}
                            options={commonfilterOpts.entryNumberOpts}
                          />
                        </div>
                        <div className="frm-filter col-md-3">
                          <FrmInput
                            title={"Account"}
                            name={"accountName"}
                            type={"input"}
                            handleChange={onSearchFilterInput}
                            value={selfilter.accountName}
                          />
                        </div>
                        <div className="frm-filter col-md-3">
                          <FrmSelect
                            title={"LoB"}
                            name={"lobId"}
                            selectopts={lobFilterOpts}
                            handleChange={onSearchFilterSelect}
                            value={selfilter.lobId}
                          />
                        </div>
                        <div className="frm-filter col-md-3">
                          <FrmSelect
                            title={"Role"}
                            name={"role"}
                            selectopts={commonfilterOpts.rolesFilterOpts}
                            handleChange={onSearchFilterSelect}
                            value={selfilter.role}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="frm-filter col-md-3">
                          <FrmSelect
                            title={"Region"}
                            name={"regionId"}
                            selectopts={regionFilterOpts}
                            handleChange={onSearchFilterSelect}
                            value={selfilter.regionId}
                          />
                        </div>
                        <div className="frm-filter col-md-3">
                          <FrmSelect
                            title={"Country"}
                            name={"countryId"}
                            selectopts={countryFilterOpts}
                            handleChange={onSearchFilterSelect}
                            value={selfilter.countryId}
                          />
                        </div>
                        <div className="frm-filter col-md-3">
                          <FrmInputAutocomplete
                            title={
                              <>
                                Underwriter <i>(submitter)</i>
                              </>
                            }
                            name={"underwriter"}
                            type={"input"}
                            handleChange={onSearchFilterInputAutocomplete}
                            value={selfilter.underwriter}
                            options={commonfilterOpts.underwriterFilterOpts}
                          />
                        </div>
                        <div className="frm-filter col-md-3">
                          <FrmInputAutocomplete
                            title={"Underwriter granting empowerment"}
                            name={"underwriterGrantingEmpowerment"}
                            type={"input"}
                            handleChange={onSearchFilterInputAutocomplete}
                            value={selfilter.underwriterGrantingEmpowerment}
                            options={
                              commonfilterOpts.underwriterGrantingEmpowermentOpts
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="frm-filter col-md-3">
                          <FrmSelect
                            title={"Request for empowerment status"}
                            name={"requestForEmpowermentStatus"}
                            selectopts={commonfilterOpts.statusFilterOpts}
                            handleChange={onSearchFilterSelect}
                            value={selfilter.requestForEmpowermentStatus}
                          />
                        </div>
                          </div>*/}
                    </div>
                  </div>
                  <div className="advance-filter-btn-container">
                    <div
                      className={`advance-filter-btn ${isAdvfilterApplied ? "selected" : "normal"
                        }`}
                      onClick={handlesetAdvSearch}
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
                        {/*<div className="row">
                          <div className="frm-filter col-md-3">
                            <FrmSelect
                              title={"Organizational alignment"}
                              titlelinespace={true}
                              name={"organizationalAlignment"}
                              selectopts={
                                commonfilterOpts.organizationalAlignmentOpts
                              }
                              handleChange={onSearchFilterSelect}
                              value={selfilter.organizationalAlignment}
                            />
                          </div>
                          <div className="frm-filter col-md-3">
                            <FrmSelect
                              title={"Request for empowerment reason"}
                              titlelinespace={true}
                              name={"requestForEmpowermentReason"}
                              selectopts={
                                commonfilterOpts.requestForEmpowermentReasonOpts
                              }
                              handleChange={onSearchFilterSelect}
                              value={selfilter.requestForEmpowermentReason}
                            />
                          </div>
                          <div className="frm-filter col-md-3">
                            <FrmSelect
                              title={
                                "CHZ Sustainability Desk / CHZ GI Credit Risk"
                              }
                              name={"chz"}
                              selectopts={commonfilterOpts.chzOpts}
                              handleChange={onSearchFilterSelect}
                              value={selfilter.chz}
                            />
                          </div>
                          <div className="frm-filter col-md-3">
                            <FrmInputAutocomplete
                              title={"Request for empowerment CC"}
                              titlelinespace={true}
                              name={"requestForEmpowermentCC"}
                              type={"input"}
                              handleChange={onSearchFilterInputAutocomplete}
                              value={selfilter.requestForEmpowermentCC}
                              options={
                                commonfilterOpts.requestForEmpowermentCCOpts
                              }
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="frm-filter col-md-3">
                            <FrmInputAutocomplete
                              title={"Creator Name"}
                              name={"creatorName"}
                              type={"input"}
                              handleChange={onSearchFilterInputAutocomplete}
                              value={selfilter.creatorName}
                              options={commonfilterOpts.creatorFilterOpts}
                            />
                          </div>
                          <div className="col-md-6 filter-date-container">
                            <div className="frm-filter">
                              <FrmDatePicker
                                title={"Created Date"}
                                name={"createdFromDate"}
                                value={selfilter.createdFromDate}
                                type={"date"}
                                handleChange={handleDateSelectChange}
                              />
                            </div>

                            <div className="daterange-title">to</div>

                            <div className="frm-filter">
                              <FrmDatePicker
                                title={""}
                                name={"createdToDate"}
                                value={selfilter.createdToDate}
                                type={"date"}
                                handleChange={handleDateSelectChange}
                                minDate={moment(
                                  selfilter.createdFromDate
                                ).toDate()}
                              />
                            </div>
                          </div>
                                </div>*/}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {filterdomfields.common.length > 0 && filterdomfields.Incountry.length === 0 ?
                    ""
                    :
                    <>
                      <div className="advance-filter-btn-container mt-5">
                        <div
                          className={`advance-filter-btn ${isInCountryfilterApplied ? "selected" : "normal"
                            }`}
                          onClick={handlesetInCountrySearch}
                        >
                          Incountry Search
                        </div>
                      </div>
                      {isInCountryfilterApplied ? (
                        <div className="filter-advance">
                          <div className="filter-container container">
                            <div className="row">
                              {filterdomfields.Incountry.length
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
                                : filterdomfields.common.length > 0 && filterdomfields.Incountry.length === 0 ? "" : "Loading..."}
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  }
                  <div className="btn-container">
                    <div
                      className={`btn-blue ${!isEmptyObjectKeys(selfilter) ? "" : "disable"
                        }`}
                      onClick={handleFilterSearch}
                    >
                      Search
                    </div>
                    {selectedUserView ?
                      <div className="btn-blue" onClick={() => onUserViewFilterSelect('', selectedUserView)}>
                        Reset
                      </div>
                      :
                      <div className="btn-blue" onClick={clearFilter}>
                        Clear
                      </div>
                    }
                    {/* <div className="btn-blue" onClick={clearFilter}>
                      Clear
                    </div> */}
                  </div>
                </div>
              ) : (
                ""
              )}

              <div
                className={`filter-btn-container ${filterbox ? "opencls" : "closecls"
                  }`}
              >
                <div className="filter-btn" onClick={handleFilterBoxState}>
                  {isfilterApplied ? "Filters Applied" : "Filters"}
                </div>
              </div>
            </div>
            {sellogTabType === 'all' && alllogsloaded &&
              <div style={{
                top: '12px', paddingLeft: "20px",
                paddingRight: '20px', display: 'flex',
                justifyContent: 'space-between', position: "absolute",
                right: '0', zIndex: '-1'
              }}
                className={`${filterbox ? '' : 'toggle-button-zindex'}`}
              >
                <div className="frm-filter">
                </div>
                <div className="frm-filter toggle-btn-header">
                  <FrmToggleSwitch
                    title={"Show Withdrawn"}
                    name={"withdrawn"}
                    value={nolonger}
                    handleChange={(name, value) => { setnolonger(value) }}
                    isRequired={false}
                    selectopts={[{ label: "No", value: "1", }, { label: "Yes", value: "0", }]}
                    isToolTip={true}
                    tooltipmsg={"<p>By default the withdrawn logs are not displayed. Please use the toggle button to view all logs.</p>"}
                  />
                </div>
              </div>
            }
          </div>
          {/*!alllogsloaded && (
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div className="progress-color"></div>
              </div>
              <div className="progress-completion">Loading logs...</div>
            </div>
          )*/}
          <div className="tabs-container">
            {logTypes.map((item) => (
              <div
                key={item.label}
                className={`tab-btn ${sellogTabType === item.value
                  ? "selected"
                  : isLoadingStarted
                    ? "disabled"
                    : "normal"
                  }`}
                onClick={() => openlogTab(item.value)}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div>
            {logstate.loading ? (
              <Loading />
            ) : logstate.error ? (
              <div>{logstate.error}</div>
            ) : (
              queryparamloaded && (
                <Pagination
                  id={"userId"}
                  column={getpaginationheaders()}
                  data={paginationdata}
                  pageno={pageIndex}
                  pagesize={pagesize}
                  totalItems={totalLogCount}
                  showAddPopup={showAddPopup}
                  showImportLogsPopup={showImportLogsPopup}
                  defaultSorted={defaultSorted}
                  isExportReport={true}
                  isImportLogs={userProfile.isAdminGroup ? true : false}
                  importLogsTitle={"Import RfE"}
                  exportReportTitle={"Export"}
                  exportReportLogsHandler={exportReportLogsHandler}
                  buttonTitle={"New RfE"}
                  hidesearch={true}
                  onPaginationPagechange={onPaginationPageChange}
                  onPageSizeChange={onPageSizeChange}
                  isChatBtns={true}
                  handleChat={handleChat}
                />
              )
            )}
          </div>
          <div>
            <input
              id="copytext-dummycontainer"
              type="text"
              disabled
              style={{ visibidlity: "hidden" }}
            ></input>
          </div>
        </>
      )}
      {showVersionHistory ? (
        <VersionHistoryPopupRfe
          versionHistoryData={versionHistoryData}
          hidePopup={hideVersionHistoryPopup}
          exportFieldTitles={versionHistoryexportFieldTitles}
          exportDateFields={versionHistoryexportDateFields}
          exportHtmlFields={versionHistoryexportHtmlFields}
          versionHistoryExcludeFields={versionHistoryExcludeFields}
          isDraft={isDraftVersionHistory ? true : false}
        />
      ) : (
        ""
      )}
      {showShareLog ? (
        <ShareItem
          title={"Share a RfE Link"}
          hidePopup={hidelogPopup}
          itemDetails={shareitemDetails}
          logtype={"RfE"}
          userProfile={userProfile}
        />
      ) : (
        ""
      )}
      {showDeleteLog ? (
        <DeleteItem
          title={"Delete RfE Entry"}
          deleteItem={handleDeleteItem}
          hidePopup={hidelogPopup}
          itemDetails={shareitemDetails}
        />
      ) : (
        ""
      )}
      {showCopyLog ? (
        <CopyItem
          title={"Copy a RfE Link"}
          hidePopup={hidelogPopup}
          itemDetails={shareitemDetails}
        />
      ) : (
        ""
      )}
      {openChatPopup ? (
        <ChatUserList
          hideAddPopup={handleCloseChat}
          id={selectedChatTopic}
          chatMembers={chatMembers}
          chatAddedMembers={chatAddedMembers}
          handleAddMemberToGroup={handleAddMemberToGroup}
          microSoftURL={microSoftURL}
          groupDetails={groupDetails}
          isGroupExist={isGroupExist}
        />
      ) : (
        ""
      )}
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
  postItem: rfelogActions.postItem,
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
  getViewsByUserId: userViewActions.getViewsByUserId,
  addEditUserView: commonActions.addEditUserView,
  getAllCurrency: currencyActions.getAllCurrency,
  getAllBranch: branchActions.getAllBranch,
  getAllSublob: sublobActions.getAllSublob,
  getAllSegment: segmentActions.getAllSegment,
  groupDetailsBaseOnEntryNumber: rfelogActions.groupDetailsBaseOnEntryNumber,
  groupChatAccessTokenDetails: rfelogActions.groupChatAccessTokenDetails,
  groupChatAuthentication: rfelogActions.groupChatAuthentication,
  generateTokenForGroupChat: rfelogActions.generateTokenForGroupChat,
  createGroupChat: rfelogActions.createGroupChat,
  getGroupchatDetailsWithMembers: rfelogActions.getGroupchatDetailsWithMembers,
  addMemberToGroupChat: rfelogActions.addMemberToGroupChat,
  getinvolveuserlist: rfelogActions.getinvolveuserlist
};

export default connect(mapStateToProp, mapActions)(Rfelog);