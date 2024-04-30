import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  segmentActions,
  countryActions,
  commonActions,
} from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort, formatDate } from "../../../helpers";
import AddEditForm from "./AddEditFrom";
import { handlePermission } from "../../../permissions/Permission";
import VersionHistoryPopup from "../../versionhistorypopup/VersionHistoryPopup";
import { versionHistoryExcludeFields, versionHistoryexportDateFields, versionHistoryexportFieldTitles, versionHistoryexportHtmlFields } from "../../../constants/segment.constants";
function Segment({ ...props }) {
  const { segmentState, countryState } = props.state;
  const {
    getAll,
    getAllCountry,
    getById,
    checkNameExist,
    checkIsInUse,
    postItem,
    deleteItem,
    userProfile,
    setMasterdataActive,
    getMasterVersion,
    downloadExcel
  } = props;
  const FileDownload = require("js-file-download");
  const templateName = "Segment.xlsx";
  useSetNavMenu({ currentMenu: "Segment", isSubmenu: true }, props.menuClick);
  //initialize filter/search functionality
  const [isfilterApplied, setisfilterApplied] = useState(false);
  const [countryFilterOpts, setcountryFilterOpts] = useState([]);
  const [segmentFilterOpts, setsegmentFilterOpts] = useState([]);
  const intialfilterval = {
    segment: "",
    country: "",
  };
  const [selfilter, setselfilter] = useState(intialfilterval);
  const onSearchFilterSelect = (name, value) => {
    //const { name, value } = e.target;
    setselfilter({
      ...selfilter,
      [name]: value,
    });
  };
  const handleFilterSearch = () => {
    if (selfilter.segment !== "" || selfilter.country !== "") {
      setisfilterApplied(true);
      let tempdata = [...data];
      tempdata = tempdata.filter((item) => {
        let isShow = true;
        if (
          isShow &&
          selfilter.segment !== "" &&
          item.segmentID !== selfilter.segment
        ) {
          isShow = false;
        }
        if (
          (isShow &&
            selfilter.country !== "" &&
            item.countryList &&
            !item.countryList.includes(selfilter.country)) ||
          (isShow && selfilter.country !== "" && !item.countryList)
        ) {
          isShow = false;
        }
        return isShow;
      });
      setpaginationdata(tempdata);
    }
  };
  const clearFilter = () => {
    setisfilterApplied(false);
    setselfilter(intialfilterval);
    setpaginationdata(data);
  };
  //set pagination data and functionality
  const [dataActItems, setdataActItems] = useState({});
  const [data, setdata] = useState([]);
  const [paginationdata, setpaginationdata] = useState([]);

  const columns = [
    {
      dataField: "checkbox",
      text: "",
      hidden: handlePermission(window.location.pathname.slice(1), "isEdit") === true ? false : true,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <FrmActiveCheckbox
            name={row.segmentID}
            value={dataActItems.segmentID}
            handleChange={handleItemSelect}
            isdisabled={false}
          />
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "40px", textAlign: "center" };
      },
    },
    {
      dataField: "editaction",
      text: "Edit",
      hidden: handlePermission(window.location.pathname.slice(1), "isEdit") === true ? false : true,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="edit-icon"
            onClick={handleEdit}
            rowid={row.segmentID}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "65px",
          textAlign: "center",
        };
      },
    },
    {
      dataField: "deleteaction",
      text: "Delete",
      hidden: handlePermission(window.location.pathname.slice(1), "isDelete") === true ? false : true,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="delete-icon"
            onClick={handleDelete}
            rowid={row.segmentID}
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
      align: "center",
    },
    {
      dataField: "DataVersion",
      text: "Data Version",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="versionhistory-icon"
            onClick={() => handleDataVersion(row.segmentID)}
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
      dataField: "segmentName",
      text: "Segment",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },

    {
      dataField: "countryList",
      text: "Country",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      },
    },
    /*{
      dataField: "logType",
      text: "Log Type",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      },
    },*/
    {
      dataField: "isActive",
      text: "Active/Inactive",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "segmentDescription",
      text: "Description",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "createdDate",
      text: "Created Date",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
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
        return { width: "150px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    }
  ];
  const defaultSorted = [
    {
      dataField: "segmentName",
      order: "asc",
    },
  ];
  useEffect(() => {
    getAll({
      RequesterUserId: userProfile.userId,
    });
    getAllCountry();
  }, []);
  useEffect(() => {
    let tempdata = [];
    let tempsegmentFilterOpts = [];
    let tempCountryFilterOpts = [];
    let tempCountryObj = {};
    let initalval = {};
    segmentState.items.forEach((item) => {
      //if (item.isActive) {
      tempdata.push({
        ...item,
        isActive: item.isActive ? "Active" : "Inactive",
      });
      initalval[item.segmentID] = false;
      tempsegmentFilterOpts.push({
        label: item.segmentName,
        value: item.segmentID,
      });
      let coutrylist = item.countryList;
      if (coutrylist) {
        coutrylist = coutrylist.split(",");
        coutrylist.forEach((countryItem) => {
          console.log("coutrylist>>", coutrylist);
          let tempItem = countryItem.trim();
          if (!tempCountryObj[tempItem]) {
            tempCountryFilterOpts.push({
              label: tempItem,
              value: tempItem,
            });
          }
          tempCountryObj[tempItem] = tempItem;
        });
      }
      //}
    });
    tempsegmentFilterOpts.sort(dynamicSort("label"));
    tempCountryFilterOpts.sort(dynamicSort("label"));
    setdata([...tempdata]);
    //setpaginationdata([...tempdata]);
    setdataActItems(initalval);
    setsegmentFilterOpts([...tempsegmentFilterOpts]);
    setcountryFilterOpts([...tempCountryFilterOpts]);
  }, [segmentState.items]);

  useEffect(() => {
    if (isfilterApplied) {
      handleFilterSearch();
    } else {
      setpaginationdata([...data]);
    }
  }, [data]);

  const [frmCountrySelectOpts, setfrmCountrySelectOpts] = useState([]);
  const [countryObj, setcountryObj] = useState({});
  useEffect(() => {
    let countryselectOpts = [];
    let tempCountryObj = {};

    countryState.countryItems.forEach((item) => {
      countryselectOpts.push({
        ...item,
        label: item.countryName.trim(),
        value: item.countryID,
      });
      tempCountryObj[item.countryID] = item.countryName.trim();
    });
    setfrmCountrySelectOpts([
      { label: "All", value: "*", isActive: true },
      ...countryselectOpts,
    ]);

    setcountryObj(tempCountryObj);
  }, [countryState.countryItems]);

  /* Add Edit Delete functionality & show popup*/

  const [isshowAddPopup, setshowAddPopup] = useState(false);

  const showAddPopup = () => {
    setshowAddPopup(true);
  };
  const hideAddPopup = () => {
    setshowAddPopup(false);
    setformIntialState(initvalstate);
    setisEditMode(false);
  };
  const initvalstate = {
    segmentName: "",
    countryList: [],
    segmentDescription: "",
    logType: "",
    isActive: false,
  };
  const [isEditMode, setisEditMode] = useState(false);
  const [formIntialState, setformIntialState] = useState(initvalstate);

  const [editmodeName, seteditmodeName] = useState("");
  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({
      SegmentID: itemid,
    });
    let selectedCountryList = [];
    if (response.segmentCountryList) {
      selectedCountryList = response.segmentCountryList.map((item) => {
        return {
          label: item.countryName,
          value: item.countryID,
        };
      });
    }
    if (
      selectedCountryList.length &&
      selectedCountryList.length === frmCountrySelectOpts.length - 1
    ) {
      selectedCountryList = [
        { label: "All", value: "*" },
        ...selectedCountryList,
      ];
    }
    setisEditMode(true);
    setformIntialState({
      ...response,
      segmentID: response.segmentID,
      segmentName: response.segmentName,
      countryList: selectedCountryList,
      segmentDescription: response.segmentDescription
        ? response.segmentDescription
        : "",
      requesterUserId: response.requesterUserId ? response.requesterUserId : "",
      isActive: response.isActive,
    });
    seteditmodeName(response.segmentName);
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (editmodeName.toLowerCase() !== item.segmentName.toLowerCase()) {
      response = await checkNameExist({
        segmentName: item.segmentName,
      });
    }
    let tempcountryList = item.countryList.map((item) => item.value);
    tempcountryList = tempcountryList.filter((value) => value !== "*");
    tempcountryList = tempcountryList.join(",");
    if (!response) {
      response = await postItem({
        ...item,
        countryList: tempcountryList,
        requesterUserId: userProfile.userId,
      });
      if (response) {
        getAll();
        hideAddPopup();
        alert(alertMessage.segment.update);
      }
    } else {
      alert(alertMessage.segment.nameExist);
    }
    setisEditMode(false);
  };
  const postItemHandler = async (item) => {
    let response = await checkNameExist({
      segmentName: item.segmentName,
    });

    let tempcountryList = item.countryList.map((item) => item.value);
    tempcountryList = tempcountryList.filter((value) => value !== "*");
    tempcountryList = tempcountryList.join(",");
    if (!response) {
      response = await postItem({
        ...item,
        countryList: tempcountryList,
        requesterUserId: userProfile.userId,
      });

      if (response) {
        getAll();
        hideAddPopup();
        alert(alertMessage.segment.add);
      }
    } else {
      alert(alertMessage.segment.nameExist);
    }
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.segment.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({
      segmentID: itemid,
    });
    if (!resonse) {
      resonse = await deleteItem({
        segmentID: itemid,
      });
      if (resonse) {
        getAll();
        alert(alertMessage.segment.delete);
      }
    } else {
      alert(alertMessage.segment.isInUse);
    }
  };

  //version history
  const [showVersionHistory, setshowVersionHistory] = useState(false);
  const [versionHistoryData, setversionHistoryData] = useState([]);

  const hideVersionHistoryPopup = () => {
    setshowVersionHistory(false);
  };

  const handleDataVersion = async (itemid) => {
    let versiondata = await getMasterVersion({
      TempId: itemid,
      MasterType: "segment",
    });
    setversionHistoryData(versiondata ? versiondata : []);
    setshowVersionHistory(true);
  };

  //added below code to set active/inactive state
  const selectedItems = [];
  const [selItemsList, setselItemsList] = useState([]);
  const [isActiveEnable, setisActiveEnable] = useState(false);
  const [isDownloadEnable, setisDownloadEnable] = useState(true);
  const handleItemSelect = async (e) => {
    let { name, value } = e.target;
    value = e.target.checked;
    setdataActItems({
      ...dataActItems,
      [name]: value,
    });
    if (value && !selectedItems.includes(name)) {
      selectedItems.push(name);
    } else {
      const index = selectedItems.indexOf(name);
      if (index > -1) {
        selectedItems.splice(index, 1);
      }
    }
    if (selectedItems.length) {
      setisActiveEnable(true);
      setselItemsList([...selectedItems]);
    } else {
      setisActiveEnable(false);
    }
  };

  const setMasterdataActiveState = async (state) => {
    let response = await setMasterdataActive({
      TempId: selItemsList.join(","),
      MasterType: "segment",
      IsActive: state,
    });
    if (response) {
      setselfilter(intialfilterval);
      setselItemsList([]);
      setisActiveEnable(false);
      getAll();
      if (state) {
        alert(alertMessage.commonmsg.masterdataActive);
      } else {
        alert(alertMessage.commonmsg.masterdataInActive);
      }
    }
  };

  const handleDownload = async() =>{
    let response = {
      segmentID: "",
      countryList: "",
    }
    if (isfilterApplied) {
      if (selfilter.country !== "") {
        let countryId = frmCountrySelectOpts.filter((item) => item.countryName === selfilter.country)
        response.countryList = countryId?.[0]?.countryID
      }
      response.segmentID = selfilter.segment 
    }
    const responsedata = await downloadExcel({
      SegmentID: response?.segmentID,
      CountryID: response.countryList,
    }, "Segment");
    FileDownload(responsedata, templateName);
  }

  return (
    <>
      <div className="page-title">Manage Segment</div>
      <div className="page-filter">
        <div className="filter-container container">
          <div className="row">
            <div className="frm-filter col-md-4">
              <FrmSelect
                title={"Segment"}
                name={"segment"}
                selectopts={segmentFilterOpts}
                handleChange={onSearchFilterSelect}
                value={selfilter.segment}
              />
            </div>
            <div className="frm-filter col-md-4">
              <FrmSelect
                title={"Country"}
                name={"country"}
                selectopts={countryFilterOpts}
                handleChange={onSearchFilterSelect}
                value={selfilter.country}
              />
            </div>
          </div>
        </div>
        <div className="btn-container">
          <div
            className={`btn-blue ${
              selfilter.segment === "" && selfilter.country === ""
                ? "disable"
                : ""
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
      <div>
        {segmentState.loading ? (
          <Loading />
        ) : segmentState.error ? (
          <div>{segmentState.error}</div>
        ) : (
          <PaginationData
            id={"segmentID"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"New Segment"}
            setMasterdataActiveState={setMasterdataActiveState}
            isShowActiveBtns={true}
            ActiveBtnsState={isActiveEnable}
            ActiveSelectedItems={selItemsList}
            isShowDownloadBtn={true}
            DownloadBtnState={paginationdata.length !== 0 ? true : false}
            handleDownload={handleDownload}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
          title={"Add/Edit Segment"}
          frmCountrySelectOpts={frmCountrySelectOpts}
          hideAddPopup={hideAddPopup}
          postItem={postItemHandler}
          putItem={putItemHandler}
          isEditMode={isEditMode}
          formIntialState={formIntialState}
        ></AddEditForm>
      ) : (
        ""
      )}
      {showVersionHistory ? (
        <VersionHistoryPopup
          versionHistoryData={versionHistoryData}
          hidePopup={hideVersionHistoryPopup}
          exportFieldTitles={versionHistoryexportFieldTitles}
          exportDateFields={versionHistoryexportDateFields}
          exportHtmlFields={versionHistoryexportHtmlFields}
          versionHistoryExcludeFields={versionHistoryExcludeFields}
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
  getAll: segmentActions.getAll,
  getAllCountry: countryActions.getAllCountry,
  getById: segmentActions.getById,
  checkNameExist: segmentActions.checkNameExist,
  checkIsInUse: segmentActions.checkIsInUse,
  postItem: segmentActions.postItem,
  deleteItem: segmentActions.deleteItem,
  setMasterdataActive: commonActions.setMasterdataActive,
  getMasterVersion: commonActions.getMasterVersion,
  downloadExcel: commonActions.downloadExcel
};
export default connect(mapStateToProp, mapActions)(Segment);
