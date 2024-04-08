import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  breachlogActions,
  userActions,
  countryActions,
  regionActions,
  lookupActions,
  segmentActions,
  lobActions,
  sublobActions,
  commonActions,
  dashboardActions,
  officeActions,
  znaorgnization1Actions,
  znaorgnization2Actions,
  znaorgnization3Actions,
  userViewActions,
} from "../../actions";
import Loading from "../common-components/Loading";
import useSetNavMenu from "../../customhooks/useSetNavMenu";
import FrmSelect from "../common-components/frmselect/FrmSelect";
import FrmMultiselect from "../common-components/frmmultiselect/FrmMultiselect";
import FrmToggleSwitch from "../common-components/frmtoggelswitch/FrmToggleSwitch";
import PaginationData from "../common-components/PaginationData";
import Pagination from "../common-components/pagination/Pagination";
import {
  alertMessage,
  dynamicSort,
  formatDate,
  getUrlParameter,
  isEmptyObjectKeys,
  isDateInRange,
  isNotEmptyValue,
} from "../../helpers";
import {
  BREACH_LOG_STATUS,
  SHAREPOINT_LINKS,
  REGION_EMEA,
  REGION_ZNA,
} from "../../constants";
import AddEditForm from "./AddEditForm";
import AddImportLogs from "./AddImportLogs";
import FrmInput from "../common-components/frminput/FrmInput";
import FrmInputAutocomplete from "../common-components/frminputautocomplete/FrmInputAutocomplete";
import FrmDatePicker from "../common-components/frmdatepicker/FrmDatePicker";
import moment from "moment";
import CustomToolTip from "../common-components/tooltip/CustomToolTip";
import parse from "html-react-parser";
import VersionHistoryPopup from "../versionhistorypopup/VersionHistoryPopup";
import MoreActions from "../common-components/moreactions/MoreActions";
import ShareItem from "../common-components/shareitem/ShareItem";
import DeleteItem from "../common-components/deleteItem/DeleteItem";
import CopyItem from "../common-components/copyitem/CopyItem";
import { handlePermission } from "../../permissions/Permission";

let pageIndex = 1;
let pagesize = 10;
let totalLogCount = 0;
function Breachlog({ ...props }) {
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
    getallLogs,
    getallDeletedLogs,
    getActionResponsible,
    getallCount,
    getAllCountry,
    getAllRegion,
    getAlllob,
    getAllSublob,
    getAllSegment,
    getById,
    getLookupByType,
    postItem,
    userProfile,
    sendLogNotification,
    getDataVersion,
    deleteLog,
    getLogUsers,
    getAllEntryNumbers,
    clearDashboardClick,
    getAllOffice,
    getallZNASegments,
    getallZNASBU,
    getallZNAMarketBasket,
    exportReportLogs,
    getViewsByUserId,
    addEditUserView
  } = props;

  useSetNavMenu(
    {
      currentMenu: "Breachlog",
      isSubmenu: false,
    },
    props.menuClick
  );

  const [logstate, setlogstate] = useState({
    loading: true,
    error: "",
    data: [],
    loadedAll: false,
    isDataImported: false,
  });
  const breachlogSharePointLink = SHAREPOINT_LINKS.Breachlog;
  const FileDownload = require("js-file-download");
  const [logsDraftData, setlogsDraftData] = useState([]);
  const [logsDeletedData, setlogsDeletedData] = useState([]);
  //initialize filter/search functionality

  const selectInitiVal = {
    label: "Select",
    value: "",
  };

  const exportExcludeFields = [
    "breachLogID",
    "regionId",
    "countryId",
    "customerSegment",
    "lobid",
    "classification",
    "typeOfBreach",
    "rootCauseOfTheBreach",
    "natureOfBreach",
    "rangeOfFinancialImpact",
    "financialImpactDescription",
    "howDetected",
    "breachStatus",
    "createdByID",
    "modifiedByID",
    "totalCount",
    "sublobid",
    "isSubmit",
    "znaSegmentId",
    "znasbuId",
    "marketBasketId",
    "businessDivision",
    "isArchived",
    "globalBreachLogURL",
    "actionResponsible",
    "office",
    "breachCC",
  ];
  const exportDateFields = {
    dateBreachOccurred: "dateBreachOccurred",
    dueDate: "dueDate",
    originalDueDate: "originalDueDate",
    dateActionClosed: "dateActionClosed",
    createdDate: "createdDate",
    modifiedDate: "modifiedDate",
    dateIdentified: "dateIdentified",
    importedDate: "importedDate",
  };
  const exportFieldTitles = {
    entityNumber: "Entity Number",
    title: "Title",
    countryName: "Country",
    regionName: "Region",
    customerSegmentName: "Customer Segment",
    znaSegmentName: "ZNA BU",
    sbuName: "ZNA SBU",
    marketBasketName: "ZNA Market Basket",
    lobName: "LoB",
    subLOBName: "Sub LoB",
    classificationValue: "Classification",
    typeOfBreachValue: "Type Of Breach",
    rootCauseOfTheBreachValue: "Root Cause of the Breach",
    natureOfBreachValue: "Nature of Breach",
    materialBreach: "Material Breach",
    dateBreachOccurred: "Date Breach Occurred",
    breachDetails: "Breach Details",
    rangeOfFinancialImpactValue: "Range of financial impact",
    financialImpactDescription: "Financial impact description",
    howDetectedValue: "How detected",
    howDetectedMoreInfo: "Additional information 'How detected'",
    nearMisses: "Near Misses",
    uwrInvolved: "UWr involved",
    /*businessDivision: "Business Division",*/
    dateIdentified: "Date Identified",
    office: "office",
    policyName: "Policy name",
    policyNumber: "Policy number",
    turNumber: "UQA Review ID",
    actionResponsibleName: "Action Responsible",
    dueDate: "Due Date",
    originalDueDate: "Original Due Date",
    actionPlan: "Action Plan",
    breachStatusValue: "Breach Status",
    dateActionClosed: "Date Action Closed",
    actionUpdate: "Action Update",
    createdDate: "Created Date",
    creatorName: "Creator",
    lastModifiorName: "Modified By",
    breachLogEmailLink: "Link",
    importedBy: "Imported By",
    importedDate: "Imported Date",
    breachCCName: "breach CC",
  };
  const exportHtmlFields = ["breachDetails", "actionPlan", "actionUpdate"];
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
    views: [{ label: "All", value: null }],
  });
  const [countryFilterOpts, setcountryFilterOpts] = useState([]);
  const [countryAllFilterOpts, setcountryAllFilterOpts] = useState([]);
  const [regionFilterOpts, setregionFilterOpts] = useState([]);
  const [regionOptsAll, setregionOptsAll] = useState([]);
  const [segmentFilterOpts, setsegmentFilterOpts] = useState([]);
  const [lobFilterOpts, setlobFilterOpts] = useState([]);
  const [org2FilterOptsAllOpts, setorg2FilterOptsAllOpts] = useState([]);
  const [org3FilterOptsAllOpts, setorg3FilterOptsAllOpts] = useState([]);
  const intialFilterState = {
    entityNumber: "",
    title: "",
    classification: "",
    group: "",
    customersegment: "",
    natureofbreach: "",
    lobid: "",
    actionResponsible: "",
    entries: "",
    regionId: [],
    countryId: [],
    status: "",
    breachStatus: "",
    sublobid: "",
    typeOfBreach: "",
    materialBreach: "",
    nearMisses: "",
    howDetected: "",
    rootCauseOfTheBreach: "",
    rangeOfFinancialImpact: "",
    creatorName: "",
    BreachOccurredFromDate: "",
    BreachOccurredToDate: "",
    ActionClosedFromDate: "",
    ActionClosedToDate: "",
    createdFromDate: "",
    createdToDate: "",
    dueFromDate: "",
    dueToDate: "",
    UWRInvolvedName: "",
    policyName: "",
    policyNumber: "",
    turNumber: "",
    office: "",
    IdentifiedToDate: "",
    IdentifiedFromDate: "",
    znaSegmentId: "",
    znasbuId: "",
    marketBasketId: "",
  };
  const [selfilter, setselfilter] = useState(intialFilterState);
  const [isfilterApplied, setisfilterApplied] = useState(false);
  const [dashboardStateApplied, setdashboardStateApplied] = useState(false);
  const [isAdvfilterApplied, setisAdvfilterApplied] = useState(false);
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
      setregionFilterOpts([...regionOpts]);
      setselfilter({
        ...selfilter,
        [name]: value,
        regionId: regionOpts[0].value,
      });
    } else if (name === "countryId" && value === "") {
      setregionFilterOpts([...regionOptsAll]);
      setselfilter({
        ...selfilter,
        [name]: value,
        regionId: "",
      });
    }*/
  };
  const handleMultiSelectChange = (name, value) => {
    if (name === "regionId") {
      let countryopts = [...selfilter.countryId];
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
      setselfilter({
        ...selfilter,
        [name]: value,
        regionId: regionOpts,
      });
    }
  };
  useEffect(() => {
    if (selfilter.regionId !== REGION_ZNA) {
      setselfilter((prevstate) => ({
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
    } else if (selfilter.customersegment && selfilter.regionId === REGION_ZNA) {
      setselfilter((prevstate) => ({
        ...prevstate,
        customersegment: "",
      }));
    }
    if (
      isNotEmptyValue(selfilter.nearMisses) &&
      selfilter.regionId !== REGION_EMEA
    ) {
      setselfilter((prevstate) => ({
        ...prevstate,
        nearMisses: "",
      }));
    }
  }, [selfilter.regionId]);

  const handleFilterSearch = () => {
    if (!isEmptyObjectKeys(selfilter)) {
      /*let dataArr;
      if (sellogTabType === "draft") {
        dataArr = logsDraftData;
      } else if (sellogTabType === "delete") {
      } else {
        dataArr = logstate.data;
      }
      let tempdata = [...dataArr];
      tempdata = tempdata.filter((item) => {
        let isShow = true;
        if (
          isShow &&
          selfilter.entityNumber.trim() !== "" &&
          item.entityNumber &&
          item.entityNumber
            .toLowerCase()
            .indexOf(selfilter.entityNumber.toLowerCase()) === -1
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.title.trim() !== "" &&
          !item.title.toLowerCase().includes(selfilter.title.toLowerCase())
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.classification !== "" &&
          selfilter.classification !== item.classification
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.customersegment !== "" &&
          selfilter.customersegment !== item.customerSegment
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.natureofbreach !== "" &&
          item.natureOfBreach !== selfilter.natureofbreach
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.lobid !== "" &&
          item.lobid !== selfilter.lobid
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.actionResponsible !== "" &&
          (item.actionResponsibleName
            ?.toLowerCase()
            .indexOf(selfilter.actionResponsible.toLocaleLowerCase()) === -1 ||
            !item.actionResponsibleName)
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.regionId !== "" &&
          item.regionId !== selfilter.regionId
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.countryId !== "" &&
          item.countryId !== selfilter.countryId
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.breachStatus !== "" &&
          item.breachStatus !== selfilter.breachStatus
        ) {
          isShow = false;
        }
        if (isShow && selfilter.entries !== "") {
          if (
            selfilter.entries === "My Entries" &&
            item.createdByID !== userProfile.userId
          ) {
            isShow = false;
          }
        }
        if (
          isShow &&
          selfilter.sublobid !== "" &&
          item.sublobid !== selfilter.sublobid
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.typeOfBreach !== "" &&
          item.typeOfBreach !== selfilter.typeOfBreach
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.materialBreach !== "" &&
          item.materialBreach !== Boolean(parseInt(selfilter.materialBreach))
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.nearMisses !== "" &&
          item.nearMisses !== Boolean(parseInt(selfilter.nearMisses))
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.howDetected !== "" &&
          item.howDetected !== selfilter.howDetected
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.rootCauseOfTheBreach !== "" &&
          item.rootCauseOfTheBreach !== selfilter.rootCauseOfTheBreach
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.rangeOfFinancialImpact !== "" &&
          item.rangeOfFinancialImpact !== selfilter.rangeOfFinancialImpact
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.creatorName !== "" &&
          (item.creatorName
            ?.toLowerCase()
            .indexOf(selfilter.creatorName.toLocaleLowerCase()) === -1 ||
            !item.creatorName)
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.dateBreachOccurredFrom &&
          selfilter.dateBreachOccurredTo
        ) {
          if (
            !item.dateBreachOccurred ||
            !isDateInRange(
              item.dateBreachOccurred,
              selfilter.dateBreachOccurredFrom,
              selfilter.dateBreachOccurredTo
            )
          ) {
            isShow = false;
          }
        }
        if (isShow && selfilter.dueDateFrom && selfilter.dueDateTo) {
          if (
            !item.dueDate ||
            !isDateInRange(
              item.dueDate,
              selfilter.dueDateFrom,
              selfilter.dueDateTo
            )
          ) {
            isShow = false;
          }
        }
        if (
          isShow &&
          selfilter.dateActionClosedFrom &&
          selfilter.dateActionClosedTo
        ) {
          if (
            !item.dateActionClosed ||
            !isDateInRange(
              item.dateActionClosed,
              selfilter.dateActionClosedFrom,
              selfilter.dateActionClosedTo
            )
          ) {
            isShow = false;
          }
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
        if (
          isShow &&
          selfilter.uwrInvolvedName !== "" &&
          (item.uwrInvolvedName
            ?.toLowerCase()
            .indexOf(selfilter.uwrInvolvedName.toLocaleLowerCase()) === -1 ||
            !item.uwrInvolvedName)
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.policyName?.trim() !== "" &&
          !item.policyName
            ?.toLowerCase()
            .includes(selfilter.policyName?.toLowerCase())
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.policyNumber?.trim() !== "" &&
          !item.policyNumber
            ?.toLowerCase()
            .includes(selfilter.policyNumber?.toLowerCase())
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.turNumber?.trim() !== "" &&
          !item.turNumber
            ?.toLowerCase()
            .includes(selfilter.turNumber?.toLowerCase())
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.office !== "" &&
          item.office !== selfilter.office
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.znaSegmentId !== "" &&
          item.znaSegmentId !== selfilter.znaSegmentId
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.znasbuId !== "" &&
          item.znasbuId !== selfilter.znasbuId
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.marketBasketId !== "" &&
          item.marketBasketId !== selfilter.marketBasketId
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.dateIdentifiedFrom &&
          selfilter.dateIdentifiedTo
        ) {
          if (
            !item.dateIdentified ||
            !isDateInRange(
              item.dateIdentified,
              selfilter.dateIdentifiedFrom,
              selfilter.dateIdentifiedTo
            )
          ) {
            isShow = false;
          }
        }
        return isShow;
      });*/
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
    /*let dataArr;
    if (sellogTabType === "draft") {
      dataArr = logsDraftData;
    } else {
      dataArr = logstate.data;
    }
    //setpaginationdata(dataArr);
    fnsetPaginationData(dataArr);
    // getAllBreachItems();*/
  };

  useEffect(() => {
    //on clear filter load data
    if (isNotEmptyValue(isfilterApplied) && isfilterApplied === false) {
      pageIndex = 1;
      loadAPIData();
    }
  }, [isfilterApplied]);

  const checkDueDatePriority = (row) => {
    let priorityCls = "";
    let dueDate = moment(row.dueDate);
    let currentDate = moment();
    if (row.breachStatus === BREACH_LOG_STATUS.Close) {
      currentDate = row.dateActionClosed ? row.dateActionClosed : currentDate;
    }
    let duedatediff = dueDate.diff(currentDate, "days");
    if (row.breachStatus === BREACH_LOG_STATUS.Close) {
      if (duedatediff >= 0) {
        priorityCls = "green";
      } else {
        priorityCls = "red";
      }
    } else {
      if (duedatediff > 30) {
        priorityCls = "green";
      } else if (duedatediff <= 30 && duedatediff >= 1) {
        priorityCls = "amber";
      } else {
        priorityCls = "red";
      }
    }
    return priorityCls;
  };
  //set pagination data and functionality
  const [isPaginationSort, setisPaginationSort] = useState(false);
  const [selSortFiled, setselSortFiled] = useState({
    name: "modifiedDate",
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
  //const [data, setdata] = useState([]);
  const [paginationdata, setpaginationdata] = useState([]);
  const [exportData, setexportData] = useState([{ columns: [], data: [] }]);
  const [logTypes, setlogTypes] = useState([]);
  const [sellogTabType, setsellogTabType] = useState("");
  const columns = [
    {
      dataField: "duedate-priority",
      text: "",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        let priorityCls = checkDueDatePriority(row);

        return (
          <div
            className={`duedate-priority-icon ${priorityCls}`}
            rowid={row.breachLogID}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "25px",
          textAlign: "center",
        };
      },
    },
    handlePermission(window.location.pathname.slice(1), "isEdit") &&
    sellogTabType !== "delete"
      ? {
          dataField: "editaction",
          text: "Edit",
          formatter: (cell, row, rowIndex, formatExtraData) => {
            return (
              <div
                className="edit-icon"
                onClick={handleEdit}
                rowid={row.breachLogID}
                mode={"edit"}
              ></div>
            );
          },
          sort: false,
          headerStyle: (colum, colIndex) => {
            return {
              width: "60px",
              textAlign: "center",
            };
          },
        }
      : handlePermission(window.location.pathname.slice(1), "isEdit") && {
          dataField: "editaction",
          text: "Restore",
          formatter: (cell, row, rowIndex, formatExtraData) => {
            return (
              <div
                className="restore-icon"
                onClick={() => handleRestoreItem(row.breachLogID, row.isSubmit)}
                rowid={row.breachLogID}
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
            rowid={row.breachLogID}
            mode={"view"}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "60px",
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
            onClick={() => handleDataVersion(row.breachLogID, row.isSubmit)}
            rowid={row.breachLogID}
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
                  rowid={row.breachLogID}
                  isSubmit={row.isSubmit}
                  handleCopyItem={handleCopyItem}
                  handleShareItem={openShareItem}
                  handleDeleteItem={openDeleteItem}
                  userProfile={userProfile}
                  isDelete={userProfile?.isAdminGroup ? true : false}
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
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "",
      text: "Title",
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
                          <b>Breach Details</b>
                          <br></br>
                          {row.breachDetails ? parse(row.breachDetails) : ""}
                        </div>
                      </td>
                      <td>
                        <div className="tooltip-content">
                          <b>Action Plan</b>
                          <br></br>
                          {row.actionPlan ? parse(row.actionPlan) : ""}
                        </div>
                      </td>
                    </tr>
                  </table>
                </>
              }
              direction="right"
            >
              <div className="breach-title" rowid={row.breachLogID}>
                {row.title}
              </div>
            </CustomToolTip>
          </>
        );
      },
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "regionName",
      text: "Region",
      sort: true,
      onSort: (field, order) => {
        if (
          field &&
          (selSortFiled.name !== field || selSortFiled.order !== order)
        ) {
          onPaginationSort(field, order);
        }
      },
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "countryName",
      text: "Country",
      sort: true,
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
    },
    {
      dataField: "lobName",
      text: "LoB",
      sort: true,
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
    },
    {
      dataField: "classificationValue",
      text: "Classification",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "typeOfBreachValue",
      text: "Type of Breach",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "natureOfBreachValue",
      text: "Nature of Breach",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "materialBreach",
      text: "Material breach",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{row.materialBreach ? "Yes" : "No"}</span>;
      },
    },
    {
      dataField: "howDetectedValue",
      text: "How detected",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "originalDueDate",
      text: "Original Due Date",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <span>
            {row.originalDueDate
              ? formatDate(row.originalDueDate)
              : row.dueDate
              ? formatDate(row.dueDate)
              : ""}
          </span>
        );
      },
    },
    {
      dataField: "customerSegmentName",
      text: "Customer Segment",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "subLOBName",
      text: "Sub-LoB",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "rootCauseOfTheBreachValue",
      text: "Root Cause of the Breach",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "dateBreachOccurred",
      text: "Date Breach Occurred",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <span>
            {row.dateBreachOccurred ? formatDate(row.dateBreachOccurred) : ""}
          </span>
        );
      },
    },
    {
      dataField: "rangeOfFinancialImpactValue",
      text: "Range of financial impact",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "nearMisses",
      text: "Near Misses",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "creatorName",
      text: "Created By",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "actionResponsibleName",
      text: "Action Responsible",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "breachStatusValue",
      text: "Status",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      },
    },
    {
      dataField: "dateActionClosed",
      text: "Date Action Closed",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
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
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
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
            onClick={() => handleOpenSharePointLink(row.entityNumber)}
          >
            link
          </span>
        ) : (
          ""
        );
      },
    },
    {
      dataField: "uwrInvolvedName",
      text: "UWr involved",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "policyName",
      text: "Policy name",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "policyNumber",
      text: "Policy number",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "turNumber",
      text: "UQA Review ID",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "officeName",
      text: "Office",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
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
      text: "ZNA Market Basket",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "dateIdentified",
      text: "Date Identified",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
  ];
  const defaultSorted = [
    {
      dataField: "modifiedDate",
      order: "desc",
    },
  ];

  //load logs data in recurrsive
  const [logItmes, setlogItmes] = useState([]);
  //const [pagesize, setpagesize] = useState(10);
  const [alllogsloaded, setalllogsloaded] = useState(false);
  const [isLoadingStarted, setisLoadingStarted] = useState(false);
  const [deletedlogCount, setdeletedlogCount] = useState(0);

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
          if (key === "materialBreach") {
            tempFilterOpts[key] = value === "1" ? true : false;
          }
          if (key === "countryId" || key === "regionId") {
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
      /*let tempItems;
      if (sellogTabType === "delete") {
        tempItems = await getallDeletedLogs(reqParam);
      } else {
        tempItems = await getallLogs(reqParam);
      }
      totalLogCount = tempItems.length && tempItems[0].totalCount;
      setlogItmes([...tempItems]);*/
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

  useEffect(() => {
    const getAllLogs = async () => {
      pageIndex = 1;
      pagesize = 10;
      //totalLogCount = await getallCount({});
      getallDraftItems();
      if (userProfile.isAdminGroup) {
        getallDeletedItems();
      }
      //getAllLogsInRecurssion();
    };
    getAllLogs();
  }, []);

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
    let tempdraftItems = await getallCount({
      RequesterUserId: userProfile.userId,
      isSubmit: false,
    });
    if (tempdraftItems) {
      setshowDraft(true);
      //setlogsDraftData([...tempdraftItems]);
    } else {
      // setlogsDraftData([]);
      setshowDraft(false);
    }
  };

  const getallDeletedItems = async () => {
    let tempItems = await getallCount({
      RequesterUserId: userProfile.userId,
      IsDelete: true,
    });
    /*let tempItems = await getallDeletedLogs({
      RequesterUserId: userProfile.userId,
    });*/
    if (tempItems) {
      setshowDeletedLogs(true);
      //setlogsDeletedData([...tempItems]);
    } else {
      setshowDeletedLogs(false);
      //setlogsDeletedData([]);
    }
  };
  const openBreachlogTab = (type) => {
    setsellogTabType(type);
  };
  useEffect(() => {
    //setselfilter(intialFilterState);
    //setisfilterApplied(false);
    /*if (isfilterApplied) {
      handleFilterSearch();
    } else {
      if (sellogTabType === "draft") {
        //setpaginationdata(logsDraftData);
        fnsetPaginationData(logsDraftData);
      } else if (sellogTabType === "delete") {
        fnsetPaginationData(logsDeletedData);
      } else {
        //setpaginationdata(logstate.data);
        fnsetPaginationData(logstate.data);
      }
    }*/

    if (sellogTabType && !dashboardState.status) {
      pageIndex = 1;
      loadAPIData();
    }
  }, [sellogTabType]);

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
    /* let tempNatureOfBreach = await getLookupByType({
      LookupType: "BreachNature",
    });
    let tempStatus = await getLookupByType({
      LookupType: "BreachStatus",
    });
    let tempTypeOfBreach = await getLookupByType({
      LookupType: "BreachType",
    });
    let tempRootCauseBreach = await getLookupByType({
      LookupType: "BreachRootCause",
    });
    let tempRangeFinImpact = await getLookupByType({
      LookupType: "BreachFinancialRange",
    });
    let tempHowDetected = await getLookupByType({
      LookupType: "BreachDetection",
    });*/

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
      setisfilterApplied(true);
      setselfilter((prevfilter) => ({
        ...prevfilter,
        breachStatus: dashboardState.status,
      }));
      clearDashboardClick();
      setdashboardStateApplied(true);
    }
    handleViews();
  };

  const [selectedview, setselectedview] = useState(null);
  const [viewData, setViewData] = useState([])

  useEffect(()=>{
    if (userProfile?.breachViewsId && viewData.length !== 0) {
      onViewFilterSelect( "", userProfile?.breachViewsId)
    }
  },[viewData])

  useEffect(() => {
      handleFilterSearch();
  }, [selectedview]);

  const onViewFilterSelect = async(name, value) => {
    let selectedViewData = viewData.filter((item, i) => {
      if (item.breachViewsId === value) {
        return item
      }
    })
    if (selectedViewData.length !== 0) {
      selectedViewData[0].entityNumber = selectedViewData[0]?.entryNumber
      delete selectedViewData[0]?.entryNumber
      let selectedCountryArray = selectedViewData[0]?.countryId.split(',')
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
      selectedViewData[0].countryId = countryArray

      let selectedRegionArray = selectedViewData[0]?.regionId.split(',')
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
      selectedViewData[0].regionId = regionArray
      selectedViewData[0].materialBreach = selectedViewData[0].materialBreach === true ? '1' : '0'
      setselfilter(selectedViewData[0])
      setselectedview(value);
    }
    if (value === null) {
      setselectedview(value);
      clearFilter()
    }
    await addEditUserView({LogType: 'breachlogs', UserId: userProfile.userId, ViewId: value})
    let updatedUserProfileData = userProfile
    updatedUserProfileData.breachViewsId = value
    localStorage.setItem("UserProfile", JSON.stringify(updatedUserProfileData))
  };

  const handleViews = async () => {
    const response = await getViewsByUserId({ RequesterUserId: userProfile.userId, UserViewType: 'breachlog' })
    setViewData(response)
    let viewFilterOpts = []
    response.map((item,i) => {
      viewFilterOpts.push({
        label: item.viewName,
        value: item.breachViewsId
      })
    })
    viewFilterOpts.sort(dynamicSort("label"));
    setcommonfilterOpts((prevstate) => ({
      ...prevstate,
      views: [{ label: "All", value: null }, ...viewFilterOpts],
    }));
  }

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
    let tempItems = segmentState.segmentItems.map((item) => ({
      label: item.segmentName,
      value: item.segmentID,
      country: item.countryList,
    }));
    tempItems.sort(dynamicSort("label"));
    setsegmentFilterOpts([selectInitiVal, ...tempItems]);
  }, [segmentState.segmentItems]);

  useEffect(() => {
    let tempItems = lobState.lobItems.map((item) => ({
      label: item.lobName,
      value: item.lobid,
    }));
    tempItems.sort(dynamicSort("label"));
    setlobFilterOpts([selectInitiVal, ...tempItems]);
  }, [lobState.lobItems]);

  const [frmsublobopts, setfrmsublobopts] = useState([]);
  useEffect(() => {
    let tempItems = sublobState.sublobitems.map((item) => ({
      label: item.subLOBName,
      value: item.subLOBID,
      lob: item.lobid,
    }));
    tempItems.sort(dynamicSort("label"));
    setfrmsublobopts([...tempItems]);
  }, [sublobState.sublobitems]);

  useEffect(() => {
    let tempItems = [];
    if (selfilter.lobid) {
      tempItems = frmsublobopts.filter((item) => item.lob === selfilter.lobid);
    } else {
      tempItems = frmsublobopts;
    }
    setcommonfilterOpts((prevstate) => ({
      ...prevstate,
      sublobFilterOpts: [selectInitiVal, ...tempItems],
    }));
  }, [selfilter.lobid, frmsublobopts]);

  useEffect(() => {
    let tempopts = [];
    officeState.officeItems.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          ...item,
          label: item.officeName,
          value: item.officeId,
        });
      }
    });
    tempopts.sort(dynamicSort("label"));
    setcommonfilterOpts((prevstate) => ({
      ...prevstate,
      officeOpts: [selectInitiVal, ...tempopts],
    }));
  }, [officeState.officeItems]);

  useEffect(() => {
    let tempopts = [];
    znaorgnization1State.org1Items.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.znaSegmentName,
          value: item.znaSegmentId,
        });
      }
    });
    tempopts.sort(dynamicSort("label"));
    setcommonfilterOpts((prevstate) => ({
      ...prevstate,
      ZNASegmentOpts: [selectInitiVal, ...tempopts],
    }));
  }, [znaorgnization1State.org1Items]);

  useEffect(() => {
    let tempopts = [];
    znaorgnization2State.org2Items.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.sbuName,
          value: item.znasbuId,
          znaSegmentId: item.znaSegmentId,
        });
      }
    });
    tempopts.sort(dynamicSort("label"));
    setorg2FilterOptsAllOpts([...tempopts]);
    setcommonfilterOpts((prevstate) => ({
      ...prevstate,
      ZNASBUOpts: [selectInitiVal, ...tempopts],
    }));
  }, [znaorgnization2State.org2Items]);

  useEffect(() => {
    let tempopts = [];
    znaorgnization3State.org3Items.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.marketBasketName,
          value: item.marketBasketId,
          znasbuId: item.znasbuId,
        });
      }
    });
    tempopts.sort(dynamicSort("label"));
    setorg3FilterOptsAllOpts([...tempopts]);
    setcommonfilterOpts((prevstate) => ({
      ...prevstate,
      ZNAMarketBasketOpts: [selectInitiVal, ...tempopts],
    }));
  }, [znaorgnization3State.org3Items]);

  useEffect(() => {
    if (selfilter.znaSegmentId !== "") {
      let tempFilterOpts = org2FilterOptsAllOpts.filter(
        (item) => item.znaSegmentId === selfilter.znaSegmentId
      );
      setcommonfilterOpts((prevstate) => ({
        ...prevstate,
        ZNASBUOpts: [
          selectInitiVal,
          ...tempFilterOpts.sort(dynamicSort("label")),
        ],
      }));
    } else {
      setcommonfilterOpts((prevstate) => ({
        ...prevstate,
        ZNASBUOpts: [selectInitiVal, ...org2FilterOptsAllOpts],
      }));
    }
    setselfilter({
      ...selfilter,
      marketBasketId: "",
      znasbuId: "",
    });
  }, [selfilter.znaSegmentId]);

  useEffect(() => {
    if (selfilter.znasbuId !== "") {
      let tempFilterOpts = org3FilterOptsAllOpts.filter(
        (item) => item.znasbuId === selfilter.znasbuId
      );
      setcommonfilterOpts((prevstate) => ({
        ...prevstate,
        ZNAMarketBasketOpts: [
          selectInitiVal,
          ...tempFilterOpts.sort(dynamicSort("label")),
        ],
      }));
    } else {
      setcommonfilterOpts((prevstate) => ({
        ...prevstate,
        ZNAMarketBasketOpts: [selectInitiVal, ...org3FilterOptsAllOpts],
      }));
    }
    setselfilter({
      ...selfilter,
      marketBasketId: "",
    });
  }, [selfilter.znasbuId]);

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
      let reqparam = { LogType: "breachlogs" };
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
  }, [sellogTabType]);

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
    // getAllApprover({ UserName: "#$%" });
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
      setlogstate((prevstate) => ({
        ...prevstate,
        isDataImported: false,
      }));
      pageIndex = 1;
      getAllLogsInRecurssion();
    }
  }, [logstate.isDataImported]);
  const setInEditMode = () => {
    setisEditMode(true);
    setisReadMode(false);
  };
  const [isEditMode, setisEditMode] = useState(false);
  const [isReadMode, setisReadMode] = useState(false);
  const formInitialValue = {
    entityNumber: "",
    breachLogID: "",
    title: "",
    regionId: "",
    regionList: [],
    countryId: "",
    countryList: [],
    customerSegment: "",
    lobid: "",
    sublobid: "",
    classification: "",
    typeOfBreach: "",
    rootCauseOfTheBreach: "",
    natureOfBreach: "",
    materialBreach: false,
    dateBreachOccurred: null,
    details: "",
    rangeOfFinancialImpact: "",
    financialImpactDescription: "",
    howDetected: "",
    howDetectedMoreInfo: "",
    actionResponsible: "",
    originalDueDate: null,
    dueDate: null,
    actionPlan: "",
    breachStatus: "",
    dateActionClosed: null,
    actionUpdate: "",
    createdByID: "",
    createdDate: null,
    breachAttachmentList: [],
    fullFilePath: "",
    isSubmit: false,
    isArchived: false,
    globalBreachLogURL: "",
    UWRinvolved: "",
    breachCC: "",
    dateIdentified: null,
    BusinessDivision: "",
    Office: "",
    PolicyName: "",
    PolicyNumber: "",
    turNumber: "",
    marketBasketId: "",
    marketBasketName: "",
    znaSegmentId: "",
    znaSegmentName: "",
    znasbuId: "",
    sbuName: "",
    isdirty: false,
    BreachLogEmailLink: window.location.href,
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
    const response = await getById({
      breachLogID: itemid,
    });
    if (mode === "edit" && response.isSubmit) {
      setisEditMode(true);
    }
    if (mode === "view") {
      setisReadMode(true);
    }
    if (queryparam.status) {
      response.breachStatus = queryparam.status;
    }
    if (response.uwrInvolvedAD && response.uwrInvolvedAD.length) {
      let users = "";
      users = response.uwrInvolvedAD.map((item) => item.userName);
      response.uwrInvolvedName = users.join(",");
    }
    if (response.breachCCAD && response.breachCCAD.length) {
      let users = "";
      users = response.breachCCAD.map((item) => item.userName);
      response.breachCCName = users.join(",");
    }
    let countryList = response.countryList;
    countryList = countryList.map((country) => ({
      label: country.countryName,
      value: country.countryID,
      regionId: country.regionID,
    }));
    response["countryList"] = [...countryList];

    let regionList = response.regionList ? response.regionList : [];
    regionList = regionList.map((item) => ({
      label: item.regionName.trim(),
      value: item.regionID,
    }));
    response["regionList"] = [...regionList];
    setformIntialState({
      ...response,
      isdirty: false,
    });
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    let tempfullPathArr = item.breachAttachmentList.map(
      (item) => item.filePath
    );
    let fullFilePath = tempfullPathArr.join(",");
    item.fullFilePath = fullFilePath;
    /*let countrylist = item.countryList.map((item) => item.value);
    item.countryId = countrylist.join(",");*/
    let response = await postItem({
      ...item,
      modifiedByID: userProfile.userId,
    });
    if (response) {
      // if (queryparam.id || !logstate.loadedAll) {
      /*if (queryparam.id) {
        window.location = "/breachlogs";
      } else {
        //setselfilter(intialFilterState);
        //setisfilterApplied(false);
        //if item is submitted and in edit mode
        let tempostItem = await getallLogs({
          breachLogID: item.breachLogID,
          isSubmit: item.isSubmit,
        });
        if (item.isSubmit) {
          let isfound = false;
          for (let i = 0; i < logstate.data.length; i++) {
            let listitem = logstate.data[i];
            if (listitem.breachLogID === item.breachLogID) {
              listitem = { ...listitem, ...tempostItem[0] };
              logstate.data[i] = listitem;
              isfound = true;
            }
          }
          if (!isfound) {
            logstate.data.unshift(tempostItem[0]);
          }
        } else {
          //if item is saved and in draft mode
        }
        fnsetPaginationData(logstate.data);
        }
        */
      alert(alertMessage.breachlog.update);
      getallDraftItems();
      onPaginationSort("modifiedDate", "desc");
      hideAddPopup();
    }
    setisEditMode(false);
  };
  const postItemHandler = async (item) => {
    let tempfullPathArr = item.breachAttachmentList.map(
      (item) => item.filePath
    );
    let fullFilePath = tempfullPathArr.join(",");
    item.fullFilePath = fullFilePath;
    /*let countrylist = item.countryList.map((item) => item.value);
    item.countryId = countrylist.join(",");*/
    let response;
    response = await postItem({
      ...item,
      createdByID: userProfile.userId,
      modifiedByID: userProfile.userId,
    });
    if (response) {
      /*if (queryparam.id) {
        window.location = "/breachlogs";
      } else {
        let logid = item.breachLogID ? item.breachLogID : response;
        //setselfilter(intialFilterState);
        //setisfilterApplied(false);
        let tempostItem = await getallLogs({
          breachLogID: logid,
          isSubmit: item.isSubmit,
        });
        if (item.isSubmit) {
          alert(alertMessage.breachlog.add);
          let isfound = false;
          for (let i = 0; i < logstate.data.length; i++) {
            let listitem = logstate.data[i];
            if (listitem.breachLogID === item.breachLogID) {
              listitem = { ...listitem, ...tempostItem[0] };
              logstate.data[i] = listitem;
              isfound = true;
            }
          }
          if (!isfound) {
            logstate.data.unshift(tempostItem[0]);
          }
        } else {
          alert(alertMessage.breachlog.draft);
        }
        getallDraftItems();
        hideAddPopup();
      }*/
      if (item.isSubmit) {
        alert(alertMessage.breachlog.add);
      } else {
        alert(alertMessage.breachlog.draft);
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
  //set query parameters

  const [queryparam, setqueryparam] = useState({ id: "", status: "" });
  const [queryparamloaded, setqueryparamloaded] = useState(false);
  useEffect(() => {
    setqueryparamloaded(true);
    if (queryparam.id) {
      handleEdit(this, true);
    }
  }, [queryparam]);
  useEffect(() => {
    let itemid = getUrlParameter("id");
    let status = getUrlParameter("status");
    setqueryparam({
      id: itemid,
      status: status,
    });
  }, []);

  const [showVersionHistory, setshowVersionHistory] = useState(false);
  const [versionHistoryData, setversionHistoryData] = useState([]);
  const [isDraftVersionHistory, setisDraftVersionHistory] = useState(false);
  const versionHistoryexportHtmlFields = [
    "BreachDetails",
    "ActionPlan",
    "ActionUpdate",
  ];
  const versionHistoryFieldTitles = {
    EntityNumber: "Entry Number",
    Title: "Title",
    CountryName: "Country",
    RegionName: "Region",
    CustomerSegmentName: "Customer Segment",
    ZNASegmentName: "ZNA BU",
    SBUName: "ZNA SBU",
    MarketBasketName: "ZNA Market Basket",
    LOBName: "LoB",
    SubLOBName: "Sub LoB",
    ClassificationValue: "Classification",
    TypeOfBreachValue: "Type Of Breach",
    RootCauseOfTheBreachValue: "Root Cause of the Breach",
    NatureOfBreachValue: "Nature of Breach",
    MaterialBreach: "Material Breach",
    DateBreachOccurred: "Date Breach Occurred",
    BreachDetails: "Breach Details",
    RangeOfFinancialImpactValue: "Range of financial impact",
    FinancialImpactDescription: "Financial impact description",
    HowDetectedValue: "How detected",
    HowDetectedMoreInfo: "Additional information 'How detected'",
    NearMisses: "Near Misses",
    UWRInvolved: "UWr involved",
    /*BusinessDivision: "Business Division",*/
    DateIdentified: "Date Identified",
    OfficeName: "Office",
    PolicyName: "Policy name",
    PolicyNumber: "Policy number",
    TURNumber: "UQA Review ID",
    ActionResponsibleName: "Action Responsible",
    DueDate: "Due Date",
    OriginalDueDate: "Original Due Date",
    ActionPlan: "Action Plan",
    BreachStatusValue: "Breach Status",
    DateActionClosed: "Date Action Closed",
    ActionUpdate: "Action Update",
    CreatedDate: "Created Date",
    CreatorName: "Creator",
    BreachLogEmailLink: "Link",
    ImportedBy: "Imported By",
    BreachCCName: "Breach CC",
    COValue: "CO"
  };
  const versionHistoryexportDateFields = {
    DateBreachOccurred: "dateBreachOccurred",
    DueDate: "dueDate",
    OriginalDueDate: "originalDueDate",
    DateActionClosed: "dateActionClosed",
    CreatedDate: "createdDate",
    DateIdentified: "dateIdentified",
  };
  const versionHistoryExcludeFields = {
    BreachLogEmailLink: "breachLogEmailLink",
    CreatedDate: "createdDate",
    ActionResponsible: "actionResponsible",
    OriginalDueDate: "originalDueDate",
    BusinessDivision: "BusinessDivision",
    BreachCC: "BreachCC",
  };
  const hideVersionHistoryPopup = () => {
    setshowVersionHistory(false);
  };
  const handleDataVersion = async (itemid, isSubmit) => {
    let versiondata = await getDataVersion({
      TempId: itemid,
      LogType: "breachlogs",
    });
    setversionHistoryData(versiondata);
    if (isSubmit) {
      setisDraftVersionHistory(false);
    } else {
      setisDraftVersionHistory(true);
    }
    setshowVersionHistory(true);
  };
  const handleOpenSharePointLink = (itemid) => {
    const link = `${breachlogSharePointLink}?ID=${itemid}&isDlg=1`;
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
      logType: "breachlogs",
      isDelete: true,
    };
    const response = await deleteLog(requestParam);
    if (response) {
      hidelogPopup();
      //check if log is draft
      /*if (isSubmit) {
        if (logstate.loadedAll) {
          let tempItems = logstate.data?.filter(
            (item) => itemid !== item.breachLogID
          );
          setlogstate({ ...logstate, data: [...tempItems] });
          //fnsetPaginationData(tempItems);
        } else {
          //reload items
          setdeletedlogCount((prevcount) => prevcount + 1);
          let tempItems = logItmes?.filter(
            (item) => itemid !== item.breachLogID
          );
          setlogItmes((prevstate) => [...tempItems]);
          fnsetPaginationData(logItmes);
        }
      } else {
        const tempdata = logsDraftData.map(
          (item) => item.breachLogID !== itemid
        );
        setlogsDraftData([...tempdata]);
        getallDraftItems();
      }*/
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
      logType: "breachlogs",
      isDelete: false,
    };
    const response = await deleteLog(requestParam);
    if (response) {
      /*let tempdata = logsDeletedData.map((item) => item.breachLogID !== itemid);
      setlogsDeletedData([...tempdata]);
      getallDeletedItems();
      alert(alertMessage.commonmsg.restoreLog);

      let tempItem = await getallLogs({
        breachLogID: itemid,
        isSubmit: isSubmit,
      });
      if (isSubmit) {
        if (logstate.loadedAll) {
          setlogstate({ ...logstate, data: [...tempItem, ...logstate.data] });
          //fnsetPaginationData(tempItems);
        } else {
          //reload items
          if (deletedlogCount) {
            setdeletedlogCount((prevcount) => prevcount - 1);
          }
          setlogItmes((prevstate) => [...tempItem, ...prevstate]);
          //logItmes.unshift(tempItem[0]);
          //fnsetPaginationData(logItmes);
        }
      } else {
        setlogsDraftData([...tempItem, ...logsDraftData]);
        getallDraftItems();
      }*/
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
          if (key === "materialBreach") {
            tempFilterOpts[key] = value === "1" ? true : false;
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
      const responseblob = await exportReportLogs(reqParam);
      const filename = "BreachLogReport.xlsx";
      FileDownload(responseblob, filename);
      alert(alertMessage.commonmsg.reportDownlaodComplete);
    } catch (errormsg) {
      console.log(errormsg);
    }
  };
  return (
    <>
      {isshowAddPopup && (
        <AddEditForm
          title={isReadMode ? "View Breach Log" : "Add/Edit Breach Log"}
          hideAddPopup={hideAddPopup}
          postItem={postItemHandler}
          putItem={putItemHandler}
          isEditMode={isEditMode}
          isReadMode={isReadMode}
          setInEditMode={setInEditMode}
          formIntialState={formIntialState}
          frmRegionSelectOpts={frmRegionSelectOpts}
          frmCountrySelectOpts={frmCountrySelectOpts}
          countrymapping={countrymapping}
          userProfile={userProfile}
          queryparam={queryparam}
          handleDataVersion={handleDataVersion}
        ></AddEditForm>
      )}
      {isshowImportLogsPopup && (
        <AddImportLogs
          title={"Bulk import Breach"}
          hideImportLogsPopup={hideImportLogsPopup}
          formIntialState={formIntialState}
          userProfile={userProfile}
          setisDataImported={setisDataImported}
          exportFileName={"BreachLogsImportData"}
        />
      )}
      {!isshowAddPopup && !isshowImportLogsPopup && (
        <>
          <div className="">
            <div className="row">
              <div className="page-title col-md-6" style={{ marginLeft: '1.5%'}}>Breach Log</div>
              {/* <div className="page-title col-md-9">RfE Log</div> */}
              <div className="col-md-3 title-dropdown" style={{ marginTop: "8px", right: '-24%' }}>
                <FrmSelect
                  title={"Switch view"}
                  name={"switchview"}
                  selectopts={commonfilterOpts.views}
                  handleChange={onViewFilterSelect}
                  value={selectedview}
                  inlinetitle={true}
                />
              </div>
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
                            name={"entityNumber"}
                            type={"input"}
                            handleChange={onSearchFilterInputAutocomplete}
                            value={selfilter.entityNumber}
                            options={commonfilterOpts.entryNumberOpts}
                          />
                        </div>
                        <div className="frm-filter col-md-3">
                          <FrmInput
                            title={"Title"}
                            name={"title"}
                            type={"input"}
                            handleChange={onSearchFilterInput}
                            value={selfilter.title}
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
                            name={"countryId"}
                            selectopts={countryFilterOpts}
                            handleChange={handleMultiSelectChange}
                            value={selfilter.countryId}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="frm-filter col-md-3">
                          <FrmSelect
                            title={"Status"}
                            name={"breachStatus"}
                            selectopts={commonfilterOpts.statusFilterOpts}
                            handleChange={onSearchFilterSelect}
                            value={selfilter.breachStatus}
                          />
                        </div>
                        <div className="frm-filter col-md-3">
                          <FrmInputAutocomplete
                            title={"Action Responsible"}
                            name={"actionResponsible"}
                            type={"input"}
                            handleChange={onSearchFilterInputAutocomplete}
                            value={selfilter.actionResponsible}
                            options={
                              commonfilterOpts.actionResponsibleFilterOpts
                            }
                          />
                        </div>
                        <div className="frm-filter  col-md-3">
                          <FrmSelect
                            title={"LoB"}
                            name={"lobid"}
                            selectopts={lobFilterOpts}
                            handleChange={onSearchFilterSelect}
                            value={selfilter.lobid}
                          />
                        </div>
                        <div className="frm-filter  col-md-3">
                          <FrmSelect
                            title={"Sub LoB"}
                            name={"sublobid"}
                            selectopts={commonfilterOpts.sublobFilterOpts}
                            handleChange={onSearchFilterSelect}
                            value={selfilter.sublobid}
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
                          <div className="frm-filter col-md-3">
                            <FrmSelect
                              title={"Type of Breach"}
                              name={"typeOfBreach"}
                              selectopts={commonfilterOpts.typeOfBreachOpts}
                              handleChange={onSearchFilterSelect}
                              value={selfilter.typeOfBreach}
                            />
                          </div>
                          <div className="frm-filter col-md-3">
                            <FrmSelect
                              title={"Classification"}
                              name={"classification"}
                              selectopts={
                                commonfilterOpts.classificationFilterOpts
                              }
                              handleChange={onSearchFilterSelect}
                              value={selfilter.classification}
                            />
                          </div>
                          <div className="frm-filter col-md-3">
                            <FrmSelect
                              title={<>Material breach</>}
                              name={"materialBreach"}
                              value={selfilter.materialBreach}
                              handleChange={onSearchFilterSelect}
                              selectopts={yesnoopts}
                            />
                          </div>
                          {selfilter.regionId !== REGION_ZNA && (
                            <div className="frm-filter col-md-3">
                              <FrmSelect
                                title={"Customer Segment"}
                                name={"customersegment"}
                                selectopts={segmentFilterOpts}
                                handleChange={onSearchFilterSelect}
                                value={selfilter.customersegment}
                              />
                            </div>
                          )}
                        </div>
                        <div className="row">
                          <div className="frm-filter  col-md-3">
                            <FrmSelect
                              title={"Nature of Breach"}
                              name={"natureofbreach"}
                              selectopts={
                                commonfilterOpts.natureOfBreachFilterOpts
                              }
                              handleChange={onSearchFilterSelect}
                              value={selfilter.natureofbreach}
                            />
                          </div>
                          <div className="frm-filter  col-md-3">
                            <FrmSelect
                              title={"How detected"}
                              name={"howDetected"}
                              selectopts={commonfilterOpts.howDetectedOpts}
                              handleChange={onSearchFilterSelect}
                              value={selfilter.howDetected}
                            />
                          </div>
                          <div className="frm-filter  col-md-3">
                            <FrmSelect
                              title={"Root Cause of the Breach"}
                              name={"rootCauseOfTheBreach"}
                              selectopts={commonfilterOpts.rootCauseBreachOpts}
                              handleChange={onSearchFilterSelect}
                              value={selfilter.rootCauseOfTheBreach}
                            />
                          </div>
                          {selfilter.regionId === REGION_EMEA && (
                            <div className="frm-filter col-md-3">
                              <FrmSelect
                                title={<>Near Misses</>}
                                name={"nearMisses"}
                                value={selfilter.nearMisses}
                                handleChange={onSearchFilterSelect}
                                selectopts={yesnoopts}
                              />
                            </div>
                          )}
                        </div>
                        <div className="row">
                          {/*<div className="frm-filter col-md-3">
                            <FrmSelect
                              title={"Entries"}
                              name={"entries"}
                              selectopts={commonfilterOpts.entriesFilterOpts}
                              handleChange={onSearchFilterSelect}
                              value={selfilter.entries}
                            />
                            </div>*/}
                          <div className="frm-filter  col-md-3">
                            <FrmSelect
                              title={"Range of financial impact"}
                              name={"rangeOfFinancialImpact"}
                              selectopts={
                                commonfilterOpts.rangeOfFinancialImpactOpts
                              }
                              handleChange={onSearchFilterSelect}
                              value={selfilter.rangeOfFinancialImpact}
                            />
                          </div>
                          <div className="frm-filter col-md-3">
                            <FrmInputAutocomplete
                              title={"Creator"}
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
                                title={"Date Breach Occurred"}
                                name={"BreachOccurredFromDate"}
                                value={selfilter.BreachOccurredFromDate}
                                type={"date"}
                                handleChange={handleDateSelectChange}
                              />
                            </div>

                            <div className="daterange-title">to</div>

                            <div className="frm-filter">
                              <FrmDatePicker
                                title={""}
                                name={"BreachOccurredToDate"}
                                value={selfilter.BreachOccurredToDate}
                                type={"date"}
                                handleChange={handleDateSelectChange}
                                minDate={moment(
                                  selfilter.BreachOccurredFromDate
                                ).toDate()}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 filter-date-container">
                            <div className="frm-filter">
                              <FrmDatePicker
                                title={"Due Date"}
                                name={"dueFromDate"}
                                value={selfilter.dueFromDate}
                                type={"date"}
                                handleChange={handleDateSelectChange}
                              />
                            </div>

                            <div className="daterange-title">to</div>

                            <div className="frm-filter">
                              <FrmDatePicker
                                title={""}
                                name={"dueToDate"}
                                value={selfilter.dueToDate}
                                type={"date"}
                                handleChange={handleDateSelectChange}
                                minDate={moment(selfilter.dueFromDate).toDate()}
                              />
                            </div>
                          </div>
                          <div className="col-md-6 filter-date-container">
                            <div className="frm-filter">
                              <FrmDatePicker
                                title={"Date Action Closed"}
                                name={"ActionClosedFromDate"}
                                value={selfilter.ActionClosedFromDate}
                                type={"date"}
                                handleChange={handleDateSelectChange}
                              />
                            </div>

                            <div className="daterange-title">to</div>

                            <div className="frm-filter">
                              <FrmDatePicker
                                title={""}
                                name={"ActionClosedToDate"}
                                value={selfilter.ActionClosedToDate}
                                type={"date"}
                                handleChange={handleDateSelectChange}
                                minDate={moment(
                                  selfilter.ActionClosedFromDate
                                ).toDate()}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
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
                        {selfilter.regionId === REGION_ZNA && (
                          <>
                            <div className="row">
                              <div className="col-md-12">
                                <div
                                  className="border-bottom"
                                  style={{
                                    padding: "5px 0",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ZNA Specific Filters
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="frm-filter col-md-3">
                                <FrmInputAutocomplete
                                  title={"UWr involved"}
                                  name={"UWRInvolvedName"}
                                  type={"input"}
                                  handleChange={onSearchFilterInputAutocomplete}
                                  value={selfilter.UWRInvolvedName}
                                  options={commonfilterOpts.uwrInvolvedOpts}
                                />
                              </div>
                              <div className="frm-filter col-md-3">
                                <FrmInput
                                  title={"Policy name"}
                                  name={"policyName"}
                                  type={"input"}
                                  handleChange={onSearchFilterInput}
                                  value={selfilter.policyName}
                                />
                              </div>
                              <div className="frm-filter col-md-3">
                                <FrmInput
                                  title={"Policy number"}
                                  name={"policyNumber"}
                                  type={"input"}
                                  handleChange={onSearchFilterInput}
                                  value={selfilter.policyNumber}
                                />
                              </div>
                              <div className="frm-filter col-md-3">
                                <FrmInput
                                  title={"UQA Review ID"}
                                  name={"turNumber"}
                                  type={"input"}
                                  handleChange={onSearchFilterInput}
                                  value={selfilter.turNumber}
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="frm-filter col-md-3">
                                <FrmSelect
                                  title={"Office"}
                                  name={"office"}
                                  selectopts={commonfilterOpts.officeOpts}
                                  handleChange={onSearchFilterSelect}
                                  value={selfilter.office}
                                />
                              </div>
                              <div className="col-md-6 filter-date-container">
                                <div className="frm-filter">
                                  <FrmDatePicker
                                    title={"Date Identified"}
                                    name={"IdentifiedFromDate"}
                                    value={selfilter.IdentifiedFromDate}
                                    type={"date"}
                                    handleChange={handleDateSelectChange}
                                  />
                                </div>

                                <div className="daterange-title">to</div>

                                <div className="frm-filter">
                                  <FrmDatePicker
                                    title={""}
                                    name={"IdentifiedToDate"}
                                    value={selfilter.IdentifiedToDate}
                                    type={"date"}
                                    handleChange={handleDateSelectChange}
                                    minDate={moment(
                                      selfilter.IdentifiedFromDate
                                    ).toDate()}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="frm-filter col-md-3">
                                <FrmSelect
                                  title={"ZNA BU"}
                                  name={"znaSegmentId"}
                                  selectopts={commonfilterOpts.ZNASegmentOpts}
                                  handleChange={onSearchFilterSelect}
                                  value={selfilter.znaSegmentId}
                                />
                              </div>
                              <div className="frm-filter col-md-3">
                                <FrmSelect
                                  title={"ZNA SBU"}
                                  name={"znasbuId"}
                                  selectopts={commonfilterOpts.ZNASBUOpts}
                                  handleChange={onSearchFilterSelect}
                                  value={selfilter.znasbuId}
                                />
                              </div>
                              <div className="frm-filter col-md-3">
                                <FrmSelect
                                  title={"ZNA Market Basket"}
                                  name={"marketBasketId"}
                                  selectopts={
                                    commonfilterOpts.ZNAMarketBasketOpts
                                  }
                                  handleChange={onSearchFilterSelect}
                                  value={selfilter.marketBasketId}
                                />
                              </div>
                            </div>
                          </>
                        )}
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
          {/*<div
            className="btn-blue"
            style={{ width: "300px" }}
            onClick={() => sendLogNotification()}
          >
            Trigger Breachlog Email
          </div>*/}
          {!alllogsloaded && (
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div className="progress-color"></div>
              </div>
              <div className="progress-completion">Loading logs...</div>
            </div>
          )}
          <div className="tabs-container">
            {logTypes.map((item) => (
              <div
                key={item.label}
                className={`tab-btn ${
                  sellogTabType === item.value ? "selected" : "normal"
                }`}
                onClick={() => openBreachlogTab(item.value)}
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
              queryparamloaded &&
              !queryparam.id && (
                <Pagination
                  id={"userId"}
                  column={columns}
                  data={paginationdata}
                  pageno={pageIndex}
                  pagesize={pagesize}
                  totalItems={totalLogCount}
                  showAddPopup={showAddPopup}
                  showImportLogsPopup={showImportLogsPopup}
                  defaultSorted={defaultSorted}
                  isExportReport={true}
                  isImportLogs={userProfile.isAdminGroup ? true : false}
                  importLogsTitle={"Import Breach"}
                  exportReportTitle={"Export"}
                  exportFileName={"BreachLogReport"}
                  exportReportLogsHandler={exportReportLogsHandler}
                  buttonTitle={"New Breach"}
                  hidesearch={true}
                  exportExcludeFields={exportExcludeFields}
                  exportFieldTitles={exportFieldTitles}
                  exportHtmlFields={exportHtmlFields}
                  exportDateFields={exportDateFields}
                  onPaginationPagechange={onPaginationPageChange}
                  onPageSizeChange={onPageSizeChange}
                />
              )
            )}
          </div>
          <div></div>
        </>
      )}
      {showVersionHistory ? (
        <VersionHistoryPopup
          versionHistoryData={versionHistoryData}
          hidePopup={hideVersionHistoryPopup}
          exportFieldTitles={versionHistoryFieldTitles}
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
          title={"Share a Breach Link"}
          hidePopup={hidelogPopup}
          itemDetails={shareitemDetails}
          logtype={"Breach"}
          userProfile={userProfile}
        />
      ) : (
        ""
      )}
      {showDeleteLog ? (
        <DeleteItem
          title={"Delete Breach Entry"}
          deleteItem={handleDeleteItem}
          hidePopup={hidelogPopup}
          itemDetails={shareitemDetails}
        />
      ) : (
        ""
      )}
      {showCopyLog ? (
        <CopyItem
          title={"Copy a Breach Link"}
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
  getAll: breachlogActions.getAll,
  getallCount: breachlogActions.getallCount,
  getallLogs: breachlogActions.getallLogs,
  getallDeletedLogs: breachlogActions.getallDeletedLogs,
  getActionResponsible: breachlogActions.getActionResponsible,
  getAllUsers: userActions.getAllUsers,
  getAllCountry: countryActions.getAllCountry,
  getAllRegion: regionActions.getAllRegions,
  getAlllob: lobActions.getAlllob,
  getAllSublob: sublobActions.getAllSublob,
  getAllSegment: segmentActions.getAllSegment,
  getAllStatus: breachlogActions.getAllStatus,
  getById: breachlogActions.getById,
  checkIsInUse: breachlogActions.checkIsInUse,
  postItem: breachlogActions.postItem,
  deleteItem: breachlogActions.deleteItem,
  exportReportLogs: breachlogActions.exportReportLogs,
  getLookupByType: lookupActions.getLookupByType,
  sendLogNotification: commonActions.sendLogNotification,
  getDataVersion: commonActions.getDataVersion,
  deleteLog: commonActions.deleteLog,
  getLogUsers: commonActions.getLogUsers,
  getAllEntryNumbers: commonActions.getAllEntryNumbers,
  clearDashboardClick: dashboardActions.clearDashboardClick,
  getAllOffice: officeActions.getAllOffice,
  getallZNASegments: znaorgnization1Actions.getAllOrgnization,
  getallZNASBU: znaorgnization2Actions.getAllOrgnization,
  getallZNAMarketBasket: znaorgnization3Actions.getAllOrgnization,
  getViewsByUserId: userViewActions.getViewsByUserId,
  addEditUserView: commonActions.addEditUserView
};

export default connect(mapStateToProp, mapActions)(Breachlog);
