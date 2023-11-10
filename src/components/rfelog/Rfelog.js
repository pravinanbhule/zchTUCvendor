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
let pageIndex = 1;
let pagesize = 10;
let totalLogCount = 0;
function Rfelog({ ...props }) {
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
  const InCountryViewOpts = [
    INCOUNTRY_FLAG_OPTS.Indonesia,
    INCOUNTRY_FLAG_OPTS.UK,
    INCOUNTRY_FLAG_OPTS.LATAM,
    INCOUNTRY_FLAG_OPTS.SINGAPORE,
    INCOUNTRY_FLAG_OPTS.ITALY,
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
  const [isAdvfilterApplied, setisAdvfilterApplied] = useState(false);
  const [countryFilterOpts, setcountryFilterOpts] = useState([]);
  const [countryAllFilterOpts, setcountryAllFilterOpts] = useState([]);
  const [regionFilterOpts, setregionFilterOpts] = useState([]);
  const [regionOptsAll, setregionOptsAll] = useState([]);
  const [lobFilterOpts, setlobFilterOpts] = useState([]);
  const [accountOpts, setaccountOpts] = useState({});

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
  const handleFilterSearch = () => {
    if (!isEmptyObjectKeys(selfilter)) {
      setisfilterApplied(true);
      setfilterbox(false);
      setisAdvfilterApplied(false);
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
                      userProfile={userProfile}
                      isDelete={fnIsEditAccess(row) ? true : false}
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
                  return row.IsArchived ? (
                    <span
                      className="link"
                      onClick={() => handleOpenSharePointLink(row.entryNumber)}
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
    if (sellogTabType && !dashboardState.status) {
      pageIndex = 1;
      loadAPIData();
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
          } else if (
            userProfile.isCountryAdmin &&
            item.id.indexOf(userProfile.countryId) !== -1
          ) {
            incountryopts.push(item);
          }
        });
        incountryopts.sort(dynamicSort("label"));
        setcommonfilterOpts((prevstate) => ({
          ...prevstate,
          views: [{ label: "All", value: "gn" }, ...incountryopts],
        }));
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
      handleEdit(this, true);
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
  const showAddPopup = () => {
    setshowAddPopup(true);
  };
  const hideAddPopup = () => {
    setshowAddPopup(false);
    setformIntialState(formInitialValue);
    setisEditMode(false);
    setisReadMode(false);
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
    RFELogEmailLink: window.location.href,
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
  };
  const [formIntialState, setformIntialState] = useState(formInitialValue);

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
    let response = await getById({
      rfeLogId: itemid,
    });
    if (response.FieldValues) {
      response = response.FieldValues;
      response.UnderwriterName = response.UnderwriterAD
        ? response.UnderwriterAD.userName
        : "";

      if (
        response.RequestForEmpowermentCCAD &&
        response.RequestForEmpowermentCCAD.length
      ) {
        let users = "";
        users = response.RequestForEmpowermentCCAD.map((item) => item.userName);
        response.RequestForEmpowermentCCName = users.join(",");
      }
      if (
        response.UnderwriterGrantingEmpowermentAD &&
        response.UnderwriterGrantingEmpowermentAD.length
      ) {
        let users = "";
        users = response.UnderwriterGrantingEmpowermentAD.map(
          (item) => item.userName
        );
        response.UnderwriterGrantingEmpowermentName = users.join(",");
      }
      let countryList = response.CountryList;
      countryList = countryList.map((country) => ({
        label: country.countryName,
        value: country.countryID,
        regionId: country.regionID,
      }));
      response["CountryList"] = [...countryList];
      if (mode === "edit" && response.IsSubmit) {
        setisEditMode(true);
      }
      if (mode === "view") {
        setisReadMode(true);
      }
      if (queryparam.status) {
        //uncomment below line if status need to set according to query param
        //response.requestForEmpowermentStatus = queryparam.status;
      }
      setformIntialState({
        ...response,
        isdirty: false,
      });
      showAddPopup();
    }
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
  };
  const handlesetAdvSearch = (e) => {
    setisAdvfilterApplied(!isAdvfilterApplied);
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
    let splink = rfelogActiveSharePointLink;
    if (itemid.indexOf("ACT_") !== -1) {
      id = itemid.split("ACT_")[1];
      splink = rfelogActiveSharePointLink;
    }
    if (itemid.indexOf("ARC_") !== -1) {
      id = itemid.split("ARC_")[1];
      splink = rfelogArchiveSharePointLink;
    }
    if (itemid.indexOf("ACT_01") !== -1) {
      id = itemid.split("ACT_01")[1];
      splink = rfelogLATAMActiveSharePointLink;
    }
    const link = `${splink}?ID=${id}&isDlg=1`;
    window.open(link);
  };

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
    if (!isEmptyObjectKeys(selfilter)) {
      let tempFilterOpts = {};
      for (let key in selfilter) {
        if (selfilter[key]) {
          tempFilterOpts[key] = selfilter[key];
        }
      }
      reqParam = {
        ...reqParam,
        ...tempFilterOpts,
      };
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
  return (
    <>
      {isshowAddPopup && (
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
        ></AddEditForm>
      )}
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
          <div className="container">
            <div className="row">
              <div className="page-title col-md-9">RfE Log</div>
              {userProfile.isAdminGroup && (
                <div className="col-md-3" style={{ marginTop: "8px" }}>
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
                      className={`advance-filter-btn ${
                        isAdvfilterApplied ? "selected" : "normal"
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
                  <div className="btn-container">
                    <div
                      className={`btn-blue ${
                        !isEmptyObjectKeys(selfilter) ? "" : "disable"
                      }`}
                      onClick={handleFilterSearch}
                    >
                      Search
                    </div>
                    <div className="btn-blue" onClick={clearFilter}>
                      Clear
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}

              <div
                className={`filter-btn-container ${
                  filterbox ? "opencls" : "closecls"
                }`}
              >
                <div className="filter-btn" onClick={handleFilterBoxState}>
                  {isfilterApplied ? "Filters Applied" : "Filters"}
                </div>
              </div>
            </div>
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
                className={`tab-btn ${
                  sellogTabType === item.value
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
};

export default connect(mapStateToProp, mapActions)(Rfelog);
