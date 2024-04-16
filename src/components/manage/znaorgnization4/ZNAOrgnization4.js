import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { znaorgnization4Actions, commonActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort, formatDate } from "../../../helpers";
import AddEditForm from "./AddEditForm";
import { handlePermission } from "../../../permissions/Permission";
import VersionHistoryPopup from "../../versionhistorypopup/VersionHistoryPopup";
import { versionHistoryExcludeFields, versionHistoryexportDateFields, versionHistoryexportFieldTitles, versionHistoryexportHtmlFields } from "../../../constants/znaorgnization4.constants";
function ZNAOrgnization4({ ...props }) {
  const { znaorgnization4State } = props.state;
  const {
    getAll,
    getById,
    checkNameExist,
    checkIsInUse,
    postItem,
    deleteItem,
    userProfile,
    setMasterdataActive,
    getMasterVersion,
  } = props;
  useSetNavMenu(
    {
      currentMenu: "znaorganization4",
      isSubmenu: true,
    },
    props.menuClick
  );
  //initialize filter/search functionality
  const [isfilterApplied, setisfilterApplied] = useState(false);
  const [orgFilterOpts, setorgFilterOpts] = useState([]);
  const intialfilterval = {
    znaProductsName: "",
    description: "",
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
    if (selfilter.znaProductsId !== "") {
      setisfilterApplied(true);
      let tempdata = [...data];
      tempdata = tempdata.filter((item) => {
        let isShow = true;
        if (
          isShow &&
          selfilter.znaProductsId !== "" &&
          item.znaProductsId !== selfilter.znaProductsId
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
            name={row.znaProductsId}
            value={dataActItems.znaProductsId}
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
            rowid={row.znaProductsId}
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
            rowid={row.znaProductsId}
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
            onClick={() => handleDataVersion(row.znaProductsId)}
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
      dataField: "znaProductsName",
      text: "ZNA Organization 4",
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
      dataField: "znaProductsName",
      order: "asc",
    },
  ];
  useEffect(() => {
    getAll({
      RequesterUserId: userProfile.userId,
    });
  }, []);
  useEffect(() => {
    let tempdata = [];
    let tempOrgFilterOpts = [];
    let initalval = {};
    znaorgnization4State.items.forEach((item) => {
      // if (item.isActive) {
      tempdata.push({
        ...item,
        isActive: item.isActive ? "Active" : "Inactive",
      });
      initalval[item.znaProductsId] = false;
      tempOrgFilterOpts.push({
        label: item.znaProductsName,
        value: item.znaProductsId,
      });
      // }
    });
    setdata([...tempdata]);
    //setpaginationdata([...tempdata]);
    setdataActItems(initalval);
    tempOrgFilterOpts.sort(dynamicSort("label"));
    setorgFilterOpts([...tempOrgFilterOpts]);
  }, [znaorgnization4State.items]);

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
    znaProductsName: "",
    description: "",
    isActive: false,
  };
  const [formIntialState, setformIntialState] = useState(initvalstate);

  const [editmodeName, seteditmodeName] = useState("");
  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({
      znaProductsId: itemid,
    });
    setisEditMode(true);
    setformIntialState({
      ...response,
    });
    seteditmodeName(response.znaProductsName);
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (editmodeName.toLowerCase() !== item.znaProductsName.toLowerCase()) {
      response = await checkNameExist({
        ZNAFieldName: item.znaProductsName,
        organisationtype: "org4",
      });
    }
    if (!response) {
      response = await postItem({
        ...item,
        createdById: item.createdById ? item.createdById : userProfile.userId,
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
      ZNAFieldName: item.znaProductsName,
      OrganisationType: "org4",
    });
    if (!response) {
      response = await postItem({
        ...item,
        createdById: userProfile.userId,
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
      organisationtype: "org4",
    });
    if (!resonse) {
      resonse = await deleteItem({
        id: itemid,
        organisationtype: "org4",
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
      MasterType: "ZNAOrganization4",
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
    let selectedItems = [...selItemsList];
    let response = await setMasterdataActive({
      TempId: selectedItems.join(","),
      MasterType: "znaorg4",
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
  return (
    <>
      <div className="page-title">Manage ZNA Organization 4</div>
      <div className="page-filter">
        <div className="filter-container container">
          <div className="row">
            <div className="frm-filter col-md-4">
              <FrmSelect
                title={"ZNA Organization 4"}
                name={"znaProductsId"}
                selectopts={orgFilterOpts}
                handleChange={onSearchFilterSelect}
                value={selfilter.znaProductsId}
              />
            </div>
          </div>
        </div>
        <div className="btn-container">
          <div
            className={`btn-blue ${
              selfilter.znaProductsId === "" ? "disable" : ""
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
        {znaorgnization4State.loading ? (
          <Loading />
        ) : znaorgnization4State.error ? (
          <div>{znaorgnization4State.error}</div>
        ) : (
          <PaginationData
            id={"znaProductsId"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"ZNA Organization 4"}
            setMasterdataActiveState={setMasterdataActiveState}
            isShowActiveBtns={true}
            ActiveBtnsState={isActiveEnable}
            ActiveSelectedItems={selItemsList}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
          title={"Add/Edit ZNA Organization 4"}
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
  getAll: znaorgnization4Actions.getAll,
  getById: znaorgnization4Actions.getById,
  checkNameExist: znaorgnization4Actions.checkNameExist,
  checkIsInUse: znaorgnization4Actions.checkIsInUse,
  postItem: znaorgnization4Actions.postItem,
  deleteItem: znaorgnization4Actions.deleteItem,
  setMasterdataActive: commonActions.setMasterdataActive,
  getMasterVersion: commonActions.getMasterVersion,
};
export default connect(mapStateToProp, mapActions)(ZNAOrgnization4);
