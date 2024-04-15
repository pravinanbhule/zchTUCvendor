import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { branchActions, commonActions, countryActions } from "../../../actions";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";

import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
import AddEditForm from "./AddEditForm";
import Loading from "../../common-components/Loading";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort, formatDate } from "../../../helpers";
import { handlePermission } from "../../../permissions/Permission";
import VersionHistoryPopup from "../../versionhistorypopup/VersionHistoryPopup";
import { BranchVersionHistoryExcludeFields, BranchVersionHistoryexportDateFields, BranchVersionHistoryexportFieldTitles, BranchVersionHistoryexportHtmlFields } from "../../../constants";
function Branch({ ...props }) {
  const { branchState, countryState } = props.state;
  const {
    getAll,
    getAllCountry,
    postItem,
    deleteItem,
    getById,
    checkNameExist,
    checkIsInUse,
    userProfile,
    setMasterdataActive,
    getMasterVersion
  } = props;
  useSetNavMenu({ currentMenu: "Branch", isSubmenu: true }, props.menuClick);
  console.log(branchState);
  //initialize filter/search functionality
  const [isfilterApplied, setisfilterApplied] = useState(false);
  const [branchFilterOpts, setbranchFilterOpts] = useState([]);
  const [countryFilterOpts, setcountryFilterOpts] = useState([]);
  const intialFilterState = {
    branch: "",
    country: "",
  };
  const selectInitiVal = {
    label: "Select",
    value: "",
  };
  const [selfilter, setselfilter] = useState(intialFilterState);
  const onSearchFilterSelect = (name, value) => {
    setselfilter({ ...selfilter, [name]: value });
  };
  const handleFilterSearch = () => {
    if (selfilter.branch !== "" || selfilter.country !== "") {
      setisfilterApplied(true);
      let tempdata = [...data];

      tempdata = tempdata.filter((item) => {
        let isShow = true;
        if (isShow && selfilter.branch !== "" && item.id !== selfilter.branch) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.country !== "" &&
          item.country !== selfilter.country
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
    setselfilter(intialFilterState);
    setpaginationdata(data);
  };

  const [frmCountrySelectOpts, setfrmCountrySelectOpts] = useState([]);

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
            name={row.branchId}
            value={dataActItems.branchId}
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
            rowid={row.branchId}
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
            rowid={row.branchId}
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
            onClick={() => handleDataVersion(row.branchId)}
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
      dataField: "branchId",
      text: "branchId",
      sort: true,
      hidden: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "left" };
      },
    },
    {
      dataField: "branchName",
      text: "Branch",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "180px" };
      },
    },
    {
      dataField: "countryName",
      text: "Country",
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
      dataField: "branchDescription",
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
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    }
  ];
  const defaultSorted = [
    {
      dataField: "branchName",
      order: "asc",
    },
  ];
  useEffect(() => {
    getAll();
    getAllCountry();
  }, []);

  useEffect(() => {
    let tempdata = [];
    let tempFilterOpts = [];
    let initalval = {};
    debugger;
    branchState.items.forEach((item) => {
      //if (item.isActive) {
      let tempItem = {
        ...item,
        id: item.branchId,
        isActive: item.isActive ? "Active" : "Inactive",
      };
      initalval[tempItem.id] = false;
      tempdata.push(tempItem);
      tempFilterOpts.push({
        label: item.branchName,
        value: item.branchId,
      });

      //}
    });
    tempFilterOpts.sort(dynamicSort("label"));
    setdata([...tempdata]);
    //setpaginationdata([...tempdata]);
    setbranchFilterOpts([...tempFilterOpts]);
    setdataActItems(initalval);
  }, [branchState.items]);

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
    countryselectOpts.sort(dynamicSort("label"));
    setfrmCountrySelectOpts([selectInitiVal, ...countryselectOpts]);
    setcountryFilterOpts([selectInitiVal, ...countryselectOpts]);
    debugger;
  }, [countryState.countryItems]);

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
    branchName: "",
    country: "",
    branchDescription: "",
    isActive: false,
  };
  const [formIntialState, setformIntialState] = useState(initvalstate);
  const [editmodeBranchName, seteditmodeBranchName] = useState("");
  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({ branchId: itemid });
    setisEditMode(true);
    setformIntialState({
      ...response,
      branchDescription: response.branchDescription
        ? response.branchDescription
        : "",
      requesterUserId: response.requesterUserId ? response.requesterUserId : "",
    });
    seteditmodeBranchName(response.branchName);
    showAddPopup();
  };

  const postItemHandler = async (item) => {
    let response = await checkNameExist({ branchName: item.branchName });
    if (!response) {
      response = await postItem({
        ...item,
        CreatedById: userProfile.userId,
        ModifiedById: userProfile.userId,
      });
      if (response) {
        //setselfilter(intialFilterState);
        getAll();
        hideAddPopup();
        alert(alertMessage.branch.add);
      }
    } else {
      alert(alertMessage.branch.nameExist);
    }
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (editmodeBranchName.toLowerCase() !== item.branchName.toLowerCase()) {
      response = await checkNameExist({ branchName: item.branchName });
    }
    if (!response) {
      response = await postItem({
        ...item,
        ModifiedById: userProfile.userId,
      });
      if (response) {
        //setselfilter(intialFilterState);
        getAll();
        hideAddPopup();
        alert(alertMessage.branch.update);
      }
    } else {
      alert(alertMessage.branch.nameExist);
    }
    setisEditMode(false);
    setformIntialState(initvalstate);
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.branch.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({ branchId: itemid });
    if (!resonse) {
      resonse = await deleteItem({ branchId: itemid });
      if (resonse) {
        getAll();
        alert(alertMessage.branch.delete);
      }
    } else {
      alert(alertMessage.branch.isInUse);
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
      MasterType: "branch",
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
      MasterType: "branch",
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
      <div className="page-title">Manage Branch</div>
      <div className="page-filter">
        <div className="filter-container container">
          <div className="row">
            <div className="frm-filter col-md-4">
              <FrmSelect
                title={"Branch"}
                name={"branch"}
                selectopts={branchFilterOpts}
                handleChange={onSearchFilterSelect}
                value={selfilter.branch}
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
              selfilter.branch === "" && selfilter.country === ""
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
        {branchState.loading ? (
          <Loading />
        ) : branchState.error ? (
          <div>{branchState.error}</div>
        ) : (
          <PaginationData
            id={"id"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"New Branch"}
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
          frmCountrySelectOpts={frmCountrySelectOpts}
        ></AddEditForm>
      ) : (
        ""
      )}
      {showVersionHistory ? (
        <VersionHistoryPopup
          versionHistoryData={versionHistoryData}
          hidePopup={hideVersionHistoryPopup}
          exportFieldTitles={BranchVersionHistoryexportFieldTitles}
          exportDateFields={BranchVersionHistoryexportDateFields}
          exportHtmlFields={BranchVersionHistoryexportHtmlFields}
          versionHistoryExcludeFields={BranchVersionHistoryExcludeFields}
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
  getAll: branchActions.getAll,
  getAllCountry: countryActions.getAllCountry,
  postItem: branchActions.postItem,
  deleteItem: branchActions.deleteItem,
  getById: branchActions.getById,
  checkNameExist: branchActions.checkNameExist,
  checkIsInUse: branchActions.checkIsInUse,
  setMasterdataActive: commonActions.setMasterdataActive,
  getMasterVersion: commonActions.getMasterVersion,
};
export default connect(mapStateToProp, mapActions)(Branch);
