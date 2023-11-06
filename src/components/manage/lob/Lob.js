import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { lobActions, countryActions, commonActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort } from "../../../helpers";
import AddEditForm from "./AddEditFrom";
import UserProfile from "../../common-components/UserProfile";

function Lob({ ...props }) {
  const { lobState, countryState } = props.state;
  const {
    getAll,
    getAllCountry,
    getAllApprover,
    getById,
    checkNameExist,
    checkIsInUse,
    postItem,
    deleteItem,
    userProfile,
    setMasterdataActive,
  } = props;

  useSetNavMenu({ currentMenu: "Lob", isSubmenu: true }, props.menuClick);
  //initialize filter/search functionality
  const [isfilterApplied, setisfilterApplied] = useState(false);
  const [countryFilterOpts, setcountryFilterOpts] = useState([]);
  const [lobFilterOpts, setlobFilterOpts] = useState([]);
  const intialfilterval = {
    lob: "",
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
    if (selfilter.lob !== "" || selfilter.country !== "") {
      setisfilterApplied(true);
      let tempdata = [...data];
      tempdata = tempdata.filter((item) => {
        let isShow = true;
        if (isShow && selfilter.lob !== "" && item.lobid !== selfilter.lob) {
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
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <FrmActiveCheckbox
            name={row.lobid}
            value={dataActItems.lobid}
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
          <div
            className="edit-icon"
            onClick={handleEdit}
            rowid={row.lobid}
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
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="delete-icon"
            onClick={handleDelete}
            rowid={row.lobid}
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
      dataField: "lobName",
      text: "LoB",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "220px" };
      },
    },
    {
      dataField: "countryList",
      text: "Country",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "180px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? cell : "-"}</span>;
      },
    },
    {
      dataField: "durationofApprovalValue",
      text: "Duration of the approval",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
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
      dataField: "lobApproverList",
      text: "Approver",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div className="approver-container">
            {getApproverBlock(cell, row)}
          </div>
        );
      },
    },
    {
      dataField: "lobDescription",
      text: "Description",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "350px" };
      },
    },
  ];
  const getApproverBlock = (cell, row) => {
    const approverList = row.aproverList ? row.aproverList : [];
    if (approverList.length) {
      const approverUser = approverList[0];
      const username = approverUser.firstName + " " + approverUser.lastName;
      const userEmail = approverUser.emailAddress;
      const imagePath = approverUser.profileImagePath;
      let otherapprovers = [];
      if (approverList.length > 1) {
        for (let i = 1; i < approverList.length; i++) {
          let item = approverList[i];
          otherapprovers.push(item.emailAddress);
        }
      }
      return (
        <>
          <UserProfile
            username={username}
            userEmail={userEmail}
            imagePath={imagePath}
          ></UserProfile>
          {approverList.length > 1 ? (
            <div
              className="approver-count"
              alt={otherapprovers.join("\n")}
              title={otherapprovers.join("\n")}
            >
              +{approverList.length - 1}
            </div>
          ) : (
            ""
          )}
        </>
      );
    } else {
      return "";
    }
  };
  const defaultSorted = [
    {
      dataField: "lobName",
      order: "asc",
    },
  ];

  useEffect(() => {
    getAll({ RequesterUserId: userProfile.userId });
    getAllCountry();
  }, []);
  useEffect(() => {
    let tempdata = [];
    let templobFilterOpts = [];
    let tempCountryFilterOpts = [];
    let tempdoaFilterOpts = [];
    let tempCountryObj = {};
    let initalval = {};
    lobState.items.forEach((item) => {
      // if (item.isActive) {
      tempdata.push({
        ...item,
        isActive: item.isActive ? "Active" : "Inactive",
      });
      initalval[item.lobid] = false;
      templobFilterOpts.push({
        label: item.lobName,
        value: item.lobid,
      });
      let coutrylist = item.countryList;
      if (coutrylist) {
        coutrylist = coutrylist.split(",");
        coutrylist.forEach((countryItem) => {
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
    tempCountryFilterOpts.sort(dynamicSort("label"));
    templobFilterOpts.sort(dynamicSort("label"));
    setdata([...tempdata]);
    //setpaginationdata([...tempdata]);
    setdataActItems(initalval);
    setlobFilterOpts([...templobFilterOpts]);
    setcountryFilterOpts([...tempCountryFilterOpts]);
  }, [lobState.items]);

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
    getAllApprover({ UserName: "#$%" });
  };

  const [isEditMode, setisEditMode] = useState(false);
  const initvalstate = {
    lobName: "",
    countryList: [],
    lobApproverList: [],
    lobDescription: "",
    isActive: false,
  };
  const [formIntialState, setformIntialState] = useState(initvalstate);

  const [editmodeName, seteditmodeName] = useState("");
  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({
      lobid: itemid,
    });
    let selectedCountryList = [];
    if (response.lobCountryList) {
      selectedCountryList = response.lobCountryList.map((item) => {
        return {
          label: item.countryName,
          value: item.countryID,
        };
      });
    }
    if (selectedCountryList.length === frmCountrySelectOpts.length - 1) {
      selectedCountryList = [
        { label: "All", value: "*" },
        ...selectedCountryList,
      ];
    }
    setisEditMode(true);
    setformIntialState({
      lobid: response.lobid,
      lobName: response.lobName,
      countryList: selectedCountryList,
      lobApproverList: response.aproverList ? response.aproverList : [],
      lobDescription: response.lobDescription ? response.lobDescription : "",
      durationofApproval: response.durationofApproval,
      requesterUserId: response.requesterUserId ? response.requesterUserId : "",
      isActive: response.isActive,
    });
    seteditmodeName(response.lobName);
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (editmodeName.toLowerCase() !== item.lobName.toLowerCase()) {
      response = await checkNameExist({
        lobName: item.lobName,
      });
    }
    let tempcountryList = item.countryList.map((item) => item.value);
    tempcountryList = tempcountryList.filter((value) => value !== "*");
    tempcountryList = tempcountryList.join(",");
    let templobApproverList = item.lobApproverList.map(
      (item) => item.emailAddress
    );
    templobApproverList = templobApproverList.length
      ? templobApproverList.join(",")
      : "";
    if (!response) {
      response = await postItem({
        ...item,
        aproverList: item.lobApproverList,
        countryList: tempcountryList,
        lobApproverList: templobApproverList,
        requesterUserId: item.requesterUserId
          ? item.requesterUserId
          : userProfile.userId,
      });
      if (response) {
        //setselfilter(intialfilterval);
        getAll();
        hideAddPopup();
        alert(alertMessage.lob.update);
      }
    } else {
      alert(alertMessage.lob.nameExist);
    }
    setisEditMode(false);
  };
  const postItemHandler = async (item) => {
    let response = await checkNameExist({
      lobName: item.lobName,
    });
    let tempcountryList = item.countryList.map((item) => item.value);
    tempcountryList = tempcountryList.filter((value) => value !== "*");
    tempcountryList = tempcountryList.join(",");
    let templobApproverList = item.lobApproverList.map(
      (item) => item.emailAddress
    );
    templobApproverList = templobApproverList.length
      ? templobApproverList.join(",")
      : "";
    if (!response) {
      response = await postItem({
        ...item,
        aproverList: item.lobApproverList,
        countryList: tempcountryList,
        lobApproverList: templobApproverList,
        requesterUserId: userProfile.userId,
      });

      if (response) {
        //setselfilter(intialfilterval);
        getAll();
        hideAddPopup();
        alert(alertMessage.lob.add);
      }
    } else {
      alert(alertMessage.lob.nameExist);
    }
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.lob.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({
      lobid: itemid,
    });
    if (!resonse) {
      resonse = await deleteItem({ lobid: itemid });
      if (resonse) {
        getAll();
        alert(alertMessage.lob.delete);
      }
    } else {
      alert(alertMessage.lob.isInUse);
    }
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
    let response = await setMasterdataActive({
      TempId: selItemsList.join(","),
      MasterType: "lob",
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
      <div className="page-title">Manage LoB</div>
      <div className="page-filter">
        <div className="filter-container container">
          <div className="row">
            <div className="frm-filter col-md-4">
              <FrmSelect
                title={"LoB"}
                name={"lob"}
                selectopts={lobFilterOpts}
                handleChange={onSearchFilterSelect}
                value={selfilter.lob}
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
              selfilter.lob === "" && selfilter.country === "" ? "disable" : ""
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
        {lobState.loading ? (
          <Loading />
        ) : lobState.error ? (
          <div>{lobState.error}</div>
        ) : (
          <PaginationData
            id={"id"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"New LoB"}
            setMasterdataActiveState={setMasterdataActiveState}
            isShowActiveBtns={true}
            ActiveBtnsState={isActiveEnable}
            ActiveSelectedItems={selItemsList}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
          title={"Add/Edit LoB"}
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
    </>
  );
}
const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
const mapActions = {
  getAll: lobActions.getAll,
  getAllCountry: countryActions.getAllCountry,
  getAllApprover: lobActions.getAllApprover,
  getById: lobActions.getById,
  checkNameExist: lobActions.checkNameExist,
  checkIsInUse: lobActions.checkIsInUse,
  postItem: lobActions.postItem,
  deleteItem: lobActions.deleteItem,
  setMasterdataActive: commonActions.setMasterdataActive,
};

export default connect(mapStateToProp, mapActions)(Lob);
