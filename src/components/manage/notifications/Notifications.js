import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { officeActions, commonActions, notificationsActions, lookupActions, countryActions } from "../../../actions";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";

import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
import AddEditForm from "./AddEditForm";
import Loading from "../../common-components/Loading";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort, formatDate } from "../../../helpers";
import { handlePermission } from "../../../permissions/Permission";
import VersionHistoryPopup from "../../versionhistorypopup/VersionHistoryPopup";
import { versionHistoryExcludeFields, versionHistoryexportDateFields, versionHistoryexportFieldTitles, versionHistoryexportHtmlFields } from "../../../constants/notifications.constants";
function Notifications({ ...props }) {
  const { officeState, notificationsState, lookupState, countryState } = props.state;
  const {
    getAll,
    getLogTypes,
    getLookupByType,
    getAllCountry,
    postItem,
    deleteItem,
    getById,
    userProfile,
    setMasterdataActive,
    getMasterVersion,
    downloadExcel,
    checkNameExist
  } = props;
  const FileDownload = require("js-file-download");
  const templateName = "Notifications.xlsx";
  useSetNavMenu({ currentMenu: "notifications", isSubmenu: true }, props.menuClick);
  //initialize filter/search functionality
  const [isfilterApplied, setisfilterApplied] = useState(false);
  const [notificationsFilterOpts, setnotificationsFilterOpts] = useState([
    {
      label: "Breach Logs",
      value: "breachlogs"
    },
    {
      label: "RFE Logs",
      value: "rfelogs"
    },
    {
      label: "Exemption Logs / ZUG",
      value: "zug"
    },
    {
      label: "Exemption Logs / URPM",
      value: "urpm"
    },
  ]);
  const intialFilterState = {
    notifications: "breachlogs",
  };
  const [selfilter, setselfilter] = useState(intialFilterState);
  const [countryAllOpts, setcountryAllOpts] = useState([]);
  const [logNotificationOpts, setLogNotificationOpts] = useState([]);
  const onSearchFilterSelect = (name, value) => {
    setselfilter({ ...selfilter, [name]: value });
  };
  const handleFilterSearch = () => {
    if (selfilter.notifications !== "") {
      setisfilterApplied(true);
      let tempdata = [...data];
      tempdata = tempdata.filter((item) => selfilter.notifications === item.logType);
      setpaginationdata(tempdata);
    }
  };
  const clearFilter = () => {
    setisfilterApplied(false);
    setselfilter(intialFilterState);
    setpaginationdata(data);
  };

  //set pagination data and functionality
  const [dataActItems, setdataActItems] = useState({});
  const [data, setdata] = useState([]);
  const [paginationdata, setpaginationdata] = useState([]);
  const columns = [
    // {
    //   dataField: "checkbox",
    //   text: "",
    //   hidden: handlePermission(window.location.pathname.slice(1), "isEdit") === true ? false : true,
    //   formatter: (cell, row, rowIndex, formatExtraData) => {
    //     return (
    //       <FrmActiveCheckbox
    //         name={row.officeId}
    //         value={dataActItems.officeId}
    //         handleChange={handleItemSelect}
    //         isdisabled={false}
    //       />
    //     );
    //   },
    //   sort: false,
    //   headerStyle: (colum, colIndex) => {
    //     return { width: "40px", textAlign: "center" };
    //   },
    // },
    {
      dataField: "editaction",
      text: "Edit",
      hidden: handlePermission(window.location.pathname.slice(1), "isEdit") === true ? false : true,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="edit-icon"
            onClick={handleEdit}
            rowid={row.logNotificationId}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "65px", textAlign: "center" };
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
            rowid={row.logNotificationId}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "70px", textAlign: "center" };
      },
      align: "center",
    },
    // {
    //   dataField: "DataVersion",
    //   text: "Data Version",
    //   formatter: (cell, row, rowIndex, formatExtraData) => {
    //     return (
    //       <div
    //         className="versionhistory-icon"
    //         onClick={() => handleDataVersion(row.logNotificationId)}
    //         mode={"view"}
    //       ></div>
    //     );
    //   },
    //   sort: false,
    //   headerStyle: (colum, colIndex) => {
    //     return {
    //       width: "100px",
    //       textAlign: "center",
    //     };
    //   },
    // },
    {
      dataField: "logNotificationId",
      text: "logNotificationId",
      sort: true,
      hidden: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "left" };
      },
    },
    // {
    //   dataField: "logType",
    //   text: "Log Type",
    //   sort: true,
    //   headerStyle: (colum, colIndex) => {
    //     return { width: "180px" };
    //   },
    // },
    {
      dataField: "logNotificationValue",
      text: "Log Notification",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "countryName",
      text: "Country",
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
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    }
  ];
  const defaultSorted = [
    {
      dataField: "officeName",
      order: "asc",
    },
  ];

  useEffect(() => {
    getAll({
      LogType: selfilter.notifications
    });
  }, [selfilter.notifications])

  useEffect(() => {
    getLookupByType({
      LookupType: "LogNotification"
    });
    getAllCountry({ IsLog: true });
  }, []);

  useEffect(() => {
    console.log("lookupState.lookupbytyps>>", lookupState.lookupbytyps);
    if (lookupState.lookupbytyps.length > 0) {
      let templookuptypes = [];
      lookupState.lookupbytyps.forEach((item) => {
        templookuptypes.push({
          label: item.lookUpName,
          value: item.lookupID,
        });
      });
      templookuptypes.sort(dynamicSort("label"));
      setLogNotificationOpts(templookuptypes);
    }
  }, [lookupState.lookupbytyps])

  useEffect(() => {
    let selectOpts = [];
    countryState.countryItems.forEach((item) => {
      selectOpts.push({
        ...item,
        label: item.countryName.trim(),
        value: item.countryID,
      });
    });
    selectOpts.sort(dynamicSort("label"));
    setcountryAllOpts([...selectOpts]);
  }, [countryState.countryItems]);

  useEffect(() => {
    let tempdata = [];
    let initalval = {};
    notificationsState.items.forEach((item) => {
      let tempItem = {
        ...item,
        id: item.logNotificationId,
      };
      initalval[tempItem.id] = false;
      tempdata.push(tempItem);
    });
    // tempFilterOpts.sort(dynamicSort("label"));
    setdata([...tempdata]);
    setdataActItems(initalval);
  }, [notificationsState.items]);

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
  const [editmodeName, seteditmodeName] = useState("");
  const initvalstate = {
    logType: "",
    logNotification: [],
    countryId: "",
  };
  const [formIntialState, setformIntialState] = useState(initvalstate);
  const [editmodeofficeName, seteditmodeofficeName] = useState("");
  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({ LogNotificationId: itemid });
    let logNotificationList = [];
    let logNotificationIds = response[0]?.logNotification.split(",")
    lookupState.lookupbytyps.forEach((item) => {
      logNotificationIds.map((notifications) => {
        if (item.lookupID === notifications) {
          logNotificationList.push({
            label: item.lookUpName,
            value: item.lookupID,
          })
        }
      })
    });
    setTimeout(() => {
      setformIntialState({
        ...response[0],
        logNotification: logNotificationList,
        requesterUserId: response.requesterUserId ? response.requesterUserId : "",
      });
      setisEditMode(true);
      seteditmodeName(response[0].countryId);
      showAddPopup();
    }, 2000);
  };

  const postItemHandler = async (item) => {
    let templogNotificationList = item?.logNotification.map((item) => item.value);
    templogNotificationList = [...templogNotificationList].join(
      ","
    );
    let response = await checkNameExist({
      CountryId: item.countryId,
    });
    if (!response) {
      response = await postItem({
        ...item,
        logNotification: templogNotificationList,
        CreatedById: userProfile.userId,
        ModifiedById: userProfile.userId,
        requesterUserId: userProfile.userId,
      });
      if (response) {
        //setselfilter(intialFilterState);
        getAll({
          LogType: selfilter.notifications
        });
        hideAddPopup();
        alert(alertMessage.notifications.add);
      }
    } else {
      alert(alertMessage.notifications.nameExist);
    }
  };
  const putItemHandler = async (item) => {
    let response = false;
    console.log(editmodeName, item);
    if (editmodeName.toLowerCase() !== item.countryId.toLowerCase()) {
      response = await checkNameExist({
        CountryId: item.countryId,
      });
    }
    let templogNotificationList = item?.logNotification.map((item) => item.value);
    templogNotificationList = [...templogNotificationList].join(
      ","
    );
    if (!response) {
      response = await postItem({
        ...item,
        logNotification: templogNotificationList,
        ModifiedById: userProfile.userId,
        requesterUserId: userProfile.userId,
      });
      if (response) {
        //setselfilter(intialFilterState);
        getAll({
          LogType: selfilter.notifications
        });
        hideAddPopup();
        setisEditMode(false);
        setformIntialState(initvalstate);
        seteditmodeName('');
        alert(alertMessage.notifications.update);
      }
    } else {
      alert(alertMessage.notifications.nameExist);
    }
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.notifications.deleteConfirm)) {
      return;
    }
    let resonse = await deleteItem({ LogNotificationId: itemid });
    if (resonse) {
      getAll({
        LogType: selfilter.notifications
      });
      alert(alertMessage.notifications.delete);
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
      MasterType: "notifications",
    });
    setversionHistoryData(versiondata ? versiondata : []);
    setshowVersionHistory(true);
  };

  // //added below code to set active/inactive state
  // const selectedItems = [];
  // const [selItemsList, setselItemsList] = useState([]);
  // const [isActiveEnable, setisActiveEnable] = useState(false);
  // const [isDownloadEnable, setisDownloadEnable] = useState(true);
  // const handleItemSelect = async (e) => {
  //   let { name, value } = e.target;
  //   value = e.target.checked;
  //   setdataActItems({ ...dataActItems, [name]: value });
  //   if (value && !selectedItems.includes(name)) {
  //     selectedItems.push(name);
  //   } else {
  //     const index = selectedItems.indexOf(name);
  //     if (index > -1) {
  //       selectedItems.splice(index, 1);
  //     }
  //   }
  //   if (selectedItems.length) {
  //     setisActiveEnable(true);
  //     setselItemsList([...selectedItems]);
  //   } else {
  //     setisActiveEnable(false);
  //   }
  // };

  // const setMasterdataActiveState = async (state) => {
  //   let response = await setMasterdataActive({
  //     TempId: selItemsList.join(","),
  //     MasterType: "notifications",
  //     IsActive: state,
  //   });
  //   if (response) {
  //     setselfilter(intialFilterState);
  //     setselItemsList([]);
  //     setisActiveEnable(false);
  //     getAll();
  //     if (state) {
  //       alert(alertMessage.commonmsg.masterdataActive);
  //     } else {
  //       alert(alertMessage.commonmsg.masterdataInActive);
  //     }
  //   }
  // };
  const handleDownload = async () => {
    let response = {
      officeId: "",
    }
    // if (isfilterApplied && selItemsList.length === 0) {
    response.officeId = selfilter.notifications
    // }
    const responsedata = await downloadExcel({
      OfficeId: response?.officeId,
    }, "Notifications");
    FileDownload(responsedata, templateName);
  }
  return (
    <>
      <div className="page-title">Manage Notifications</div>
      <div className="page-filter">
        <div className="filter-container container">
          <div className="row">
            <div className="frm-filter col-md-4">
              <FrmSelect
                title={"Log Type"}
                name={"notifications"}
                selectopts={notificationsFilterOpts}
                handleChange={onSearchFilterSelect}
                value={selfilter.notifications}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        {notificationsState.loading ? (
          <Loading />
        ) : notificationsState.error ? (
          <div>{notificationsState.error}</div>
        ) : (
          <PaginationData
            id={"id"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"New Notifications"}
            // setMasterdataActiveState={setMasterdataActiveState}
            // isShowActiveBtns={true}
            // ActiveBtnsState={isActiveEnable}
            // ActiveSelectedItems={selItemsList}
            isShowDownloadBtn={false}
            DownloadBtnState={paginationdata.length !== 0 ? true : false}
            handleDownload={handleDownload}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
          hideAddPopup={hideAddPopup}
          postItem={postItemHandler}
          putItem={putItemHandler}
          isEditMode={isEditMode}
          formIntialState={formIntialState}
          logTypeOps={notificationsFilterOpts}
          countryAllOpts={countryAllOpts}
          logNotificationOpts={logNotificationOpts}
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
  getAll: notificationsActions.getAll,
  postItem: notificationsActions.postItem,
  deleteItem: notificationsActions.deleteItem,
  getById: notificationsActions.getById,
  checkNameExist: notificationsActions.checkNameExist,
  getLookupByType: lookupActions.getLookupByType,
  getLogTypes: lookupActions.getLogTypes,
  getAllCountry: countryActions.getAllCountry,
  setMasterdataActive: commonActions.setMasterdataActive,
  getMasterVersion: commonActions.getMasterVersion,
  downloadExcel: commonActions.downloadExcel
};
export default connect(mapStateToProp, mapActions)(Notifications);
