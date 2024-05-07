import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { lookupActions, commonActions, countryActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
import { alertMessage, dynamicSort } from "../../../helpers";
import FrmInlineInput from "../../common-components/frminlineinput/FrmInlineInput";
import { handlePermission } from "../../../permissions/Permission";
import { versionHistoryExcludeFields, versionHistoryexportDateFields, versionHistoryexportFieldTitles, versionHistoryexportHtmlFields } from "../../../constants/lookup.constants";
import VersionHistoryPopup from "../../versionhistorypopup/VersionHistoryPopup";
function Lookup({ ...props }) {
  const { lookupState, countryState } = props.state;
  const {
    getAllLookupByLogType,
    getLogTypes,
    checkNameExist,
    checkIsInUse,
    postLookupItem,
    deleteItem,
    userProfile,
    setMasterdataActive,
    getAllCountry,
    getMasterVersion,
    downloadExcel
  } = props;
  const FileDownload = require("js-file-download");
  const templateName = "LookUp.xlsx";
  useSetNavMenu({ currentMenu: "Lookup", isSubmenu: true }, props.menuClick);
  const [logtypeFilterOpts, setlogtypeFilterOpts] = useState([]);
  const intialfilterval = {
    logtype: "",
  };
  const [selfilter, setselfilter] = useState(intialfilterval);
  const selectActVal = [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];
  const onSearchFilterSelect = (name, value) => {
    //const { name, value } = e.target;
    setselfilter({
      ...selfilter,
      [name]: value,
    });
  };
  const handleFilterSearch = async () => {
    if (selfilter.logtype !== "") {
      getAllLookupByLogType({
        LogType: selfilter.logtype,
        ScopeCountryList: userProfile.isCountrySuperAdmin ? userProfile?.scopeCountryList : "",
      });
    } else {
      setdata([]);
      setlookuptypes([]);
    }
  };
  useEffect(() => {
    if (selfilter.logtype !== "") {
      getAllLookupByLogType({
        LogType: selfilter.logtype,
        ScopeCountryList: userProfile.isCountrySuperAdmin ? userProfile?.scopeCountryList : "",
      });
    } else {
      setdata([]);
      setlookuptypes([]);
    }
    setisActiveEnable(false);
  }, [selfilter.logtype]);


  const clearFilter = () => {
    setselfilter(intialfilterval);
    setdata([]);
    setlookuptypes([]);
  };
  const [breachlogData, setbreachlogData] = useState([]);
  const [breachlookupTypes, setbreachlookupTypes] = useState([]);
  const [rfelogData, setrfelogData] = useState({});
  const [exemptionlogData, setexemptionlogData] = useState({});
  const [dataActItems, setdataActItems] = useState({});
  const [data, setdata] = useState([]);
  const [lookuptyps, setlookuptypes] = useState([]);

  const [issubmitted, setissubmitted] = useState(false);

  useEffect(() => {
    getLogTypes({
      LookupType: "logs",
      RequesterUserId: userProfile.userId,
    });
    getAllCountry()
  }, []);

  useEffect(() => {
    let templottypefilterOpts = [];

    if (lookupState.logtyps.length) {
      lookupState.logtyps.forEach((item) => {
        templottypefilterOpts.push({
          label: item.lookUpName,
          value: item.lookUpValue,
        });
      });
      setlogtypeFilterOpts([...templottypefilterOpts]);
      if (userProfile.isCountrySuperAdmin) {
        setselfilter({
          logtype: templottypefilterOpts[1].value,
        });
      } else {
        setselfilter({
          logtype: templottypefilterOpts[0].value,
        });
      }
    }
  }, [lookupState.logtyps]);

  useEffect(() => {
    let templookuptypes = [];
    let tempObj = {};
    let initalval = {};
    lookupState.lookupitems.sort(dynamicSort("lookUpValue"));
    lookupState.lookupitems.forEach((item) => {
      if (
        !tempObj[item["lookUpType"]] &&
        item["lookUpType"] !== "BreachClassification"
      ) {
        templookuptypes.push({
          type: item["lookUpType"],
          name: item["lookUpTypeName"],
        });
      }
      tempObj[item["lookUpType"]] = item["lookUpType"];
      initalval[item.lookupID] = false;
    });
    templookuptypes.sort(dynamicSort("name"));
    setbreachlookupTypes(templookuptypes);
    setbreachlogData(lookupState.lookupitems);
    //if (selfilter.logtype === "1") {
    setdata(lookupState.lookupitems);
    setlookuptypes(templookuptypes);
    setdataActItems(initalval);
    // }
  }, [lookupState.lookupitems]);
  const [isAddItem, setAddItem] = useState({
    type: false,
    nature: false,
  });

  const [formfield, setformfield] = useState({ isActive: "true" });
  const handleAdd = (param) => {
    setAddItem({
      ...isAddItem,
      [param.lookUpType]: true,
    });
  };
  const handleEdit = (param) => {
    const tempData = [...data];
    tempData.forEach((item) => {
      if (item.lookupID === param.lookupID) {
        item.isEditMode = true;
      }
    });
    setdata([...tempData]);
  };
  const handleSave = async (param) => {
    let item = {};
    let payload = {};
    let response;
    if (param.lookupID) {
      item = data.filter((item) => item.lookupID === param.lookupID);
    } else {
      if (!formfield[param.lookUpType]) {
        alert("Please enter value then save.");
        return;
      }
      response = await checkNameExist({
        lookUpType: param.lookUpType,
        lookUpValue: formfield[param.lookUpType],
      });
    }
    if (!response) {
      if (param.lookupID) {
        payload = {
          ...item[0],
          lookupID: param.lookupID,
          lookUpType: param.lookUpType,
          lookUpValue: item[0].lookUpValue,
          requesterUserId: userProfile.userId,
          countryId: selfilter.logtype === "RFELogs" ? handleGetCountryList(param.lookUpType) : ""
        }
        response = await postLookupItem(payload);
      } else {
        payload = {
          lookUpType: param.lookUpType,
          lookUpValue: formfield[param.lookUpType],
          isActive: formfield["isActive"] === "true" ? true : false,
          requesterUserId: userProfile.userId,
          countryId: selfilter.logtype === "RFELogs" ? handleGetCountryList(param.lookUpType) : ""
        }
        response = await postLookupItem(payload);
        setformfield({ isActive: "true" });
      }
      if (response) {
        getAllLookupByLogType({
          LogType: selfilter.logtype,
          ScopeCountryList: userProfile.isCountrySuperAdmin ? userProfile?.scopeCountryList : "",
        });
        if (param.lookupID) {
          alert(alertMessage.lookup.update);
        } else {
          alert(alertMessage.lookup.add);
        }
      }
    } else {
      alert(alertMessage.lookup.nameExist);
    }
    setAddItem({
      ...isAddItem,
      [param.lookUpType]: false,
    });
  };

  const handleGetCountryList = (lookUpType) => {
    let response = ""
    let search = lookUpType.search("RFEEmpowermentReasonRequest")
    let countryName = lookUpType.replace("RFEEmpowermentReasonRequest", "")
    if (search !== -1 && countryName !== "" ) {
      if(countryName.toLowerCase() === "nordic" || countryName.toLowerCase() === "benelux") {
        countryName = countryName + " All Countries"
      }
      let countryDetail = countryState.countryItems.filter((item,i)=> item.countryName.toLowerCase() === countryName.toLowerCase())
      if (countryName.toLowerCase() === "nordic all countries" ||
          countryName.toLowerCase() === "benelux all countries" ||
          countryName.toLowerCase() === "latam") {
        let countryList = []
        countryState.countryItems.map((item, i) => {
          if (item.isActive === true && item.incountryFlag === countryDetail[0].incountryFlag) {
            countryList.push(item.countryID)
          }
        })
        response = countryList.toString()
      } else if (countryDetail?.length){
        response = countryDetail[0]?.countryID
      }
    }
    return response
  }

  const handleDelete = async (param) => {
    if (!window.confirm(alertMessage.lookup.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({
      lookupID: param.lookupID,
      lookUpType: param.lookUpType,
    });
    if (!resonse) {
      resonse = await deleteItem({
        lookupID: param.lookupID,
      });
      if (resonse) {
        getAllLookupByLogType({
          LogType: selfilter.logtype,
          ScopeCountryList: userProfile.isCountrySuperAdmin ? userProfile?.scopeCountryList : "",
        });
        alert(alertMessage.lookup.delete);
      }
    } else {
      alert(alertMessage.lookup.isInUse);
    }
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setformfield({ ...formfield, [name]: value });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    let lookupID = e.target.getAttribute("itemid");
    let tempData = [...data];

    tempData.forEach((item) => {
      if (item.lookupID === lookupID) {
        item.lookUpValue = value;
      }
    });
    setdata([...tempData]);
  };
  const handleSelectChange = (name, value, itemid) => {
    let lookupID = itemid;
    let tempData = [...data];
    tempData.forEach((item) => {
      if (item.lookupID === lookupID) {
        item[name] = value === "true" ? true : false;
      }
    });
    setdata([...tempData]);
  };
  const handleNewSelectChange = (name, value) => {
    setformfield({ ...formfield, [name]: value });
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
    let tempItems = [...selItemsList];
    if (value && !tempItems.includes(name)) {
      tempItems.push(name);
      //setselItemsList([...tempItems, name]);
    } else {
      const index = tempItems.indexOf(name);
      if (index > -1) {
        tempItems.splice(index, 1);
      }
    }
    if (tempItems.length) {
      setisActiveEnable(true);
      setselItemsList([...tempItems]);
    } else {
      setisActiveEnable(false);
    }
  };

  const setMasterdataActiveState = async (state) => {
    let response = await setMasterdataActive({
      TempId: selItemsList.join(","),
      MasterType: "lookup",
      IsActive: state,
    });
    if (response) {
      //setselfilter(intialfilterval);
      setselItemsList([]);
      setisActiveEnable(false);
      getAllLookupByLogType({
        LogType: selfilter.logtype,
        ScopeCountryList: userProfile.isCountrySuperAdmin ? userProfile?.scopeCountryList : "",
      });
      if (state) {
        alert(alertMessage.commonmsg.masterdataActive);
      } else {
        alert(alertMessage.commonmsg.masterdataInActive);
      }
    }
  };

  const handleDownload = async() =>{
    let response = {
      LogType: selfilter.logtype,
    }

    const responsedata = await downloadExcel({
      LogType: response.LogType,
      ScopeCountryList: userProfile.isCountrySuperAdmin ? userProfile?.scopeCountryList : "",
    }, "Lookup");
    FileDownload(responsedata, `${selfilter.logtype}.xlsx`);
  }

  //version history
  const [showVersionHistory, setshowVersionHistory] = useState(false);
  const [versionHistoryData, setversionHistoryData] = useState([]);
  
  const hideVersionHistoryPopup = () => {
    setshowVersionHistory(false);
  };
  
  const handleDataVersion = async (itemid) => {
    let versiondata = await getMasterVersion({
      TempId: itemid,
      MasterType: "Lookup",
    });
    setversionHistoryData(versiondata ? versiondata : []);
    setshowVersionHistory(true);
  };

  const pageFilterStyle = {
    justifyContent: "flex-start",
  };
  const tableiconclmStyle = { width: "70px" };
  return (
    <>
      <div className="page-title">Manage Lookup</div>
      <div className="page-filter" style={pageFilterStyle}>
        <div className="filter-container container">
          <div className="row">
            <div className="frm-filter col-md-3">
              <FrmSelect
                title={"Log Type"}
                name={"logtype"}
                selectopts={logtypeFilterOpts}
                handleChange={onSearchFilterSelect}
                value={selfilter.logtype}
                isdisabled={userProfile.isCountrySuperAdmin ? true : false}
              />
            </div>
          </div>
        </div>
        {/*<div className="btn-container">
          <div
            className={`btn-blue ${selfilter.logtype === "" ? "disable" : ""}`}
            onClick={handleFilterSearch}
          >
            Search
          </div>
        </div>*/}
      </div>
      <div>
        {lookupState.loading ? (
          <Loading />
        ) : lookupState.error ? (
          <div>{lookupState.error}</div>
        ) : data.length ? (
          <div className="lookup-content-container">
            <div className="lookup-type">
              {lookuptyps.map((lookuptype, index) => {
                return (
                  <>
                    <div className="lookup-title-header">
                      <div className="title">{lookuptype.name}</div>
                      {handlePermission(window.location.pathname.slice(1), "isAdd") === true ? (
                        <div className="btn-container">
                          {index === 0 && (
                            <>
                              <div
                                className={`btn-blue ${
                                  isActiveEnable ? "" : "disable"
                                }`}
                                onClick={() => setMasterdataActiveState(true)}
                              >
                                Active
                              </div>
                              <div
                                className={`btn-blue ${
                                  isActiveEnable ? "" : "disable"
                                }`}
                                onClick={() => setMasterdataActiveState(false)}
                              >
                                Inactive
                              </div>
                              <div
                                className={`btn-blue download-icon`}
                                onClick={() => handleDownload()}
                              >
                                Download
                              </div>
                            </>
                          )}

                            <div
                              className={`btn-blue`}
                              onClick={() =>
                                handleAdd({
                                  lookUpType: lookuptype.type,
                                  lookupID: "",
                                })
                              }
                            >
                              Add
                            </div>
                          </div>
                      ) : ""}
                      </div>
                      <table className="table">
                        <thead>
                          <tr>
                            {handlePermission(window.location.pathname.slice(1), "isEdit") === true && (
                              <>
                                <th style={{ width: "40px" }}></th>
                                <th style={tableiconclmStyle}>Edit</th>
                              </>
                            )}
                            {handlePermission(window.location.pathname.slice(1), "isDelete") === true && (
                              <th style={tableiconclmStyle}>Delete</th>
                            )}
                            <th style={{width: "100px", textAlign: 'center'}}>Data Version</th>
                            <th style={{ width: "250px" }}>Value</th>
                            <th>Active/Inactive</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isAddItem[lookuptype.type] ? (
                            <tr>
                              <td></td>
                              <td
                                style={tableiconclmStyle}
                                className="save-icon"
                                onClick={() =>
                                  handleSave({
                                    lookUpType: lookuptype.type,
                                    lookupID: "",
                                  })
                                }
                              ></td>
                              <td></td>
                              <td>
                                <FrmInlineInput
                                  placeholder={"Add value here"}
                                  name={lookuptype.type}
                                  value={formfield[lookuptype.type]}
                                  type={"text"}
                                  handleChange={handleNewChange}
                                  isRequired={true}
                                  validationmsg={"Mandatory field"}
                                  issubmitted={issubmitted}
                                />
                              </td>
                              <td>
                                <div style={{ width: "130px" }}>
                                  <FrmSelect
                                    title={""}
                                    name={"isActive"}
                                    isinline={true}
                                    value={formfield["isActive"]}
                                    handleChange={handleNewSelectChange}
                                    validationmsg={"Mandatory field"}
                                    issubmitted={issubmitted}
                                    selectopts={selectActVal}
                                  />
                                </div>
                              </td>
                            </tr>
                          ) : (
                            ""
                          )}
                          {data.map((item) => {
                            return lookuptype.type === item.lookUpType ? (
                              <tr>
                                 {handlePermission(window.location.pathname.slice(1), "isEdit") === true && (
                                  <>
                                    <td>
                                      <FrmActiveCheckbox
                                        name={item.lookupID}
                                        value={dataActItems.lookupID}
                                        handleChange={handleItemSelect}
                                        isdisabled={false}
                                      />
                                    </td>
                                    <td
                                      style={tableiconclmStyle}
                                      className={`${
                                        item.isEditMode ? "save-icon" : "edit-icon"
                                      }`}
                                      onClick={() => {
                                        item.isEditMode
                                          ? handleSave({
                                              lookUpType: lookuptype.type,
                                              lookupID: item.lookupID,
                                            })
                                          : handleEdit({
                                              lookUpType: lookuptype.type,
                                              lookupID: item.lookupID,
                                            });
                                      }}
                                      rowid={item.lookupID}
                                    ></td>
                                  </>
                                )}
                                {handlePermission(window.location.pathname.slice(1), "isEdit") === true && (
                                  <td
                                    className="delete-icon"
                                    onClick={() =>
                                      handleDelete({
                                        lookUpType: lookuptype.type,
                                        lookupID: item.lookupID,
                                      })
                                    }
                                    rowid={item.lookupID}
                                  ></td>
                                )}
                                 <td
                                    className="versionhistory-icon"
                                    onClick={() =>
                                      handleDataVersion(item.lookupID)
                                    }
                                    style={{width: '100px'}}
                                    rowid={item.lookupID}
                                  ></td>
                                <td>
                                  {item.isEditMode ? (
                                    <FrmInlineInput
                                      placeholder={"Add value here"}
                                      name={lookuptype.type}
                                      value={item.lookUpValue}
                                      type={"text"}
                                      itemid={item.lookupID}
                                      handleChange={handleEditChange}
                                      isRequired={true}
                                      validationmsg={"Mandatory field"}
                                      issubmitted={issubmitted}
                                    />
                                  ) : (
                                    item.lookUpValue
                                  )}
                                </td>
                                <td>
                                  {item.isEditMode ? (
                                    <div style={{ width: "130px" }}>
                                      <FrmSelect
                                        title={""}
                                        name={"isActive"}
                                        isinline={true}
                                        value={item.isActive ? "true" : "false"}
                                        itemid={item.lookupID}
                                        handleChange={handleSelectChange}
                                        validationmsg={"Mandatory field"}
                                        issubmitted={issubmitted}
                                        selectopts={selectActVal}
                                      />
                                    </div>
                                  ) : item.isActive ? (
                                    "Active"
                                  ) : (
                                    "Inactive"
                                  )}
                                </td>
                              </tr>
                            ) : (
                              ""
                            );
                          })}
                        </tbody>
                      </table>
                    </>
                  );
                })}
              </div>
            </div>
          ) : (
            ""
          )}
      </div>
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
  getAllLookupByLogType: lookupActions.getAllLookupByLogType,
  getLogTypes: lookupActions.getLogTypes,
  checkNameExist: lookupActions.checkNameExist,
  checkIsInUse: lookupActions.checkIsInUse,
  postLookupItem: lookupActions.postLookupItem,
  deleteItem: lookupActions.deleteItem,
  setMasterdataActive: commonActions.setMasterdataActive,
  getAllCountry: countryActions.getAllCountry,
  getMasterVersion: commonActions.getMasterVersion,
  downloadExcel: commonActions.downloadExcel
};
export default connect(mapStateToProp, mapActions)(Lookup);
