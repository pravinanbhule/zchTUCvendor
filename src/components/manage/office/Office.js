import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { officeActions, commonActions } from "../../../actions";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";

import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
import AddEditForm from "./AddEditForm";
import Loading from "../../common-components/Loading";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort, formatDate } from "../../../helpers";
import { handlePermission } from "../../../permissions/Permission";
import VersionHistoryPopup from "../../versionhistorypopup/VersionHistoryPopup";
import { versionHistoryExcludeFields, versionHistoryexportDateFields, versionHistoryexportFieldTitles, versionHistoryexportHtmlFields } from "../../../constants/office.constants";
function Office({ ...props }) {
  const { officeState } = props.state;
  const {
    getAll,
    postItem,
    deleteItem,
    getById,
    checkNameExist,
    checkIsInUse,
    userProfile,
    setMasterdataActive,
    getMasterVersion
  } = props;
  useSetNavMenu({ currentMenu: "Office", isSubmenu: true }, props.menuClick);
  console.log(officeState);
  //initialize filter/search functionality
  const [isfilterApplied, setisfilterApplied] = useState(false);
  const [officeFilterOpts, setofficeFilterOpts] = useState([]);
  const intialFilterState = {
    office: "",
  };
  const [selfilter, setselfilter] = useState(intialFilterState);
  const onSearchFilterSelect = (name, value) => {
    setselfilter({ ...selfilter, [name]: value });
  };
  const handleFilterSearch = () => {
    if (selfilter.office !== "") {
      setisfilterApplied(true);
      let tempdata = [...data];
      tempdata = tempdata.filter((item) => selfilter.office === item.id);
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
    {
      dataField: "checkbox",
      text: "",
      hidden: handlePermission(window.location.pathname.slice(1), "isEdit") === true ? false : true,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <FrmActiveCheckbox
            name={row.officeId}
            value={dataActItems.officeId}
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
            rowid={row.officeId}
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
            rowid={row.officeId}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "70px", textAlign: "center" };
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
            onClick={() => handleDataVersion(row.officeId)}
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
      dataField: "officeId",
      text: "officeId",
      sort: true,
      hidden: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "left" };
      },
    },
    {
      dataField: "officeName",
      text: "Office",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "180px" };
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
      dataField: "officeDescription",
      text: "Description",
      sort: false,
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
    getAll();
  }, []);

  useEffect(() => {
    let tempdata = [];
    let tempFilterOpts = [];
    let initalval = {};
    officeState.items.forEach((item) => {
      //if (item.isActive) {
      let tempItem = {
        ...item,
        id: item.officeId,
        isActive: item.isActive ? "Active" : "Inactive",
      };
      initalval[tempItem.id] = false;
      tempdata.push(tempItem);
      tempFilterOpts.push({
        label: item.officeName,
        value: item.officeId,
      });

      //}
    });
    tempFilterOpts.sort(dynamicSort("label"));
    setdata([...tempdata]);
    //setpaginationdata([...tempdata]);
    setofficeFilterOpts([...tempFilterOpts]);
    setdataActItems(initalval);
  }, [officeState.items]);

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
    officeName: "",
    officeDescription: "",
    isActive: false,
  };
  const [formIntialState, setformIntialState] = useState(initvalstate);
  const [editmodeofficeName, seteditmodeofficeName] = useState("");
  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({ officeID: itemid });
    setisEditMode(true);
    setformIntialState({
      ...response,
      officeDescription: response.officeDescription
        ? response.officeDescription
        : "",
      requesterUserId: response.requesterUserId ? response.requesterUserId : "",
    });
    seteditmodeofficeName(response.officeName);
    showAddPopup();
  };

  const postItemHandler = async (item) => {
    let response = await checkNameExist({ officeName: item.officeName });
    if (!response) {
      response = await postItem({
        ...item,
        CreatedById: userProfile.userId,
        ModifiedById: userProfile.userId,
        requesterUserId: userProfile.userId,
      });
      if (response) {
        //setselfilter(intialFilterState);
        getAll();
        hideAddPopup();
        alert(alertMessage.office.add);
      }
    } else {
      alert(alertMessage.office.nameExist);
    }
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (editmodeofficeName.toLowerCase() !== item.officeName.toLowerCase()) {
      response = await checkNameExist({ officeName: item.officeName });
    }
    if (!response) {
      response = await postItem({
        ...item,
        ModifiedById: userProfile.userId,
        requesterUserId: userProfile.userId,
      });
      if (response) {
        //setselfilter(intialFilterState);
        getAll();
        hideAddPopup();
        alert(alertMessage.office.update);
      }
    } else {
      alert(alertMessage.office.nameExist);
    }
    setisEditMode(false);
    setformIntialState(initvalstate);
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.office.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({ officeId: itemid });
    if (!resonse) {
      resonse = await deleteItem({ officeId: itemid });
      if (resonse) {
        getAll();
        alert(alertMessage.office.delete);
      }
    } else {
      alert(alertMessage.office.isInUse);
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
      MasterType: "office",
    });
    setversionHistoryData(versiondata ? versiondata : []);
    setshowVersionHistory(true);
  };

  //added below code to set active/inactive state
  const selectedItems = [];
  const [selItemsList, setselItemsList] = useState([]);
  const [isActiveEnable, setisActiveEnable] = useState(false);
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
      MasterType: "office",
      IsActive: state,
    });
    if (response) {
      setselfilter(intialFilterState);
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
  return (
    <>
      <div className="page-title">Manage Office</div>
      <div className="page-filter">
        <div className="filter-container container">
          <div className="row">
            <div className="frm-filter col-md-4">
              <FrmSelect
                title={"Office"}
                name={"office"}
                selectopts={officeFilterOpts}
                handleChange={onSearchFilterSelect}
                value={selfilter.office}
              />
            </div>
          </div>
        </div>
        <div className="btn-container">
          <div
            className={`btn-blue ${selfilter.office === "" ? "disable" : ""}`}
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
        {officeState.loading ? (
          <Loading />
        ) : officeState.error ? (
          <div>{officeState.error}</div>
        ) : (
          <PaginationData
            id={"id"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"New Office"}
            setMasterdataActiveState={setMasterdataActiveState}
            isShowActiveBtns={true}
            ActiveBtnsState={isActiveEnable}
            ActiveSelectedItems={selItemsList}
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
  getAll: officeActions.getAll,
  postItem: officeActions.postItem,
  deleteItem: officeActions.deleteItem,
  getById: officeActions.getById,
  checkNameExist: officeActions.checkNameExist,
  checkIsInUse: officeActions.checkIsInUse,
  setMasterdataActive: commonActions.setMasterdataActive,
  getMasterVersion: commonActions.getMasterVersion,
};
export default connect(mapStateToProp, mapActions)(Office);
