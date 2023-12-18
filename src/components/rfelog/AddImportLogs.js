import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import FrmFileImport from "../common-components/frmfileupload/FrmFileImport";
import FrmSelect from "../common-components/frmselect/FrmSelect";
import Loading from "../common-components/Loading";
import moment from "moment";
import "./Style.css";
import {
  RFE_LOG_ORGALINMENT,
  RFE_LOG_STATUS,
  USER_ROLE,
  REGION_LATAM,
  INCOUNTRY_FLAG,
  INCOUNTRTY_IDS,
} from "../../constants";
import {
  commonActions,
  lookupActions,
  countryActions,
  regionActions,
  lobActions,
  sublobActions,
  segmentActions,
  branchActions,
  currencyActions,
  userprofileActions,
} from "../../actions";
import {
  alertMessage,
  dynamicSort,
  validateEmail,
  isNotEmptyValue,
} from "../../helpers";
import readXlsxFile from "read-excel-file";
import ExportToExcelLib from "../common-components/exporttoexcel/ExportToExcelLib";
import { isObject } from "../../helpers";
function AddImportLogs(props) {
  const {
    countryState,
    lobState,
    sublobState,
    currencyState,
    segmentState,
    branchState,
  } = props.state;
  const {
    title,
    hideImportLogsPopup,
    formIntialState,
    getLookupByType,
    getAllCountry,
    getAlllob,
    getAllSublob,
    downloadTemplate,
    userProfile,
    setisDataImported,
    importExcelLogs,
    validateActDirEmail,
    exportFileName,
    getAllCurrency,
    getAllBranch,
    getAllSegment,
    getMultiUserProfile,
    incountryopts,
  } = props;
  const FileDownload = require("js-file-download");
  const templateName = "TUC_RFELog_Import_Template.xlsm";
  const [commonMandatoryFields, setcommonMandatoryFields] = useState([
    "AccountName",
    "OrganizationalAlignment",
    "CountryId",
    "LOBId",
    "DurationofApproval",
    "RequestForEmpowermentReason",
    "RFELogDetails",
    "UnderwriterGrantingEmpowerment",
    "RequestForEmpowermentStatus",
    "Underwriter",
  ]);
  const [LATAMMandatoryFields, setLATAMMandatoryFields] = useState([
    "CustomerSegment",
    "NewRenewal",
    "GWP",
  ]);
  const [mandatoryFields, setmandatoryFields] = useState([]);
  const organizationalAlignment = {
    global: RFE_LOG_ORGALINMENT.Global,
    region: RFE_LOG_ORGALINMENT.Region,
    country: RFE_LOG_ORGALINMENT.Country,
  };
  const rfelog_status = {
    Pending: RFE_LOG_STATUS.Pending,
    More_information_needed: RFE_LOG_STATUS.More_information_needed,
    Empowerment_granted: RFE_LOG_STATUS.Empowerment_granted,
    Empowerment_granted_with_conditions:
      RFE_LOG_STATUS.Empowerment_granted_with_conditions,
    Empowerment_not_granted: RFE_LOG_STATUS.Empowerment_not_granted,
    Withdrawn: RFE_LOG_STATUS.Withdrawn,
  };
  const IncountryFlagCost = INCOUNTRY_FLAG;
  const [masterdata, setmasterdata] = useState({
    country: [],
    countryObj: {},
    lobs: [],
    lobsObj: {},
    lobsValueObj: {},
    subLoBs: [],
    subLoBsObj: {},
    orgnizationalalignment: [],
    orgnizationalalignmentObj: {},
    rfechz: [],
    rfechzObj: {},
    rfeEmpourment: [],
    rfeEmpourmentObj: {},
    durationofApprovals: [],
    durationofApprovalObj: {},
    status: [],
    statusObj: {},
    condition: [],
    conditionObj: {},
    segments: [],
    segmentObj: {},
    branchs: [],
    branchObj: {},
    branchMapObj: {},
    currency: [],
    currencyObj: {},
    newRenewal: [],
    newRenewalObj: {},
  });
  const [loading, setloading] = useState(true);
  const [logType, setlogType] = useState("rfelogs");
  const approverIntialRole = {
    isAdminGroup: false,
    isSuperAdmin: false,
    isGlobalAdmin: false,
    isRegionAdmin: false,
    isCountryAdmin: false,
    isNormalUser: false,
  };
  /* const [incountryopts, setincountryopts] = useState([
    { label: "Global", value: "gn" },
    { label: "Indonesia", value: IncountryFlagCost.Indonesia },
    { label: "UK", value: IncountryFlagCost.UK },
    { label: "LATAM", value: IncountryFlagCost.LATAM },
  ]);*/
  const [importfieldscount, setimportfieldscount] = useState(0);
  useEffect(() => {
    fnOnInit();
  }, []);
  const fnOnInit = async () => {
    //import all lookup and masterdata fields
    getAllCountry();
    getAlllob();
    getAllSublob();
    getAllSegment({ logType: "rfelogs" });
    getAllCurrency();
    getAllBranch();
    let tempopts = [];
    let tempObj = {};
    let temporgnizationalalignment = await getLookupByType({
      LookupType: "RFEOrganizationalAlignment",
    });
    let temprfechz = await getLookupByType({
      LookupType: "RFECHZ",
    });
    let temprfeempourment = await getLookupByType({
      LookupType: "RFEEmpowermentReasonRequest",
    });
    let tempstatus = await getLookupByType({
      LookupType: "RFEEmpowermentStatusRequest",
    });
    let tempCondition = await getLookupByType({
      LookupType: "ConditionApplicableTo",
    });
    let tempDurationofapprvl = await getLookupByType({
      LookupType: "DurationofApproval",
    });
    let temNewRenewal = await getLookupByType({
      LookupType: "RFELogNewRenewal",
    });
    tempopts = [];
    tempObj = {};
    temporgnizationalalignment.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    temporgnizationalalignment = [...tempopts];
    let temporgnizationalalignmentObj = { ...tempObj };
    tempopts = [];
    tempObj = {};
    temprfechz.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    temprfechz = [...tempopts];
    let temprfechzObj = { ...tempObj };
    tempopts = [];
    tempObj = {};
    temNewRenewal.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    temNewRenewal = [...tempopts];
    let temNewRenewalObj = { ...tempObj };

    tempopts = [];
    tempObj = {};
    temprfeempourment.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    temprfeempourment = [...tempopts];
    let temprfeempourmentObj = { ...tempObj };

    tempopts = [];
    tempObj = {};

    tempstatus.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    tempstatus = [...tempopts];
    let tempstatusObj = { ...tempObj };

    tempopts = [];
    tempObj = {};
    tempCondition.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    tempCondition = [...tempopts];
    let tempconditionObj = { ...tempObj };

    tempopts = [];
    tempObj = {};
    tempDurationofapprvl.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    tempDurationofapprvl = [...tempopts];
    let tempDurationofapprvlObj = { ...tempObj };
    setmasterdata((prevstate) => ({
      ...prevstate,
      orgnizationalalignment: [...temporgnizationalalignment],
      orgnizationalalignmentObj: { ...temporgnizationalalignmentObj },
      rfechz: [...temprfechz],
      rfechzObj: { ...temprfechzObj },
      rfeEmpourment: [...temprfeempourment],
      rfeEmpourmentObj: { ...temprfeempourmentObj },
      status: [...tempstatus],
      statusObj: { ...tempstatusObj },
      condition: [...tempCondition],
      conditionObj: { ...tempconditionObj },
      durationofApprovals: [...tempDurationofapprvl],
      durationofApprovalObj: { ...tempDurationofapprvlObj },
      newRenewal: [...temNewRenewal],
      newRenewalObj: { ...temNewRenewalObj },
    }));

    // setmandatoryFields([...commonMandatoryFields, ...regionMandotoryFields]);
    setloading(false);
  };

  useEffect(() => {
    let tempopts = [];
    let tempObj = {};
    let tempObjMap = {};
    countryState.countryItems.forEach((item) => {
      let obj = {
        ...item,
        label: item.countryName.trim(),
        value: item.countryID,
        regionId: item.regionID,
      };
      tempopts.push(obj);
      tempObj[obj.label] = obj.countryID;
      tempObjMap[obj.label] = obj;
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      country: [...tempopts],
      countryObj: { ...tempObj },
      countryMapObj: { ...tempObjMap },
    }));
  }, [countryState.countryItems]);

  useEffect(() => {
    let tempopts = [];
    let durationofApproval = [];
    let tempObj = {};
    let tempValueObj = {};
    lobState.lobItems.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          ...item,
          label: item.lobName,
          value: item.lobid,
          //durationofApproval: item.durationofApprovalValue,
        });
        // durationofApproval.push({lob: item.lobName, lobid: item.lobid, durationofApprovalValue:item.durationofApprovalValue});
      }
      tempObj[item.lobName] = item.lobid;
      tempValueObj[item.lobid] = item;
      //durationofApproval[item.lobid] = item.durationofApprovalValue;
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      lobs: [...tempopts],
      lobsObj: { ...tempObj },
      lobsValueObj: { ...tempValueObj },
      //durationofApprovalObj: { ...durationofApproval },
    }));
  }, [lobState.lobItems]);
  useEffect(() => {
    let tempopts = [];
    let tempObj = {};
    let tempObjMap = {};
    sublobState.sublobitems.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          ...item,
          label: item.subLOBName.trim(),
          value: item.subLOBID,
          lob: item.lobid,
        });
        tempObj[item.subLOBName.trim()] = item.subLOBID;
        tempObjMap[item.subLOBName.trim()] = item;
      }
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      subLoBs: [...tempopts],
      subLoBsObj: { ...tempObj },
      subLoBsMapObj: { ...tempObjMap },
    }));
    //setfrmSublob([...tempopts]);
  }, [sublobState.sublobitems]);
  useEffect(() => {
    let tempopts = [];
    let tempObj = {};
    segmentState.segmentItems.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          ...item,
          label: item.segmentName,
          value: item.segmentID,
          country: item.countryList,
        });
        tempObj[item.segmentName] = item.segmentID;
      }
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      segments: [...tempopts],
      segmentObj: { ...tempObj },
    }));
  }, [segmentState.segmentItems]);

  useEffect(() => {
    let tempopts = [];
    let tempObj = {};
    let tempMapObj = {};
    branchState.branchItems.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          ...item,
          label: item.branchName,
          value: item.branchId,
        });
        tempObj[item.branchName] = item.branchId;
        tempMapObj[item.branchName] = item;
      }
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      branchs: [...tempopts],
      branchObj: { ...tempObj },
      branchMapObj: { ...tempMapObj },
    }));
  }, [branchState.branchItems]);

  useEffect(() => {
    let tempopts = [];
    let tempObj = {};
    currencyState.currencyItems.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          ...item,
          label: item.currencyName,
          value: item.currencyID,
        });
        tempObj[item.currencyName] = item.currencyID;
      }
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      currency: [...tempopts],
      currencyObj: { ...tempObj },
    }));
  }, [currencyState.currencyItems]);

  const [logData, setlogData] = useState([]);
  const columnExcelMapping = {
    "Sr No": { lookupObj: "", fieldname: "" },
    "Account Name": {
      lookupObj: "",
      fieldname: "AccountName",
    },
    Country: {
      lookupObj: "countryObj",
      fieldname: "CountryId",
      multival: true,
    },
    Underwriter: {
      lookupObj: "",
      fieldname: "Underwriter",
      email: true,
    },
    LoB: {
      lookupObj: "lobsObj",
      fieldname: "LOBId",
    },
    "Sub LoB": {
      lookupObj: "subLoBsObj",
      fieldname: "SUBLOBID",
      mapping: true,
      mappedField: "LOBId",
      mappedvalue: "LOBId",
      mappingType: "sublob",
      dbmultival: true,
      dbmultivalArr: "subLoBs",
    },
    "Duration of Approval": {
      lookupObj: "durationofApprovalObj",
      fieldname: "DurationofApproval",
      mapping: true,
      mappedField: "LOBId",
      mappedvalue: "LOBId",
      mappingType: "lob",
    },
    "Request for empowerment reason": {
      lookupObj: "rfeEmpourmentObj",
      fieldname: "RequestForEmpowermentReason",
    },
    "Specific Details": {
      lookupObj: "",
      fieldname: "RFELogDetails",
    },
    "Underwriter granting empowerment": {
      lookupObj: "",
      fieldname: "UnderwriterGrantingEmpowerment",
      email: true,
    },
    "CHZ Sustainability Desk / CHZ GI Credit Risk": {
      lookupObj: "rfechzObj",
      fieldname: "CHZ",
    },
    "Request for empowerment CC": {
      lookupObj: "",
      fieldname: "RequestForEmpowermentCC",
      email: true,
      multival: true,
      seperator: ",",
    },
    "Request for empowerment status": {
      lookupObj: "statusObj",
      fieldname: "RequestForEmpowermentStatus",
    },
    "Condition Applicable To": {
      lookupObj: "conditionObj",
      fieldname: "ConditionApplicableTo",
    },
    "Underwriter granting empowerment comments / condition": {
      lookupObj: "",
      fieldname: "UnderwriterGrantingEmpowermentComments",
    },
    "Date of reception of information needed by approver": {
      lookupObj: "",
      fieldname: "ReceptionInformationDate",
      date: true,
    },
    "Date of response": {
      lookupObj: "",
      fieldname: "ResponseDate",
      date: true,
    },
    Creator: {
      lookupObj: "",
      fieldname: "CreatedByID",
      email: true,
    },
    "Created Date": {
      lookupObj: "",
      fieldname: "CreatedDate",
      date: true,
    },
    "Modified By": {
      lookupObj: "",
      fieldname: "ModifiedByID",
      email: true,
    },
    "Modified Date": {
      lookupObj: "",
      fieldname: "ModifiedDate",
      date: true,
    },
    "LatAm_Customer Segment": {
      lookupObj: "segmentObj",
      fieldname: "CustomerSegment",
    },
    "LatAm_New/Renewal": {
      lookupObj: "newRenewalObj",
      fieldname: "NewRenewal",
    },
    LatAm_GWP: {
      fieldname: "GWP",
    },
    LatAm_Branch: {
      lookupObj: "branchObj",
      fieldname: "Branch",
      mapping: true,
      mappedvalue: "CountryId",
      mappedField: "country",
      mappingType: "branch",
    },
    "LatAm_Policy Period": {
      fieldname: "PolicyPeriod",
    },
    LatAm_Currency: {
      lookupObj: "currencyObj",
      fieldname: "Currency",
    },
    LatAm_Limit: {
      fieldname: "Limit",
    },
    "LatAm_Zurich Share": {
      fieldname: "ZurichShare",
    },
    "LatAm_Decision Date": {
      fieldname: "DecisionDate",
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
  const fieldCount = importfieldscount;
  const checkisIncountryLog = (countryList, regionList) => {
    let isUKcountry = true;
    let isSingaporecountry = true;
    let isChinacountry = true;
    let isHongKongcountry = true;
    let isMalaysiacountry = true;
    let isFrancecountry = true;
    let isSpaincountry = true;
    let isMiddleEastcountry = true;
    let isAustraliacountry = true;
    let isItalycountry = true;
    let isBeneluxcountry = true;
    let isNordiccountry = true;
    let isIndonesiacountry = true;
    let isLatamregion = true;
    regionList.forEach((item) => {
      if (item === REGION_LATAM) {
        isLatamregion = isLatamregion ? true : false;
      } else {
        isLatamregion = false;
      }
    });
    countryList.forEach((item) => {
      if (
        item === INCOUNTRTY_IDS.UK ||
        item === INCOUNTRTY_IDS.SPAINFOS ||
        item === INCOUNTRTY_IDS.IRELANDFOS
      ) {
        isUKcountry = isUKcountry ? true : false;
      } else {
        isUKcountry = false;
      }
      if (item === INCOUNTRTY_IDS.SINGAPORE) {
        isSingaporecountry = isSingaporecountry ? true : false;
      } else {
        isSingaporecountry = false;
      }
      if (item === INCOUNTRTY_IDS.CHINA) {
        isChinacountry = isChinacountry ? true : false;
      } else {
        isChinacountry = false;
      }
      if (item === INCOUNTRTY_IDS.HONGKONG) {
        isHongKongcountry = isHongKongcountry ? true : false;
      } else {
        isHongKongcountry = false;
      }
      if (item === INCOUNTRTY_IDS.MALAYSIA) {
        isMalaysiacountry = isMalaysiacountry ? true : false;
      } else {
        isMalaysiacountry = false;
      }
      if (item === INCOUNTRTY_IDS.FRANCE) {
        isFrancecountry = isFrancecountry ? true : false;
      } else {
        isFrancecountry = false;
      }
      if (item === INCOUNTRTY_IDS.SPAIN) {
        isSpaincountry = isSpaincountry ? true : false;
      } else {
        isSpaincountry = false;
      }
      if (item === INCOUNTRTY_IDS.MIDDLEEAST) {
        isMiddleEastcountry = isMiddleEastcountry ? true : false;
      } else {
        isMiddleEastcountry = false;
      }
      if (item === INCOUNTRTY_IDS.AUSTRALIA) {
        isAustraliacountry = isAustraliacountry ? true : false;
      } else {
        isAustraliacountry = false;
      }
      if (item === INCOUNTRTY_IDS.ITALY) {
        isItalycountry = isItalycountry ? true : false;
      } else {
        isItalycountry = false;
      }
      if (
        item === INCOUNTRTY_IDS.BENELUX ||
        item === INCOUNTRTY_IDS.BENELUXNETHERLANDS ||
        item === INCOUNTRTY_IDS.BENELUXBELGIUM ||
        item === INCOUNTRTY_IDS.BENELUXLUXEMBOURG
      ) {
        isBeneluxcountry = isBeneluxcountry ? true : false;
      } else {
        isBeneluxcountry = false;
      }
      if (
        item === INCOUNTRTY_IDS.NORDIC ||
        item === INCOUNTRTY_IDS.NORDICDENMARK ||
        item === INCOUNTRTY_IDS.NORDICFINALAND ||
        item === INCOUNTRTY_IDS.NORDICSWEDEN
      ) {
        isNordiccountry = isNordiccountry ? true : false;
      } else {
        isNordiccountry = false;
      }
      if (item === INCOUNTRTY_IDS.INDONESIA) {
        isIndonesiacountry = isIndonesiacountry ? true : false;
      } else {
        isIndonesiacountry = false;
      }
    });
    return {
      isLatamregion: isLatamregion,
      isUKcountry: isUKcountry,
      isSingaporecountry: isSingaporecountry,
      isChinacountry : isChinacountry,
      isHongKongcountry : isHongKongcountry,
      isMalaysiacountry : isMalaysiacountry,
      isFrancecountry : isFrancecountry,
      isSpaincountry : isSpaincountry,
      isMiddleEastcountry : isMiddleEastcountry,
      isAustraliacountry: isAustraliacountry,
      isItalycountry: isItalycountry,
      isBeneluxcountry: isBeneluxcountry,
      isNordiccountry: isNordiccountry,
      isIndonesiacountry: isIndonesiacountry,
    };
  };
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
      let rowindex = 0;
      const rowdataRecursion = async () => {
        let data = excelData[rowindex];
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
          rowindex++;
          if (rowindex < excelData.length) {
            rowdataRecursion();
          }
        } else if (isExcelValid) {
          //capturing log data
          let templogdata = {};
          let reportdata = {};
          let isvalid = true;
          let tempmandatoryFields = [...mandatoryFields];
          let dataEmails = [];
          setisLoadingValidation(true);
          let index = 0;
          const columndataRecursion = async () => {
            let cellData = data[index];
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
              let mappedvalue =
                columnExcelMapping[fieldArr[index]]["mappedvalue"];
              let mappingType =
                columnExcelMapping[fieldArr[index]]["mappingType"];
              let isemail = columnExcelMapping[fieldArr[index]]["email"];
              let ismultival = columnExcelMapping[fieldArr[index]]["multival"];
              let value =
                typeof cellData === "string" ? cellData.trim() : cellData;
              if (value && ismultival) {
                value =
                  value.indexOf("##") !== -1
                    ? value.split("##")
                    : value.split(",");
                let tempval = [];
                value.forEach((val) => {
                  tempval.push(
                    lookupObj
                      ? masterdata[lookupObj][val]
                      : isdate
                        ? val //moment(val).format("YYYY-MM-DD")
                        : val
                          ? val.toString()
                          : val
                  );
                });
                value = tempval.join(",");
              } else {
                if (lookupObj === "lobs") {
                  value = templogdata["lobid"];
                } else {
                  value = lookupObj
                    ? masterdata[lookupObj][value]
                    : isdate
                      ? value
                        ? value //moment(value).format("YYYY-MM-DD")
                        : null
                      : value
                        ? value.toString()
                        : value;
                }
              }

              if (
                isemail &&
                value &&
                validateEmail(value, ismultival ? true : false)
              ) {
                reportdata["emailfields"][excelfieldname] = value;
                dataEmails.push(value);
              }
              let isvalidval = isNotEmptyValue(value);
              if (
                (tempmandatoryFields.includes(fieldname) && !isvalidval) ||
                (cellData && !isvalidval) ||
                (isvalidval &&
                  ismapping &&
                  !validateMapValues(
                    cellData,
                    mappedField,
                    templogdata[mappedvalue],
                    mappingType,
                    ismultival
                  )) ||
                (isvalidval &&
                  isemail &&
                  !validateEmail(value, ismultival ? true : false)) ||
                (isvalidval && isdate && !moment(value).isValid()) ||
                (fieldname === "UnderwriterGrantingEmpowerment" &&
                  value.indexOf(templogdata["underwriter"]) !== -1) ||
                (fieldname === "RequestForEmpowermentStatus" &&
                  value !== rfelog_status.Pending &&
                  !userProfile.isSuperAdmin &&
                  templogdata["UnderwriterGrantingEmpowerment"] !==
                  userProfile.emailAddress) ||
                (isvalidval &&
                  (fieldname === "ReceptionInformationDate" ||
                    fieldname === "UnderwriterGrantingEmpowermentComments" ||
                    fieldname === "ResponseDate") &&
                  templogdata["RequestForEmpowermentStatus"] ===
                  rfelog_status.Pending) ||
                (isvalidval &&
                  fieldname === "ConditionApplicableTo" &&
                  templogdata["RequestForEmpowermentStatus"] !==
                  rfelog_status.Empowerment_granted_with_conditions)
              ) {
                //added below condition to check & validate values
                isvalid = false;
                reportdata["isvalid"] = false;
                reportdata["invalidfields"].push(excelfieldname);
              }
              if (value || value === false) {
                templogdata[fieldname] = value;
              }
              if (isvalidval && fieldname === "CountryId") {
                templogdata["OrganizationalAlignment"] =
                  organizationalAlignment.global;

                //templogdata["regionId"] = masterdata["countryMapObj"][cellData]["regionId"];
                templogdata["regionId"] = "";
                let regions = [];
                let tempregionObj = {};
                const tempCoutries = value ? value.split(",") : [];
                tempCoutries.forEach((item) => {
                  masterdata.country.forEach((country) => {
                    if (country.countryID === item) {
                      if (!tempregionObj[country.regionID]) {
                        regions.push(country.regionID);
                        tempregionObj[country.regionID] = country.regionID;
                      }
                    }
                  });
                });
                templogdata["regionId"] = regions.join(",");
                const {
                  isLatamregion,
                  isUKcountry,
                  isSingaporecountry,
                  isChinacountry,
                  isHongKongcountry,
                  isMalaysiacountry,
                  isFrancecountry,
                  isSpaincountry,
                  isMiddleEastcountry,
                  isAustraliacountry,
                  isItalycountry,
                  isBeneluxcountry,
                  isNordiccountry,
                  isIndonesiacountry,
                } = checkisIncountryLog(tempCoutries, regions);
                //added below codition to check if selected type is country but country is not set
                if (
                  IncountryFlag === IncountryFlagCost.LATAM &&
                  !isLatamregion
                ) {
                  isvalid = false;
                  reportdata["isvalid"] = false;
                  reportdata["invalidfields"].push(excelfieldname);
                }
                if (IncountryFlag === IncountryFlagCost.UK && !isUKcountry) {
                  isvalid = false;
                  reportdata["isvalid"] = false;
                  reportdata["invalidfields"].push(excelfieldname);
                }
                if (
                  IncountryFlag === IncountryFlagCost.INDONESIA &&
                  !isIndonesiacountry
                ) {
                  isvalid = false;
                  reportdata["isvalid"] = false;
                  reportdata["invalidfields"].push(excelfieldname);
                }
                if (
                  IncountryFlag === IncountryFlagCost.SINGAPORE &&
                  !isSingaporecountry
                ) {
                  isvalid = false;
                  reportdata["isvalid"] = false;
                  reportdata["invalidfields"].push(excelfieldname);
                }
                if (
                  IncountryFlag === IncountryFlagCost.CHINA &&
                  !isChinacountry
                ) {
                  isvalid = false;
                  reportdata["isvalid"] = false;
                  reportdata["invalidfields"].push(excelfieldname);
                }
                if (
                  IncountryFlag === IncountryFlagCost.HONGKONG &&
                  !isHongKongcountry
                ) {
                  isvalid = false;
                  reportdata["isvalid"] = false;
                  reportdata["invalidfields"].push(excelfieldname);
                }
                if (
                  IncountryFlag === IncountryFlagCost.MALAYSIA &&
                  !isMalaysiacountry
                ) {
                  isvalid = false;
                  reportdata["isvalid"] = false;
                  reportdata["invalidfields"].push(excelfieldname);
                }
                if (
                  IncountryFlag === IncountryFlagCost.FRANCE &&
                  !isFrancecountry
                ) {
                  isvalid = false;
                  reportdata["isvalid"] = false;
                  reportdata["invalidfields"].push(excelfieldname);
                }
                if (
                  IncountryFlag === IncountryFlagCost.SPAIN &&
                  !isSpaincountry
                ) {
                  isvalid = false;
                  reportdata["isvalid"] = false;
                  reportdata["invalidfields"].push(excelfieldname);
                }
                if (
                  IncountryFlag === IncountryFlagCost.MIDDLEEAST &&
                  !isMiddleEastcountry
                ) {
                  isvalid = false;
                  reportdata["isvalid"] = false;
                  reportdata["invalidfields"].push(excelfieldname);
                }
                if (
                  IncountryFlag === IncountryFlagCost.AUSTRALIA &&
                  !isAustraliacountry
                ) {
                  isvalid = false;
                  reportdata["isvalid"] = false;
                  reportdata["invalidfields"].push(excelfieldname);
                }
                if (
                  IncountryFlag === IncountryFlagCost.ITALY &&
                  !isItalycountry
                ) {
                  isvalid = false;
                  reportdata["isvalid"] = false;
                  reportdata["invalidfields"].push(excelfieldname);
                }
                if (
                  IncountryFlag === IncountryFlagCost.BENELUX &&
                  !isBeneluxcountry
                ) {
                  isvalid = false;
                  reportdata["isvalid"] = false;
                  reportdata["invalidfields"].push(excelfieldname);
                }
                if (
                  IncountryFlag === IncountryFlagCost.NORDIC &&
                  !isNordiccountry
                ) {
                  isvalid = false;
                  reportdata["isvalid"] = false;
                  reportdata["invalidfields"].push(excelfieldname);
                }
              }
              if (
                isvalidval &&
                fieldname === "UnderwriterGrantingEmpowerment"
              ) {
                //for global log if country is set from in country and approver is set from country/region - set invalid
                const tempCoutries = templogdata["CountryId"].split(",");
                const regions = templogdata["regionId"].split(",");
                const {
                  isLatamregion,
                  isUKcountry,
                  isSingaporecountry,
                  isChinacountry,
                  isHongKongcountry,
                  isMalaysiacountry,
                  isFrancecountry,
                  isSpaincountry,
                  isMiddleEastcountry,
                  isAustraliacountry,
                  isItalycountry,
                  isBeneluxcountry,
                  isNordiccountry,
                  isIndonesiacountry,
                } = checkisIncountryLog(tempCoutries, regions);
                const approverRole = await getApproverRole(value);
                if (
                  IncountryFlag === "gn" &&
                  (isLatamregion ||
                    isUKcountry ||
                    isSingaporecountry ||
                    isChinacountry ||
                    isHongKongcountry ||
                    isMalaysiacountry ||
                    isFrancecountry ||
                    isSpaincountry ||
                    isMiddleEastcountry ||
                    isAustraliacountry ||
                    isItalycountry ||
                    isBeneluxcountry ||
                    isNordiccountry ||
                    isIndonesiacountry) &&
                  !approverRole.isGlobalAdmin &&
                  !approverRole.isSuperAdmin
                ) {
                  isvalid = false;
                  reportdata["isvalid"] = false;
                  reportdata["invalidfields"].push(excelfieldname);
                }
                //for LATAM log - set branch field
                if (IncountryFlag === IncountryFlagCost.LATAM) {
                  let tempLATAMBranch = [];
                  tempLATAMBranch = masterdata.branchs.filter((item) => {
                    return templogdata["CountryId"].indexOf(item.country) !== -1
                      ? true
                      : false;
                  });

                  tempmandatoryFields = [
                    ...tempmandatoryFields,
                    tempLATAMBranch.length && "Branch",
                  ];
                }
                //for In country - if approver is set to global/superadmin - set it invalid
                if (
                  IncountryFlag !== "gn" &&
                  (approverRole.isGlobalAdmin || approverRole.isSuperAdmin)
                ) {
                  isvalid = false;
                  reportdata["isvalid"] = false;
                  reportdata["invalidfields"].push(excelfieldname);
                }
                //for incountry log - set orgnization alignment based on the approvers roles
                if (IncountryFlag !== "gn" && approverRole.isRegionAdmin) {
                  templogdata["OrganizationalAlignment"] =
                    organizationalAlignment.region;
                }
                if (
                  IncountryFlag !== "gn" &&
                  (approverRole.isCountryAdmin || approverRole.isNormalUser)
                ) {
                  templogdata["OrganizationalAlignment"] =
                    organizationalAlignment.country;
                }
              }

              /*if (
                isvalidval &&
                fieldname === "UnderwriterGrantingEmpowerment" &&
                validateEmail(value, true) &&
                templogdata["regionId"] === REGION_LATAM
              ) {
                const approverRole = await getApproverRole(value);
                let tempLATAMBranch = [];
                tempLATAMBranch = masterdata.branchs.filter(
                  (item) => item.country === templogdata["CountryId"]
                );
                const isLATAMBranchMandotory = tempLATAMBranch.length
                  ? true
                  : false;
                if (approverRole.isRegionAdmin) {
                  templogdata["OrganizationalAlignment"] =
                    organizationalAlignment.region;

                  mandatoryFields = [
                    ...commonMandatoryFields,
                    ...LATAMMandatoryFields,
                    isLATAMBranchMandotory && "Branch",
                  ];
                } else if (
                  approverRole.isCountryAdmin ||
                  approverRole.isNormalUser
                ) {
                  templogdata["OrganizationalAlignment"] =
                    organizationalAlignment.country;
                  mandatoryFields = [
                    ...commonMandatoryFields,
                    ...LATAMMandatoryFields,
                    isLATAMBranchMandotory && "Branch",
                  ];
                } else {
                  templogdata["OrganizationalAlignment"] =
                    organizationalAlignment.global;
                }
              }*/
            }
            index++;
            if (index < data.length) {
              columndataRecursion();
            } else if (index === data.length) {
              if (isvalid) {
                if (
                  templogdata["RequestForEmpowermentStatus"] ===
                  rfelog_status.Pending
                ) {
                  templogdata["ResponseDate"] = null;
                  templogdata["ReceptionInformationDate"] = null;
                  templogdata["UnderwriterGrantingEmpowermentComments"] = "";
                }
                logData.push({
                  ...formIntialState,
                  ...templogdata,
                  ImportedBy: userProfile.emailAddress,
                  srNo: rowindex,
                  isSubmit: true,
                  IncountryFlag: IncountryFlag === "gn" ? "" : IncountryFlag,
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
              rowindex++;
              if (rowindex < excelData.length) {
                rowdataRecursion();
              } else if (rowindex === excelData.length) {
                //excelDataBuild();
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
                        invalideDataEntry.push({
                          srNo: item["srNo"],
                          isvalid: false,
                        });
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
              }
            }
          };

          columndataRecursion();
        }
      };
      rowdataRecursion();
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
      case "branch":
        if (
          mappedvalue.indexOf(
            masterdata["branchMapObj"][value][mappedField]
          ) !== -1
        ) {
          return true;
        } else {
          return false;
        }
      case "lob":
        if (
          masterdata["lobsValueObj"][mappedvalue]["durationofApprovalValue"] ===
          String(value)
        ) {
          return true;
        } else {
          return false;
        }
      case "sublob":
        let isPresent = false;
        masterdata["subLoBs"].forEach((sublob) => {
          if (sublob.label === value && sublob.lob === mappedvalue) {
            isPresent = true;
          }
        });
        return isPresent;
      default:
        break;
    }
  };

  const getApproverRole = async (email) => {
    const tmpapprover = await getMultiUserProfile({
      EmailAddress: email,
    });
    if (isObject(tmpapprover) && tmpapprover) {
      if (tmpapprover?.userRoles[0]?.roleId === USER_ROLE.superAdmin) {
        return { ...approverIntialRole, isSuperAdmin: true };
      } else if (tmpapprover?.userRoles[0]?.roleId === USER_ROLE.globalAdmin) {
        return { ...approverIntialRole, isGlobalAdmin: true };
      } else if (tmpapprover?.userRoles[0]?.roleId === USER_ROLE.regionAdmin) {
        return { ...approverIntialRole, isRegionAdmin: true };
      } else if (tmpapprover?.userRoles[0]?.roleId === USER_ROLE.countryAdmin) {
        return { ...approverIntialRole, isCountryAdmin: true };
      } else if (tmpapprover?.userRoles[0]?.roleId === USER_ROLE.normalUser) {
        return { ...approverIntialRole, isNormalUser: true };
      }
    } else {
      return { ...approverIntialRole };
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
    const responsedata = await downloadTemplate({
      request: logType,
      IncountryFlag: IncountryFlag === "gn" ? "" : IncountryFlag,
    });
    if (responsedata) {
      FileDownload(responsedata, templateName);
    }
  };
  const handleSubmit = async () => {
    // const response = await importExcelLogs({ type: logType, logdata: logData });
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
  const [IncountryFlag, setIncountryFlag] = useState("gn");

  useEffect(async()=>{
    if (IncountryFlag !== "gn") {
      let temprfeempourment = await getLookupByType({
        LookupType: "RFEEmpowermentReasonRequest",
        IncountryFlag: IncountryFlag
      });
      let tempopts = [];
      let tempObj = {};
      temprfeempourment.forEach((item) => {
        if (item.isActive) {
          tempopts.push({
            label: item.lookUpValue,
            value: item.lookupID,
          });
          tempObj[item.lookUpValue] = item.lookupID;
        }
      });
      temprfeempourment = [...tempopts];
      let temprfeempourmentObj = { ...tempObj };
      setmasterdata((prevstate) => ({
        ...prevstate,
        rfeEmpourmentObj: { ...temprfeempourmentObj },
      }));
    }
  },[IncountryFlag])

  const onSelectChange = (name, value) => {
    setIncountryFlag(value);
    handleCancel();
  };
  useEffect(() => {
    if (IncountryFlag === IncountryFlagCost.LATAM) {
      setimportfieldscount(29);
      setmandatoryFields([...commonMandatoryFields, ...LATAMMandatoryFields]);
    } else if (IncountryFlag === IncountryFlagCost.UK) {
      setimportfieldscount(21);
    } else if (IncountryFlag === IncountryFlagCost.ITALY) {
      setimportfieldscount(21);
    } else {
      setimportfieldscount(20);
      setmandatoryFields([...commonMandatoryFields]);
    }
  }, [IncountryFlag]);

  return loading ? (
    <Loading />
  ) : (
    <div className="addedit-logs-container">
      <div className="addedit-header-container">
        <div className="addedit-header-title">{title}</div>
        <div className="clsincountrysel">
          <FrmSelect
            title={"Import log type"}
            name={"IncountryFlag"}
            selectopts={incountryopts}
            handleChange={onSelectChange}
            value={IncountryFlag}
            inlinetitle={true}
          />
        </div>
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
                  <div
                    className="btn-container"
                    style={{ paddingBottom: "5px" }}
                  >
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
  getAllCountry: countryActions.getAllCountry,
  getAllRegion: regionActions.getAllRegions,
  getAlllob: lobActions.getAlllob,
  getAllSublob: sublobActions.getAllSublob,
  getAllSegment: segmentActions.getAllSegment,
  uploadFile: commonActions.uploadFile,
  deleteFile: commonActions.deleteFile,
  downloadFile: commonActions.downloadFile,
  importExcelLogs: commonActions.importExcelLogs,
  validateActDirEmail: commonActions.validateActDirEmail,
  downloadTemplate: commonActions.downloadTemplate,
  getAllCurrency: currencyActions.getAllCurrency,
  getAllBranch: branchActions.getAllBranch,
  getMultiUserProfile: userprofileActions.getMultiUserProfile,
};
export default connect(mapStateToProp, mapActions)(AddImportLogs);
