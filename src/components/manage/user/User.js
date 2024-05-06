import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { userActions, countryActions, regionActions, lobActions, lookupActions, commonActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort, formatDate } from "../../../helpers";
import AddEditForm from "./AddEditForm";
import UserProfile from "../../common-components/UserProfile";
import FrmInput from "../../common-components/frminput/FrmInput";
import { USER_ROLE } from "../../../constants";
import { handlePermission } from "../../../permissions/Permission";
import { versionHistoryExcludeFields, versionHistoryexportDateFields, versionHistoryexportFieldTitles, versionHistoryexportHtmlFields } from "../../../constants/user.constants";
import VersionHistoryPopup from "../../versionhistorypopup/VersionHistoryPopup";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
function User({ ...props }) {
  const { userState, countryState, regionState, lobState } = props.state;
  const {
    getAll,
    getAllUsers,
    getAllCountry,
    getUserCountry,
    getUserRegions,
    getAllRegion,
    getAllSpecialUsers,
    getAllUsersRoles,
    getById,
    checkNameExist,
    checkIsInUse,
    postItem,
    deleteItem,
    userProfile,
    getAlllob,
    getLookupByType,
    getMasterVersion,
    downloadExcel
  } = props;
  const FileDownload = require("js-file-download");
  const templateName = "User.xlsx";
  useSetNavMenu({ currentMenu: "User", isSubmenu: true }, props.menuClick);
  //initialize filter/search functionality
  const [isfilterApplied, setisfilterApplied] = useState(false);
  const [countryFilterOpts, setcountryFilterOpts] = useState([]);
  const [countryAllOpts, setcountryAllOpts] = useState([]);
  const [regionFilterOpts, setregionFilterOpts] = useState([]);
  const [userTypeFilterOpts, setuserTypeFilterOpts] = useState([]);
  const [unathorizedRegions, setunathorizedRegions] = useState([]);
  const [unauthorizedCountries, setunauthorizedCountries] = useState([]);
  const [dualRoleOpts, setDualRoleOpts] = useState([])
  const intialFilterState = {
    username: "",
    email: "",
    region: "",
    country: "",
    usertype: "",
  };
  const [selfilter, setselfilter] = useState(intialFilterState);
  const onSearchFilterInput = (e) => {
    const { name, value } = e.target;
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

    if (name === "region" && value !== "") {
      let region = frmRegionSelectOpts.filter((item) => item.label === value);
      let tempmapObj = countrymapping.filter(
        (item) => item.region === region[0].value
      );
      let countryopts = [];
      if (tempmapObj.length) {
        countryopts = tempmapObj[0].country.map((item) => {
          return { label: item.label, value: item.label };
        });
      }
      setcountryFilterOpts([...countryopts]);
    } else if (name === "region" && value === "") {
      let countryopts = countryAllOpts.map((item) => {
        return { label: item.label, value: item.label };
      });
      setcountryFilterOpts([...countryopts]);
    }
  };
  const handleFilterSearch = () => {
    if (
      selfilter.username !== "" ||
      selfilter.email !== "" ||
      selfilter.region !== "" ||
      selfilter.country !== "" ||
      selfilter.usertype !== ""
    ) {
      setisfilterApplied(true);
      let tempdata = [...data];
      tempdata = tempdata.filter((item) => {
        let isShow = true;
        let username = item.firstName + " " + item.lastName;
        if (
          isShow &&
          selfilter.username !== "" &&
          username &&
          !username.toLowerCase().includes(selfilter.username.toLowerCase())
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.email !== "" &&
          item.emailAddress &&
          !item.emailAddress
            .toLowerCase()
            .includes(selfilter.email.toLowerCase())
        ) {
          isShow = false;
        }
        if (
          (isShow &&
            selfilter.region !== "" &&
            item.regionList &&
            !item.regionList.includes(selfilter.region)) ||
          (isShow && selfilter.region !== "" && !item.regionList)
        ) {
          isShow = false;
        }
        let countryName = []
        if (selfilter.country !== "") {
          countryName = item.userType !== 'DualRole' ? item.countryList : item.dualRoleCountry
          countryName = countryName?.replaceAll(" ", "")?.split(",")
        }
        if (
          (isShow && 
            selfilter.country !== "" && 
            !countryName?.includes(selfilter.country.replaceAll(" ","")))
        ) {
            isShow = false;
        }
        if (
          (isShow &&
            selfilter.usertype !== "" &&
            item.userType &&
            !item.userType.includes(selfilter.usertype)) ||
          (isShow && selfilter.usertype !== "" && !item.userType)
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
  //set user role
  const [userroles, setuserroles] = useState({
    issuperadmin: false,
    isglobaladmin: false,
    isregionadmin: false,
    iscountryadmin: false,
    iscountrysuperadmin: false,
  });
  useEffect(() => {
    let loggeduserrole = userProfile ? userProfile.userRoles[0].roleId : "";
    const tempuserroles = {
      issuperadmin: false,
      isglobaladmin: false,
      isregionadmin: false,
      iscountryadmin: false,
      iscountrysuperadmin: false,
    };
    if (loggeduserrole === USER_ROLE.superAdmin) {
      tempuserroles.issuperadmin = true;
    }
    if (loggeduserrole === USER_ROLE.globalAdmin) {
      tempuserroles.isglobaladmin = true;
    }
    if (loggeduserrole === USER_ROLE.regionAdmin) {
      tempuserroles.isregionadmin = true;
    }
    if (loggeduserrole === USER_ROLE.countryAdmin) {
      tempuserroles.iscountryadmin = true;
    }
    if (loggeduserrole === USER_ROLE.countrySuperAdmin) {
      tempuserroles.iscountrysuperadmin = true;
    }
    setuserroles(tempuserroles);
  }, [userProfile]);
  //set pagination data and functionality
  const [data, setdata] = useState([]);
  const [paginationdata, setpaginationdata] = useState([]);

  const columns = [
    {
      dataField: "editaction",
      text: "Edit",
      hidden: handlePermission(window.location.pathname.slice(1), "isEdit") === true ? false : true,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="edit-icon"
            onClick={handleEdit}
            rowid={row.userId}
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
            rowid={row.userId}
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
            onClick={() => handleDataVersion(row.userId)}
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
      dataField: "emailAddress",
      text: "User Name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <div className="">{getUserBlock(cell, row)}</div>;
      },
    },
    {
      dataField: "userType",
      text: "Type of User",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "dualRoleTypeName",
      text: "Dual Role Type",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "regionList",
      text: "Region",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? cell : row?.dualRoleRegion ? row?.dualRoleRegion : "-"}</span>;
      },
    },
    {
      dataField: "countryList",
      text: "Country",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? cell : row?.dualRoleCountry ? row?.dualRoleCountry : "-"}</span>;
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
  const getUserBlock = (cell, row) => {
    const username = row.firstName + " " + row.lastName;
    const userEmail = row.emailAddress;
    const imagePath = row.profileImagePath;

    return (
      <>
        <UserProfile
          username={username}
          userEmail={userEmail}
          imagePath={imagePath}
        ></UserProfile>
      </>
    );
  };
  const defaultSorted = [
    {
      dataField: "lobName",
      order: "asc",
    },
  ];

  useEffect(async() => {
    getAll({ RequesterUserId: userProfile.userId });
    getAllCountry({ IsLog: true });
    getAllRegion({ IsLog: true });
    getAllUsersRoles({ RequesterUserId: userProfile.userId });
    getAlllob({ isActive: true });
    let dualRoleList = await getLookupByType({ LookupType: "DualRole" })
    dualRoleList = dualRoleList.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    dualRoleList.sort(dynamicSort("label"));
    setDualRoleOpts(dualRoleList)
  }, []);
  useEffect(() => {
    let tempdata = [];
    userState.items.forEach((item) => {
      if (userroles.isglobaladmin) {
        if (item.roleId !== USER_ROLE.superAdmin) {
          tempdata.push(item);
        }
      } else {
        tempdata.push(item);
      }
    });

    setdata([...tempdata]);
    //setpaginationdata([...tempdata]);
  }, [userState.items]);

  useEffect(() => {
    if (isfilterApplied) {
      handleFilterSearch();
    } else {
      setpaginationdata([...data]);
    }
  }, [data]);
  const [countrymapping, setcountrymapping] = useState([]);
  const [frmCountrySelectOpts, setfrmCountrySelectOpts] = useState([]);
  const [frmuserType, setfrmuserType] = useState([]);
  const [frmuserTypeObj, setfrmuserTypeObj] = useState({});
  const [countryObj, setcountryObj] = useState({});
  useEffect(() => {
    let selectOpts = [];
    let selectFilterOpts = [];
    let tempCountryMapping = [];
    let tempRegionListObj = {};

    countryState.countryItems.forEach((item) => {
      selectOpts.push({
        ...item,
        label: item.countryName.trim(),
        value: item.countryID,
      });
      selectFilterOpts.push({
        label: item.countryName.trim(),
        value: item.countryName.trim(),
      });
      if (!tempRegionListObj[item.regionID]) {
        tempCountryMapping.push({
          region: item.regionID,
          country: [
            {
              ...item,
              label: item.countryName,
              value: item.countryID,
            },
          ],
        });
      } else {
        tempCountryMapping.forEach((countryitem) => {
          if (countryitem.region === item.regionID) {
            countryitem.country.push({
              ...item,
              label: item.countryName,
              value: item.countryID,
            });
          }
        });
      }
      tempRegionListObj[item.regionID] = item.countryName;
    });
    selectOpts.sort(dynamicSort("label"));
    if (selectOpts.length) {
      setfrmCountrySelectOpts([...selectOpts]);
    }
    setcountryAllOpts([...selectOpts]);
    setcountryFilterOpts([...selectFilterOpts]);
    setcountrymapping([...tempCountryMapping]);
  }, [countryState.countryItems]);

  const [frmLobSelectOpts, setfrmLobSelectOpts] = useState([]);
  useEffect(() => {
    let tempItems = lobState.lobItems.map((item) => ({
      ...item,
      label: item.lobName,
      value: item.lobid,
    }));
    tempItems.sort(dynamicSort("label"));
    setfrmLobSelectOpts([...tempItems]);
  }, [lobState.lobItems]);

  const [frmRegionSelectOpts, setfrmRegionSelectOpts] = useState([]);
  useEffect(() => {
    let selectOpts = [];
    let selectFilterOpts = [];
    regionState.regionItems.forEach((item) => {
      selectOpts.push({
        ...item,
        label: item.regionName.trim(),
        value: item.regionID,
      });
      selectFilterOpts.push({
        label: item.regionName.trim(),
        value: item.regionName.trim(),
      });
    });
    selectOpts.sort(dynamicSort("label"));
    selectFilterOpts.sort(dynamicSort("label"));
    if (selectOpts.length) {
      setfrmRegionSelectOpts([...selectOpts]);
    }
    setregionFilterOpts([...selectFilterOpts]);
  }, [regionState.regionItems]);

  useEffect(() => {
    let tempuserroles = [];
    let tempfilterroles = [];
    let tempObj = {};
    userState.userRoles.forEach((item) => {
      if (
        (userroles.iscountryadmin && item.roleId === USER_ROLE.countryAdmin) ||
        (USER_ROLE.regionAdmin &&
          (item.roleId === USER_ROLE.countryAdmin ||
            item.roleId === USER_ROLE.regionAdmin ||
            item.roleId === USER_ROLE.normalUser)) ||
        (userroles.isglobaladmin &&
          (item.roleId === USER_ROLE.countryAdmin ||
            item.roleId === USER_ROLE.regionAdmin ||
            item.roleId === USER_ROLE.globalAdmin ||
            item.roleId === USER_ROLE.normalUser)) ||
        userroles.issuperadmin
      ) {
        if (userProfile?.isCountrySuperAdmin === false && item.roleId !== USER_ROLE.normalUser) {
          tempuserroles.push({
            label: item.displayRole,
            value: item.roleId,
          });
        }
        if (userProfile.isCountrySuperAdmin && item.roleId === USER_ROLE.countryAdmin) {
          tempuserroles.push({
            label: item.displayRole,
            value: item.roleId,
          });
        }
        tempfilterroles.push({
          label: item.displayRole,
          value: item.displayRole,
        });
      }
      tempObj[item.roleId] = item.displayRole;
    });
    setfrmuserType([...tempuserroles]);
    setfrmuserTypeObj(tempObj);
    setuserTypeFilterOpts([...tempfilterroles]);
  }, [userState.userRoles]);
  /* Add Edit Delete functionality & show popup*/
  const [isshowAddPopup, setshowAddPopup] = useState(false);

  const showAddPopup = () => {
    setshowAddPopup(true);
  };
  const hideAddPopup = () => {
    setshowAddPopup(false);
    setformIntialState(formInitialValue);
    setisEditMode(false);
    // getAllApprover({ UserName: "#$%" });
  };

  const [isEditMode, setisEditMode] = useState(false);
  const formInitialValue = {
    user: [],
    regionList: [],
    countryList: [],
    lobList: [],
    userType: "",
    PreviousRoleID: "",
    isAccessBreachLog: false,
    isSuperAdmin: false,
    isGeneralUser: false,
    isAccessDeleteLog: false,
  };
  const [formIntialState, setformIntialState] = useState(formInitialValue);

  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({ UserId: itemid });
    let userCountry = await getUserCountry({ IsLog: true });
    let userRegions = await getUserRegions({ IsLog: true });
    const user = [
      {
        userId: response.userId,
        firstName: response.firstName,
        lastName: response.lastName,
        emailAddress: response.emailAddress,
      },
    ];
    let regionList = [];
    let countryList = [];
    let lobList = [];
    let tempunauthorizedRegions = [];
    let tempunauthorizedCountries = [];
    let regionUserList = response.roleId === '11' ? response.dualRoleRegionDataList : response.regionDataList
    regionUserList.forEach((item) => {
      let isPresent = false;
      userRegions.forEach((region) => {
        if (region.regionID === item.regionID.trim()) {
          isPresent = true;
        }
      });
      if (isPresent) {
        regionList.push({
          label: item.regionName.trim(),
          value: item.regionID.trim(),
        });
      } else {
        tempunauthorizedRegions.push({
          label: item.regionName.trim(),
          value: item.regionID.trim(),
        });
      }
    });
    let countryUserList = response.roleId === '11' ? response.dualRoleCountryDataList : response.countryDataList
    countryUserList.forEach((item) => {
      let isPresent = false;
      userCountry.forEach((country) => {
        if (country.countryID === item.countryID.trim()) {
          isPresent = true;
        }
      });
      if (isPresent) {
        countryList.push({
          label: item.countryName.trim(),
          value: item.countryID.trim(),
        });
      } else {
        tempunauthorizedCountries.push({
          label: item.countryName.trim(),
          value: item.countryID.trim(),
        });
      }
    });
    response.lobDataList.forEach((item) => {
      let isPresent = false;
      frmLobSelectOpts.forEach((lob) => {
        if (lob.lobid === item.lobid.trim()) {
          isPresent = true;
        }
      });
      if (isPresent) {
        lobList.push({
          label: item.lobName.trim(),
          value: item.lobid.trim(),
        });
      }
    });
    let selectedDualRole = ""
    if (response?.dualRole) {
      dualRoleOpts.map((item, i) => {
        if (item.value === response.dualRole) {
          selectedDualRole = item.label
        }
      })
    }
    setisEditMode(true);
    let isSuperAdmin = response.userType === "SuperAdmin" ? true : false;
    let isAccessDeleteLog =
      response.userType === "SuperAdmin" ||
      response.userType === "Global" ||
      response.userType === "Region" ||
      response.isAccessDeleteLog
        ? true
        : false;
    setformIntialState({
      ...response,
      user: user,
      regionList: regionList,
      countryList: countryList,
      lobList: lobList,
      userType: response.roleId,
      PreviousRoleID: response.roleId,
      isAccessBreachLog: response.isAccessBreachLog,
      isSuperAdmin: isSuperAdmin,
      isAccessDeleteLog: isAccessDeleteLog,
      selectedDualRole: selectedDualRole
    });
    setunathorizedRegions([...tempunauthorizedRegions]);
    setunauthorizedCountries([...tempunauthorizedCountries]);
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    const { userId, firstName, lastName, emailAddress } = item.user[0];
    let tempcountryList = item?.countryList.map((item) => item.value);
    let tempunauthorizedCountryList = unauthorizedCountries.map(
      (item) => item.value
    );
    tempcountryList = [...tempcountryList, ...tempunauthorizedCountryList].join(
      ","
    );
    let tempregionList = item?.regionList.map((item) => item.value);
    let tempunauthorizedRegionList = unathorizedRegions.map(
      (item) => item.value
    );
    tempregionList = [...tempregionList, ...tempunauthorizedRegionList].join(
      ","
    );
    let templobList = item?.lobList.map((item) => item.value);
    templobList = templobList.join(",")
  
    if (item.isSuperAdmin) {
      item.isAccessBreachLog = true;
      for (let i = 0; i < frmuserType.length; i++) {
        if (frmuserType[i]["label"] === "Super Admin") {
          item.userType = frmuserType[i]["value"];
        }
      }
    }
    if (item.isGeneralUser) {
      item.userType = USER_ROLE.normalUser;
    }

    // if (item.userType === USER_ROLE.dualRole) {
    //   item.countryList = "";
    //   item.regionList = "";
    //   item.dualRoleCountry = tempcountryList;
    //   item.dualRoleRegion = tempregionList
    // } else {
    //   item.countryList = tempcountryList;
    //   item.regionList = tempregionList
    // }

    let response = await postItem({
      ...item,
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      RoleID: item.userType,
      lobList: templobList,
      isAccessBreachLog: item.isAccessBreachLog,
      requesterUserId: userProfile.userId,
      PreviousRoleID: item.PreviousRoleID,
      profileCountry: item.user[0].profileCountry,
      countryList: item.userType === USER_ROLE.dualRole ? "" : tempcountryList,
      regionList: item.userType === USER_ROLE.dualRole ? "" : tempregionList,
      dualRoleCountry: item.userType === USER_ROLE.dualRole ? tempcountryList : "",
      dualRoleRegion: item.userType === USER_ROLE.dualRole ? tempregionList : "",
    });
    if (response) {
      //setselfilter(intialFilterState);
      getAll({ RequesterUserId: userProfile.userId });
      hideAddPopup();
      alert(alertMessage.user.update);
    }
    setisEditMode(false);
  };
  const postItemHandler = async (item) => {
    const { firstName, lastName, emailAddress } = item.user[0];
    let response = await checkNameExist({
      emailAddress: emailAddress,
    });
    let tempcountryList = item.countryList.map((item) => item.value);
    tempcountryList = tempcountryList.join(",");
    let tempregionList = item.regionList.map((item) => item.value);
    tempregionList = tempregionList.join(",");
    let templobList = item.lobList.map((item) => item.value);
    templobList = templobList.join(",")
    if (item.isSuperAdmin) {
      item.isAccessBreachLog = true;
      for (let i = 0; i < frmuserType.length; i++) {
        if (frmuserType[i]["label"] === "Super Admin") {
          item.userType = frmuserType[i]["value"];
        }
      }
    }
    if (item.isGeneralUser) {
      item.userType = USER_ROLE.normalUser;
    }

    // if (item.userType === USER_ROLE.dualRole) {
    //   item.countryList = "";
    //   item.regionList = "";
    //   item.dualRoleCountry = tempcountryList;
    //   item.dualRoleRegion = tempregionList
    // } else {
    //   item.countryList = tempcountryList;
    //   item.regionList = tempregionList
    // }

    if (!response) {
      response = await postItem({
        ...item,
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        RoleID: item.userType,
        PreviousRoleID: "",
        lobList: templobList,
        isAccessBreachLog: item.isAccessBreachLog,
        requesterUserId: userProfile.userId,
        profileCountry: item.user[0].profileCountry,
        countryList: item.userType === USER_ROLE.dualRole ? "" : tempcountryList,
        regionList: item.userType === USER_ROLE.dualRole ? "" : tempregionList,
        dualRoleCountry: item.userType === USER_ROLE.dualRole ? tempcountryList : "",
        dualRoleRegion: item.userType === USER_ROLE.dualRole ? tempregionList : "",
      });

      if (response) {
        //setselfilter(intialFilterState);
        getAll({ RequesterUserId: userProfile.userId });
        hideAddPopup();
        alert(alertMessage.user.add);
      }
    } else {
      alert(alertMessage.user.nameExist);
    }
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.user.deleteConfirm)) {
      return;
    }
    let userdetails = await getById({ UserId: itemid });
    let resonse = await checkIsInUse({
      EmailAddress: userdetails.emailAddress,
    });
    if (!resonse) {
      resonse = await deleteItem({ UserId: itemid });
      if (resonse) {
        getAll({ RequesterUserId: userProfile.userId });
        alert(alertMessage.user.delete);
      }
    } else {
      alert(alertMessage.user.isInUse);
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
      MasterType: "user",
    });
    setversionHistoryData(versiondata ? versiondata : []);
    setshowVersionHistory(true);
  };

  /* search Input functionality */
  const [searchOptions, setsearchOptions] = useState([]);
  useEffect(() => {
    setsearchOptions(userState.approverUsers);
  }, [userState.approverUsers]);


  const handleDownload = async() =>{
    let response = {
      RegionId: "",
      CountryId: "",
      UserType: "",
      UserName: "",
      EmailAddress: "",
    }

    if (isfilterApplied) {
      if (selfilter.region !== "") {
        let regionId = frmRegionSelectOpts.filter((item, i) => item.label === selfilter.region)
        response.RegionId = regionId?.[0]?.value
      }
      if (selfilter.country !== "") {
        let countryId = frmCountrySelectOpts.filter((item, i) => item.label === selfilter.country)
        response.CountryId = countryId?.[0]?.value
      }
      response.UserName = selfilter.username
      response.EmailAddress = selfilter.email
      response.UserType = selfilter.usertype
    }
    
    const responsedata = await downloadExcel({
      UserName: response.UserName,
      EmailAddress: response.EmailAddress,
      RegionId: response.RegionId,
      CountryId: response.CountryId,
      UserType: response.UserType,
    }, "User");
    FileDownload(responsedata, templateName);
  }

  return (
    <>
      <div className="page-title">Manage User</div>
      <div className="page-filter">
        <div className="filter-container container">
          <div className="row">
            <div className="frm-filter col-md-4">
              <FrmSelect
                title={"Region"}
                name={"region"}
                selectopts={regionFilterOpts}
                handleChange={onSearchFilterSelect}
                value={selfilter.region}
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
            <div className="frm-filter col-md-4">
              <FrmSelect
                title={"Type of User"}
                name={"usertype"}
                selectopts={userTypeFilterOpts}
                handleChange={onSearchFilterSelect}
                value={selfilter.usertype}
              />
            </div>
          </div>
          <div className="row">
            <div className="frm-filter col-md-4">
              <FrmInput
                title={"User"}
                name={"username"}
                type={"input"}
                handleChange={onSearchFilterInput}
                value={selfilter.username}
              />
            </div>
            <div className="frm-filter col-md-4">
              <FrmInput
                title={"Email"}
                name={"email"}
                type={"input"}
                handleChange={onSearchFilterInput}
                value={selfilter.email}
              />
            </div>
          </div>
        </div>
        <div className="btn-container">
          <div
            className={`btn-blue ${
              selfilter.username === "" &&
              selfilter.email === "" &&
              selfilter.region === "" &&
              selfilter.country === "" &&
              selfilter.usertype === ""
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
        {userState.loading ? (
          <Loading />
        ) : userState.error ? (
          <div>{userState.error}</div>
        ) : (
          <PaginationData
            id={"userId"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"New User"}
            hidesearch={true}
            isShowDownloadBtn={true}
            DownloadBtnState={paginationdata.length !== 0 ? true : false}
            handleDownload={handleDownload}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
          title={"Add/Edit User"}
          frmCountrySelectOpts={frmCountrySelectOpts}
          frmRegionSelectOpts={frmRegionSelectOpts}
          frmLobSelectOpts={frmLobSelectOpts}
          frmuserType={frmuserType.filter(
            (item) => item.label !== "Super Admin"
          )}
          frmuserTypeObj={frmuserTypeObj}
          countrymapping={countrymapping}
          countryAllOpts={countryAllOpts}
          hideAddPopup={hideAddPopup}
          postItem={postItemHandler}
          putItem={putItemHandler}
          isEditMode={isEditMode}
          formIntialState={formIntialState}
          userroles={userroles}
          dualRoleOpts={dualRoleOpts}
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
  getAll: userActions.getAll,
  getAllUsers: userActions.getAllUsers,
  getAllCountry: countryActions.getAllCountry,
  getUserCountry: countryActions.getUserCountry,
  getAllRegion: regionActions.getAllRegions,
  getUserRegions: regionActions.getUserRegions,
  getAllSpecialUsers: userActions.getAllSpecialUsers,
  getAllUsersRoles: userActions.getAllUsersRoles,
  getById: userActions.getById,
  checkNameExist: userActions.checkNameExist,
  checkIsInUse: userActions.checkIsInUse,
  postItem: userActions.postItem,
  deleteItem: userActions.deleteItem,
  getAlllob: lobActions.getAlllob,
  getLookupByType: lookupActions.getLookupByType,
  getMasterVersion: commonActions.getMasterVersion,
  downloadExcel: commonActions.downloadExcel
};

export default connect(mapStateToProp, mapActions)(User);
