import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { currencyActions, commonActions } from "../../../actions";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";

import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
import AddEditForm from "./AddEditForm";
import Loading from "../../common-components/Loading";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort } from "../../../helpers";
import { handlePermission } from "../../../permissions/Permission";
function Currency({ ...props }) {
  const { currencyState } = props.state;
  const {
    getAll,
    postItem,
    deleteItem,
    getById,
    checkNameExist,
    checkIsInUse,
    userProfile,
    setMasterdataActive,
  } = props;
  useSetNavMenu({ currentMenu: "Currency", isSubmenu: true }, props.menuClick);
  console.log(currencyState);
  //initialize filter/search functionality
  const [isfilterApplied, setisfilterApplied] = useState(false);
  const [currencyFilterOpts, setcurrencyFilterOpts] = useState([]);
  const intialFilterState = {
    currency: "",
  };
  const [selfilter, setselfilter] = useState(intialFilterState);
  const onSearchFilterSelect = (name, value) => {
    setselfilter({ ...selfilter, [name]: value });
  };
  const handleFilterSearch = () => {
    if (selfilter.currency !== "") {
      setisfilterApplied(true);
      let tempdata = [...data];
      tempdata = tempdata.filter((item) => selfilter.currency === item.id);
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
            name={row.currencyID}
            value={dataActItems.currencyID}
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
            rowid={row.currencyID}
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
            rowid={row.currencyID}
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
      dataField: "currencyID",
      text: "currencyID",
      sort: true,
      hidden: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "left" };
      },
    },
    {
      dataField: "currencyName",
      text: "Currency",
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
      dataField: "currencyDescription",
      text: "Description",
      sort: false,
    },
  ];
  const defaultSorted = [
    {
      dataField: "currencyName",
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
    currencyState.items.forEach((item) => {
      //if (item.isActive) {
      let tempItem = {
        ...item,
        id: item.currencyID,
        isActive: item.isActive ? "Active" : "Inactive",
      };
      initalval[tempItem.id] = false;
      tempdata.push(tempItem);
      tempFilterOpts.push({
        label: item.currencyName,
        value: item.currencyID,
      });

      //}
    });
    tempFilterOpts.sort(dynamicSort("label"));
    setdata([...tempdata]);
    //setpaginationdata([...tempdata]);
    setcurrencyFilterOpts([...tempFilterOpts]);
    setdataActItems(initalval);
  }, [currencyState.items]);

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
    currencyName: "",
    currencyDescription: "",
    isActive: false,
  };
  const [formIntialState, setformIntialState] = useState(initvalstate);
  const [editmodeCurrencyName, seteditmodeCurrencyName] = useState("");
  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({ currencyID: itemid });
    setisEditMode(true);
    setformIntialState({
      ...response,
      currencyDescription: response.currencyDescription
        ? response.currencyDescription
        : "",
      requesterUserId: response.requesterUserId ? response.requesterUserId : "",
    });
    seteditmodeCurrencyName(response.currencyName);
    showAddPopup();
  };

  const postItemHandler = async (item) => {
    let response = await checkNameExist({ currencyName: item.currencyName });
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
        alert(alertMessage.currency.add);
      }
    } else {
      alert(alertMessage.currency.nameExist);
    }
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (
      editmodeCurrencyName.toLowerCase() !== item.currencyName.toLowerCase()
    ) {
      response = await checkNameExist({ currencyName: item.currencyName });
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
        alert(alertMessage.currency.update);
      }
    } else {
      alert(alertMessage.currency.nameExist);
    }
    setisEditMode(false);
    setformIntialState(initvalstate);
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.currency.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({ currencyID: itemid });
    if (!resonse) {
      resonse = await deleteItem({ currencyID: itemid });
      if (resonse) {
        getAll();
        alert(alertMessage.currency.delete);
      }
    } else {
      alert(alertMessage.currency.isInUse);
    }
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
      MasterType: "currency",
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
      <div className="page-title">Manage Currency</div>
      <div className="page-filter">
        <div className="filter-container container">
          <div className="row">
            <div className="frm-filter col-md-4">
              <FrmSelect
                title={"Currency"}
                name={"currency"}
                selectopts={currencyFilterOpts}
                handleChange={onSearchFilterSelect}
                value={selfilter.currency}
              />
            </div>
          </div>
        </div>
        <div className="btn-container">
          <div
            className={`btn-blue ${selfilter.currency === "" ? "disable" : ""}`}
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
        {currencyState.loading ? (
          <Loading />
        ) : currencyState.error ? (
          <div>{currencyState.error}</div>
        ) : (
          <PaginationData
            id={"id"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"New Currency"}
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
    </>
  );
}
const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
const mapActions = {
  getAll: currencyActions.getAll,
  postItem: currencyActions.postItem,
  deleteItem: currencyActions.deleteItem,
  getById: currencyActions.getById,
  checkNameExist: currencyActions.checkNameExist,
  checkIsInUse: currencyActions.checkIsInUse,
  setMasterdataActive: commonActions.setMasterdataActive,
};
export default connect(mapStateToProp, mapActions)(Currency);
