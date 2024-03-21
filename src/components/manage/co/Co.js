import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { coActions, commonActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, formatDate } from "../../../helpers";
import AddEditForm from "./AddEditFrom";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
import VersionHistoryPopup from "../../versionhistorypopup/VersionHistoryPopup";
import { versionHistoryExcludeFields, versionHistoryexportDateFields, versionHistoryexportFieldTitles, versionHistoryexportHtmlFields } from "./Coconstants";
function Co({ ...props }) {
  const { coState } = props.state;
  const {
    getAll,
    putItem,
    postItem,
    deleteItem,
    userProfile,
    setMasterdataActive,
    checkIsInUse,
    checkNameExist,
    downloadCO,
    getById,
    getMasterVersion
  } = props;
  const FileDownload = require("js-file-download");
  const templateName = "COs.xlsx";
  useSetNavMenu({ currentMenu: "CO", isSubmenu: true }, props.menuClick);
  //set pagination data and functionality
  const [dataActItems, setdataActItems] = useState({});
  const [data, setdata] = useState([]);
  const [paginationdata, setpaginationdata] = useState([]);
  const columns = [
    {
      dataField: "checkbox",
      text: "",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <FrmActiveCheckbox
            name={row.coId}
            value={dataActItems.coId}
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
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div className="edit-icon" onClick={handleEdit} rowid={row.coId}></div>
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
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="delete-icon"
            onClick={handleDelete}
            rowid={row.coId}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "70px",
          textAlign: "center"
        };
      }
    },
    // {
    //   dataField: "DataVersion",
    //   text: "Data Version",
    //   formatter: (cell, row, rowIndex, formatExtraData) => {
    //     return (
    //       <div
    //         className="versionhistory-icon"
    //         onClick={() => handleDataVersion(row.coId)}
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
      dataField: "coName",
      text: "CO Name",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "left" };
      },
    },
    {
      dataField: "coDescription",
      text: "Description",
      sort: false,
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
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell === true ? "Active" : "Inactive"}</span>;
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
      dataField: "coName",
      order: "asc",
    },
  ];

  useEffect(() => {
    setpaginationdata([...data]);
  }, [data]);

  useEffect(() => {
    fnOnInit();
  }, []);

  const fnOnInit = async () => {
    getAll();
  };

  useEffect(() => {
    let tempdata = [];
    let initalval = {};
    coState.items.forEach((item) => {
      tempdata.push(item)
    });
    setdata([...tempdata]);
    setdataActItems(initalval);
  }, [coState.items]);

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
    coName: "",
    coDescription: "",
    coId: "",
    isActive: false 
  };
  const [isEditMode, setisEditMode] = useState(false);
  const [formIntialState, setformIntialState] = useState(initvalstate);
  const [editmodeCOName, seteditmodeCOName] = useState("");
  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({ COId: itemid });
    setisEditMode(true);
    setformIntialState({
      ...response,
      coDescription: response.coDescription
      ? response.coDescription
      : "",
      requesterUserId: response.requesterUserId ? response.requesterUserId : "",
    })
    seteditmodeCOName(response.coName)
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (editmodeCOName.replace(/\s+$/, '').toLowerCase() !== item.coName.replace(/\s+$/, '').toLowerCase()) {
      response = await checkNameExist({ COName: item.coName });
    }
    if (!response) {
      response = await putItem({
        ...item,
      });
      if (response) {
        getAll();
        hideAddPopup();
        alert(alertMessage.co.update);
      }
      setisEditMode(false);
      setformIntialState(initvalstate);
    } else {
      alert(alertMessage.co.nameExist);
    }
  };
  const postItemHandler = async (item) => {
    let response = await checkNameExist({ COName: item.coName });
    if (!response) {
      response = await postItem({
        ...item
      });
      if (response) {
        getAll();
        hideAddPopup();
        alert(alertMessage.co.add);
      }
    } else {
      alert(alertMessage.co.nameExist);
    }
  };
 
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.co.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({ COId: itemid });
    if (!resonse) {
      resonse = await deleteItem({ COId: itemid });
      if (resonse) {
        getAll();
        alert(alertMessage.co.delete);
      }
    } else {
      alert(alertMessage.co.isInUse);
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
      MasterType: "CO",
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
    setdataActItems({ ...dataActItems, [name]: value });
    if (value && !selectedItems.includes(name)) {
      selectedItems.push(name);
    } else {
      const index = selectedItems.indexOf(name);
      if (index > -1) {
        selectedItems.splice(index, 1);
      }
    }
    if (selectedItems.length > 1) {
      setisDownloadEnable(false)
    } else {
      setisDownloadEnable(true)
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
      MasterType: "CO",
      IsActive: state,
    });
    if (response) {
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
      coName: "",
      coDescription: ""
    }
    if (selItemsList && selItemsList.length === 1) {
      response = await getById({ COId: selItemsList[0] });
    }
    const responsedata = await downloadCO({COName: response.coName , coDescription: response.coDescription});
    FileDownload(responsedata, templateName);
  }

  return (
    <>
      <div className="page-title">Manage CO</div>
      <div className="page-filter"></div>
      <div>
        {coState.loading ? (
          <Loading />
        ) : coState.error ? (
          <div>{coState.error}</div>
        ) : (
          <PaginationData
            id={"coId"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"New CO"}
            setMasterdataActiveState={setMasterdataActiveState}
            isShowActiveBtns={true}
            ActiveBtnsState={isActiveEnable}
            ActiveSelectedItems={selItemsList}
            // isShowDownloadBtn={true}
            // DownloadBtnState={isDownloadEnable}
            handleDownload={handleDownload}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
          title={"Add / Edit CO"}
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
  getAll: coActions.getAll,
  getById: coActions.getById,
  postItem: coActions.postItem,
  putItem: coActions.putItem,
  deleteItem: coActions.deleteItem,
  checkIsInUse: coActions.checkIsInUse,
  setMasterdataActive: commonActions.setMasterdataActive,
  checkNameExist: coActions.checkNameExist,
  downloadCO: coActions.downloadCO,
  getMasterVersion: commonActions.getMasterVersion,
};
export default connect(mapStateToProp, mapActions)(Co);
