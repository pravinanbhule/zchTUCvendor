import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import FrmFileImport from "../common-components/frmfileupload/FrmFileImport";
import Loading from "../common-components/Loading";
import moment from "moment";
import "./Style.css";
import {
  BREACH_LOG_STATUS,
  REGION_EMEA,
  REGION_ZNA,
  HOW_DETECTED_TUR,
} from "../../constants";
import {
  commonActions,
  lookupActions,
  countryActions,
  regionActions,
  lobActions,
  sublobActions,
  segmentActions,
  officeActions,
  znaorgnization1Actions,
  znaorgnization2Actions,
  znaorgnization3Actions,
  coActions,
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
    regionState,
    segmentState,
    lobState,
    sublobState,
    officeState,
    znaorgnization1State,
    znaorgnization2State,
    znaorgnization3State,
    coState,
  } = props.state;
  const {
    title,
    hideImportLogsPopup,
    formIntialState,
    getLookupByType,
    getAllCountry,
    getAllRegion,
    getAlllob,
    getAllSegment,
    getAllCOList,
    getAllSublob,
    getallZNASegments,
    getallZNASBU,
    getallZNAMarketBasket,
    getAllOffice,
    downloadTemplate,
    userProfile,
    setisDataImported,
    importExcelLogs,
    validateActDirEmail,
    exportFileName,
  } = props;

  const FileDownload = require("js-file-download");
  const templateName = "TUC_BreachLog_Import_Template.xlsm";
  const [commonMandatoryFields, setcommonMandatoryFields] = useState([
    "title",
    "countryId",
    "regionId",
    "lobid",
    "severity",
    "typeOfBreach",
    "natureOfBreach",
    "dateBreachOccurred",
    "howDetected",
    "actionPlan",
    "dueDate",
    "actionResponsible",
    "breachStatus",
    "breachDetails",
    "classification",
  ]);
  const [znaMandotoryFields, setznaMandotoryFields] = useState([
    "znaSegmentId",
    "znasbuId",
    "marketBasketId",
  ]);
  const [EMEAMandotoryFields, setEMEAMandotoryFields] = useState([
    "nearMisses",
  ]);
  const [regionMandotoryFields, setregionMandotoryFields] = useState([
    "customerSegment",
  ]);
  // const [mandatoryFields, setmandatoryFields] = useState([]);
  const breachlog_status = {
    Pending: BREACH_LOG_STATUS.Pending,
    Close: BREACH_LOG_STATUS.Close,
    Reopen: BREACH_LOG_STATUS.Reopen,
  };
  const [masterdata, setmasterdata] = useState({
    country: [],
    countryObj: {},
    region: [],
    regionObj: {},
    segments: [],
    segmentsObj: {},
    cos:[],
    cosObj: {},
    lobs: [],
    lobsObj: {},
    subLoBs: [],
    subLoBsObj: {},
    zNASegments: [],
    zNASegmentsObj: {},
    zNASBUs: [],
    zNASBUsObj: {},
    zNAMarketBaskets: [],
    zNAMarketBasketsObj: {},
    classification: [],
    classificationObj: {},
    typeOfBreach: [],
    typeOfBreachObj: {},
    rootCauseBreach: [],
    rootCauseBreachObj: {},
    natureOfBreach: [],
    natureOfBreachObj: {},
    rangeFinImpact: [],
    rangeFinImpactObj: {},
    howDetected: [],
    howDetectedObj: {},
    office: [],
    officeObj: {},
    breachStatus: [],
    breachStatusObj: {},
    materialBreachObj: { TRUE: true, FALSE: false },
    // nearMissesObj: { TRUE: true, FALSE: false },
  });
  const [loading, setloading] = useState(true);
  const [logType, setlogType] = useState("breachlogs");

  useEffect(() => {
    fnOnInit();
  }, []);
  const fnOnInit = async () => {
    //import all lookup and masterdata fields
    getAllCountry();
    getAllRegion();
    getAlllob();
    getAllSegment();
    getAllCOList()
    getAllOffice();
    getAllSublob();
    getallZNASegments();
    getallZNASBU();
    getallZNAMarketBasket();
    let tempopts = [];
    let tempObj = {};

    let tempClassification = await getLookupByType({
      LookupType: "BreachClassification",
    });
    let tempTypeOfBreach = await getLookupByType({
      LookupType: "BreachType",
    });
    let tempRootCauseBreach = await getLookupByType({
      LookupType: "BreachRootCause",
    });
    let tempNatureOfBreach = await getLookupByType({
      LookupType: "BreachNature",
    });
    let tempRangeFinImpact = await getLookupByType({
      LookupType: "BreachFinancialRange",
    });
    let tempHowDetected = await getLookupByType({
      LookupType: "BreachDetection",
    });
    let tempBreachStatus = await getLookupByType({
      LookupType: "BreachStatus",
    });

    tempopts = [];
    tempObj = {};
    tempClassification.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    tempClassification = [...tempopts];
    let tempClassificationObj = { ...tempObj };
    tempopts = [];
    tempObj = {};
    tempTypeOfBreach.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    tempTypeOfBreach = [...tempopts];
    let tempTypeOfBreachObj = { ...tempObj };
    tempopts = [];
    tempObj = {};
    tempRootCauseBreach.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    tempRootCauseBreach = [...tempopts];
    let tempRootCauseBreachObj = { ...tempObj };
    tempopts = [];
    tempObj = {};
    tempNatureOfBreach.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    tempNatureOfBreach = [...tempopts];
    let tempNatureOfBreachObj = { ...tempObj };
    tempopts = [];
    tempObj = {};
    tempRangeFinImpact.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    tempRangeFinImpact = [...tempopts];
    let tempRangeFinImpactObj = { ...tempObj };
    tempopts = [];
    tempObj = {};
    tempHowDetected = tempHowDetected.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    tempHowDetected = [...tempopts];
    let tempHowDetectedObj = { ...tempObj };
    tempopts = [];
    tempObj = {};
    tempBreachStatus.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        tempObj[item.lookUpValue] = item.lookupID;
      }
    });
    tempBreachStatus = [...tempopts];
    let tempBreachStatusObj = { ...tempObj };
    setmasterdata((prevstate) => ({
      ...prevstate,
      classification: [...tempClassification],
      classificationObj: { ...tempClassificationObj },
      typeOfBreach: [...tempTypeOfBreach],
      typeOfBreachObj: { ...tempTypeOfBreachObj },
      rootCauseBreach: [...tempRootCauseBreach],
      rootCauseBreachObj: { ...tempRootCauseBreachObj },
      natureOfBreach: [...tempNatureOfBreach],
      natureOfBreachObj: { ...tempNatureOfBreachObj },
      rangeFinImpact: [...tempRangeFinImpact],
      rangeFinImpactObj: { ...tempRangeFinImpactObj },
      howDetected: [...tempHowDetected],
      howDetectedObj: { ...tempHowDetectedObj },
      breachStatus: [...tempBreachStatus],
      breachStatusObj: { ...tempBreachStatusObj },
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
    let tempObj = {};
    regionState.regionItems.forEach((item) => {
      let obj = {
        ...item,
        label: item.regionName.trim(),
        value: item.regionID,
      };
      tempopts.push(obj);
      tempObj[obj.label] = obj.value;
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      region: [...tempopts],
      regionObj: { ...tempObj },
    }));
  }, [regionState.regionItems]);

  useEffect(() => {
    let tempopts = [];
    let tempObj = {};
    officeState.officeItems.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          ...item,
          label: item.officeName,
          value: item.officeId,
        });
        tempObj[item.officeName] = item.officeId;
      }
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      office: [...tempopts],
      officeObj: { ...tempObj },
    }));
    //setfrmOffice([...tempopts]);
  }, [officeState.officeItems]);

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
      segmentsObj: { ...tempObj },
    }));
    //setfrmSegmentOpts([...tempopts]);
  }, [segmentState.segmentItems]);

  useEffect(() => {
    let tempopts = [];
    let tempObj = {};
    coState.items.forEach((item) => {
      if (item.isActive) {
        tempopts.push({ ...item, label: item.coName, value: item.coId });
      }
      tempObj[item.coName] = item.coId;
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      cos: [...tempopts],
      cosObj: { ...tempObj },
    }));
  }, [coState.items]);

  useEffect(() => {
    let tempopts = [];
    let tempObj = {};
    lobState.lobItems.forEach((item) => {
      if (item.isActive) {
        tempopts.push({ ...item, label: item.lobName, value: item.lobid });
      }
      tempObj[item.lobName] = item.lobid;
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      lobs: [...tempopts],
      lobsObj: { ...tempObj },
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
    znaorgnization1State.org1Items.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.znaSegmentName,
          value: item.znaSegmentId,
        });
        tempObj[item.znaSegmentName] = item.znaSegmentId;
      }
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      zNASegments: [...tempopts],
      zNASegmentsObj: { ...tempObj },
    }));
    //setfrmZNASegmentOpts([...tempopts]);
  }, [znaorgnization1State.org1Items]);

  useEffect(() => {
    let tempopts = [];
    let tempObj = {};
    let tempMapObj = {};
    znaorgnization2State.org2Items.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.sbuName,
          value: item.znasbuId,
        });
        tempObj[item.sbuName] = item.znasbuId;
        tempMapObj[item.sbuName] = item;
      }
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      zNASBUs: [...tempopts],
      zNASBUsObj: { ...tempObj },
      zNASBUsMapObj: { ...tempMapObj },
    }));
    //setfrmZNASBUOpts([...tempopts]);
  }, [znaorgnization2State.org2Items]);

  useEffect(() => {
    let tempopts = [];
    let tempObj = {};
    let tempMapObj = {};
    znaorgnization3State.org3Items.forEach((item) => {
      if (item.isActive) {
        tempopts.push({
          label: item.marketBasketName,
          value: item.marketBasketId,
        });
        tempObj[item.marketBasketName] = item.marketBasketId;
        tempMapObj[item.marketBasketName] = item;
      }
    });
    tempopts.sort(dynamicSort("label"));
    setmasterdata((prevstate) => ({
      ...prevstate,
      zNAMarketBaskets: [...tempopts],
      zNAMarketBasketsObj: { ...tempObj },
      zNAMarketBasketsMapObj: { ...tempMapObj },
    }));
    //setfrmZNAMarketBasketOpts([...tempopts]);
  }, [znaorgnization3State.org3Items]);

  const [logData, setlogData] = useState([]);
  const columnExcelMapping = {
    "Sr No": { lookupObj: "", fieldname: "" },
    Title: {
      lookupObj: "",
      fieldname: "title",
    },
    Region: {
      lookupObj: "regionObj",
      fieldname: "regionId",
      multival: true,
    },
    Country: {
      lookupObj: "countryObj",
      fieldname: "countryId",
      mapping: true,
      mappedField: "regionId",
      mappingType: "region",
      multival: true,
    },
    "Customer Segment": {
      lookupObj: "segmentsObj",
      fieldname: "customerSegment",
    },
    LoB: {
      lookupObj: "lobsObj",
      fieldname: "lobid",
    },
    "Sub LoB": {
      lookupObj: "subLoBsObj",
      fieldname: "sublobid",
      mapping: true,
      mappedField: "lobid",
      mappingType: "lob",
      dbmultival: true,
      dbmultivalArr: "subLoBs",
    },
    Classification: {
      lookupObj: "classificationObj",
      fieldname: "classification",
    },
    "Type Of Breach": {
      lookupObj: "typeOfBreachObj",
      fieldname: "typeOfBreach",
    },
    "Root Cause of the Breach": {
      lookupObj: "rootCauseBreachObj",
      fieldname: "rootCauseOfTheBreach",
    },
    "Nature of Breach": {
      lookupObj: "natureOfBreachObj",
      fieldname: "natureOfBreach",
    },
    "Material Breach": {
      lookupObj: "materialBreachObj",
      fieldname: "materialBreach",
    },
    "Date Breach Occurred": {
      lookupObj: "",
      fieldname: "dateBreachOccurred",
      date: true,
    },
    "Breach Details": {
      lookupObj: "",
      fieldname: "breachDetails",
    },
    "Range of financial impact": {
      lookupObj: "rangeFinImpactObj",
      fieldname: "rangeOfFinancialImpact",
    },
    "How detected": {
      lookupObj: "howDetectedObj",
      fieldname: "howDetected",
    },
    "Additional information 'How detected'": {
      lookupObj: "",
      fieldname: "howDetectedMoreInfo",
    },
    // "Near Misses (Only EMEA)": {
    //   lookupObj: "nearMissesObj",
    //   fieldname: "nearMisses",
    // },
    "Action Responsible": {
      lookupObj: "",
      fieldname: "actionResponsible",
      email: true,
    },
    "Action Plan": {
      lookupObj: "",
      fieldname: "actionPlan",
    },
    "Breach Status": {
      lookupObj: "breachStatusObj",
      fieldname: "breachStatus",
    },
    "Due Date": {
      lookupObj: "",
      fieldname: "dueDate",
      date: true,
    },
    "Original Due Date": {
      lookupObj: "",
      fieldname: "originalDueDate",
      date: true,
    },
    "Date Action Closed": {
      lookupObj: "",
      fieldname: "dateActionClosed",
      date: true,
    },
    "Breach CC": {
      lookupObj: "",
      fieldname: "breachCC",
      email: true,
    },
    "Breach CO": {
      lookupObj: "cosObj",
      fieldname: "co",
    },
    "Financial impact description": {
      lookupObj: "",
      fieldname: "financialImpactDescription",
    },
    "Action Update": {
      lookupObj: "",
      fieldname: "actionUpdate",
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
    "ZNA BU": {
      lookupObj: "zNASegmentsObj",
      fieldname: "znaSegmentId",
    },
    "ZNA SBU": {
      lookupObj: "zNASBUsObj",
      fieldname: "znasbuId",
      mapping: true,
      mappedField: "znaSegmentId",
      mappingType: "org1",
    },
    "ZNA Market Basket": {
      lookupObj: "zNAMarketBasketsObj",
      fieldname: "marketBasketId",
      mapping: true,
      mappedField: "znasbuId",
      mappingType: "org2",
    },
    "ZNA UWr involved": {
      lookupObj: "",
      fieldname: "UWRinvolved",
      email: true,
    },
    "ZNA Date Identified": {
      lookupObj: "",
      fieldname: "dateIdentified",
      date: true,
    },
    "ZNA Office": {
      lookupObj: "officeObj",
      fieldname: "Office",
    },
    "ZNA Policy name": {
      lookupObj: "",
      fieldname: "PolicyName",
    },
    "ZNA Policy number": {
      lookupObj: "",
      fieldname: "PolicyNumber",
    },
    "ZNA UQA Review ID": {
      lookupObj: "",
      fieldname: "turNumber",
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
  const fieldCount = 38;
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
              let isdbmultival =
                columnExcelMapping[fieldArr[index]]["dbmultival"];
              let dbmultivalArr =
                columnExcelMapping[fieldArr[index]]["dbmultivalArr"];
              let value =
                typeof cellData === "string" ? cellData.trim() : cellData;
              if (isdbmultival) {
                value = lookupObj && masterdata[lookupObj][value];
                masterdata[dbmultivalArr].forEach((sublob) => {
                  if (
                    sublob.label === cellData &&
                    sublob.lob === templogdata[mappedField]
                  ) {
                    value = sublob.value;
                  }
                });
              } else if (value && ismultival) {
                value = value.split("##");
                let tempval = [];
                value.forEach((val) => {
                  tempval.push(
                    lookupObj
                      ? masterdata[lookupObj][val]
                      : isdate
                      ? value
                        ? value
                        : null //moment(value).format("YYYY-MM-DD")
                      : value
                  );
                });
                value = tempval.join(",");
              } else {
                value = lookupObj
                  ? masterdata[lookupObj][value]
                  : isdate
                  ? value
                    ? value
                    : null
                  : value
                  ? value.toString()
                  : value;
              }
      
              if (fieldname === "regionId") {
                if (value?.indexOf(REGION_ZNA) !== -1) {
                  mandatoryFields = [...mandatoryFields, ...znaMandotoryFields];
                }
                // nearMisses
                // if (value?.indexOf(REGION_EMEA) !== -1) {
                //   mandatoryFields = [
                //     ...mandatoryFields,
                //     ...regionMandotoryFields,
                //     ...EMEAMandotoryFields,
                //   ];
                // }
                if (
                  value?.indexOf(REGION_ZNA) === -1 ||
                  value?.split(",").length > 1
                ) {
                  mandatoryFields = [
                    ...mandatoryFields,
                    ...regionMandotoryFields,
                  ];
                }
              }
              if (
                templogdata["regionId"]?.indexOf(REGION_ZNA) !== -1 &&
                fieldname === "regionId" &&
                value === HOW_DETECTED_TUR
              ) {
                mandatoryFields = [...mandatoryFields, "turNumber"];
              }
              if (templogdata["breachStatus"] === breachlog_status.Close) {
                mandatoryFields = [...mandatoryFields, "dateActionClosed"];
              }
              if (isemail && value && validateEmail(value)) {
                reportdata["emailfields"][excelfieldname] = value;
                dataEmails.push(value);
              }
              let isvalidval = isNotEmptyValue(value);
              if (
                (mandatoryFields.includes(fieldname) && !isvalidval) ||
                (cellData && !isvalidval) ||
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
                /*(fieldname === "breachStatus" &&
                  value !== breachlog_status.Pending &&
                  !userProfile.isSuperAdmin &&
                  templogdata["actionResponsible"] !==
                    userProfile.emailAddress) */

                (isvalidval &&
                  (fieldname === "znaSegmentId" ||
                    fieldname === "znasbuId" ||
                    fieldname === "marketBasketId" ||
                    fieldname === "UWRinvolved" ||
                    fieldname === "dateIdentified" ||
                    fieldname === "Office" ||
                    fieldname === "PolicyName" ||
                    fieldname === "PolicyNumber" ||
                    fieldname === "turNumber") &&
                  templogdata["regionId"]?.indexOf(REGION_ZNA) === -1) ||
                // (isvalidval &&
                //   fieldname === "nearMisses" &&
                //   templogdata["regionId"]?.indexOf(REGION_EMEA) === -1) ||
                (isvalidval &&
                  fieldname === "dateActionClosed" &&
                  templogdata["breachStatus"] !== breachlog_status.Close) ||
                (isvalidval &&
                  fieldname === "customerSegment" &&
                  templogdata["regionId"]?.indexOf(REGION_ZNA) !== -1 &&
                  templogdata["regionId"].split(",").length === 1)
              ) {
                //added below condition to check & validate values
                isvalid = false;
                reportdata["isvalid"] = false;
                reportdata["invalidfields"].push(excelfieldname);
              }

              if (value || value === false || (isdate && value === null)) {
                templogdata[fieldname] = value;
              }
            }
          });

          if (isvalid) {
            //added below condition to set hidden fields to orginal value
            /* if (templogdata["regionId"]?.indexOf(REGION_ZNA) !== -1) {
              templogdata["customerSegment"] = "";
            } else {
              templogdata["znaSegmentId"] = "";
              templogdata["znasbuId"] = "";
              templogdata["marketBasketId"] = "";
              templogdata["UWRinvolved"] = null;
              templogdata["dateIdentified"] = null;
              templogdata["Office"] = "";
              templogdata["PolicyName"] = "";
              templogdata["PolicyNumber"] = "";
              templogdata["turNumber"] = "";
            }*/
            if (templogdata["breachStatus"] === breachlog_status.Pending) {
              templogdata["dateActionClosed"] = null;
            }
            logData.push({
              ...formIntialState,
              ...templogdata,
              importedBy: userProfile.emailAddress,
              srNo: rowindex,
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
    } catch (err) {}
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
        let ismapped = true;
        if (ismultival) {
          let countryList = value.split("##");
          let regionList = mappedvalue.split(",");
          let tempregions = [];
          let tempregionobj = {};
          countryList.forEach((item) => {
            let countryregion = masterdata["countryMapObj"][item][mappedField];
            if (mappedvalue.indexOf(countryregion) !== -1) {
              if (!tempregionobj[countryregion]) {
                tempregions.push(countryregion);
                tempregionobj[countryregion] = countryregion;
              }
            } else {
              ismapped = false;
            }
          });
          ismapped =
            ismapped && regionList.length === tempregions.length ? true : false;
        } else {
          ismapped =
            masterdata["countryMapObj"][value][mappedField] === mappedvalue
              ? true
              : false;
        }
        return ismapped;
      case "lob":
        let isPresent = false;
        masterdata["subLoBs"].forEach((sublob) => {
          if (sublob.label === value && sublob.lob === mappedvalue) {
            isPresent = true;
          }
        });
        return isPresent;
      case "org1":
        if (masterdata["zNASBUsMapObj"][value][mappedField] === mappedvalue) {
          return true;
        } else {
          return false;
        }
      case "org2":
        if (
          masterdata["zNAMarketBasketsMapObj"][value][mappedField] ===
          mappedvalue
        ) {
          return true;
        } else {
          return false;
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
  addExcelLogs: commonActions.addExcelLogs,
  getAllCountry: countryActions.getAllCountry,
  getAllRegion: regionActions.getAllRegions,
  getAlllob: lobActions.getAlllob,
  getAllSegment: segmentActions.getAllSegment,
  getAllSublob: sublobActions.getAllSublob,
  getAllOffice: officeActions.getAllOffice,
  uploadFile: commonActions.uploadFile,
  deleteFile: commonActions.deleteFile,
  getallZNASegments: znaorgnization1Actions.getAllOrgnization,
  getallZNASBU: znaorgnization2Actions.getAllOrgnization,
  getallZNAMarketBasket: znaorgnization3Actions.getAllOrgnization,
  importExcelLogs: commonActions.importExcelLogs,
  validateActDirEmail: commonActions.validateActDirEmail,
  downloadTemplate: commonActions.downloadTemplate,
  getAllCOList: coActions.getAll
};
export default connect(mapStateToProp, mapActions)(AddImportLogs);
