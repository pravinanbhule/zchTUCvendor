import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
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
} from "../../actions";
import { SHAREPOINT_LINKS } from "../../constants";
import Loading from "../common-components/Loading";
import useSetNavMenu from "../../customhooks/useSetNavMenu";
import FrmSelect from "../common-components/frmselect/FrmSelect";
import FrmMultiselect from "../common-components/frmmultiselect/FrmMultiselect";
import FrmRadio from "../common-components/frmradio/FrmRadio";
import FrmDatePicker from "../common-components/frmdatepicker/FrmDatePicker";
import moment from "moment";
import Pagination from "../common-components/pagination/Pagination";
import PaginationData from "../common-components/PaginationData";
import {
  alertMessage,
  dynamicSort,
  formatDate,
  getUrlParameter,
  isEmptyObjectKeys,
  isDateInRange,
  isNotEmptyValue,
} from "../../helpers";
import AddEditForm from "./AddEditForm";
import AddImportLogs from "./AddImportLogs";
import FrmInput from "../common-components/frminput/FrmInput";
import FrmInputAutocomplete from "../common-components/frminputautocomplete/FrmInputAutocomplete";
import CustomToolTip from "../common-components/tooltip/CustomToolTip";
import parse from "html-react-parser";
import VersionHistoryPopup from "../versionhistorypopup/VersionHistoryPopup";
import MoreActions from "../common-components/moreactions/MoreActions";
import ShareItem from "../common-components/shareitem/ShareItem";
import DeleteItem from "../common-components/deleteItem/DeleteItem";
import CopyItem from "../common-components/copyitem/CopyItem";
import { isEmpty } from "lodash";
import ConfirmPopup from "../common-components/confirmpopup/ConfirmPopup";
import { handlePermission } from "../../permissions/Permission";
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
    getViewsByUserId,
    addEditUserView
  } = props;

  const [logstate, setlogstate] = useState({
    loading: true,
    error: "",
    ZUGLoadedAll: false,
    URPMLoadedAll: false,
    ZUGdata: [],
    URPMdata: [],
  });
  const zuglogSharePointLink = SHAREPOINT_LINKS.ZUGlog;
  const urpmlogSharePointLink = SHAREPOINT_LINKS.URPM;
  const [logsDraftData, setlogsDraftData] = useState({
    ZUGdraftdata: [],
    URPMdraftdata: [],
  });
  const [logsDeletedData, setlogsDeletedData] = useState({
    ZUGdeleteddata: [],
    URPMdeleteddata: [],
  });
  useSetNavMenu(
    { currentMenu: "Exemptionlog", isSubmenu: false },
    props.menuClick
  );
  const FileDownload = require("js-file-download");
  //initialize filter/search functionality
  const selectInitiVal = {
    label: "Select",
    value: "",
  };
  const exportExcludeFieldsZUG = [
    "zugExemptionLogId",
    "fullTransitional",
    "countryID",
    "createdById",
    "isSubmit",
    "lobChapter",
    "modifiedById",
    "status",
    "totalCount",
    "typeOfBusiness",
    "typeOfExemption",
    "approver",
    "empowermentRequestedBy",
    "individualGrantedEmpowerment",
    "countryName",
    "isActive",
    "isArchived",
    "isInvalidEmailExists",
    "globalExemptionLogURL",
    "znaSegmentId",
    "znasbuId",
    "marketBasketId",
    "znaProductsId",
    "exemptionCC",
    "regionId",
  ];
  const exportExcludeFieldsURPM = [
    "urpmExemptionLogId",
    "fullTransitional",
    "countryID",
    "createdById",
    "isSubmit",
    "isActive",
    "status",
    "modifiedById",
    "totalCount",
    "typeOfBusiness",
    "typeOfExemption",
    "approver",
    "empowermentRequestedBy",
    "individualGrantedEmpowerment",
    "cc",
    "countryName",
    "empowermentRequestedBy",
    "zugChapterVersion",
    "isActive",
    "isArchived",
    "isInvalidEmailExists",
    "globalExemptionLogURL",
    "znaSegmentId",
    "znasbuId",
    "marketBasketId",
    "znaProductsId",
    "exemptionCC",
    "regionId",
  ];
  const exportDateFields = {
    expiringDate: "expiringDate",
    transitionalExpireDate: "transitionalExpireDate",
    modifiedDate: "modifiedDate",
    createdDate: "createdDate",
    importedDate: "importedDate",
  };
  const exportFieldTitlesZUG = {
    entryNumber: "Entry Number",
    countryNames: "Country",
    typeOfExemptionValue: "Type of Exemption",
    typeOfBusinessValue: "Type of Business",
    individualGrantedEmpowermentName: "Individual Granted Empowerment",
    lobChapterName: "LoB Chapter/Document",
    section: "Section",
    sectionSubject: "Section Subject",
    zugChapterVersion: "ZUG Chapter Version",
    empowermentAndFeedbackRequest: "Empowerment request details",
    empowermentRequestedByName: "Empowerment Requested By",
    fullTransitionalValue: "Full/Transitional",
    transitionalExpireDate: "Transitional Expiring Date of Empowerment",
    pC_URPMExemptionRequired: "P&C URPM exemption required",
    approverName: "Approver",
    statusValue: "Status",
    expiringDate: "Expiring Date",
    additionalApprovalComments: "Additional Approval Comments",
    createdDate: "Created Date",
    creatorName: "Creator Name",
    modifiedDate: "Modified Date",
    lastModifiorName: "Modified by",
    exemptionLogType: "Exemption Log Type",
    exemptionLogEmailLink: "Link",
    importedBy: "Imported By",
    importedDate: "Imported Date",
    ciGuidlineId: "Previous Exemption ID",
    znaSegmentName: "ZNA BU",
    sbuName: "ZNA SBU",
    marketBasketName: "ZNA MarketBasket",
    znaProductsName: "ZNA Products",
    exemptionCCName: "Exemption CC",
  };
  const exportFieldTitlesURPM = {
    entryNumber: "Entry Number",
    countryNames: "Country",
    typeOfExemptionValue: "Type of Exemption",
    typeOfBusinessValue: "Type of Business",
    individualGrantedEmpowermentName: "Individual Granted Empowerment",
    section: "Section",
    sectionSubject: "Section Subject",
    transitionalExpireDate: "Transitional Expiring Date of Empowerment",
    expiringDate: "Expiring Date",
    requestDetails: "Empowerment request details",
    approverName: "Approver",
    statusValue: "Status",
    additionalApprovalComments: "Additional Approval Comments",
    empowermentRequestedByName: "Empowerment Requested By",
    fullTransitionalValue: "Full/Transitional",
    createdDate: "Created Date",
    creatorName: "Creator Name",
    modifiedDate: "Modified Date",
    lastModifiorName: "Modified by",
    exemptionLogType: "Exemption Log Type",
    exemptionLogEmailLink: "Link",
    importedBy: "Imported By",
    importedDate: "Imported Date",
    ciGuidlineId: "Previous Exemption ID",
    znaSegmentName: "ZNA BU",
    sbuName: "ZNA SBU",
    marketBasketName: "ZNA MarketBasket",
    znaProductsName: "ZNA Products",
    exemptionCCName: "Exemption CC",
  };
  const exportHtmlFields = [
    "empowermentAndFeedbackRequest",
    "additionalApprovalComments",
    "requestDetails",
  ];
  const exportCapitalField = { exemptionLogType: "exemptionLogType" };
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
    views: [{ label: "All", value: null }],
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
  const [selectedExemptionLog, setselectedExemptionLog] = useState("zug");
  const [countryFilterOpts, setcountryFilterOpts] = useState([]);
  const [countryAllFilterOpts, setcountryAllFilterOpts] = useState([]);
  const [regionFilterOpts, setregionFilterOpts] = useState([]);
  const [regionOptsAll, setregionOptsAll] = useState([]);
  const [lobChapterFilterOpts, setlobChapterFilterOpts] = useState([]);
  const intialFilterState = {
    entryNumber: "",
    countryID: [],
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
  };
  const [selfilter, setselfilter] = useState(intialFilterState);
  const [isfilterApplied, setisfilterApplied] = useState(false);
  const [dashboardStateApplied, setdashboardStateApplied] = useState(false);
  const [isAdvfilterApplied, setisAdvfilterApplied] = useState(false);
  const [showpage, setShowPage] = useState(false)
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
  const onExemptionlogSelection = (e) => {
    let { name, value } = e.target;
    setselectedview(null)
    if (
      (value === "zug" && !logstate.ZUGLoadedAll) ||
      (value === "urpm" && !logstate.URPMLoadedAll)
    ) {
      setlogItmes([]);
      setlogstate({ ...logstate, loading: true });
    }
    setExemLogTypeFn(value);
    clearFilter()
  };
  const onSearchFilterSelect = (name, value) => {
    //const { name, value } = e.target;
    setselfilter({
      ...selfilter,
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
    //const tempval = value.map((item) => item.value);
    /*setselfilter({
      ...selfilter,
      [name]: value,
    });*/
    if (name === "regionId") {
      /*let countryopts = countryAllFilterOpts.filter(
        (item) => item.regionId === value
      );
      /setcountryFilterOpts([...countryopts]);*/
      let countryopts = [...selfilter.countryID];
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
        countryID: countryopts,
      });
    } /*else if (name === "regionId" && value === "") {
      setcountryFilterOpts([...countryAllFilterOpts]);
      setregionFilterOpts([...regionOptsAll]);
      setselfilter({
        ...selfilter,
        [name]: [],
        countryID: [],
      });
    }*/
    if (name === "countryID") {
      //let country = countryAllFilterOpts.filter((item) => item.value === value);
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
        regionId: regionOpts,
      });
    } /* else if (name === "countryID" && value === "") {
      //setregionFilterOpts([...regionOptsAll]);
      setselfilter({
        ...selfilter,
        [name]: [],
        regionId: [],
      });
    }*/
  };

  const handleFilterSearch = () => {
    if (!isEmptyObjectKeys(selfilter)) {
      /*let dataArr;
      if (sellogTabType === "draft") {
        dataArr =
          selectedExemptionLog === "zug"
            ? logsDraftData.ZUGdraftdata
            : logsDraftData.URPMdraftdata;
      } else {
        dataArr =
          selectedExemptionLog === "zug" ? logstate.ZUGdata : logstate.URPMdata;
      }
      let tempdata = [...dataArr];
      tempdata = tempdata.filter((item) => {
        let isShow = true;
        if (
          isShow &&
          selfilter.entryNumber.trim() !== "" &&
          item.entryNumber &&
          item.entryNumber?.toLowerCase() !==
            selfilter.entryNumber?.toLowerCase()
        ) {
          isShow = false;
        }
        if (isShow && selfilter.countryID.length) {
          let isPresent = false;
          selfilter.countryID.forEach((selitem) => {
            if (item.countryID.indexOf(selitem.value) !== -1) {
              isPresent = true;
            }
          });
          if (!isPresent) {
            isShow = false;
          }
        }
        if (isShow && selfilter.regionId.length) {
          let isPresent = false;
          selfilter.regionId.forEach((selitem) => {
            if (item.regionId.indexOf(selitem.value) !== -1) {
              isPresent = true;
            }
          });
          if (!isPresent) {
            isShow = false;
          }
        }
        if (
          isShow &&
          selectedExemptionLog === "zug" &&
          selfilter.lobChapter !== "" &&
          item.lobChapter &&
          item.lobChapter !== selfilter.lobChapter
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.status !== "" &&
          selfilter.status !== item.status
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selectedExemptionLog !== "zug" &&
          selfilter.section.trim() !== "" &&
          item.section &&
          !item.section
            .toString()
            .toLowerCase()
            .includes(selfilter.section.toString().toLowerCase())
        ) {
          isShow = false;
        }
        if (isShow && selfilter.role !== "") {
          if (
            selfilter.role === "approver" &&
            item.approver !== userProfile.emailAddress
          ) {
            isShow = false;
          } else if (
            selfilter.role === "initiator" &&
            item.empowermentRequestedBy !== userProfile.emailAddress
          ) {
            isShow = false;
          }
        }
        if (
          isShow &&
          selfilter.typeOfExemption !== "" &&
          selfilter.typeOfExemption !== item.typeOfExemption
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.zugChapterVersion.trim() !== "" &&
          !item.zugChapterVersion
            ?.toLowerCase()
            .includes(selfilter.zugChapterVersion?.toLowerCase())
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.ciGuidlineId.trim() !== "" &&
          !item.ciGuidlineId
            ?.toLowerCase()
            .includes(selfilter.ciGuidlineId?.toLowerCase())
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.pC_URPMExemptionRequired !== "" &&
          Boolean(parseInt(selfilter.pC_URPMExemptionRequired)) !==
            item.pC_URPMExemptionRequired
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.individualGrantedEmpowermentName !== "" &&
          (item.individualGrantedEmpowermentName
            ?.toLowerCase()
            .indexOf(
              selfilter.individualGrantedEmpowermentName.toLocaleLowerCase()
            ) === -1 ||
            !item.individualGrantedEmpowermentName)
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.approverName !== "" &&
          (item.approverName
            ?.toLowerCase()
            .indexOf(selfilter.approverName.toLocaleLowerCase()) === -1 ||
            !item.approverName)
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.empowermentRequestedByName !== "" &&
          (item.empowermentRequestedByName
            ?.toLowerCase()
            .indexOf(
              selfilter.empowermentRequestedByName.toLocaleLowerCase()
            ) === -1 ||
            !item.empowermentRequestedByName)
        ) {
          isShow = false;
        }
        if (isShow && selfilter.createdDateFrom && selfilter.createdDateTo) {
          if (
            !item.createdDate ||
            !isDateInRange(
              item.createdDate,
              selfilter.createdDateFrom,
              selfilter.createdDateTo
            )
          ) {
            isShow = false;
          }
        }
        return isShow;
      });
      //setpaginationdata(tempdata);
      fnsetPaginationData(tempdata);
      setisfilterApplied(true);*/
      setisfilterApplied(true);
      setfilterbox(false);
      setisAdvfilterApplied(false);
      pageIndex = 1;
      loadAPIData();
    }
  };
  const clearFilter = () => {
    /*setselfilter(intialFilterState);
    setisfilterApplied(false);
    let dataArr;
    if (sellogTabType === "draft") {
      dataArr =
        selectedExemptionLog === "zug"
          ? logsDraftData.ZUGdraftdata
          : logsDraftData.URPMdraftdata;
    } else {
      dataArr =
        selectedExemptionLog === "zug" ? logstate.ZUGdata : logstate.URPMdata;
    }
    //setpaginationdata(dataArr);
    setcountryFilterOpts([...countryAllFilterOpts]);
    setregionFilterOpts([selectInitiVal, ...regionOptsAll]);
    fnsetPaginationData(dataArr);*/

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

  const fnIsEditAccess = (row) => {
    let isedit = false;
    let loggeduser = userProfile.emailAddress;
    if (row.isSubmit) {
      if (
        (row.individualGrantedEmpowerment &&
          row.individualGrantedEmpowerment.indexOf(loggeduser) !== -1) ||
        (row.empowermentRequestedBy &&
          row.empowermentRequestedBy.indexOf(loggeduser) !== -1) ||
        (row.approver && row.approver.indexOf(loggeduser) !== -1) ||
        userProfile.isSuperAdmin ||
        userProfile.isGlobalAdmin
      ) {
        isedit = true;
      }
    } else {
      isedit = true;
    }
    if (userProfile.isAdminGroup && userProfile.scopeCountryList) {
      let countryList = row.countryID ? row.countryID.split(",") : [];
      countryList.forEach((country) => {
        if (userProfile.scopeCountryList.indexOf(country) !== -1) {
          isedit = true;
        }
      });
    }
    return isedit;
  };
  //set pagination data and functionality
  const [isPaginationSort, setisPaginationSort] = useState(false);
  const [selSortFiled, setselSortFiled] = useState({
    name: "modifiedDate",
    order: "desc",
  });
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
  const columnsZUG = [
    sellogTabType !== "delete"
      ? {
          dataField: "editaction",
          text: "Edit",
          hidden: handlePermission(window.location.pathname.slice(1), "isEdit") === true ? false : true,
          formatter: (cell, row, rowIndex, formatExtraData) => {
            let isedit = fnIsEditAccess(row);
            /* let loggeduser = userProfile.emailAddress;

            if (row.isSubmit) {
              if (
                (row.individualGrantedEmpowerment &&
                  row.individualGrantedEmpowerment.indexOf(loggeduser) !==
                    -1) ||
                (row.empowermentRequestedBy &&
                  row.empowermentRequestedBy.indexOf(loggeduser) !== -1) ||
                (row.approver && row.approver.indexOf(loggeduser) !== -1) ||
                userProfile.isSuperAdmin ||
                userProfile.isGlobalAdmin
              ) {
                isedit = true;
              }
            } else {
              isedit = true;
            }
            if (userProfile.isAdminGroup && userProfile.scopeCountryList) {
              let countryList = row.countryID ? row.countryID.split(",") : [];
              countryList.forEach((country) => {
                if (userProfile.scopeCountryList.indexOf(country) !== -1) {
                  isedit = true;
                }
              });
            }*/

            return isedit ? (
              <div
                className={`edit-icon`}
                onClick={handleEdit}
                rowid={row.zugExemptionLogId}
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
          hidden: handlePermission(window.location.pathname.slice(1), "isEdit") === true ? false : true,
          formatter: (cell, row, rowIndex, formatExtraData) => {
            return (
              <div
                className="restore-icon"
                onClick={() =>
                  handleRestoreItem(row.zugExemptionLogId, row.isSubmit)
                }
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
            rowid={row.zugExemptionLogId}
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
            onClick={() => handleDataVersion(row.zugExemptionLogId)}
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
                  rowid={
                    selectedExemptionLog === "zug"
                      ? row.zugExemptionLogId
                      : row.urpmExemptionLogId
                  }
                  isSubmit={row.isSubmit}
                  handleCopyItem={handleCopyItem}
                  handleShareItem={openShareItem}
                  handleDeleteItem={openDeleteItem}
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
    {
      dataField: "entityNumber",
      text: "Entry Number",
      sort: false,
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
                          <b>Details for Request</b>
                          <br></br>
                          {row.empowermentAndFeedbackRequest
                            ? parse(row.empowermentAndFeedbackRequest)
                            : ""}
                        </div>
                      </td>
                      <td>
                        <div className="tooltip-content">
                          <b>Comments</b>
                          <br></br>
                          {row.additionalApprovalComments
                            ? parse(row.additionalApprovalComments)
                            : ""}
                        </div>
                      </td>
                    </tr>
                  </table>
                </>
              }
              direction="right"
            >
              <div className="breach-title" rowid={row.zugExemptionLogId}>
                {row.entryNumber}
              </div>
            </CustomToolTip>
          </>
        );
      },
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "countryNames",
      text: "Country",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      },
    },
    {
      dataField: "regionName",
      text: "Region",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "lobChapterName",
      text: "LoB Chapter/Document",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      },
    },

    {
      dataField: "section",
      text: "Section",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "fullTransitionalValue",
      text: "Full/Transitional",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "sectionSubject",
      text: "Section Subject",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "typeOfBusinessValue",
      text: "Type of Business",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "typeOfExemptionValue",
      text: "Type of exemption",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "pC_URPMExemptionRequired",
      text: "P&C URPM exemption required",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{row.pC_URPMExemptionRequired ? "Yes" : "No"}</span>;
      },
    },
    {
      dataField: "empowermentRequestedByName",
      text: "Empowerment Requested By",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "approverName",
      text: "Approver",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "individualGrantedEmpowermentName",
      text: "Individual Granted Empowerment",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "statusValue",
      text: "Status",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },

    {
      dataField: "transitionalExpireDate",
      text: "Transitional Expiring Date",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
    {
      dataField: "expiringDate",
      text: "Expiring Date",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
    {
      dataField: "createdDate",
      text: "Created Date",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
    {
      dataField: "modifiedDate",
      text: "Modified Date",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
    {
      dataField: "znaSegmentName",
      text: "ZNA BU",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "sbuName",
      text: "ZNA SBU",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "marketBasketName",
      text: "ZNA MarketBasket",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "znaProductsName",
      text: "ZNA Products",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "zugChapterVersion",
      text: "ZUG Chapter Version",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "ciGuidlineId",
      text: "Previous Exemption ID",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "exemptionDetailForLocalAddendum",
      text: "Exemption Detail for local addendum",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "isArchived",
      text: "Link to SharePoint",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return row.isArchived ? (
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
    },
  ];
  const columnsURPM = [
    sellogTabType !== "delete"
      ? {
          dataField: "editaction",
          text: "Edit",
          hidden: handlePermission(window.location.pathname.slice(1), "isEdit") === true ? false : true,
          formatter: (cell, row, rowIndex, formatExtraData) => {
            let isedit = fnIsEditAccess(row);

            return isedit ? (
              <div
                className={`edit-icon`}
                onClick={handleEdit}
                rowid={row.urpmExemptionLogId}
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
          hidden: handlePermission(window.location.pathname.slice(1), "isEdit") === true ? false : true,
          formatter: (cell, row, rowIndex, formatExtraData) => {
            return (
              <div
                className="restore-icon"
                onClick={() =>
                  handleRestoreItem(row.urpmExemptionLogId, row.isSubmit)
                }
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
            rowid={row.urpmExemptionLogId}
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
            onClick={() => handleDataVersion(row.urpmExemptionLogId)}
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
                  rowid={
                    selectedExemptionLog === "zug"
                      ? row.zugExemptionLogId
                      : row.urpmExemptionLogId
                  }
                  isSubmit={row.isSubmit}
                  handleCopyItem={handleCopyItem}
                  handleShareItem={openShareItem}
                  handleDeleteItem={openDeleteItem}
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
    {
      dataField: "entityNumber",
      text: "Entry Number",
      sort: false,
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
                          <b>Details for Request</b>
                          <br></br>
                          {row.requestDetails ? parse(row.requestDetails) : ""}
                        </div>
                      </td>
                      <td>
                        <div className="tooltip-content">
                          <b>Comments</b>
                          <br></br>
                          {row.additionalApprovalComments
                            ? parse(row.additionalApprovalComments)
                            : ""}
                        </div>
                      </td>
                    </tr>
                  </table>
                </>
              }
              direction="right"
            >
              <div className="breach-title" rowid={row.urpmExemptionLogId}>
                {row.entryNumber}
              </div>
            </CustomToolTip>
          </>
        );
      },
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      },
    },
    {
      dataField: "typeOfExemptionValue",
      text: "Type of exemption",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "typeOfBusinessValue",
      text: "Type of Business",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "160px" };
      },
    },
    {
      dataField: "section",
      text: "Section",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "fullTransitionalValue",
      text: "Full/Transitional",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "countryNames",
      text: "Country Granted Exemption",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      },
    },
    {
      dataField: "regionName",
      text: "Region",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "sectionSubject",
      text: "Section Subject/Power Reserved",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },

    {
      dataField: "empowermentRequestedByName",
      text: "Empowerment Requested By",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "individualGrantedEmpowermentName",
      text: "Individual Granted Empowerment",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "180px" };
      },
    },
    {
      dataField: "approverName",
      text: "Approver",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "statusValue",
      text: "Status",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "transitionalExpireDate",
      text: "Transitional Expiring Date",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
    {
      dataField: "expiringDate",
      text: "Expiring Date",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
    {
      dataField: "createdDate",
      text: "Created Date",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
    {
      dataField: "modifiedDate",
      text: "Modified Date",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
    {
      dataField: "znaSegmentName",
      text: "ZNA BU",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "sbuName",
      text: "ZNA SBU",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "marketBasketName",
      text: "ZNA MarketBasket",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "znaProductsName",
      text: "ZNA Products",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "exemptionDetailForLocalAddendum",
      text: "Exemption Detail for local addendum",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "isArchived",
      text: "Link to SharePoint",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return row.isArchived ? (
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
    },
  ];
  const defaultSorted = [
    {
      dataField: "modifiedDate",
      order: "desc",
    },
  ];
  //set selected exemption log type
  const setExemLogTypeFn = (value) => {
    setselectedExemptionLog(value);
  };
  //load logs data in recurrsive
  const [logItmes, setlogItmes] = useState([]);
  //const [pagesize, setpagesize] = useState(500);
  const [alllogsloaded, setalllogsloaded] = useState(false);
  const [isLoadingStarted, setisLoadingStarted] = useState(false);
  const [deletedlogCount, setdeletedlogCount] = useState({
    ZUGDeletedlogs: 0,
    URPMDeletedlogs: 0,
  });
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

    if (!isEmptyObjectKeys(selfilter)) {
      let tempFilterOpts = {};
      for (let key in selfilter) {
        if (selfilter[key]) {
          let value = selfilter[key];
          tempFilterOpts[key] = value;
          if (key === "PC_URPMExemptionRequired") {
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
      /*if (sellogTabType === "delete") {
        if (selectedExemptionLog === "zug") {
          tempItems = await getallZUGDeletedLogs(reqParam);
        } else {
          tempItems = await getallURPMDeletedLogs(reqParam);
        }
      } else {
        if (selectedExemptionLog === "zug") {
          tempItems = await getallZUGLogs(reqParam);
        } else {
          tempItems = await getallURPMLogs(reqParam);
        }
      }
      totalLogCount = tempItems.length && tempItems[0].totalCount;
      setlogItmes([...tempItems]);*/
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
    fnsetPaginationData(logstate.data);
  }, [logstate.data]);

  /*useEffect(() => {
    if (isLoadingStarted) {
      //setdata(logItmes);
      let dataArrayName = selectedExemptionLog === "zug" ? "data" : "data";
      let deletedCount =
        selectedExemptionLog === "zug" ? "ZUGDeletedlogs" : "URPMDeletedlogs";
      //setpaginationdata(logItmes);
      let chunkPercentage = Math.round((logItmes.length / totalLogCount) * 100);
      const progressbar = document.querySelector(".progress-color");

      if (progressbar) {
        progressbar.style.width = chunkPercentage + "%";
      }

      if (totalLogCount > logItmes.length + deletedlogCount[deletedCount]) {
        pageIndex++;
        setlogstate({
          ...logstate,
          loading: false,
          [dataArrayName]: [...logItmes],
        });
        getAllLogsInRecurssion();
      } else {
        pageIndex = 1;
        totalLogCount = 0;
        let compeletedfieldname =
          selectedExemptionLog === "zug" ? "ZUGLoadedAll" : "URPMLoadedAll";
        setlogstate({
          ...logstate,
          loading: false,
          [dataArrayName]: [...logItmes],
          [compeletedfieldname]: true,
        });
        setalllogsloaded(true);
      }
    }
  }, [logItmes]);*/

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
    if (!sellogTabType || tempStatus.length === 1) {
      setsellogTabType(tempStatus[0].value);
    }
  }, [showDraft, showDeletedLogs]);

  const getallDraftItems = async () => {
    let tempdraftItems;
    let requestParam = {
      RequesterUserId: userProfile.userId,
      isSubmit: false,
    };
    //let draftDataArr = "";
    if (selectedExemptionLog === "zug") {
      tempdraftItems = await getallZUGCount(requestParam);
      //draftDataArr = "ZUGdraftdata";
    } else {
      tempdraftItems = await getallURPMCount(requestParam);
      //draftDataArr = "URPMdraftdata";
    }
    if (tempdraftItems) {
      setshowDraft(true);

      /*setlogsDraftData({
        ...logsDraftData,
        [draftDataArr]: [...tempdraftItems],
      });*/
    } else {
      //setlogsDraftData({ ...logsDraftData, [draftDataArr]: [] });
      setshowDraft(false);
    }
  };
  const getallDeletedItems = async () => {
    let tempdeletedItems;
    //let deletedDataArr = "";
    if (selectedExemptionLog === "zug") {
      tempdeletedItems = await getallZUGCount({
        RequesterUserId: userProfile.userId,
        IsDelete: true,
      });
      //deletedDataArr = "ZUGdeleteddata";
    } else {
      tempdeletedItems = await getallURPMCount({
        RequesterUserId: userProfile.userId,
        IsDelete: true,
      });
      //deletedDataArr = "URPMdeleteddata";
    }
    if (tempdeletedItems) {
      setshowDeletedLogs(true);
      /*setlogsDeletedData({
        ...logsDeletedData,
        [deletedDataArr]: [...tempdeletedItems],
      });*/
    } else {
      setshowDeletedLogs(false);
      /*setlogsDeletedData({
        ...logsDeletedData,
        [deletedDataArr]: [],
      });*/
    }
  };
  const openlogTab = (type) => {
    if (!isLoadingStarted) {
      setsellogTabType(type);
    }
  };
  const fnsetPaginationData = (data) => {
    //if (data.length) {
    setpaginationdata(data);
    //}
  };

  useEffect(() => {
    if (selectedExemptionLog && !dashboardState.status) {
      if (queryparam.id && queryparam.type) {
        handleEdit(this, true, queryparam.type);
        return;
      }
      fnOnLogSpecData();
      getallDraftItems();
      if (userProfile.isAdminGroup) {
        getallDeletedItems();
      }
      pageIndex = 1;
      loadAPIData();
      /*let isStartLoading = false;
      if (selectedExemptionLog === "zug") {
        isStartLoading = logstate.ZUGLoadedAll ? false : true;
      } else {
        isStartLoading = logstate.URPMLoadedAll ? false : true;
      }
      if (isStartLoading) {
        pageIndex = 1;
        totalLogCount = 0;
        setalllogsloaded(false);
        getAllLogsInRecurssion();
      } else {
        let logitems =
          selectedExemptionLog === "zug" ? logstate.ZUGdata : logstate.URPMdata;
        //setpaginationdata(logitems);
        fnsetPaginationData(logitems);
      }*/
      let forminitval =
        selectedExemptionLog === "zug"
          ? formInitialValueZUG
          : formInitialValueURPM;
      setformIntialState(forminitval);
    }
  }, [selectedExemptionLog]);

  useEffect(() => {
    if ((selectedExemptionLog === 'zug' && userProfile?.zugExemptionViewsId && userProfile?.zugExemptionViewsId !== "null") || (selectedExemptionLog === 'urpm' && userProfile?.urpmExemptionViewsId && userProfile?.urpmExemptionViewsId !== 'null')) {
      return
    } else if (sellogTabType && !dashboardState.status && selectedExemptionLog) {
      pageIndex = 1;
      loadAPIData();
    }

    /* let entityNumberArr = [];
    let dataArr = [];
    if (sellogTabType === "draft") {
      dataArr =
        selectedExemptionLog === "zug"
          ? logsDraftData.ZUGdraftdata
          : logsDraftData.URPMdraftdata;
      //setpaginationdata(dataArr);
      fnsetPaginationData(dataArr);
    } else if (sellogTabType === "delete") {
      dataArr =
        selectedExemptionLog === "zug"
          ? logsDeletedData.ZUGdeleteddata
          : logsDeletedData.URPMdeleteddata;
      fnsetPaginationData(dataArr);
    } else {
      if (isfilterApplied) {
        handleFilterSearch();
      } else {
        dataArr =
          selectedExemptionLog === "zug" ? logstate.ZUGdata : logstate.URPMdata;
        //setpaginationdata(dataArr);
        fnsetPaginationData(dataArr);
      }
    }
    if (dataArr?.length) {
      dataArr.forEach((item) => {
        entityNumberArr.push(item.entryNumber);
      });
      entityNumberArr.sort();
      setcommonfilterOpts((prevstate) => ({
        ...prevstate,
        entryNumberOpts: [...entityNumberArr],
      }));
    }*/
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
      reqparam =
        sellogTabType === "draft"
          ? { ...reqparam, isSubmit: false }
          : sellogTabType === "delete"
          ? { ...reqparam, isDelete: true }
          : { ...reqparam, isSubmit: true };

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
  }, [sellogTabType, selectedExemptionLog]);

  useEffect(() => {
    pageIndex = 1;
    pagesize = 10;
    totalLogCount = 0;
    fnOnInit();
  }, []);

  const fnOnInit = async () => {
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
      URPMstatusFilterOpts: [selectInitiVal, ...tempZUGStatus],
      URPMSectionFilterOps: [selectInitiVal, ...tempURPMSection],
      typeOfExemptionOpts: [selectInitiVal, ...tempTypeOfExemption],
    }));
    if (
      countryFilterOpts.length &&
      regionFilterOpts.length &&
      commonfilterOpts.ZUGstatusFilterOpts.length &&
      commonfilterOpts.URPMstatusFilterOpts.length &&
      !dashboardStateApplied
    ) {
      setDashboardFilters();
    }
  };
  
  const [selectedview, setselectedview] = useState(null);
  const [viewData, setViewData] = useState([])
  const [viewResponse, setViewResponse] = useState(false)

  useEffect(()=>{
    handleViews()
    setselectedview(null)
    setViewResponse(false)
  },[selectedExemptionLog])

  useEffect(()=>{
    if (selectedExemptionLog === 'zug' && userProfile?.zugExemptionViewsId && viewResponse && viewData?.length !== 0) {
      onViewFilterSelect( "", userProfile?.zugExemptionViewsId)
    } else if (selectedExemptionLog === 'urpm' && userProfile?.urpmExemptionViewsId && viewResponse && viewData?.length !== 0) {
      onViewFilterSelect( "", userProfile?.urpmExemptionViewsId)
    } else if (viewResponse && ((selectedExemptionLog === 'zug' && userProfile?.zugExemptionViewsId && userProfile?.zugExemptionViewsId !== "null") || (selectedExemptionLog === 'urpm' && userProfile?.urpmExemptionViewsId && userProfile?.urpmExemptionViewsId !== 'null'))) {
      pageIndex = 1;
      loadAPIData();
    }
  },[viewData, sellogTabType, viewResponse])

  useEffect(() => {
    if (selectedview && sellogTabType) {
      handleFilterSearch();
    }
  }, [selectedview, sellogTabType]);

  const onViewFilterSelect = async(name, value) => {
    let selectedViewData = viewData?.filter((item, i) => {
      let id = item.zugExemptionViewsId ? item.zugExemptionViewsId : item.urpmExemptionViewsId
      if (id === value) {
        return item
      }
    })
    if (selectedViewData.length !== 0) {
      let countryArray = []
      if (selectedViewData[0]?.countryID?.length && selectedViewData[0]?.countryID?.length !== 0) {
        let selectedCountryArray = selectedViewData[0]?.countryID?.split(',')
        selectedCountryArray?.map((id, j) => {
            countryState.countryItems.map((item, i) => {
                if (id === item.countryID) {
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
      selectedViewData[0].countryID = countryArray

      let regionArray = []
      if (selectedViewData[0]?.regionId?.length && selectedViewData[0]?.regionId?.length !== 0) {
        let selectedRegionArray = selectedViewData[0]?.regionId?.split(',')
        selectedRegionArray?.map((id, j) => {
            regionState.regionItems.map((item, i) => {
                if (id === item.regionID) {
                    regionArray.push({
                        ...item,
                        label: item.regionName.trim(),
                        value: item.regionID,
                    })
                }
            })
        })
      }
      selectedViewData[0].regionId = regionArray

      setselfilter(selectedViewData[0])
      setselectedview(value);
    } else {
      value = null;
      pageIndex = 1;
      clearFilter();
    }
    if (value === null) {
      setselectedview(value);
    }
    await addEditUserView({LogType: selectedExemptionLog ? selectedExemptionLog : 'zug', UserId: userProfile.userId, ViewId: value})
    let updatedUserProfileData = userProfile
    if (selectedExemptionLog === 'urpm') {
      updatedUserProfileData.urpmExemptionViewsId = value
    } else {
      updatedUserProfileData.zugExemptionViewsId = value
    }
    localStorage.setItem("UserProfile", JSON.stringify(updatedUserProfileData))
  };

  const handleViews = async () => {
    const response = await getViewsByUserId({ RequesterUserId: userProfile.userId, UserViewType: 'exemptionlog', exemptiontype: selectedExemptionLog ? selectedExemptionLog : 'zug'  })
    setViewData(response)
    let viewFilterOpts = []
    response.map((item,i) => {
      viewFilterOpts.push({
        label: item.viewName,
        value: item.zugExemptionViewsId ? item.zugExemptionViewsId : item.urpmExemptionViewsId 
      })
    })
    viewFilterOpts.sort(dynamicSort("label"));
    setcommonfilterOpts((prevstate) => ({
      ...prevstate,
      views: [{ label: "All", value: null }, ...viewFilterOpts],
    }));
    setViewResponse(true)
  }

  useEffect(() => {
    if (
      countryFilterOpts.length &&
      regionFilterOpts.length &&
      commonfilterOpts.ZUGstatusFilterOpts.length &&
      commonfilterOpts.URPMstatusFilterOpts.length &&
      !dashboardStateApplied
    ) {
      setDashboardFilters();
    }
  }, [
    countryFilterOpts,
    regionFilterOpts,
    commonfilterOpts.URPMstatusFilterOpts,
  ]);

  const setDashboardFilters = () => {
    if (dashboardState.status) {
      setisfilterApplied(true);
      let name = "";
      let value = "";
      if (userProfile.isRegionAdmin) {
        let regionopts = userProfile.regionId.split(",");
        let selectedopts = [];
        regionFilterOpts.forEach((regionitem) => {
          regionopts.forEach((item) => {
            if (item === regionitem.value) {
              selectedopts.push(regionitem);
            }
          });
        });
        name = "regionId";
        value = selectedopts;
      }
      if (userProfile.isCountryAdmin || !userProfile.isAdminGroup) {
        let countryopts = userProfile.isCountryAdmin
          ? userProfile.scopeCountryList.split(",")
          : userProfile.profileCountry
          ? [userProfile.profileCountry]
          : [];
        let selectedCountryopts = [];
        countryFilterOpts.forEach((countryitem) => {
          countryopts.forEach((item) => {
            if (item === countryitem.value) {
              selectedCountryopts.push(countryitem);
            }
          });
        });
        name = "countryID";
        value = selectedCountryopts;
      }
      setselfilter((prevfilter) => ({
        ...prevfilter,
        status: dashboardState.status,
        [name]: value,
      }));
      clearDashboardClick();
      setisfilterApplied(true);
      setdashboardStateApplied(true);
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
  useEffect(() => {
    if (dashboardStateApplied && isfilterApplied) {
      debugger;
      getallDraftItems();
      if (userProfile.isAdminGroup) {
        getallDeletedItems();
      }
      handleFilterSearch();
      fnOnLogSpecData();
    }
  }, [dashboardStateApplied]);

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
  const [queryparam, setqueryparam] = useState({
    id: "",
    status: "",
    type: "",
    loaded: false,
  });
  const [queryparamloaded, setqueryparamloaded] = useState(false);
  useEffect(() => {
    let itemid = getUrlParameter("id");
    let status = getUrlParameter("status");
    let type = getUrlParameter("type");
    setqueryparam({ id: itemid, status: status, type: type, loaded: true });
  }, []);

  useEffect(() => {
    if (!queryparam.loaded) {
      return;
    }
    setqueryparamloaded(true);
    if (queryparam.id) {
      if (queryparam.type) {
        setselectedExemptionLog(queryparam.type);
      } else {
        setselectedExemptionLog("zug");
      }
      // handleEdit(this, true, queryparam.type);
    } else {
      if (dashboardState.logType) {
        setselectedExemptionLog(dashboardState.logType);
      } else {
        setselectedExemptionLog("zug");
      }
    }
  }, [queryparam]);

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

  /* Add Edit Delete functionality & show popup*/

  const [isshowAddPopup, setshowAddPopup] = useState(false);
  const [isshowImportLogsPopup, setshowImportLogsPopup] = useState(false);
  const [isDataImported, setisDataImported] = useState(false);
  const history = useHistory()
  const showAddPopup = () => {
    if (showpage) {
      setShowPage(false)
    }
    if (showpage) {
      setShowPage(false)
    }
    setshowAddPopup(true);
    };
    const confirmationPopup = () => {
      setShowPage(true)
    };
  const hideAddPopup = () => {
    setshowAddPopup(false);
    let forminitval =
      selectedExemptionLog === "zug"
        ? formInitialValueZUG
        : formInitialValueURPM;
    setformIntialState(forminitval);
    setisEditMode(false);
    setisReadMode(false);
    if (window.location.search) {
      removeQueryParams()
    }
  };
  const removeQueryParams = () => {
    history.replace({
        pathname: window.location.pathname,
        search: '',
    })
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
      let dataArrayName =
        selectedExemptionLog === "zug" ? "ZUGdata" : "URPMdata";
      let logloaded =
        selectedExemptionLog === "zug" ? "ZUGLoadedAll" : "URPMLoadedAll";
      setlogstate({
        ...logstate,
        loading: true,
        error: "",
        [logloaded]: false,
        [dataArrayName]: [],
        isDataImported: true,
      });
    }
  };
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

  const setInEditMode = () => {
    setisEditMode(true);
    setisReadMode(false);
  };
  const [isEditMode, setisEditMode] = useState(false);
  const [isReadMode, setisReadMode] = useState(false);
  const formInitialValueZUG = {
    countryID: "",
    countryList: [],
    typeOfExemption: "",
    typeOfBusiness: [],
    individualGrantedEmpowerment: "",
    individualGrantedEmpowermentAD: [],
    individualGrantedEmpowermentName: "",
    empowermentRequestedBy: userProfile.emailAddress,
    empowermentRequestedByName:
      userProfile.firstName + " " + userProfile.lastName,
    empowermentRequestedByAD: {
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      userName: userProfile.firstName + " " + userProfile.lastName,
      emailAddress: userProfile.emailAddress,
    },
    approver: "",
    approverAD: {},
    approverName: "",
    lobChapter: "",
    section: "",
    sectionSubject: "",
    empowermentAndFeedbackRequest: "",
    fullTransitional: "",
    transitionalExpireDate: null,
    expiringDate: null,
    pC_URPMExemptionRequired: false,
    additionalApprovalComments: "",
    status: "",
    exmpAttachmentList: [],
    fullFilePath: "",
    exemptionLogType: "",
    isSubmit: false,
    zugChapterVersion: "",
    isActive: true,
    exemptionLogEmailLink: window.location.origin + window.location.pathname,
    isdirty: false,
    isArchived: false,
    ciGuidlineId: "",
    znaSegmentId: "",
    znasbuId: "",
    znasbuList: [],
    marketBasketId: "",
    marketBasketList: [],
    znaProductsId: "",
    znaProductsList: [],
    exemptionDetailForLocalAddendum: ""
  };
  const formInitialValueURPM = {
    countryID: "",
    countryList: [],
    typeOfExemption: "",
    typeOfBusiness: [],
    individualGrantedEmpowerment: "",
    individualGrantedEmpowermentAD: [],
    individualGrantedEmpowermentName: "",
    empowermentRequestedBy: userProfile.emailAddress,
    empowermentRequestedByName:
      userProfile.firstName + " " + userProfile.lastName,
    empowermentRequestedByAD: {
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      userName: userProfile.firstName + " " + userProfile.lastName,
      emailAddress: userProfile.emailAddress,
    },
    approver: "",
    approverAD: {},
    approverName: "",
    section: "",
    sectionSubject: "",
    requestDetails: "",
    expiringDate: null,
    additionalApprovalComments: "",
    status: "",
    exemptionLogType: "",
    exmpAttachmentList: [],
    fullFilePath: "",
    isSubmit: false,
    isActive: true,
    exemptionLogEmailLink: window.location.origin + window.location.pathname,
    isdirty: false,
    isArchived: false,
    ciGuidlineId: "",
    znaSegmentId: "",
    znasbuId: "",
    znasbuList: [],
    marketBasketId: "",
    marketBasketList: [],
    znaProductsId: "",
    znaProductsList: [],
    exemptionDetailForLocalAddendum: ""
  };
  const [formIntialState, setformIntialState] = useState(formInitialValueZUG);

  const handleEdit = async (e, hasqueryparam, type) => {
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
    let response;
    if (selectedExemptionLog === "zug") {
      response = await getByIdZUG({
        zugExemptionLogId: itemid,
      });
    } else {
      response = await getByIdURPM({
        urpmExemptionLogId: itemid,
      });
    }
    if (response) {
      let countryList = response.countryList;
      countryList = countryList.map((country) => ({
        label: country.countryName,
        value: country.countryID,
        regionId: country.regionID,
      }));
      response["countryList"] = [...countryList];

      let businessList = response.typeOfBusinessAD;
      businessList = businessList.map((item) => ({
        label: item.lookUpValue,
        value: item.lookupID,
      }));

      response["typeOfBusiness"] = [...businessList];

      let znasbuList = [];
      znasbuList = response.znasbuList?.map((item) => ({
        label: item.sbuName,
        value: item.znasbuId,
      }));

      response["znasbuList"] = znasbuList ? [...znasbuList] : [];

      let marketBasketList = [];
      marketBasketList = response.marketBasketList?.map((item) => ({
        label: item.marketBasketName,
        value: item.marketBasketId,
      }));

      response["marketBasketList"] = marketBasketList
        ? [...marketBasketList]
        : [];

      let znaProductsList = [];
      znaProductsList = response.znaProductsList?.map((item) => ({
        label: item.znaProductsName,
        value: item.znaProductsId,
      }));

      response["znaProductsList"] = znaProductsList ? [...znaProductsList] : [];

      if (selectedExemptionLog === "zug" || type === "zug") {
        response.approverName = response.approverAD
          ? response.approverAD.userName
          : "";
        response.empowermentRequestedByName = response.empowermentRequestedByAD
          ? response.empowermentRequestedByAD.userName
          : "";
      } else {
        response.approverName = response.approverAD
          ? response.approverAD.userName
          : "";
      }
      if (
        response.individualGrantedEmpowermentAD &&
        response.individualGrantedEmpowermentAD.length
      ) {
        let users = "";
        users = response.individualGrantedEmpowermentAD.map(
          (item) => item.userName
        );
        response.individualGrantedEmpowermentName = users.join(",");
      }
      if (response.exemptionCCAD && response.exemptionCCAD.length) {
        let users = "";
        users = response.exemptionCCAD.map((item) => item.userName);
        response.exemptionCCName = users.join(",");
      }
      if (mode === "edit" && response.isSubmit) {
        setisEditMode(true);
      }
      if (mode === "view") {
        setisReadMode(true);
      }
      if (queryparam.status) {
        response.requestForEmpowermentStatus = queryparam.status;
      }
      setformIntialState({
        ...response,
        isdirty: false,
        exemptionLogEmailLink: window.location.origin + window.location.pathname
      });
      showAddPopup();
    }
  };

  const putItemHandler = async (item) => {
    let tempfullPathArr = item.exmpAttachmentList.map((item) => item.filePath);
    let fullFilePath = tempfullPathArr.join(",");
    item.fullFilePath = fullFilePath;
    let response;
    let datafieldname = selectedExemptionLog === "zug" ? "ZUGdata" : "URPMdata";
    let id =
      selectedExemptionLog === "zug"
        ? "zugExemptionLogId"
        : "urpmExemptionLogId";
    let typeOfBusiness = item.typeOfBusiness.map((item) => item.value);
    let znasbuId = item.znasbuList.map((item) => item.value);
    let marketBasketId = item.marketBasketList.map((item) => item.value);
    let znaProductsId = item.znaProductsList.map((item) => item.value);
    typeOfBusiness = typeOfBusiness.join(",");
    znasbuId = znasbuId ? znasbuId.join(",") : "";
    marketBasketId = marketBasketId ? marketBasketId.join(",") : "";
    znaProductsId = znaProductsId ? znaProductsId.join(",") : "";
    if (selectedExemptionLog === "zug") {
      response = await postItemZUG({
        ...item,
        typeOfBusiness: typeOfBusiness,
        znasbuId: znasbuId,
        marketBasketId: marketBasketId,
        znaProductsId: znaProductsId,
        modifiedByID: userProfile.userId,
      });
    } else {
      response = await postItemURPM({
        ...item,
        typeOfBusiness: typeOfBusiness,
        znasbuId: znasbuId,
        marketBasketId: marketBasketId,
        znaProductsId: znaProductsId,
        modifiedByID: userProfile.userId,
      });
    }

    if (response) {
      alert(alertMessage.exemptionlog.update);

      getallDraftItems();
      onPaginationSort("modifiedDate", "desc");
      hideAddPopup();
      /*let compeletedfieldname =
        selectedExemptionLog === "zug" ? "ZUGLoadedAll" : "URPMLoadedAll";
      if (queryparam.id || !logstate[compeletedfieldname]) {
        window.location = "/exemptionlogs";
      } else {
        //if item is submitted and in edit mode
        let logid = item[id];
        let tempostItem;
        if (selectedExemptionLog === "zug") {
          tempostItem = await getallZUGLogs({
            [id]: logid,
            isSubmit: item.isSubmit,
          });
        } else {
          tempostItem = await getallURPMLogs({
            [id]: logid,
            isSubmit: item.isSubmit,
          });
        }
        if (item.isSubmit) {
          let isfound = false;
          for (let i = 0; i < logstate[datafieldname].length; i++) {
            let listitem = logstate[datafieldname][i];
            if (listitem[id] === item[id]) {
              listitem = { ...listitem, ...tempostItem[0] };
              logstate[datafieldname][i] = listitem;
              isfound = true;
            }
          }
          if (!isfound) {
            logstate[datafieldname].unshift(tempostItem[0]);
          }
        } else {
          //if item is saved and in draft mode
        }
        getallDraftItems();
        hideAddPopup();
      }*/
    }
    setisEditMode(false);
  };
  const postItemHandler = async (item) => {
    let tempfullPathArr = item.exmpAttachmentList.map((item) => item.filePath);
    let fullFilePath = tempfullPathArr.join(",");
    item.fullFilePath = fullFilePath;
    item.exemptionLogType = selectedExemptionLog;
    let response;
    let datafieldname = selectedExemptionLog === "zug" ? "ZUGdata" : "URPMdata";
    let id =
      selectedExemptionLog === "zug"
        ? "zugExemptionLogId"
        : "urpmExemptionLogId";
    let typeOfBusiness = item.typeOfBusiness.map((item) => item.value);
    let znasbuId = item.znasbuList.map((item) => item.value);
    let marketBasketId = item.marketBasketList.map((item) => item.value);
    let znaProductsId = item.znaProductsList.map((item) => item.value);
    typeOfBusiness = typeOfBusiness.join(",");
    znasbuId = znasbuId ? znasbuId.join(",") : "";
    marketBasketId = marketBasketId ? marketBasketId.join(",") : "";
    znaProductsId = znaProductsId ? znaProductsId.join(",") : "";
    if (selectedExemptionLog === "zug") {
      response = await postItemZUG({
        ...item,
        typeOfBusiness: typeOfBusiness,
        znasbuId: znasbuId,
        marketBasketId: marketBasketId,
        znaProductsId: znaProductsId,
        createdByID: userProfile.userId,
        modifiedByID: userProfile.userId,
      });
    } else {
      response = await postItemURPM({
        ...item,
        typeOfBusiness: typeOfBusiness,
        znasbuId: znasbuId,
        marketBasketId: marketBasketId,
        znaProductsId: znaProductsId,
        createdByID: userProfile.userId,
        modifiedByID: userProfile.userId,
      });
    }
    if (response) {
      /*let compeletedfieldname =
        selectedExemptionLog === "zug" ? "ZUGLoadedAll" : "URPMLoadedAll";
      if (queryparam.id || !logstate[compeletedfieldname]) {
        window.location = "/exemptionlogs";
      } else {
        let logid = item[id] ? item[id] : response;
        let tempostItem;
        if (selectedExemptionLog === "zug") {
          tempostItem = await getallZUGLogs({
            [id]: logid,
            isSubmit: item.isSubmit,
          });
        } else {
          tempostItem = await getallURPMLogs({
            [id]: logid,
            isSubmit: item.isSubmit,
          });
        }

        if (item.isSubmit) {
          alert(alertMessage.exemptionlog.add);
          let isfound = false;
          for (let i = 0; i < logstate[datafieldname].length; i++) {
            let listitem = logstate[datafieldname][i];
            if (listitem[id] === item[id]) {
              listitem = { ...listitem, ...tempostItem[0] };
              logstate[datafieldname][i] = listitem;
              isfound = true;
            }
          }
          if (!isfound) {
            logstate[datafieldname].unshift(tempostItem[0]);
          }
        } else {
          alert(alertMessage.exemptionlog.draft);
        }
        //setselfilter(intialFilterState);
        //setisfilterApplied(false);
        //getAllRfeItems();
        getallDraftItems();
        hideAddPopup();
      }*/
      if (item.isSubmit) {
        alert(alertMessage.exemptionlog.add);
      } else {
        alert(alertMessage.exemptionlog.draft);
      }

      onPaginationSort("modifiedDate", "desc");
      getallDraftItems();
      hideAddPopup();
    }
    setisEditMode(false);
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
  const versionHistoryexportDateFields = {
    ExpiringDate: "expiringDate",
    TransitionalExpireDate: "transitionalExpireDate",
    ModifiedDate: "modifiedDate",
    CreatedDate: "createdDate",
  };
  const versionHistoryexportFieldTitlesZUG = {
    EntryNumber: "Entry Number",
    CountryNames: "Country",
    TypeOfExemptionValue: "Type of Exemption",
    TypeOfBusinessValue: "Type of Business",
    IndividualGrantedEmpowermentName: "Individual Granted Empowerment",
    LOBChapterName: "LoB Chapter/Document",
    Section: "Section",
    SectionSubject: "Section Subject",
    ZUGChapterVersion: "ZUG Chapter Version",
    EmpowermentAndFeedbackRequest: "Empowerment request details",
    EmpowermentRequestedByName: "Empowerment Requested By",
    FullTransitionalValue: "Full/Transitional",
    TransitionalExpireDate: "Transitional Expiring Date of Empowerment",
    PC_URPMExemptionRequired: "P&C URPM exemption required",
    ApproverName: "Approver",
    StatusValue: "Status",
    ExpiringDate: "Expiring Date",
    AdditionalApprovalComments: "Additional Approval Comments",
    CreatedDate: "Created Date",
    CreatorName: "Creator Name",
    ModifiedDate: "Modified Date",
    LastModifiorName: "Last Modifier",
    ExemptionLogType: "Exemption Log Type",
    ExemptionLogEmailLink: "Link",
    ImportedBy: "Imported By",
    ciGuidlineId: "Previous Exemption ID",
    ZNASegmentName: "ZNA BU",
    SBUName: "ZNA SBU",
    MarketBasketName: "ZNA Market Basket",
    ZNAProductsName: "ZNA Products",
    ExemptionCCName: "Exemption CC",
    ExemptionDetailForLocalAddendum : "Exemption Detail for local addendum",
  };
  const versionHistoryexportFieldTitlesURPM = {
    EntryNumber: "Entry Number",
    CountryNames: "Country",
    TypeOfExemptionValue: "Type of Exemption",
    TypeOfBusinessValue: "Type of Business",
    IndividualGrantedEmpowermentName: "Individual Granted Empowerment",
    Section: "Section",
    SectionSubject: "Section Subject",
    FullTransitionalValue: "Full/Transitional",
    TransitionalExpireDate: "Transitional Expiring Date of Empowerment",
    ExpiringDate: "Expiring Date",
    RequestDetails: "Empowerment request details",
    ApproverName: "Approver",
    StatusValue: "Status",
    AdditionalApprovalComments: "Additional Approval Comments",
    EmpowermentRequestedByName: "Empowerment Requested By",
    CreatedDate: "Created Date",
    CreatorName: "Creator Name",
    ModifiedDate: "Modified Date",
    LastModifiorName: "Last Modifier",
    ExemptionLogType: "Exemption Log Type",
    ExemptionLogEmailLink: "Link",
    ImportedBy: "Imported By",
    ZNASegmentName: "ZNA BU",
    SBUName: "ZNA SBU",
    MarketBasketName: "ZNA Market Basket",
    ZNAProductsName: "ZNA Products",
    ExemptionCCName: "Exemption CC",
    ExemptionDetailForLocalAddendum : "Exemption Detail for local addendum",
  };
  const versionHistoryexportHtmlFields = [
    "EmpowermentAndFeedbackRequest",
    "AdditionalApprovalComments",
    "RequestDetails",
  ];
  const versionHistoryExcludeFields = {
    ExemptionLogType: "exemptionLogType",
    CreatedDate: "createdDate",
    CreatorName: "creatorName",
    ModifiedDate: "modifiedDate",
    LastModifiorName: "lastModifiorName",
    ExemptionLogEmailLink: "exemptionLogEmailLink",
    EmpowermentRequestedBy: "EmpowermentRequestedBy",
    ZNAProductsId: "ZNAProductsId",
    ZNASBUId: "ZNASBUId",
    ZNASegmentId: "ZNASegmentId",
    MarketBasketId: "MarketBasketId",
    ExemptionCC: "ExemptionCC",
  };
  const hideVersionHistoryPopup = () => {
    setshowVersionHistory(false);
  };
  const handleDataVersion = async (itemid) => {
    let versiondata = await getDataVersion({
      TempId: itemid,
      LogType: selectedExemptionLog,
    });
    setversionHistoryData(versiondata);
    setshowVersionHistory(true);
  };
  const handleOpenSharePointLink = (itemid) => {
    const sharepointlink =
      selectedExemptionLog === "zug"
        ? zuglogSharePointLink
        : urpmlogSharePointLink;
    const link = `${sharepointlink}?ID=${itemid}&isDlg=1`;
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
      link: `${window.location.href}?id=${itemid}&type=${selectedExemptionLog}`,
    });
    setshowCopyLog(true);
  };
  const openShareItem = (itemid, isSubmit) => {
    const link = `${window.location.href}?id=${itemid}&type=${selectedExemptionLog}`;
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
    }
    let dataArrayName, loadedAll, id, draftDataArr, deletedCount, requestParam;
    if (selectedExemptionLog === "zug") {
      dataArrayName = "ZUGdata";
      loadedAll = "ZUGLoadedAll";
      id = "zugExemptionLogId";
      draftDataArr = "ZUGdraftdata";
      deletedCount = "ZUGDeletedlogs";
      requestParam = {
        tempId: itemid,
        logType: "zug",
        isDelete: true,
      };
    } else {
      dataArrayName = "URPMdata";
      loadedAll = "URPMLoadedAll";
      id = "urpmExemptionLogId";
      draftDataArr = "URPMdraftdata";
      deletedCount = "ZUGDeletedlogs";
      requestParam = {
        tempId: itemid,
        logType: "urpm",
        isDelete: true,
      };
    }*/
    let requestParam = {
      tempId: itemid,
      logType: selectedExemptionLog === "zug" ? "zug" : "urpm",
      isDelete: true,
    };
    const response = await deleteLog(requestParam);
    if (response) {
      hidelogPopup();
      //check if log is draft
      /*if (isSubmit) {
        if (logstate[loadedAll]) {
          let tempItems = logstate[dataArrayName]?.filter(
            (item) => itemid !== item[id]
          );
          setlogstate({ ...logstate, [dataArrayName]: [...tempItems] });
          //fnsetPaginationData(tempItems);
        } else {
          //reload items
          setdeletedlogCount({
            ...deletedlogCount,
            [deletedCount]: [deletedCount] + 1,
          });
          let tempItems = logItmes?.filter((item) => itemid !== item[id]);
          setlogItmes((prevstate) => [...tempItems]);
          fnsetPaginationData(logItmes);
        }
      } else {
        const tempdata = logsDraftData[draftDataArr].map(
          (item) => item[id] !== itemid
        );
        setlogsDraftData({
          ...logsDraftData,
          [draftDataArr]: [...tempdata],
        });
        getallDraftItems();
      }*/
      if (!isSubmit) {
        getallDraftItems();
      }
      alert(alertMessage.commonmsg.deleteLog);
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
      logType: selectedExemptionLog === "zug" ? "zug" : "urpm",
      isDelete: false,
    };
    /*let dataArrayName,
      loadedAll,
      id,
      draftDataArr,
      deletedCount,
      requestParam,
      deletedlogarray;
    if (selectedExemptionLog === "zug") {
      dataArrayName = "ZUGdata";
      loadedAll = "ZUGLoadedAll";
      id = "zugExemptionLogId";
      draftDataArr = "ZUGdraftdata";
      deletedlogarray = "ZUGdeleteddata";
      deletedCount = "ZUGDeletedlogs";
      requestParam = {
        tempId: itemid,
        logType: "zug",
        isDelete: false,
      };
    } else {
      dataArrayName = "URPMdata";
      loadedAll = "URPMLoadedAll";
      id = "urpmExemptionLogId";
      draftDataArr = "URPMdraftdata";
      deletedlogarray = "URPMdeleteddata";
      deletedCount = "URPMDeletedlogs";
      requestParam = {
        tempId: itemid,
        logType: "urpm",
        isDelete: false,
      };
    }*/
    const response = await deleteLog(requestParam);
    if (response) {
      alert(alertMessage.commonmsg.restoreLog);
      if (!isSubmit) {
        getallDraftItems();
      }
      getallDeletedItems();
      loadAPIData();
      /*let tempdata = logsDeletedData[deletedlogarray].map(
        (item) => item[id] !== itemid
      );
      setlogsDeletedData({
        ...logsDeletedData,
        [deletedlogarray]: [...tempdata],
      });
      getallDeletedItems();
      alert(alertMessage.commonmsg.restoreLog);
      //get specific log by id
      let tempItem = [];
      if (selectedExemptionLog === "zug") {
        tempItem = await getallZUGLogs({
          [id]: itemid,
          isSubmit: isSubmit,
        });
      } else {
        tempItem = await getallURPMLogs({
          [id]: itemid,
          isSubmit: isSubmit,
        });
      }
      if (isSubmit) {
        if (logstate[loadedAll]) {
          setlogstate({
            ...logstate,
            [dataArrayName]: [...tempItem, ...logstate[dataArrayName]],
          });
          //fnsetPaginationData(tempItems);
        } else {
          //reload items
          if (deletedlogCount) {
            setdeletedlogCount({
              ...deletedlogCount,
              [deletedCount]: [deletedCount] - 1,
            });
          }
          setlogItmes((prevstate) => [...tempItem, ...prevstate]);
          //logItmes.unshift(tempItem[0]);
          //fnsetPaginationData(logItmes);
        }
      } else {
        setlogsDraftData({
          ...logsDraftData,
          [draftDataArr]: [...tempdata],
        });
        getallDraftItems();
      }*/
    }
  };
  const exportReportLogsHandler = async () => {
    let reqParam = {
      RequesterUserId: userProfile.userId,
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
          let value = selfilter[key];
          tempFilterOpts[key] = value;
          if (key === "PC_URPMExemptionRequired") {
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
      };
    }
    try {
      alert(alertMessage.commonmsg.reportDownlaod);
      let responseblob;
      if (selectedExemptionLog === "zug") {
        responseblob = await exportReportZUGLogs(reqParam);
      } else {
        responseblob = await exportReportURPMLogs(reqParam);
      }
      const filename =
        selectedExemptionLog === "zug"
          ? "ExemptionLogCIReport.xlsx"
          : "ExemptionLogURPMReport.xlsx";
      FileDownload(responseblob, filename);
      alert(alertMessage.commonmsg.reportDownlaodComplete);
    } catch (errormsg) {
      console.log(errormsg);
    }
  };
  return (
    <div className="exemptionlog">
      {showpage &&
        <ConfirmPopup
          title={"Are You Sure?"}
          hidePopup={() => setShowPage(false)}
          showPage={showAddPopup}
          itemDetails={`Clicking 'Yes' will create an exemption (generally for a portfolio) to the ZUG Guidelines. To request empowerment for a single account, new product, or new DAA, click on the "RfE Logs" tab in the left menu.`}
        />
      }
      {isshowAddPopup && (
        <AddEditForm
          title={isReadMode ? "View Exemption Log" : "Add/Edit Exemption Log"}
          hideAddPopup={hideAddPopup}
          postItem={postItemHandler}
          putItem={putItemHandler}
          isEditMode={isEditMode}
          isReadMode={isReadMode}
          formIntialState={formIntialState}
          frmCountrySelectOpts={frmCountrySelectOpts}
          userProfile={userProfile}
          setInEditMode={setInEditMode}
          queryparam={queryparam}
          selectedExemptionLog={selectedExemptionLog}
          setExemLogTypeFn={setExemLogTypeFn}
          exemptionlogsType={exemptionlogsType}
          formInitialValueZUG={formInitialValueZUG}
          formInitialValueURPM={formInitialValueURPM}
          handleDataVersion={handleDataVersion}
        ></AddEditForm>
      )}
      {isshowImportLogsPopup && (
        <AddImportLogs
          title={
            selectedExemptionLog === "zug"
              ? "Bulk Import ZUG"
              : "Bulk Import URPM"
          }
          hideImportLogsPopup={hideImportLogsPopup}
          formIntialState={formIntialState}
          selectedExemptionLog={selectedExemptionLog}
          userProfile={userProfile}
          setisDataImported={setisDataImported}
          exportFileName={
            selectedExemptionLog === "zug"
              ? "ExemptionLogCIImportData"
              : "ExemptionLogURPMImportData"
          }
          exportExcludeFields={
            selectedExemptionLog === "zug"
              ? exportExcludeFieldsZUG
              : exportExcludeFieldsURPM
          }
          exportDateFields={exportDateFields}
          exportFieldTitles={
            selectedExemptionLog === "zug"
              ? exportFieldTitlesZUG
              : exportFieldTitlesURPM
          }
          exportHtmlFields={exportHtmlFields}
        />
      )}
      {!isshowAddPopup && !isshowImportLogsPopup && (
        <>
          {/* <div className="page-title">Exemption Log</div> */}
          <div className="">
            <div className="title-rfe">
              <div className="page-title-rfe">Exemption Log</div>
              {commonfilterOpts.views.length > 1 && (
                <div className="title-dropdown-rfe">
                  <FrmSelect
                    title={"Switch view"}
                    name={"switchview"}
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
                          <FrmMultiselect
                            title={"Region"}
                            name={"regionId"}
                            selectopts={regionFilterOpts}
                            handleChange={handleMultiSelectChange}
                            value={selfilter.regionId}
                          />
                        </div>
                        <div className="frm-filter col-md-3">
                          <FrmMultiselect
                            title={"Country"}
                            name={"countryID"}
                            selectopts={countryFilterOpts}
                            handleChange={handleMultiSelectChange}
                            value={selfilter.countryID}
                            isAllOptNotRequired={true}
                          />
                        </div>
                        {selectedExemptionLog === "zug" ? (
                          <div className="frm-filter col-md-3">
                            <FrmSelect
                              title={"LoB Chapter"}
                              name={"LOBChapter"}
                              selectopts={lobChapterFilterOpts}
                              handleChange={onSearchFilterSelect}
                              value={selfilter.LOBChapter}
                            />
                          </div>
                        ) : (
                          <div className="frm-filter col-md-3">
                            <FrmInput
                              title={"Section"}
                              name={"section"}
                              type={"input"}
                              handleChange={onSearchFilterInput}
                              value={selfilter.section}
                            />
                          </div>
                        )}
                      </div>
                      <div className="row">
                        <div className="frm-filter col-md-3">
                          <FrmSelect
                            title={"Type of Exemption"}
                            name={"typeOfExemption"}
                            selectopts={commonfilterOpts.typeOfExemptionOpts}
                            handleChange={onSearchFilterSelect}
                            value={selfilter.typeOfExemption}
                          />
                        </div>
                        <div className="frm-filter col-md-3">
                          <FrmInputAutocomplete
                            title={"Individual Granted Empowerment"}
                            name={"individualGrantedEmpowerment"}
                            type={"input"}
                            handleChange={onSearchFilterInputAutocomplete}
                            value={selfilter.individualGrantedEmpowerment}
                            options={
                              commonfilterOpts.individualGrantedEmpowermentOpts
                            }
                          />
                        </div>
                        <div className="frm-filter col-md-3">
                          <FrmInputAutocomplete
                            title={"Approver"}
                            name={"approver"}
                            type={"input"}
                            handleChange={onSearchFilterInputAutocomplete}
                            value={selfilter.approver}
                            options={commonfilterOpts.approverOpts}
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
                            title={"Status"}
                            name={"status"}
                            selectopts={
                              selectedExemptionLog === "zug"
                                ? commonfilterOpts.ZUGstatusFilterOpts
                                : commonfilterOpts.URPMstatusFilterOpts
                            }
                            handleChange={onSearchFilterSelect}
                            value={selfilter.status}
                          />
                        </div>
                      </div>
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
                          {selectedExemptionLog === "zug" && (
                            <div className="frm-filter col-md-3">
                              <FrmInput
                                title={"ZUG Chapter Version"}
                                name={"zugChapterVersion"}
                                type={"input"}
                                handleChange={onSearchFilterInput}
                                value={selfilter.zugChapterVersion}
                              />
                            </div>
                          )}

                          <div className="frm-filter col-md-3">
                            <FrmInputAutocomplete
                              title={"Empowerment Requested By"}
                              name={"empowermentRequestedBy"}
                              type={"input"}
                              handleChange={onSearchFilterInputAutocomplete}
                              value={selfilter.empowermentRequestedBy}
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
                        </div>
                        <div className="row">
                          {selectedExemptionLog === "zug" && (
                            <>
                              <div className="frm-filter col-md-3">
                                <FrmInput
                                  title={"Previous Exemption ID"}
                                  name={"ciGuidlineId"}
                                  type={"input"}
                                  handleChange={onSearchFilterInput}
                                  value={selfilter.ciGuidlineId}
                                />
                              </div>
                              <div className="frm-filter col-md-3">
                                <FrmSelect
                                  title={"P&C URPM exemption required"}
                                  name={"PC_URPMExemptionRequired"}
                                  selectopts={yesnoopts}
                                  handleChange={onSearchFilterSelect}
                                  value={selfilter.PC_URPMExemptionRequired}
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
          {!alllogsloaded && (
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div className="progress-color"></div>
              </div>
              <div className="progress-completion">Loading logs...</div>
            </div>
          )}
          <div style={{ paddingLeft: "20px" }}>
            <div className="frm-filter">
              <FrmRadio
                title={"Exemption Log Type"}
                name={"exemptionLogType"}
                selectopts={exemptionlogsType}
                handleChange={onExemptionlogSelection}
                value={selectedExemptionLog}
                isdisabled={!alllogsloaded}
              />
            </div>
          </div>
          <div className="tabs-container">
            {logTypes.map((item) => (
              <div
                key={item.label}
                className={`tab-btn ${
                  sellogTabType === item.value ? "selected" : "normal"
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
                  id={
                    selectedExemptionLog === "zug"
                      ? "zugExemptionLogId"
                      : "urpmExemptionLogId"
                  }
                  column={
                    selectedExemptionLog === "zug" ? columnsZUG : columnsURPM
                  }
                  data={paginationdata}
                  pageno={pageIndex}
                  pagesize={pagesize}
                  totalItems={totalLogCount}
                  showAddPopup={confirmationPopup}
                  showImportLogsPopup={showImportLogsPopup}
                  defaultSorted={defaultSorted}
                  isExportReport={true}
                  isImportLogs={userProfile.isAdminGroup ? true : false}
                  importLogsTitle={
                    selectedExemptionLog === "zug"
                      ? "Import ZUG"
                      : "Import URPM"
                  }
                  exportReportTitle={"Export"}
                  exportFileName={
                    selectedExemptionLog === "zug"
                      ? "ExemptionLogCIReport"
                      : "ExemptionLogURPMReport"
                  }
                  exportReportLogsHandler={exportReportLogsHandler}
                  buttonTitle={"New"}
                  hidesearch={true}
                  exportExcludeFields={
                    selectedExemptionLog === "zug"
                      ? exportExcludeFieldsZUG
                      : exportExcludeFieldsURPM
                  }
                  exportDateFields={exportDateFields}
                  exportFieldTitles={
                    selectedExemptionLog === "zug"
                      ? exportFieldTitlesZUG
                      : exportFieldTitlesURPM
                  }
                  exportHtmlFields={exportHtmlFields}
                  exportCapitalField={exportCapitalField}
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
        <VersionHistoryPopup
          versionHistoryData={versionHistoryData}
          hidePopup={hideVersionHistoryPopup}
          exportFieldTitles={
            selectedExemptionLog === "zug"
              ? versionHistoryexportFieldTitlesZUG
              : versionHistoryexportFieldTitlesURPM
          }
          exportDateFields={versionHistoryexportDateFields}
          exportHtmlFields={versionHistoryexportHtmlFields}
          versionHistoryExcludeFields={versionHistoryExcludeFields}
          isDraft={sellogTabType === "draft" ? true : false}
        />
      ) : (
        ""
      )}
      {showShareLog ? (
        <ShareItem
          title={"Share a Exemption Link"}
          hidePopup={hidelogPopup}
          itemDetails={shareitemDetails}
          logtype={"Exemption"}
          userProfile={userProfile}
        />
      ) : (
        ""
      )}
      {showDeleteLog ? (
        <DeleteItem
          title={"Delete Exemption Entry"}
          deleteItem={handleDeleteItem}
          hidePopup={hidelogPopup}
          itemDetails={shareitemDetails}
        />
      ) : (
        ""
      )}
      {showCopyLog ? (
        <CopyItem
          title={"Copy a Exemption Link"}
          hidePopup={hidelogPopup}
          itemDetails={shareitemDetails}
        />
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
  getViewsByUserId: userViewActions.getViewsByUserId,
  addEditUserView: commonActions.addEditUserView
};

export default connect(mapStateToProp, mapActions)(Exemptionlog);
