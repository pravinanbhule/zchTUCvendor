import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import FrmFileImport from "../common-components/frmfileupload/FrmFileImport";
import Loading from "../common-components/Loading";
import moment from "moment";
import "./Style.css";
import {
  EXEMPTION_LOG_STATUS,
  EXEMPTION_CONSTANT,
  REGION_ZNA,
} from "../../constants";
import {
  commonActions,
  lookupActions,
  countryActions,
  lobchapterActions,
  znaorgnization1Actions,
  znaorgnization2Actions,
  znaorgnization3Actions,
  znaorgnization4Actions,
} from "../../actions";
import {
  alertMessage,
  dynamicSort,
  validateEmail,
  isNotEmptyValue,
} from "../../helpers";
import readXlsxFile from "read-excel-file";
import ExportToExcel from "../common-components/exporttoexcel/ExportToExcel";
import ExportToExcelLib from "../common-components/exporttoexcel/ExportToExcelLib";
function AddImportLogs(props) {
  const {
    countryState,
    lobchapterState,
    znaorgnization1State,
    znaorgnization2State,
    znaorgnization3State,
    znaorgnization4State,
  } = props.state;
  const {
    title,
    hideImportLogsPopup,
    formIntialState,
    getLookupByType,
    getAllCountry,
    getAlllobChapter,
    selectedExemptionLog,
    userProfile,
    setisDataImported,
    importExcelLogs,
    validateActDirEmail,
    downloadTemplate,
    exportFileName,
    getallZNASegments,
    getallZNASBU,
    getallZNAMarketBasket,
    getallZNAProducts,
  } = props;

  const ZUGMandatoryFields = [
    "countryID",
    "typeOfExemption",
    "typeOfBusiness",
    "lobChapter",
    "approver",
    "status",
    "section",
    "empowermentRequestedBy",
    "empowermentAndFeedbackRequest",
  ];
  const URPMMandatoryFields = [
    "countryID",
    "typeOfExemption",
    "typeOfBusiness",
    "approver",
    "status",
    "section",
    "empowermentRequestedBy",
    "requestDetails",
  ];
  const [commonMandatoryFields, setcommonMandatoryFields] = useState([]);
  const FileDownload = require("js-file-download");
  const templateName =
    selectedExemptionLog === "zug"
      ? "TUC_ExemptionLog_ZUG_Import_Template.xlsm"
      : "TUC_ExemptionLog_URPM_Import_Template.xlsm";
  const status = {
    Pending: EXEMPTION_LOG_STATUS.Pending,
    Empowerment_granted: EXEMPTION_LOG_STATUS.Empowerment_granted,
    Empowerment_not_granted: EXEMPTION_LOG_STATUS.Empowerment_not_granted,
    More_Information_Needed: EXEMPTION_LOG_STATUS.More_Information_Needed,
    Withdrawn: EXEMPTION_LOG_STATUS.Withdrawn,
    No_longer_required: EXEMPTION_LOG_STATUS.No_longer_required,
  };

  const exemptionType_Individual = EXEMPTION_CONSTANT.TypeExemption_Individual;
  const exemptionType_Portfolio = EXEMPTION_CONSTANT.TypeExemption_Portfolio;
  const fullTransitional_Transitional =
    EXEMPTION_CONSTANT.FullTransitional_Transitional;
  const full_Transitional = EXEMPTION_CONSTANT.Full_Transitional;
  const znaregion = REGION_ZNA;
  const [masterdata, setmasterdata] = useState({
    country: [],
    countryObj: {},
    countryDetailObj: {},
    loBChapter: [],
    loBChapterObj: {},
    typeOfExemption: [],
    typeOfExemptionObj: {},
    typeOfBusiness: [],
    typeOfBusinessObj: {},
    fullTransitional: [],
    fullTransitionalObj: {},
    status: [],
    statusObj: {},
    pC_URPMExemptionRequiredObj: { TRUE: true, FALSE: false },
    ZNASegment: [],
    ZNASegmentObj: {},
    ZNAMarketBasket: [],
    ZNAMarketBasketObj: {},
    ZNASBU: [],
    ZNASBUObj: {},
    ZNAProducts: [],
    ZNAProductsObj: {},
  });
  const [loading, setloading] = useState(true);
  const [logType, setlogType] = useState("ExemptionLogs");

  useEffect(() => {
    fnOnInit();
  }, []);
  const fnOnInit = async () => {
    //import all lookup and masterdata fields
    getAllCountry();
    getAlllobChapter();
    getallZNASegments();
    getallZNASBU();
    getallZNAMarketBasket();
    getallZNAProducts();
    let tempopts = [];
    let tempObj = {};

    let tempTypeOfExemption = await getLookupByType({
      LookupType: "EXMPTypeOfExemption",
    });
    let tempTypeOfBusiness = await getLookupByType({
      LookupType: "EXMPTypeOfBusiness",
    });
    let tempFullTransitional = await getLookupByType({
      LookupType: "EXMPFullTransitional",
    });
    let tempStatus = await getLookupByType({
      LookupType: "EXMPZUGStatus",
    });
    tempTypeOfExemption.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    tempTypeOfExemption = [...tempopts];
    let tempTypeOfExemptionObj = { ...tempObj };
    tempopts = [];
    tempObj = {};
    tempTypeOfBusiness.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    tempTypeOfBusiness = [...tempopts];
    let tempTypeOfBusinessObj = { ...tempObj };
    tempopts = [];
    tempObj = {};
    tempFullTransitional.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    tempFullTransitional = [...tempopts];
    let tempFullTransitionalObj = { ...tempObj };
    tempopts = [];
    tempObj = {};
    tempStatus.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    tempStatus = [...tempopts];
    let tempStatusObj = { ...tempObj };

    setmasterdata((prevstate) => ({
      ...prevstate,
      typeOfExemption: [...tempTypeOfExemption],
      typeOfExemptionObj: { ...tempTypeOfExemptionObj },
      typeOfBusiness: [...tempTypeOfBusiness],
      typeOfBusinessObj: { ...tempTypeOfBusinessObj },
      fullTransitional: [...tempFullTransitional],
      fullTransitionalObj: { ...tempFullTransitionalObj },
      status: [...tempStatus],
      statusObj: { ...tempStatusObj },
    }));
    if (selectedExemptionLog === "zug") {
      setcolumnExcelMapping({ ...columnExcelMappingZUG });
      setcommonMandatoryFields([...ZUGMandatoryFields]);
      setlogType("zug");
    } else {
      setcolumnExcelMapping({ ...columnExcelMappingURPM });
      setcommonMandatoryFields([...URPMMandatoryFields]);
      setlogType("urpm");
    }
    // setmandatoryFields([...commonMandatoryFields, ...regionMandotoryFields]);
    setloading(false);
  };

  useEffect(() => {
    let tempopts = [];
    let tempObj = {};
    countryState.countryItems.forEach((item) => {
      let obj = {
        ...item,
        label: item.countryName.trim(),
        value: item.countryID,
        regionId: item.regionID,
      };
      tempopts.push(obj);
      tempObj[obj.label] = obj.value;
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      country: [...tempopts],
      countryObj: { ...tempObj },
    }));
  }, [countryState.countryItems]);

  useEffect(() => {
    let tempopts = [];
    let tempObj = {};
    znaorgnization1State.org1Items.forEach((item) => {
      let obj = {
        ...item,
        label: item.znaSegmentName.trim(),
        value: item.znaSegmentId,
      };
      tempopts.push(obj);
      tempObj[obj.label] = obj.value;
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      ZNASegment: [...tempopts],
      ZNASegmentObj: { ...tempObj },
    }));
  }, [znaorgnization1State.org1Items]);

  useEffect(() => {
    let tempopts = [];
    let tempObj = {};
    let tempMapObj = {};
    znaorgnization2State.org2Items.forEach((item) => {
      let obj = {
        ...item,
        label: item.sbuName.trim(),
        value: item.znasbuId,
      };
      tempopts.push(obj);
      tempObj[obj.label] = obj.value;
      tempMapObj[obj.label] = item;
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      ZNASBU: [...tempopts],
      ZNASBUObj: { ...tempObj },
      ZNASBUsMapObj: { ...tempMapObj },
    }));
  }, [znaorgnization2State.org2Items]);

  useEffect(() => {
    let tempopts = [];
    let tempObj = {};
    let tempMapObj = {};
    znaorgnization3State.org3Items.forEach((item) => {
      let obj = {
        ...item,
        label: item.marketBasketName.trim(),
        value: item.marketBasketId,
      };
      tempopts.push(obj);
      tempObj[obj.label] = obj.value;
      tempMapObj[obj.label] = item;
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      ZNAMarketBasket: [...tempopts],
      ZNAMarketBasketObj: { ...tempObj },
      ZNAMarketBasketsMapObj: { ...tempMapObj },
    }));
  }, [znaorgnization3State.org3Items]);

  useEffect(() => {
    let tempopts = [];
    let tempObj = {};
    znaorgnization4State.org4Items.forEach((item) => {
      let obj = {
        ...item,
        label: item.znaProductsName.trim(),
        value: item.znaProductsId,
      };
      tempopts.push(obj);
      tempObj[obj.label] = obj.value;
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      ZNAProducts: [...tempopts],
      ZNAProductsObj: { ...tempObj },
    }));
  }, [znaorgnization4State.org4Items]);

  useEffect(() => {
    let tempopts = [];
    let tempObj = {};
    lobchapterState.lobChapterItems.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lobChapterName,
          value: item.lobChapterID,
        });
        tempObj[item.lobChapterName] = item.lobChapterID;
      }
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      loBChapter: [...tempopts],
      loBChapterObj: { ...tempObj },
    }));
    //setfrmSegmentOpts([...tempopts]);
  }, [lobchapterState.lobChapterItems]);

  const [logData, setlogData] = useState([]);
  const [columnExcelMapping, setcolumnExcelMapping] = useState({});
  const columnExcelMappingZUG = {
    "Sr No": { lookupObj: "", fieldname: "" },
    Title: {
      lookupObj: "",
      fieldname: "title",
    },
    Country: {
      lookupObj: "countryObj",
      fieldname: "countryID",
      multival: true,
    },
    "Type of Exemption": {
      lookupObj: "typeOfExemptionObj",
      fieldname: "typeOfExemption",
    },
    "Type of Business": {
      lookupObj: "typeOfBusinessObj",
      fieldname: "typeOfBusiness",
      multival: true,
    },
    "Individual Granted Empowerment": {
      lookupObj: "",
      fieldname: "individualGrantedEmpowerment",
      email: true,
    },
    "LoB Chapter/Document": {
      lookupObj: "loBChapterObj",
      fieldname: "lobChapter",
    },
    Section: {
      lookupObj: "",
      fieldname: "section",
    },
    "Section Subject": {
      lookupObj: "",
      fieldname: "sectionSubject",
    },
    "ZUG Chapter Version": {
      lookupObj: "",
      fieldname: "zugChapterVersion",
    },
    "Previous Exemption ID": { lookupObj: "", fieldname: "ciGuidlineId" },
    "Empowerment request details": {
      lookupObj: "",
      fieldname: "empowermentAndFeedbackRequest",
    },
    "Empowerment Requested By": {
      lookupObj: "",
      fieldname: "empowermentRequestedBy",
      email: true,
    },
    "Full/Transitional": {
      lookupObj: "fullTransitionalObj",
      fieldname: "fullTransitional",
    },
    "Transitional Expiring Date of Empowerment": {
      lookupObj: "",
      fieldname: "transitionalExpireDate",
      date: true,
    },
    "P&C URPM exemption required": {
      lookupObj: "pC_URPMExemptionRequiredObj",
      fieldname: "pC_URPMExemptionRequired",
    },
    Approver: {
      lookupObj: "",
      fieldname: "approver",
      email: true,
    },
    "Exemption CC": {
      lookupObj: "",
      fieldname: "exemptionCC",
      email: true,
    },
    Status: {
      lookupObj: "statusObj",
      fieldname: "status",
    },
    "Expiring Date (Only for Status 'Non Longer required')": {
      lookupObj: "",
      fieldname: "expiringDate",
      date: true,
    },
    "Additional Approval Comments": {
      lookupObj: "",
      fieldname: "additionalApprovalComments",
    },
    "ZNA BU": {
      lookupObj: "ZNASegmentObj",
      fieldname: "znaSegmentId",
    },
    "ZNA SBU": {
      lookupObj: "ZNASBUObj",
      fieldname: "znasbuId",
      multival: true,
      mapping: true,
      mappedField: "znaSegmentId",
      mappingType: "org1",
    },
    "ZNA Market Basket": {
      lookupObj: "ZNAMarketBasketObj",
      fieldname: "marketBasketId",
      multival: true,
      mapping: true,
      mappedField: "znasbuId",
      mappingType: "org2",
    },
    "ZNA Products": {
      lookupObj: "ZNAProductsObj",
      fieldname: "znaProductsId",
      multival: true,
    },
    Creator: {
      lookupObj: "",
      fieldname: "createdByID",
      email: true,
    },
    "Created Date": {
      lookupObj: "",
      fieldname: "createdDate",
      date: true,
    },
    "Modified By": {
      lookupObj: "",
      fieldname: "modifiedById",
      email: true,
    },
    "Modified Date": {
      lookupObj: "",
      fieldname: "modifiedDate",
      date: true,
    },
  };
  const columnExcelMappingURPM = {
    "Sr No": { lookupObj: "", fieldname: "" },
    Title: {
      lookupObj: "",
      fieldname: "title",
    },
    Country: {
      lookupObj: "countryObj",
      fieldname: "countryID",
      multival: true,
    },
    "Type of Exemption": {
      lookupObj: "typeOfExemptionObj",
      fieldname: "typeOfExemption",
    },
    "Type of Business": {
      lookupObj: "typeOfBusinessObj",
      fieldname: "typeOfBusiness",
      multival: true,
    },
    "Individual Granted Empowerment": {
      lookupObj: "",
      fieldname: "individualGrantedEmpowerment",
      email: true,
    },
    Section: {
      lookupObj: "",
      fieldname: "section",
    },
    "Section Subject": {
      lookupObj: "",
      fieldname: "sectionSubject",
    },

    "Empowerment request details": {
      lookupObj: "",
      fieldname: "requestDetails",
    },
    "Empowerment Requested By": {
      lookupObj: "",
      fieldname: "empowermentRequestedBy",
      email: true,
    },
    "Full/Transitional": {
      lookupObj: "fullTransitionalObj",
      fieldname: "fullTransitional",
    },
    "Transitional Expiring Date of Empowerment": {
      lookupObj: "",
      fieldname: "transitionalExpireDate",
      date: true,
    },
    Approver: {
      lookupObj: "",
      fieldname: "approver",
      email: true,
    },
    "Exemption CC": {
      lookupObj: "",
      fieldname: "exemptionCC",
      email: true,
    },
    Status: {
      lookupObj: "statusObj",
      fieldname: "status",
    },
    "Expiring Date (Only for Status 'Non Longer required')": {
      lookupObj: "",
      fieldname: "expiringDate",
      date: true,
    },
    "Additional Approval Comments": {
      lookupObj: "",
      fieldname: "additionalApprovalComments",
    },
    "ZNA BU": {
      lookupObj: "ZNASegmentObj",
      fieldname: "znaSegmentId",
    },
    "ZNA SBU": {
      lookupObj: "ZNASBUObj",
      fieldname: "znasbuId",
      multival: true,
      mapping: true,
      mappedField: "znaSegmentId",
      mappingType: "org1",
    },
    "ZNA Market Basket": {
      lookupObj: "ZNAMarketBasketObj",
      fieldname: "marketBasketId",
      multival: true,
      mapping: true,
      mappedField: "znasbuId",
      mappingType: "org2",
    },
    "ZNA Products": {
      lookupObj: "ZNAProductsObj",
      fieldname: "znaProductsId",
      multival: true,
    },
    Creator: {
      lookupObj: "",
      fieldname: "createdByID",
      email: true,
    },
    "Created Date": {
      lookupObj: "",
      fieldname: "CreatedDate",
      date: true,
    },
    "Modified By": {
      lookupObj: "",
      fieldname: "modifiedById",
      email: true,
    },
    "Modified Date": {
      lookupObj: "",
      fieldname: "modifiedDate",
      date: true,
    },
  };
  const [isSubmitted, setisSubmitted] = useState(false);
  const [insertResponesData, setinsertResponesData] = useState([]);
  const [excelValidatedData, setexcelValidatedData] = useState([]);
  const [invalidEntry, setinvalidEntry] = useState([]);
  const [emailEntries, setemailEntries] = useState([]);
  const [exportData, setexportData] = useState([]);
  const [isLoadingValidation, setisLoadingValidation] = useState(false);
  const [isDataImport, setisDataImport] = useState(false);
  const maxCount = 51;
  const fieldCount = selectedExemptionLog === "zug" ? 28 : 24;
  const validateExcelData = async (excelData) => {
    let excelReportData = [];
    let logData = [];
    let fieldArr = [];
    let invalideDataEntry = [];
    let tempemailEntries = [];
    let isExcelValid = true;
    if (excelData.length > maxCount) {
      alert(alertMessage.importlogs.limiterror);
      isExcelValid = false;
      return;
    }
    if (excelData[0].length !== fieldCount) {
      alert(alertMessage.importlogs.fieldcounterror);
      isExcelValid = false;
      return;
    }
    try {
      excelData.forEach((data, rowindex) => {
        if (rowindex === 0) {
          //capturing fieldnames
          data.forEach((fieldname, index) => {
            let tempname = fieldname.trim();
            if (index !== 0 && !columnExcelMapping[tempname]) {
              alert(alertMessage.importlogs.fieldnameerror);
              isExcelValid = false;
              return;
            }
            fieldArr.push(tempname);
          });
        } else if (isExcelValid) {
          //capturing log data
          let templogdata = {};
          let reportdata = {};
          let isvalid = true;
          let mandatoryFields = [...commonMandatoryFields];
          let dataEmails = [];
          setisLoadingValidation(true);
          data.forEach((cellData, index) => {
            if (index === 0) {
              reportdata["srNo"] = rowindex;
              reportdata["isvalid"] = true;
              reportdata["invalidfields"] = [];
              reportdata["emailfields"] = {};
            } else {
              let excelfieldname = fieldArr[index];
              let fieldname = columnExcelMapping[excelfieldname]["fieldname"];
              let isdate = columnExcelMapping[fieldArr[index]]["date"];
              let lookupObj = columnExcelMapping[fieldArr[index]]["lookupObj"];
              let ismapping = columnExcelMapping[fieldArr[index]]["mapping"];
              let mappedField =
                columnExcelMapping[fieldArr[index]]["mappedField"];
              let mappingType =
                columnExcelMapping[fieldArr[index]]["mappingType"];
              let isemail = columnExcelMapping[fieldArr[index]]["email"];
              let ismultival = columnExcelMapping[fieldArr[index]]["multival"];
              let value =
                typeof cellData === "string" ? cellData.trim() : cellData;
              if (value && ismultival) {
                value = value.split("##");
                let tempval = [];
                value.forEach((val) => {
                  const tempvalue = lookupObj
                    ? masterdata[lookupObj][val]
                      ? masterdata[lookupObj][val]
                      : ""
                    : isdate
                    ? value
                      ? value
                      : null //moment(value).format("YYYY-MM-DD")
                    : value
                    ? value.toString()
                    : value;
                  if (tempvalue) {
                    tempval.push(tempvalue);
                  }
                });
                value = tempval.join(",");
              } else {
                value = lookupObj
                  ? masterdata[lookupObj][value]
                  : isdate
                  ? value
                    ? value
                      ? value
                      : null //moment(value).format("YYYY-MM-DD")
                    : null
                  : value
                  ? value.toString()
                  : value;
              }

              if (
                templogdata["fullTransitional"] ===
                fullTransitional_Transitional
              ) {
                mandatoryFields = [
                  ...commonMandatoryFields,
                  "transitionalExpireDate",
                ];
                if (templogdata["status"] === status.No_longer_required) {
                  mandatoryFields = [
                    ...commonMandatoryFields,
                    "transitionalExpireDate",
                    "expiringDate",
                  ];
                }
              } else if (templogdata["status"] === status.No_longer_required) {
                mandatoryFields = [...commonMandatoryFields, "expiringDate"];
              }
              if (isemail && value && validateEmail(value)) {
                reportdata["emailfields"][excelfieldname] = value;
                dataEmails.push(value);
              }
              let isvalidval = isNotEmptyValue(value);
              if (
                (mandatoryFields.includes(fieldname) && !isvalidval) ||
                (cellData && !isvalidval && value !== false) ||
                (isvalidval &&
                  ismapping &&
                  !validateMapValues(
                    cellData,
                    mappedField,
                    templogdata[mappedField],
                    mappingType,
                    ismultival
                  )) ||
                (isvalidval && isemail && !validateEmail(value)) ||
                (isvalidval && isdate && !moment(value).isValid()) ||
                (fieldname === "status" &&
                  value !== status.Pending &&
                  !userProfile.isSuperAdmin &&
                  templogdata["approver"] !== userProfile.emailAddress) ||
                (fieldname === "approver" &&
                  templogdata["empowermentRequestedBy"] === value) ||
                (fieldname === "individualGrantedEmpowerment" &&
                  isvalidval &&
                  templogdata["typeOfExemption"] === exemptionType_Portfolio) ||
                (fieldname === "transitionalExpireDate" &&
                  isvalidval &&
                  templogdata["fullTransitional"] === full_Transitional) ||
                (isvalidval &&
                  (fieldname === "znaSegmentId" ||
                    fieldname === "znasbuId" ||
                    fieldname === "marketBasketId" ||
                    fieldname === "znaProductsId") &&
                  templogdata["regionId"].indexOf(znaregion) === -1)
              ) {
                //added below condition to check & validate values
                isvalid = false;
                reportdata["isvalid"] = false;
                reportdata["invalidfields"].push(excelfieldname);
              }
              if (value || value === false) {
                templogdata[fieldname] = value;
              }
              if (fieldname === "countryID") {
                if (value) {
                  const tempCoutries = value.split(",");
                  tempCoutries.forEach((item) => {
                    masterdata.country.forEach((country) => {
                      if (country.countryID === item) {
                        templogdata["regionId"] = country.regionID;
                      }
                    });
                  });
                } else {
                  templogdata["regionId"] = "";
                }
              }
            }
          });

          if (isvalid) {
            if (
              templogdata["fullTransitional"] !== fullTransitional_Transitional
            ) {
              //added below condition to set hidden fields to orginal value
              templogdata["transitionalExpireDate"] = null;
            }
            if (templogdata["status"] !== status.No_longer_required) {
              templogdata["expiringDate"] = null;
            }
            logData.push({
              ...formIntialState,
              ...templogdata,
              importedBy: userProfile.emailAddress,
              srNo: rowindex,
              exemptionLogType: selectedExemptionLog,
              isSubmit: true,
            });
          } else {
            invalideDataEntry.push(reportdata);
          }
          if (dataEmails.length) {
            tempemailEntries.push({
              srNo: reportdata.srNo,
              email: dataEmails.join(","),
            });
          }
          excelReportData.push(reportdata);
        }
      });
      if (isExcelValid) {
        setlogData([...logData]);
        setemailEntries([...tempemailEntries]);
        const response = await validateActDirEmail({
          emailData: tempemailEntries,
        });
        if (response) {
          response.forEach((item, index) => {
            if (!item.isValid) {
              let tempexcelReportData = excelReportData[index];
              tempexcelReportData["isvalid"] = false;
              const invalidEmails = item.error;
              tempexcelReportData["invalidEmail"] = true;
              invalideDataEntry.push({ srNo: item["srNo"], isvalid: false });
              tempexcelReportData["invalidEmailList"] = [];
              for (let key in tempexcelReportData["emailfields"]) {
                if (
                  invalidEmails.indexOf(
                    tempexcelReportData["emailfields"][key]
                  ) !== -1
                ) {
                  tempexcelReportData["invalidEmailList"].push(
                    `${key} - ${tempexcelReportData["emailfields"][key]}`
                  );
                }
              }
            }
          });
        }
        setexcelValidatedData([...excelReportData]);
        setinvalidEntry([...invalideDataEntry]);
        setisLoadingValidation(false);
      }
    } catch (error) {}
  };
  const validateMapValues = (
    value,
    mappedField,
    mappedvalue,
    type,
    ismultival
  ) => {
    switch (type) {
      case "region":
        if (masterdata["countryObj"][value][mappedField] === mappedvalue) {
          return true;
        } else {
          return false;
        }
      case "org1":
        if (ismultival) {
          const tempval = value.split("##");
          let isvalid = true;
          tempval.forEach((val) => {
            if (
              mappedvalue?.indexOf(
                masterdata["ZNASBUsMapObj"][val][mappedField]
              ) === -1
            ) {
              isvalid = false;
            }
            if (!mappedvalue) {
              isvalid = false;
            }
          });
          return isvalid;
        } else {
          if (masterdata["ZNASBUsMapObj"][value][mappedField] === mappedvalue) {
            return true;
          } else {
            return false;
          }
        }
      case "org2":
        if (ismultival) {
          const tempval = value.split("##");
          let isvalid = true;
          tempval.forEach((val) => {
            if (
              mappedvalue?.indexOf(
                masterdata["ZNAMarketBasketsMapObj"][val][mappedField]
              ) === -1
            ) {
              isvalid = false;
            }
            if (!mappedvalue) {
              isvalid = false;
            }
          });
          return isvalid;
        } else {
          if (
            masterdata["ZNAMarketBasketsMapObj"][value][mappedField] ===
            mappedvalue
          ) {
            return true;
          } else {
            return false;
          }
        }
      default:
        break;
    }
  };
  const onfileImport = (file) => {
    if (!file) {
      return;
    }
    readXlsxFile(file[0], { sheet: 2 }).then((rows, errors) => {
      // `rows` is an array of rows
      // each row being an array of cells.
      setlogData([]);
      setexcelValidatedData([]);
      setinvalidEntry([]);
      setinsertResponesData([]);
      setisSubmitted(false);
      validateExcelData(rows);
      document.getElementById("file").value = null;
    });
  };
  const handleDownload = async () => {
    const responsedata = await downloadTemplate({ request: logType });
    FileDownload(responsedata, templateName);
  };
  const handleSubmit = async () => {
    // const response = await importExcelLogs({ type: logType, logdata: logData });
    // alert(response);
    if (isSubmitted) return;
    if (invalidEntry.length) {
      alert(alertMessage.importlogs.invalidDataMsg);
      return;
    }
    if (!window.confirm(alertMessage.importlogs.confirmImportDataMsg)) {
      return;
    }
    setisSubmitted(true);
    setisDataImport(true);
    const tempInsertObj = {
      logdata: logData,
      logType: logType,
    };
    //setdebuglogdata(JSON.stringify(tempInsertObj));

    const response = await importExcelLogs(tempInsertObj);
    if (response) {
      setisDataImport(false);
      alert("Data is imported.");
      setinsertResponesData(response);
      setExportToExcelData(response);
      setlogData([]);
      setisDataImported(true);
    } else {
      setisDataImport(false);
      alert("Error in data imported.");
    }
    resetfileimport();
  };
  const handleCancel = () => {
    resetfileimport();
    setinsertResponesData([]);
    setexportData([]);
  };
  const resetfileimport = () => {
    setexcelValidatedData([]);
    setlogData([]);

    document.getElementById("file").value = null;
  };
  const setExportToExcelData = (importedData) => {
    let column = [{ title: "Sr. No." }, { title: "Entry Number." }];
    let data = [];
    importedData?.forEach((item, index) => {
      let dataitem = [];
      if (item.isValid) {
        dataitem.push({ value: item["srNo"]?.toString() });
        dataitem.push({ value: item["entityNumber"] });
        data.push(dataitem);
      }
    });
    const multiDataSet = [
      {
        columns: column,
        data: data,
      },
    ];
    setexportData([...multiDataSet]);
  };
  return loading ? (
    <Loading />
  ) : (
    <div className="addedit-logs-container">
      <div className="addedit-header-container">
        <div className="addedit-header-title">{title}</div>
        <div className="header-btn-container">
          <div
            className="addedit-close btn-blue"
            onClick={() => hideImportLogsPopup()}
          >
            Back
          </div>
        </div>
      </div>
      <div className="popup-formitems">
        <div className="row border-bottom">
          <div className="col-md-6">
            <FrmFileImport
              title={"Browse file to import"}
              name={"fullFilePath"}
              isReadMode={false}
              isdisabled={false}
              isRequired={false}
              onfileImport={onfileImport}
            />
          </div>
          <div className="col-md-6">
            <div className="download-temp-btn">
              <div className="btn-blue download-icon" onClick={handleDownload}>
                Download Template
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="excel-import-notes">
              <div className="info-icon"></div>
              <div className="notes">
                <div>Choose Excel as the format.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="import-excelreport-container">
              {isLoadingValidation ? (
                <>
                  <div>Validating data...</div>
                  <Loading />
                </>
              ) : excelValidatedData.length && !isDataImport ? (
                <div className="import-excelreport">
                  <table>
                    <tr>
                      <th>Row ID</th>
                      <th style={{ width: "350px" }}>Error / Invalid fields</th>
                      <th style={{ width: "350px" }}>
                        Invalid emails (Not present in AD)
                      </th>
                      <th style={{ width: "180px" }}>Status</th>
                    </tr>
                    {excelValidatedData.map((item) => (
                      <tr className={`${!item["isvalid"] && "error"}`}>
                        <td>{item["srNo"]}</td>
                        <td>
                          {item["invalidfields"].length
                            ? item["invalidfields"].join(", ")
                            : "-"}
                        </td>
                        <td>
                          {item["invalidEmail"]
                            ? item["invalidEmailList"].map((item) => (
                                <>
                                  <span>{item}</span>
                                  <br></br>
                                </>
                              ))
                            : "-"}
                        </td>
                        <td>
                          {item["isvalid"] ? (
                            <span>Valid entry</span>
                          ) : (
                            <span>Not valid</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              ) : (
                ""
              )}
              {isDataImport ? (
                <>
                  <div>Importing Data...</div>
                  <Loading />
                </>
              ) : insertResponesData.length ? (
                <>
                  <div className="btn-container">
                    <div>
                      <b>Imported records - </b>
                    </div>
                    <div>
                      <ExportToExcelLib
                        exportReportTitle={"Export Data"}
                        exportFileName={exportFileName}
                        multiDataSet={exportData}
                      />
                    </div>
                  </div>
                  <div className="import-excelreport">
                    <table>
                      <tr>
                        <th>Row ID</th>
                        <th>Entry No</th>
                      </tr>
                      {insertResponesData.map((item) => (
                        <tr className={`${!item["isValid"] && "error"}`}>
                          <td>{item["srNo"]}</td>

                          <td>
                            {item["entityNumber"] && item["entityNumber"]}
                          </td>
                        </tr>
                      ))}
                    </table>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {excelValidatedData.length || insertResponesData.length ? (
          <div className="col-md-12">
            <div className="popup-footer-container">
              <div className="btn-container">
                <button
                  className={`btn-blue ${isSubmitted ? "disable" : ""}`}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <div className="btn-blue" onClick={handleCancel}>
                  Cancel
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
const mapActions = {
  getLookupByType: lookupActions.getLookupByType,
  importExcelLogs: commonActions.importExcelLogs,
  validateActDirEmail: commonActions.validateActDirEmail,
  getAllCountry: countryActions.getAllCountry,
  getAlllobChapter: lobchapterActions.getAlllobChapter,
  downloadTemplate: commonActions.downloadTemplate,
  getallZNASegments: znaorgnization1Actions.getAllOrgnization,
  getallZNASBU: znaorgnization2Actions.getAllOrgnization,
  getallZNAMarketBasket: znaorgnization3Actions.getAllOrgnization,
  getallZNAProducts: znaorgnization4Actions.getAllOrgnization,
};
export default connect(mapStateToProp, mapActions)(AddImportLogs);
