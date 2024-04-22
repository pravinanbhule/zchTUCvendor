import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  znaorgnization1Actions,
  znaorgnization2Actions,
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
import { versionHistoryExcludeFields, versionHistoryexportDateFields, versionHistoryexportFieldTitles, versionHistoryexportHtmlFields } from "../../../constants/znaorgnization2.constants";
function ZNAOrgnization2({ ...props }) {
  const { znaorgnization1State, znaorgnization2State } = props.state;
  const {
    getAll,
    getAllOrgnization1,
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
  const templateName = "znaorganization2.xlsx";
  useSetNavMenu(
    {
      currentMenu: "znaorganization2",
      isSubmenu: true,
    },
    props.menuClick
  );

  const [frmOrg1SelectOpts, setfrmOrg1SelectOpts] = useState([]);
  const [frmOrg1SelectOptsObj, setfrmOrg1SelectOptsObj] = useState([]);
  //initialize filter/search functionality
  const [isfilterApplied, setisfilterApplied] = useState(false);
  const [org1FilterOpts, setorg1FilterOpts] = useState([]);
  const [org2FilterOpts, setorg2FilterOpts] = useState([]);
  const [org2FilterOptsAllOpts, setorg2FilterOptsAllOpts] = useState([]);

  const intialfilterval = {
    znasbuId: "",
    znaSegmentId: "",
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
    if (selfilter.znasbuId !== "" || selfilter.znaSegmentId !== "") {
      setisfilterApplied(true);
      let tempdata = [...data];
      tempdata = tempdata.filter((item) => {
        let isShow = true;
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
  useEffect(() => {
    if (selfilter.znaSegmentId !== "") {
      let tempFilterOpts = org2FilterOptsAllOpts.filter(
        (item) => item.znaSegmentId === selfilter.znaSegmentId
      );
      setorg2FilterOpts([...tempFilterOpts.sort(dynamicSort("label"))]);
    } else {
      setorg2FilterOpts([...org2FilterOptsAllOpts]);
    }
    setselfilter({
      ...selfilter,
      znasbuId: "",
    });
  }, [selfilter.znaSegmentId]);
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
            name={row.znasbuId}
            value={dataActItems.znasbuId}
            handleChange={handleItemSelect}
            isdisabled={!row.isActiveEnable}
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
            rowid={row.znasbuId}
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
      dataField: "deleteaction",
      text: "Delete",
      hidden: handlePermission(window.location.pathname.slice(1), "isDelete") === true ? false : true,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="delete-icon"
            onClick={handleDelete}
            rowid={row.znasbuId}
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
            onClick={() => handleDataVersion(row.znasbuId)}
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
      dataField: "sbuName",
      text: "ZNA Organization 2",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "znaSegmentName",
      text: "ZNA Organization 1",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "isActive",
      text: "Active/Inactive",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "description",
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
      dataField: "sbuName",
      order: "asc",
    },
  ];
  useEffect(() => {
    fnOnInit();
  }, []);
  const fnOnInit = async () => {
    let org1Items = [];
    org1Items = await getAllOrgnization1({
      createdById: userProfile.userId,
    });
    let tempObj = {};
    let tempOpts = [];
    org1Items.forEach((item) => {
      tempOpts.push({
        ...item,
        label: item.znaSegmentName,
        value: item.znaSegmentId,
      });
      tempObj[item.znaSegmentId] = item;
    });
    tempOpts.sort(dynamicSort("label"));
    setfrmOrg1SelectOpts(tempOpts);
    setfrmOrg1SelectOptsObj({ ...tempObj });
    getAll({
      createdById: userProfile.userId,
    });
  };

  useEffect(() => {
    let tempdata = [];
    let tempOrg2FilterOpts = [];
    let tempOrg1FilterOpts = [];
    let tempOrg1ListObj = {};
    let initalval = {};
    znaorgnization2State.items.forEach((item) => {
      // if (item.isActive) {
      tempdata.push({
        ...item,
        isActiveEnable: frmOrg1SelectOptsObj[item.znaSegmentId]
          ? frmOrg1SelectOptsObj[item.znaSegmentId]["isActive"]
          : true,
        isActive: item.isActive ? "Active" : "Inactive",
      });
      initalval[item.znasbuId] = false;
      tempOrg2FilterOpts.push({
        label: item.sbuName,
        value: item.znasbuId,
        znaSegmentId: item.znaSegmentId,
      });
      if (!tempOrg1ListObj[item.znaSegmentId]) {
        tempOrg1FilterOpts.push({
          label: item.znaSegmentName,
          value: item.znaSegmentId,
        });
      }
      tempOrg1ListObj[item.znaSegmentId] = item.znaSegmentName;
      //}
    });
    setdata([...tempdata]);
    //setpaginationdata([...tempdata]);
    setdataActItems(initalval);
    tempOrg2FilterOpts.sort(dynamicSort("label"));
    tempOrg1FilterOpts.sort(dynamicSort("label"));
    setorg2FilterOpts([...tempOrg2FilterOpts]);
    setorg2FilterOptsAllOpts([...tempOrg2FilterOpts]);
    setorg1FilterOpts([...tempOrg1FilterOpts]);
  }, [znaorgnization2State.items]);

  useEffect(() => {
    if (isfilterApplied) {
      handleFilterSearch();
    } else {
      setpaginationdata([...data]);
    }
  }, [data]);
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
  const [isEditMode, setisEditMode] = useState(false);
  const initvalstate = {
    sbuName: "",
    znaSegmentId: "",
    description: "",
    isActive: false,
    isActiveEnable: true,
  };
  const [formIntialState, setformIntialState] = useState(initvalstate);

  const [editmodeName, seteditmodeName] = useState("");
  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({
      znasbuId: itemid,
    });
    setisEditMode(true);
    setformIntialState({
      ...response,
      isActiveEnable: frmOrg1SelectOptsObj[response.znaSegmentId]
        ? frmOrg1SelectOptsObj[response.znaSegmentId]["isActive"]
        : true,
    });
    seteditmodeName(response.sbuName);
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (editmodeName.toLowerCase() !== item.sbuName.toLowerCase()) {
      response = await checkNameExist({
        ZNAFieldName: item.sbuName,
        organisationtype: "org2",
      });
    }
    if (!response) {
      response = await postItem({
        ...item,
        createdById: item.createdById ? item.createdById : userProfile.userId,
        requesterUserId: userProfile.userId,
      });
      if (response) {
        //setselfilter(intialfilterval);
        getAll();
        hideAddPopup();
        alert(alertMessage.orgnization1.update);
      }
    } else {
      alert(alertMessage.orgnization1.nameExist);
    }
    setisEditMode(false);
    setformIntialState(initvalstate);
  };
  const postItemHandler = async (item) => {
    let response;
    response = await checkNameExist({
      ZNAFieldName: item.sbuName,
      OrganisationType: "org2",
    });
    if (!response) {
      response = await postItem({
        ...item,
        createdById: userProfile.userId,
        requesterUserId: userProfile.userId,
      });
      if (response) {
        //setselfilter(intialfilterval);
        getAll();
        hideAddPopup();
        alert(alertMessage.orgnization1.add);
      }
    } else {
      alert(alertMessage.orgnization1.nameExist);
    }
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.orgnization1.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({
      id: itemid,
      organisationtype: "org2",
    });
    if (!resonse) {
      resonse = await deleteItem({
        id: itemid,
        organisationtype: "org2",
      });
      if (resonse) {
        getAll();
        alert(alertMessage.orgnization1.delete);
      }
    } else {
      alert(alertMessage.orgnization1.isInUse);
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
      MasterType: "ZNAOrganization2",
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
      MasterType: "ZNAOrganization2",
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
      znasbuId: "",
      znaSegmentId: "",
    }
    if (isfilterApplied) {
      response.znasbuId = selfilter.znasbuId
      response.znaSegmentId = selfilter.znaSegmentId
    }
    const responsedata = await downloadExcel({
      ZNASBUId: response?.znasbuId,
      ZNASegmentId: response.znaSegmentId,
    }, "ZNAOrganization2");
    FileDownload(responsedata, templateName);
  }
  return (
    <>
      <div className="page-title">Manage ZNA Organization 2</div>
      <div className="page-filter">
        <div className="filter-container container">
          <div className="row">
            <div className="frm-filter col-md-4">
              <FrmSelect
                title={"ZNA Organization 1"}
                name={"znaSegmentId"}
                selectopts={org1FilterOpts}
                handleChange={onSearchFilterSelect}
                value={selfilter.znaSegmentId}
              />
            </div>
            <div className="frm-filter col-md-4">
              <FrmSelect
                title={"ZNA Organization 2"}
                name={"znasbuId"}
                selectopts={org2FilterOpts}
                handleChange={onSearchFilterSelect}
                value={selfilter.znasbuId}
              />
            </div>
          </div>
        </div>
        <div className="btn-container">
          <div
            className={`btn-blue ${
              selfilter.znaSegmentId === "" && selfilter.znasbuId === ""
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
        {znaorgnization2State.loading ? (
          <Loading />
        ) : znaorgnization2State.error ? (
          <div>{znaorgnization2State.error}</div>
        ) : (
          <PaginationData
            id={"znasbuId"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"ZNA Organization 2"}
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
          title={"Add/Edit ZNA Organization 2"}
          hideAddPopup={hideAddPopup}
          postItem={postItemHandler}
          putItem={putItemHandler}
          isEditMode={isEditMode}
          formIntialState={formIntialState}
          frmOrg1SelectOpts={frmOrg1SelectOpts}
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
  getAll: znaorgnization2Actions.getAll,
  getById: znaorgnization2Actions.getById,
  checkNameExist: znaorgnization2Actions.checkNameExist,
  checkIsInUse: znaorgnization2Actions.checkIsInUse,
  postItem: znaorgnization2Actions.postItem,
  deleteItem: znaorgnization2Actions.deleteItem,
  getAllOrgnization1: znaorgnization1Actions.getAllOrgnization,
  setMasterdataActive: commonActions.setMasterdataActive,
  getMasterVersion: commonActions.getMasterVersion,
  downloadExcel: commonActions.downloadExcel
};
export default connect(mapStateToProp, mapActions)(ZNAOrgnization2);
