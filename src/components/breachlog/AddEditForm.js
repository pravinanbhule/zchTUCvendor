import React, { useState, useEffect } from "react";
import FrmInput from "../common-components/frminput/FrmInput";
import FrmToggleSwitch from "../common-components/frmtoggelswitch/FrmToggleSwitch";
import FrmDatePicker from "../common-components/frmdatepicker/FrmDatePicker";
import FrmSelect from "../common-components/frmselect/FrmSelect";
import FrmMultiselect from "../common-components/frmmultiselect/FrmMultiselect";
import { connect } from "react-redux";
import FrmFileUpload from "../common-components/frmfileupload/FrmFileUpload";
import Loading from "../common-components/Loading";
import moment from "moment";
import { Prompt } from "react-router-dom";
import { isNotEmptyValue } from "../../helpers";
import "./Style.css";
import CustomToolTip from "../common-components/tooltip/CustomToolTip";

import {
  BREACH_LOG_STATUS,
  REGION_EMEA,
  REGION_ZNA,
  USER_ROLE,
  HOW_DETECTED_TUR,
} from "../../constants";
import {
  userActions,
  lookupActions,
  lobActions,
  segmentActions,
  sublobActions,
  znaorgnization1Actions,
  znaorgnization2Actions,
  znaorgnization3Actions,
  officeActions,
  commonActions,
} from "../../actions";
import FrmRadio from "../common-components/frmradio/FrmRadio";
import FrmRichTextEditor from "../common-components/frmrichtexteditor/FrmRichTextEditor5";
import { alertMessage, dynamicSort, formatDate } from "../../helpers";
import PeoplePickerPopup from "./PeoplePickerPopup";

function AddEditForm(props) {
  const {
    breachlogState,
    segmentState,
    lobState,
    sublobState,
    officeState,
    userState,
    znaorgnization1State,
    znaorgnization2State,
    znaorgnization3State,
  } = props.state;
  const {
    title,
    hideAddPopup,
    postItem,
    putItem,
    isEditMode,
    setInEditMode,
    formIntialState,
    frmCountrySelectOpts,
    frmRegionSelectOpts,
    getAllUsers,
    getLookupByType,
    getToolTip,
    getAlllob,
    getAllSegment,
    getAllSublob,
    getallZNASegments,
    getallZNASBU,
    getallZNAMarketBasket,
    getAllOffice,
    uploadFile,
    deleteFile,
    downloadFile,
    isReadMode,
    userProfile,
    queryparam,
    handleDataVersion,
  } = props;

  const selectInitiVal = { label: "Select", value: "" };
  const breachlog_status = {
    Pending: BREACH_LOG_STATUS.Pending,
    Close: BREACH_LOG_STATUS.Close,
    Reopen: BREACH_LOG_STATUS.Reopen,
  };
  const FileDownload = require("js-file-download");
  const countryadminrole = USER_ROLE.countryAdmin;
  const emeaRegionValue = REGION_EMEA;
  const znaRegionValue = REGION_ZNA;
  const howdetectedtur = HOW_DETECTED_TUR;
  const [formfield, setformfield] = useState({});
  const [issubmitted, setissubmitted] = useState(false);
  const [countryopts, setcountryopts] = useState([]);
  const [frmCountryOptsAll, setfrmCountryOptsAll] = useState([]);
  const [regionopts, setregionopts] = useState([]);
  const [frmRegionOptsAll, setfrmRegionOptsAll] = useState([]);
  const [isfrmdisabled, setisfrmdisabled] = useState(false);
  const [yesnoopts, setyesnoopts] = useState([
    {
      label: "No",
      value: false,
    },
    {
      label: "Yes",
      value: true,
    },
  ]);
  const [frmSegmentOpts, setfrmSegmentOpts] = useState([]);
  const [frmSegmentOptsAll, setfrmSegmentOptsAll] = useState([]);
  const [frmLoB, setfrmLoB] = useState([]);
  const [frmSublob, setfrmSublob] = useState([]);
  const [frmSublobAll, setfrmSublobAll] = useState([]);
  const [frmZNASegmentOpts, setfrmZNASegmentOpts] = useState([]);
  const [frmZNASBUOpts, setfrmZNASBUOpts] = useState([]);
  const [frmZNAMarketBasketOpts, setfrmZNAMarketBasketOpts] = useState([]);
  const [frmSeverity, setfrmSeverity] = useState([]);
  const [frmTypeOfBreach, setfrmTypeOfBreach] = useState([]);
  const [frmRootCauseBreach, setfrmRootCauseBreach] = useState([]);
  const [frmNatureOfBreach, setfrmNatureOfBreach] = useState([]);
  const [frmRangeFinImpact, setfrmRangeFinImpact] = useState([]);
  const [frmHowDetected, setfrmHowDetected] = useState([]);
  const [frmOffice, setfrmOffice] = useState([]);
  const [frmBreachStatus, setfrmBreachStatus] = useState([]);
  const [tooltip, settooltip] = useState({});

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
    "actionResponsibleName",
    "breachStatus",
    "breachDetails",
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
  const [mandatoryFields, setmandatoryFields] = useState([]);
  const [fileuploadloader, setfileuploadloader] = useState(false);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    fnOnInit();
  }, []);

  const fnOnInit = async () => {
    getAlllob();
    getAllSegment();
    getAllOffice();
    getAllSublob();
    getallZNASegments();
    if (formIntialState.znaSegmentId) {
      getallZNASBU({ znaSegmentId: formIntialState.znaSegmentId });
    }
    if (formIntialState.znasbuId) {
      getallZNAMarketBasket({ znasbuId: formIntialState.znasbuId });
    }
    let tempopts = [];
    frmCountrySelectOpts.forEach((item) => {
      if (isEditMode || isReadMode || formIntialState.countryList.length) {
        let ispresent = false;
        formIntialState.countryList.forEach((countryitem) => {
          if (item.countryID === countryitem.value) {
            ispresent = true;
          }
        });
        if (item.isActive || ispresent) {
          tempopts.push(item);
        }
      } else if (item.isActive) {
        tempopts.push(item);
        if (
          userProfile.profileCountry &&
          item.countryID === userProfile.profileCountry
        ) {
          formIntialState.countryList.push(item);
          frmRegionSelectOpts.forEach((regionitem) => {
            if (item.regionID === regionitem.regionID) {
              formIntialState.regionList.push(regionitem);
            }
          });
        }
      }
    });
    let regionIds = [];
    formIntialState.regionList.forEach((item) => {
      regionIds.push(item.value);
    });
    formIntialState.regionId = regionIds.join(",");
    setfrmCountryOptsAll(tempopts);
    setcountryopts([...tempopts]);
    tempopts = [];
    let selectedregions = [];
    frmRegionSelectOpts.forEach((item) => {
      if (isEditMode || isReadMode || formIntialState.regionList.length) {
        let ispresent = false;
        formIntialState.regionList.forEach((regionitem) => {
          if (item.regionID === regionitem.value) {
            ispresent = true;
            selectedregions.push(item);
          }
        });
        if (item.isActive || ispresent) {
          tempopts.push(item);
        }
      } else if (item.isActive) {
        tempopts.push(item);
      }
    });
    setfrmRegionOptsAll(tempopts);
    setregionopts(
      selectedregions.length ? [...selectedregions] : [...tempopts]
    );
    setmandatoryFields(...commonMandatoryFields, regionMandotoryFields);
    const dbvalues = await Promise.all([
      getLookupByType({ LookupType: "BreachClassification" }),
      getLookupByType({ LookupType: "BreachType" }),
      getLookupByType({ LookupType: "BreachRootCause" }),
      getLookupByType({ LookupType: "BreachNature" }),
      getLookupByType({ LookupType: "BreachFinancialRange" }),
      getLookupByType({ LookupType: "BreachDetection" }),
      getLookupByType({ LookupType: "BreachStatus" }),
      getToolTip({ type: "BreachLogs" }),
    ]);
    let tempSeverity = dbvalues[0];
    let tempTypeOfBreach = dbvalues[1];
    let tempRootCauseBreach = dbvalues[2];
    let tempNatureOfBreach = dbvalues[3];
    let tempRangeFinImpact = dbvalues[4];
    let tempHowDetected = dbvalues[5];
    let tempBreachStatus = dbvalues[6];
    let tempToolTips = dbvalues[7];
    /*let tempSeverity = await getLookupByType({
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
    let tempToolTips = await getToolTip({ type: "BreachLogs" });*/

    let tooltipObj = {};
    tempToolTips.forEach((item) => {
      tooltipObj[item.toolTipField] = item.toolTipText;
    });
    settooltip(tooltipObj);
    tempopts = [];
    tempSeverity.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (item.isActive || item.lookupID === formIntialState.classification) {
          tempopts.push({
            label: item.lookUpValue,
            value: item.lookupID,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
      }
    });
    tempSeverity = [...tempopts];
    tempopts = [];
    tempTypeOfBreach.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (item.isActive || item.lookupID === formIntialState.typeOfBreach) {
          tempopts.push({
            label: item.lookUpValue,
            value: item.lookupID,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
      }
    });
    tempTypeOfBreach = [...tempopts];
    tempopts = [];
    tempRootCauseBreach.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (
          item.isActive ||
          item.lookupID === formIntialState.rootCauseOfTheBreach
        ) {
          tempopts.push({
            label: item.lookUpValue,
            value: item.lookupID,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
      }
    });
    tempRootCauseBreach = [...tempopts];
    tempopts = [];
    tempNatureOfBreach.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (item.isActive || item.lookupID === formIntialState.natureOfBreach) {
          tempopts.push({
            label: item.lookUpValue,
            value: item.lookupID,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
      }
    });
    tempNatureOfBreach = [...tempopts];
    tempopts = [];
    tempRangeFinImpact.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (
          item.isActive ||
          item.lookupID === formIntialState.rangeOfFinancialImpact
        ) {
          tempopts.push({
            label: item.lookUpValue,
            value: item.lookupID,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
      }
    });
    tempRangeFinImpact = [...tempopts];
    tempopts = [];
    tempHowDetected = tempHowDetected.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (item.isActive || item.lookupID === formIntialState.howDetected) {
          tempopts.push({
            label: item.lookUpValue,
            value: item.lookupID,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
      }
    });
    tempHowDetected = [...tempopts];
    tempopts = [];
    let frmbreachstatus = [];
    tempBreachStatus.forEach((item) => {
      let isshow = false;
      //draft status -
      if (!formIntialState.isSubmit) {
        if (item.lookupID === breachlog_status.Pending) {
          isshow = true;
        }
      }
      //open status
      if (
        formIntialState.breachStatus === breachlog_status.Pending &&
        formIntialState.isSubmit
      ) {
        if (
          item.lookupID === breachlog_status.Pending ||
          item.lookupID === breachlog_status.Close
        ) {
          isshow = true;
        }
      }
      //close status && reopen status
      if (
        formIntialState.breachStatus === breachlog_status.Close ||
        formIntialState.breachStatus === breachlog_status.Reopen
      ) {
        if (
          item.lookupID === breachlog_status.Reopen ||
          item.lookupID === breachlog_status.Close
        ) {
          isshow = true;
        }
      }
      if (isshow) {
        frmbreachstatus.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
        if (!formIntialState.isSubmit) {
          //setformfield({ ...formfield, breachStatus: item.lookupID });
          formIntialState.breachStatus = item.lookupID;
        }
      }
    });

    setfrmSeverity([...tempSeverity]);
    setfrmTypeOfBreach([selectInitiVal, ...tempTypeOfBreach]);
    setfrmRootCauseBreach([selectInitiVal, ...tempRootCauseBreach]);
    setfrmNatureOfBreach([selectInitiVal, ...tempNatureOfBreach]);
    setfrmRangeFinImpact([selectInitiVal, ...tempRangeFinImpact]);
    setfrmHowDetected([selectInitiVal, ...tempHowDetected]);
    setfrmBreachStatus([selectInitiVal, ...frmbreachstatus]);
    setformfield(formIntialState);
    setloading(false);
  };

  useEffect(() => {
    let tempopts = [];
    officeState.officeItems.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (item.isActive || item.officeId === formIntialState.office) {
          tempopts.push({
            ...item,
            label: item.officeName,
            value: item.officeId,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          ...item,
          label: item.officeName,
          value: item.officeId,
        });
      }
    });
    tempopts.sort(dynamicSort("label"));
    setfrmOffice([selectInitiVal, ...tempopts]);
  }, [officeState.officeItems]);

  useEffect(() => {
    let tempopts = [];
    segmentState.segmentItems.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (
          item.isActive ||
          item.segmentID === formIntialState.customerSegment
        ) {
          tempopts.push({
            ...item,
            label: item.segmentName,
            value: item.segmentID,
            country: item.countryList,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          ...item,
          label: item.segmentName,
          value: item.segmentID,
          country: item.countryList,
        });
      }
    });
    tempopts.sort(dynamicSort("label"));
    setfrmSegmentOpts([selectInitiVal, ...tempopts]);
    setfrmSegmentOptsAll(tempopts);
  }, [segmentState.segmentItems]);

  useEffect(() => {
    let tempopts = [];
    lobState.lobItems.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (item.isActive || item.lobid === formIntialState.lobid) {
          tempopts.push({ ...item, label: item.lobName, value: item.lobid });
        }
      } else if (item.isActive) {
        tempopts.push({ ...item, label: item.lobName, value: item.lobid });
      }
    });
    tempopts.sort(dynamicSort("label"));
    setfrmLoB([selectInitiVal, ...tempopts]);
  }, [lobState.lobItems]);

  useEffect(() => {
    let tempopts = [];
    sublobState.sublobitems.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (item.isActive || item.subLOBID === formIntialState.sublobid) {
          tempopts.push({
            ...item,
            label: item.subLOBName,
            value: item.subLOBID,
            lob: item.lobid,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          ...item,
          label: item.subLOBName,
          value: item.subLOBID,
          lob: item.lobid,
        });
      }
    });
    tempopts.sort(dynamicSort("label"));
    setfrmSublobAll(tempopts);

    if (formIntialState.lobid) {
      let sublobopts = tempopts.filter(
        (item) => item.lob === formIntialState.lobid
      );
      setfrmSublob([...sublobopts]);
    }
  }, [sublobState.sublobitems]);

  useEffect(() => {
    let tempopts = [];
    znaorgnization1State.org1Items.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (
          item.isActive ||
          item.znaSegmentId === formIntialState.znaSegmentId
        ) {
          tempopts.push({
            label: item.znaSegmentName,
            value: item.znaSegmentId,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          label: item.znaSegmentName,
          value: item.znaSegmentId,
        });
      }
    });
    tempopts.sort(dynamicSort("label"));
    setfrmZNASegmentOpts([selectInitiVal, ...tempopts]);
  }, [znaorgnization1State.org1Items]);

  useEffect(() => {
    if (formfield.znaSegmentId) {
      getallZNASBU({ znaSegmentId: formfield.znaSegmentId });
    } else if (
      (!formfield.znaSegmentId && formfield.isdirty) ||
      !formIntialState.znaSegmentId
    ) {
      getallZNASBU({ znaSegmentId: "none" });
    }
  }, [formfield.znaSegmentId]);

  useEffect(() => {
    if (formfield.znasbuId) {
      getallZNAMarketBasket({ znasbuId: formfield.znasbuId });
    } else if (
      (!formfield.znasbuId && formfield.isdirty) ||
      !formIntialState.znasbuId
    ) {
      getallZNAMarketBasket({ znasbuId: "none" });
    }
  }, [formfield.znasbuId]);

  useEffect(() => {
    let tempopts = [];
    znaorgnization2State.org2Items.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (item.isActive || item.znasbuId === formIntialState.znasbuId) {
          tempopts.push({
            label: item.sbuName,
            value: item.znasbuId,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          label: item.sbuName,
          value: item.znasbuId,
        });
      }
    });
    tempopts.sort(dynamicSort("label"));
    setfrmZNASBUOpts([...tempopts]);
  }, [znaorgnization2State.org2Items]);

  useEffect(() => {
    let tempopts = [];
    znaorgnization3State.org3Items.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (
          item.isActive ||
          item.marketBasketId === formIntialState.marketBasketId
        ) {
          tempopts.push({
            label: item.marketBasketName,
            value: item.marketBasketId,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          label: item.marketBasketName,
          value: item.marketBasketId,
        });
      }
    });
    tempopts.sort(dynamicSort("label"));
    setfrmZNAMarketBasketOpts([...tempopts]);
  }, [znaorgnization3State.org3Items]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    setformfield({ ...formfield, isdirty: true, [name]: value });
  };
  const handleSelectChange = (name, value) => {
    if (name === "znaSegmentId") {
      setformfield({
        ...formfield,
        znasbuId: "",
        marketBasketId: "",
        isdirty: true,
        [name]: value,
      });
    } else if (name === "znasbuId") {
      setformfield({
        ...formfield,
        marketBasketId: "",
        isdirty: true,
        [name]: value,
      });
    } else {
      setformfield({
        ...formfield,
        isdirty: true,
        [name]: value,
      });
    }

    //map country and region fields

    /*if (name === "regionId" && value !== "") {
      let countryopts = frmCountryOptsAll.filter(
        (item) => item.regionId === value
      );
      setcountryopts([...countryopts]);
      setformfield({
        ...formfield,
        [name]: value,
        countryList: [],
      });
    } else if (name === "regionId" && value === "") {
      setcountryopts([...frmCountryOptsAll]);
      setregionopts([selectInitiVal, ...frmRegionOptsAll]);
      setformfield({
        ...formfield,
        [name]: value,
        countryList: [],
      });
    }
    if (name === "countryId" && value !== "") {
      let country = frmCountryOptsAll.filter((item) => item.value === value);
      let regionOpts = frmRegionOptsAll.filter(
        (item) => item.value === country[0].regionId
      );
      let segmentOpts = frmSegmentOptsAll.filter((item) => {
        if (!item.country) {
          return true;
        } else if (item.country.indexOf(country[0].label) !== -1) {
          return true;
        } else {
          return false;
        }
      });
      setfrmSegmentOpts([selectInitiVal, ...segmentOpts]);
      setregionopts([selectInitiVal, ...regionOpts]);
      setformfield({
        ...formfield,
        [name]: value,
        regionId: regionOpts[0].value,
        customerSegment: "",
      });
    } else if (name === "countryId" && value === "") {
      setregionopts([selectInitiVal, ...frmRegionOptsAll]);
      setfrmSegmentOpts([selectInitiVal, ...frmSegmentOptsAll]);
      setformfield({
        ...formfield,
        [name]: value,
        regionId: "",
      });
    }*/
    //map lob and sublob fields
    if (name === "lobid" && value !== "") {
      let sublobopts = frmSublobAll.filter((item) => item.lob === value);
      setfrmSublob([selectInitiVal, ...sublobopts]);
    } else if (name === "lobid" && value === "") {
      setfrmSublob([]);
      setformfield({
        ...formfield,
        [name]: value,
        sublobid: "",
      });
    }
    if (
      name === "breachStatus" &&
      value === breachlog_status.Close &&
      !formfield.dateActionClosed
    ) {
      setformfield({
        ...formfield,
        [name]: value,
        dateActionClosed: moment().format("YYYY-MM-DD"),
      });
    }
  };

  const handleMultiSelectChange = (name, value) => {
    //setformfield({ ...formfield, isdirty: true, [name]: value });
    if (name === "countryList") {
      if (value.length) {
        let country = value;
        let regionOpts = frmRegionOptsAll.filter((item) => {
          let ispresent = false;
          country.forEach((countryitem) => {
            if (countryitem.regionId === item.value) {
              ispresent = true;
            }
          });
          return ispresent;
        });
        let segmentOpts = frmSegmentOptsAll.filter((item) => {
          if (!item.country) {
            return true;
          } else {
            let ispresent = false;
            country.forEach((countryitem) => {
              if (item.country.indexOf(countryitem.label) !== -1) {
                ispresent = true;
              }
            });
            return ispresent;
          }
        });
        let countryIds = [];
        let regionIds = [];
        country.forEach((item) => {
          countryIds.push(item.value);
        });
        regionOpts.forEach((item) => {
          regionIds.push(item.value);
        });
        setfrmSegmentOpts([selectInitiVal, ...segmentOpts]);
        setregionopts([...regionOpts]);
        setformfield({
          ...formfield,
          [name]: value,
          regionList: [...regionOpts],
          customerSegment: "",
          regionId: regionIds.join(","),
          countryId: countryIds.join(","),
        });
      } else {
        setfrmSegmentOpts([selectInitiVal, ...frmSegmentOptsAll]);
        setcountryopts([...frmCountryOptsAll]);
        setregionopts([...frmRegionOptsAll]);
        setformfield({
          ...formfield,
          [name]: value,
          regionList: [],
          customerSegment: "",
          regionId: "",
          countryId: "",
        });
      }
    }
    if (name === "regionList") {
      if (value.length) {
        let regions = value;
        //get countries related to region and update country dropdown
        let selectedcountries = [];
        let countryOpts = [];
        frmCountryOptsAll.forEach((item) => {
          regions.forEach((regionitem) => {
            if (regionitem.value === item.regionId) {
              countryOpts.push(item);
            }
          });
        });
        setcountryopts([...countryOpts]);
        regions.forEach((regionitem) => {
          formfield.countryList.forEach((item) => {
            if (regionitem.value === item.regionId) {
              selectedcountries.push(item);
            }
          });
        });
        let segmentOpts = frmSegmentOptsAll.filter((item) => {
          if (!item.country) {
            return true;
          } else {
            let ispresent = false;
            selectedcountries.forEach((countryitem) => {
              if (item.country.indexOf(countryitem.label) !== -1) {
                ispresent = true;
              }
            });
            return ispresent;
          }
        });
        setfrmSegmentOpts([selectInitiVal, ...segmentOpts]);
        let countryIds = [];
        let regionIds = [];
        selectedcountries.forEach((item) => {
          countryIds.push(item.value);
        });
        regions.forEach((item) => {
          regionIds.push(item.value);
        });
        setformfield({
          ...formfield,
          [name]: value,
          countryList: [...selectedcountries],
          customerSegment: "",
          regionId: regionIds.join(","),
          countryId: countryIds.join(","),
        });
      } else {
        setcountryopts([...frmCountryOptsAll]);
        setregionopts([...frmRegionOptsAll]);
        setfrmSegmentOpts([...frmSegmentOptsAll]);
        setformfield({
          ...formfield,
          [name]: value,
          countryList: [],
          customerSegment: "",
          regionId: "",
          countryId: "",
        });
      }
    }
  };
  const handleDateSelectChange = (name, value) => {
    let dateval = value ? moment(value).format("YYYY-MM-DD") : "";
    setformfield({ ...formfield, isdirty: true, [name]: dateval });
  };
  const handleFileUpload = async (name, selectedfile) => {
    const formData = new FormData();
    if (selectedfile) {
      // Update the formData object
      for (let i = 0; i < selectedfile.length; i++) {
        let file = selectedfile[i];
        formData.append("files", file, file.name);
      }
      let folderID = formfield.breachLogID
        ? formfield.breachLogID
        : formfield.folderID
        ? formfield.folderID
        : "";

      formData.append("TempId", folderID);
      if (formfield.breachLogID) {
        formData.append("LogType", "BreachLogs");
      }
    }
    setfileuploadloader(true);
    let response = await uploadFile(formData);
    if (response) {
      setfileuploadloader(false);
      if (!formfield.breachLogID) {
        formfield.folderID = response.tempId;
      }
      let tempattachementfiles = [...formfield.breachAttachmentList];

      response.attachmentFiles.forEach((item) => {
        let isExits = false;
        for (let j = 0; j < tempattachementfiles.length; j++) {
          let existfile = tempattachementfiles[j]["filePath"];
          existfile = existfile.split("/")[existfile.split("/").length - 1];
          let currentfile = item.split("/")[item.split("/").length - 1];
          if (existfile === currentfile) {
            isExits = true;
            break;
          }
        }
        if (!isExits) {
          tempattachementfiles.push({
            filePath: item,
            logAttachmentId: "",
            isNew: true,
          });
        }
      });
      setformfield({
        ...formfield,
        isdirty: true,
        breachAttachmentList: [...tempattachementfiles],
      });
      alert(alertMessage.commonmsg.fileuploadsuccess);
    } else {
      setfileuploadloader(false);
      alert(alertMessage.commonmsg.fileuploaderror);
    }
  };
  const handleFileDelete = async (id, url) => {
    if (!window.confirm(alertMessage.breachlog.deleteAttachmentConfirm)) {
      return;
    }
    const requestParam = {
      id: id,
      uploadedFile: url,
    };
    const response = await deleteFile(requestParam);
    if (response) {
      alert(alertMessage.breachlog.deleteAttachment);
      let tempattachementfiles = [...formfield.breachAttachmentList];
      tempattachementfiles = tempattachementfiles.filter(
        (item) => item.filePath !== url
      );
      setformfield({
        ...formfield,
        isdirty: true,
        breachAttachmentList: [...tempattachementfiles],
      });
    }
  };
  useEffect(() => {
    if (formfield.regionList?.length === 1) {
      if (
        formfield.regionId?.indexOf(znaRegionValue) !== -1 &&
        formfield.howDetected === howdetectedtur
      ) {
        setmandatoryFields([
          ...commonMandatoryFields,
          ...znaMandotoryFields,
          "turNumber",
        ]);
      } else if (formfield.regionId?.indexOf(znaRegionValue) !== -1) {
        setmandatoryFields([...commonMandatoryFields, ...znaMandotoryFields]);
        setformfield({
          ...formfield,
          customerSegment: "",
        });
      } else {
        if (formfield.regionId?.indexOf(emeaRegionValue) !== -1) {
          setmandatoryFields([
            ...commonMandatoryFields,
            ...regionMandotoryFields,
            ...EMEAMandotoryFields,
          ]);
        } else {
          setmandatoryFields([
            ...commonMandatoryFields,
            ...regionMandotoryFields,
          ]);
        }
        setformfield({
          ...formfield,
          znaSegmentId: "",
          znasbuId: "",
          marketBasketId: "",
          uwrInvolved: "",
          businessDivision: "",
          office: "",
          policyName: "",
          policyNumber: "",
          turNumber: "",
        });
      }
    } else {
      let tempMandatoryfields = [
        ...commonMandatoryFields,
        ...regionMandotoryFields,
      ];
      if (formfield.regionId?.indexOf(znaRegionValue) !== -1) {
        tempMandatoryfields = [...tempMandatoryfields, ...znaMandotoryFields];
        if (formfield.howDetected === howdetectedtur) {
          tempMandatoryfields = [...tempMandatoryfields, "turNumber"];
        }
      } else {
        if (formfield.regionId?.indexOf(emeaRegionValue) !== -1) {
          tempMandatoryfields = [...tempMandatoryfields, "EMEAMandotoryFields"];
        }
        setformfield({
          ...formfield,
          znaSegmentId: "",
          znasbuId: "",
          marketBasketId: "",
          uwrInvolved: "",
          businessDivision: "",
          office: "",
          policyName: "",
          policyNumber: "",
          turNumber: "",
        });
      }
      setmandatoryFields([...tempMandatoryfields]);
    }
  }, [formfield.regionId, formfield.howDetected]);
  useEffect(() => {
    if (formfield.regionId?.indexOf(emeaRegionValue) !== -1) {
      setformfield({
        ...formfield,
        nearMisses: formfield.nearMisses ? formfield.nearMisses : false,
      });
    } else {
      setformfield({
        ...formfield,
        nearMisses: null,
      });
    }
  }, [formfield.regionId]);

  const [scrollPosition, setScrollPosition] = useState(0);
  const [showpeoplepicker, setshowpeoplepicker] = useState(false);
  const [showuwrInvolved, setshowuwrInvolved] = useState(false);
  const [showBreachCC, setshowBreachCC] = useState(false);
  const handleshowpeoplepicker = (usertype, e) => {
    e.target.blur();
    const position = window.pageYOffset;
    setScrollPosition(position);
    if (usertype === "actionResponsible") {
      setshowpeoplepicker(true);
    } else if (usertype === "uwrInvolved") {
      setshowuwrInvolved(true);
    } else if (usertype === "breachCC") {
      setshowBreachCC(true);
    }
  };
  const hidePeoplePickerPopup = () => {
    setshowpeoplepicker(false);
    setshowuwrInvolved(false);
    setshowBreachCC(false);
    window.scrollTo({ top: scrollPosition, behavior: "smooth" });
  };
  const assignPeoplepikerUser = (name, value, usertype) => {
    let displayname = [];
    let email = [];

    value.forEach((item) => {
      displayname.push(item.firstName + " " + item.lastName);
      email.push(item["emailAddress"]);
    });
    let namefield = "";
    let adfield = "";
    let selvalue = value;
    if (usertype === "actionResponsible") {
      namefield = "actionResponsibleName";
      adfield = "actionResponsibleAD";
      selvalue = value[0];
    } else if (usertype === "uwrInvolved") {
      namefield = "uwrInvolvedName";
      adfield = "uwrInvolvedAD";
    } else if (usertype === "breachCC") {
      namefield = "breachCCName";
      adfield = "breachCCAD";
    }
    /*let displayname = value.length
      ? value[0].firstName + " " + value[0].lastName
      : "";
    let email = value.length ? value[0]["emailAddress"] : "";*/
    setformfield({
      ...formfield,
      isdirty: true,
      [name]: email.join(","),
      [namefield]: displayname.join(","),
      [adfield]: selvalue,
    });
  };
  const validateform = () => {
    let isvalidated = true;
    for (let key in formfield) {
      if (mandatoryFields.includes(key) && isvalidated) {
        let value = formfield[key];
        if (key === "actionPlan") {
          value = formfield[key].replace(/<\/?[^>]+(>|$)/g, "");
        }
        if (!isNotEmptyValue(value)) {
          isvalidated = false;
        }
      }
    }
    return isvalidated;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isfrmdisabled) {
      return;
    }
    setissubmitted(true);
    let selectedCountryItems = formfield.countryList.map((item) => item.value);
    formfield.countryId = selectedCountryItems.join(",");

    let selectedRegionItems = formfield.regionList.map((item) => item.value);
    formfield.regionId = selectedRegionItems.join(",");

    if (validateform()) {
      //added below code to set date action closed value
      if (
        formfield.breachStatus === breachlog_status.Close &&
        !formfield.dateActionClosed
      ) {
        formfield.dateActionClosed = moment().format("YYYY-MM-DD");
      }
      //end of code
      if (formfield.breachStatus)
        if (isEditMode) {
          putItem({ ...formfield, isSubmit: true });
        } else {
          postItem({ ...formfield, isSubmit: true });
        }
      setisfrmdisabled(true);
    }
  };
  const handleSaveLog = () => {
    //setissubmitted(true);
    if (isfrmdisabled) {
      return;
    }
    let selectedCountryItems = formfield.countryList.map((item) => item.value);
    formfield.countryId = selectedCountryItems.join(",");

    let selectedRegionItems = formfield.regionList.map((item) => item.value);
    formfield.regionId = selectedRegionItems.join(",");

    if (formfield.title && formfield.countryId) {
      postItem({ ...formfield, isSubmit: false });
      setisfrmdisabled(true);
    } else {
      alert(alertMessage.breachlog.draftInvalid);
    }
    // }
    // hideAddPopup();
  };
  const hidePopup = () => {
    let isconfirmed = true;
    if (formfield.isdirty) {
      isconfirmed = window.confirm(alertMessage.commonmsg.promptmsg);
    }
    if (isconfirmed) {
      if (queryparam.id) {
        window.location = "/breachlogs";
      } else {
        hideAddPopup();
      }
    }
  };
  const downloadfile = async (fileurl) => {
    const responsedata = await downloadFile({
      uploadedFile: fileurl,
    });

    const filename = fileurl.split("/")[fileurl.split("/").length - 1];
    FileDownload(responsedata, filename);
  };
  return loading ? (
    <Loading />
  ) : (
    <div className="addedit-logs-container">
      <div className="addedit-header-container">
        <div className="addedit-header-title">{title}</div>
        <div className="header-btn-container">
          {formfield.isSubmit && (
            <div
              className="btn-blue"
              onClick={() =>
                handleDataVersion(formfield.breachLogID, formfield.isSubmit)
              }
              style={{ marginRight: "10px" }}
            >
              Version History
            </div>
          )}
          {!isEditMode && isReadMode && (
            <div
              className="btn-blue"
              onClick={() => setInEditMode()}
              style={{ marginRight: "10px" }}
            >
              Edit
            </div>
          )}
          <div className="addedit-close btn-blue" onClick={() => hidePopup()}>
            Back
          </div>
        </div>
      </div>
      <div className="popup-formitems logs-form">
        <form onSubmit={handleSubmit} id="myForm">
          <>
            <Prompt
              when={formfield.isdirty ? true : false}
              message={(location) => alertMessage.commonmsg.promptmsg}
            />
            <div className="frm-field-bggray">
              <div className="row">
                {isNotEmptyValue(formfield.entityNumber) ? (
                  <div
                    className="col-md-12"
                    style={{ marginBottom: "15px", fontSize: "16px" }}
                  >
                    <label>Entry Number:</label> {formfield.entityNumber}
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="row">
                <div className="col-md-3">
                  <FrmInput
                    title={"Title of the Breach"}
                    name={"title"}
                    value={formfield.title}
                    type={"text"}
                    handleChange={handleChange}
                    isReadMode={isReadMode}
                    isRequired={true}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isToolTip={true}
                    tooltipmsg={tooltip["Title"]}
                  />
                </div>
                <div className="col-md-3">
                  <FrmMultiselect
                    title={"Country"}
                    name={"countryList"}
                    value={formfield.countryList ? formfield.countryList : []}
                    handleChange={handleMultiSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={countryopts}
                    isdisabled={isfrmdisabled}
                    isAllOptNotRequired={true}
                  />
                </div>
                <div className="col-md-3">
                  <FrmMultiselect
                    title={"Region"}
                    name={"regionList"}
                    value={formfield.regionList ? formfield.regionList : []}
                    isReadMode={isReadMode}
                    handleChange={handleMultiSelectChange}
                    isRequired={true}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={regionopts}
                    isdisabled={isfrmdisabled}
                    isAllOptNotRequired={true}
                  />
                </div>
                {(formfield.regionId?.indexOf(znaRegionValue) === -1 ||
                  formfield.regionList.length > 1) && (
                  <div className="col-md-3">
                    <FrmSelect
                      title={"Customer Segment"}
                      name={"customerSegment"}
                      value={formfield.customerSegment}
                      handleChange={handleSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={frmSegmentOpts}
                    />
                  </div>
                )}
              </div>
              {formfield.regionId?.indexOf(znaRegionValue) !== -1 ? (
                <div className="row">
                  <div className="col-md-3">
                    <FrmSelect
                      title={"ZNA BU"}
                      name={"znaSegmentId"}
                      value={formfield.znaSegmentId}
                      handleChange={handleSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={frmZNASegmentOpts}
                    />
                  </div>
                  <div className="col-md-3">
                    <FrmSelect
                      title={"ZNA SBU"}
                      name={"znasbuId"}
                      value={formfield.znasbuId}
                      handleChange={handleSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={frmZNASBUOpts}
                    />
                  </div>
                  <div className="col-md-3">
                    <FrmSelect
                      title={"ZNA Market Basket"}
                      name={"marketBasketId"}
                      value={formfield.marketBasketId}
                      handleChange={handleSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={frmZNAMarketBasketOpts}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="row">
                <div className="col-md-3">
                  <FrmSelect
                    title={"LoB"}
                    name={"lobid"}
                    value={formfield.lobid}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmLoB}
                  />
                </div>
                <div className="col-md-3">
                  <FrmSelect
                    title={"Sub-LoB"}
                    name={"sublobid"}
                    value={formfield.sublobid}
                    handleChange={handleSelectChange}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmSublob}
                  />
                </div>
                <div className="col-md-3">
                  {
                    <FrmRadio
                      title={"Classification"}
                      name={"classification"}
                      value={formfield.classification}
                      handleChange={handleChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      isToolTip={true}
                      tooltipmsg={tooltip["Classification"]}
                      issubmitted={issubmitted}
                      selectopts={frmSeverity}
                      isdisabled={isfrmdisabled}
                    />
                  }
                </div>
                <div className="col-md-3">
                  <FrmSelect
                    title={"Type of Breach"}
                    name={"typeOfBreach"}
                    value={formfield.typeOfBreach}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    isToolTip={true}
                    tooltipmsg={tooltip["TypeOfBreach"]}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmTypeOfBreach}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <FrmSelect
                    title={"Root Cause of the Breach"}
                    name={"rootCauseOfTheBreach"}
                    value={formfield.rootCauseOfTheBreach}
                    handleChange={handleSelectChange}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmRootCauseBreach}
                    isToolTip={true}
                    tooltipmsg={tooltip["RootCauseOfTheBreach"]}
                  />
                </div>
                <div className="col-md-3">
                  <FrmSelect
                    title={
                      <>
                        Nature of Breach <i>(Keywords)</i>
                      </>
                    }
                    name={"natureOfBreach"}
                    value={formfield.natureOfBreach}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmNatureOfBreach}
                    isToolTip={true}
                    tooltipmsg={tooltip["NatureOfBreach"]}
                  />
                </div>
                <div className="col-md-3">
                  <FrmToggleSwitch
                    title={
                      <>
                        Material breach <i>(as per ZUG)</i>
                      </>
                    }
                    name={"materialBreach"}
                    value={formfield.materialBreach}
                    handleChange={handleSelectChange}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    isToolTip={true}
                    tooltipmsg={tooltip["MaterialBreach"]}
                    issubmitted={issubmitted}
                    selectopts={yesnoopts}
                    isdisabled={isfrmdisabled}
                  />
                </div>
                <div className="col-md-3">
                  <FrmDatePicker
                    title={"Date Breach Occurred"}
                    name={"dateBreachOccurred"}
                    value={formfield.dateBreachOccurred}
                    type={"date"}
                    handleChange={handleDateSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    maxDate={moment().toDate()}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <FrmRichTextEditor
                    title={
                      <>
                        Details{" "}
                        <i>
                          (Use the Upload Attachments field at the bottom of the
                          form to upload supporting documents.)
                        </i>
                      </>
                    }
                    name={"breachDetails"}
                    value={formfield.breachDetails}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isToolTip={true}
                    tooltipmsg={tooltip["BreachDetails"]}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-3">
                  <FrmSelect
                    title={
                      <>
                        Range of financial impact <br></br>
                        <i>(In US Dollars $)</i>
                      </>
                    }
                    name={"rangeOfFinancialImpact"}
                    value={formfield.rangeOfFinancialImpact}
                    handleChange={handleSelectChange}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmRangeFinImpact}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <FrmRichTextEditor
                    title={"Financial impact description"}
                    name={"financialImpactDescription"}
                    value={formfield.financialImpactDescription}
                    handleChange={handleSelectChange}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={""}
                    issubmitted={issubmitted}
                    isToolTip={true}
                    tooltipmsg={tooltip["FinancialImpactDescription"]}
                  />
                </div>
              </div>
              <div
                className={`row ${
                  formfield.regionId?.indexOf(znaRegionValue) !== -1
                    ? "border-bottom"
                    : ""
                }`}
              >
                <div className="col-md-3">
                  <FrmSelect
                    title={"How detected"}
                    titlelinespace={true}
                    name={"howDetected"}
                    value={formfield.howDetected}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmHowDetected}
                    isToolTip={true}
                    tooltipmsg={tooltip["HowDetected"]}
                  />
                </div>
                <div className="col-md-3">
                  <FrmInput
                    title={
                      <>
                        Additional information<br></br>'How detected'
                      </>
                    }
                    name={"howDetectedMoreInfo"}
                    value={formfield.howDetectedMoreInfo}
                    type={"text"}
                    handleChange={handleChange}
                    isReadMode={isReadMode}
                    isToolTip={true}
                    tooltipmsg={tooltip["HowDetectedMoreInfo"]}
                    isRequired={false}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                  />
                </div>
                <div className="col-md-3">
                  {formfield.regionId?.indexOf(emeaRegionValue) !== -1 ? (
                    <FrmToggleSwitch
                      title={
                        <>
                          Near misses / OE <i>(Only EMEA)</i>
                        </>
                      }
                      name={"nearMisses"}
                      value={
                        formfield.nearMisses === true ||
                        formfield.nearMisses === false
                          ? formfield.nearMisses
                          : false
                      }
                      handleChange={handleSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      isToolTip={true}
                      tooltipmsg={tooltip["NearMisses"]}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={yesnoopts}
                      isdisabled={isfrmdisabled}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {formfield.regionId?.indexOf(znaRegionValue) !== -1 && (
                <>
                  <div className="row">
                    <div className="col-md-3">
                      {
                        /*<FrmInput
                          title={"UWr involved"}
                          name={"uwrInvolved"}
                          value={formfield.uwrInvolved}
                          type={"text"}
                          handleChange={handleChange}
                          isReadMode={isReadMode}
                          isRequired={false}
                          validationmsg={"Mandatory field"}
                          issubmitted={issubmitted}
                        />*/
                        <FrmInput
                          title={"UWr involved"}
                          name={"uwrInvolvedName"}
                          value={formfield.uwrInvolvedName}
                          type={"text"}
                          handleChange={handleChange}
                          handleClick={(e) =>
                            handleshowpeoplepicker("uwrInvolved", e)
                          }
                          isRequired={false}
                          isReadMode={isReadMode}
                          validationmsg={"Mandatory field"}
                          issubmitted={issubmitted}
                          isdisabled={isfrmdisabled}
                        />
                      }
                    </div>
                    <div className="col-md-3">
                      <FrmDatePicker
                        title={"Date Identified"}
                        name={"dateIdentified"}
                        value={formfield.dateIdentified}
                        type={"date"}
                        handleChange={handleDateSelectChange}
                        isRequired={false}
                        isReadMode={isReadMode}
                        validationmsg={"Mandatory field"}
                        issubmitted={issubmitted}
                      />
                    </div>
                    {/* <div className="col-md-3">
                      <FrmInput
                        title={"Business Division"}
                        name={"businessDivision"}
                        value={formfield.businessDivision}
                        type={"text"}
                        handleChange={handleChange}
                        isReadMode={isReadMode}
                        isRequired={false}
                        validationmsg={"Mandatory field"}
                        issubmitted={issubmitted}
                      />
              </div>*/}
                    <div className="col-md-3">
                      <FrmSelect
                        title={"Office"}
                        name={"office"}
                        value={formfield.office}
                        handleChange={handleSelectChange}
                        isRequired={false}
                        isReadMode={isReadMode}
                        validationmsg={"Mandatory field"}
                        issubmitted={issubmitted}
                        selectopts={frmOffice}
                      />
                    </div>
                  </div>
                  <div
                    className="row border-bottom"
                    style={{ paddingBottom: "10px" }}
                  >
                    <div className="col-md-3">
                      <FrmInput
                        title={"Policy name"}
                        name={"policyName"}
                        value={formfield.policyName}
                        type={"text"}
                        handleChange={handleChange}
                        isReadMode={isReadMode}
                        isRequired={false}
                        validationmsg={"Mandatory field"}
                        issubmitted={issubmitted}
                      />
                    </div>
                    <div className="col-md-3">
                      <FrmInput
                        title={"Policy number"}
                        name={"policyNumber"}
                        value={formfield.policyNumber}
                        type={"text"}
                        handleChange={handleChange}
                        isReadMode={isReadMode}
                        isRequired={false}
                        validationmsg={"Mandatory field"}
                        issubmitted={issubmitted}
                      />
                    </div>
                    <div className="col-md-3">
                      <FrmInput
                        title={"UQA Review ID"}
                        name={"turNumber"}
                        value={formfield.turNumber}
                        type={"text"}
                        handleChange={handleChange}
                        isReadMode={isReadMode}
                        isRequired={
                          formfield.regionId?.indexOf(znaRegionValue) !== -1 &&
                          formfield.howDetected === howdetectedtur
                            ? true
                            : false
                        }
                        validationmsg={"Mandatory field"}
                        issubmitted={issubmitted}
                      />
                    </div>
                    <br />
                    <br />
                  </div>
                </>
              )}
              <br />
              <div className="row">
                <div className="col-md-3">
                  <FrmInput
                    title={"Action Responsible"}
                    name={"actionResponsibleName"}
                    value={formfield.actionResponsibleName}
                    type={"text"}
                    handleChange={handleChange}
                    handleClick={(e) =>
                      handleshowpeoplepicker("actionResponsible", e)
                    }
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isToolTip={true}
                    tooltipmsg={tooltip["ActionResponsible"]}
                  />
                </div>
                <div className="col-md-3">
                  <FrmDatePicker
                    title={"Due Date"}
                    name={"dueDate"}
                    value={formfield.dueDate}
                    type={"date"}
                    handleChange={handleDateSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    minDate={moment().toDate()}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                  />
                </div>
                <div className="col-md-3 customDateTT">
                  <label>
                    Original Due Date
                    <CustomToolTip
                      content={
                        <>
                          <table>
                            <tr>
                              <td>
                                <div className="tooltip-content">
                                  This is the due date set when the breach was
                                  originally created.
                                </div>
                              </td>
                            </tr>
                          </table>
                        </>
                      }
                      direction="left"
                    >
                      <div className="breach-title" rowid="">
                        <div
                          className="icon info-icon"
                          style={{
                            width: "50px",
                            height: "14px",
                            left: "20px",
                            position: "relative",
                            top: "0px",
                          }}
                        >
                          {" "}
                        </div>
                      </div>
                    </CustomToolTip>
                  </label>
                  <div className="cls-orgduedate">
                    {formfield.originalDueDate
                      ? formatDate(formfield.originalDueDate)
                      : ""}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <FrmInput
                    title={"Breach CC"}
                    name={"breachCCName"}
                    value={formfield.breachCCName}
                    type={"text"}
                    handleChange={handleChange}
                    handleClick={(e) => handleshowpeoplepicker("breachCC", e)}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    isToolTip={true}
                    tooltipmsg={tooltip["BreachCC"]}
                    issubmitted={issubmitted}
                    isdisabled={isfrmdisabled}
                  />
                </div>
              </div>
              <div className="row border-bottom">
                <div className="col-md-12">
                  <FrmRichTextEditor
                    title={"Action Plan"}
                    name={"actionPlan"}
                    value={formfield.actionPlan}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isToolTip={true}
                    tooltipmsg={tooltip["ActionPlan"]}
                  />
                </div>
              </div>
            </div>

            <div class="frm-container-bggray">
              <div className="row">
                <div className="col-md-3">
                  <FrmSelect
                    title={"Breach Status"}
                    name={"breachStatus"}
                    value={formfield.breachStatus}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isdisabled={
                      formfield.breachStatus === breachlog_status.Close &&
                      userProfile.userRoles[0].roleId === countryadminrole
                        ? true
                        : false
                    }
                    selectopts={frmBreachStatus}
                  />
                </div>
                <div className="col-md-3">
                  <FrmDatePicker
                    title={"Date Action Closed"}
                    name={"dateActionClosed"}
                    value={formfield.dateActionClosed}
                    type={"date"}
                    handleChange={handleDateSelectChange}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    minDate={moment(formfield.dateBreachOccurred).toDate()}
                    isdisabled={
                      formfield.breachStatus === breachlog_status.Close
                        ? false
                        : true
                    }
                  />
                </div>
              </div>
              <div className={`row `}>
                <div className="col-md-12">
                  <FrmRichTextEditor
                    title={"Action Update"}
                    name={"actionUpdate"}
                    value={formfield.actionUpdate}
                    handleChange={handleSelectChange}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isToolTip={true}
                    tooltipmsg={tooltip["ActionUpdate"]}
                  />
                </div>
              </div>
              <div
                className={`row ${
                  isEditMode || isReadMode ? "border-bottom" : ""
                }`}
              >
                <div className="col-md-6">
                  <FrmFileUpload
                    title={"Upload Attachment"}
                    name={"fullFilePath"}
                    uploadedfiles={formfield.breachAttachmentList}
                    value={""}
                    type={""}
                    handleFileUpload={handleFileUpload}
                    handleFileDelete={handleFileDelete}
                    isRequired={false}
                    isReadMode={isReadMode}
                    isShowDelete={!isReadMode && !isfrmdisabled}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isshowloading={fileuploadloader ? fileuploadloader : false}
                    downloadfile={downloadfile}
                  />
                </div>
              </div>
            </div>
            {isEditMode || isReadMode ? (
              <div className="row mb20">
                <div className="col-md-3">
                  <label>Created by</label>
                  <br></br>
                  {formfield.creatorName}
                </div>
                <div className="col-md-3">
                  <label>Created Date</label>
                  <br></br>
                  {formfield.createdDate
                    ? formatDate(formfield.createdDate)
                    : ""}
                </div>
                <div className="col-md-3">
                  <label>Modified By</label>
                  <br></br>
                  {formfield.lastModifiorName}
                </div>
                <div className="col-md-3">
                  <label>Modified Date</label>
                  <br></br>
                  {formfield.modifiedDate
                    ? formatDate(formfield.modifiedDate)
                    : ""}
                </div>
              </div>
            ) : (
              ""
            )}
          </>
        </form>
      </div>
      {!isReadMode ? (
        <div className="popup-footer-container">
          <div className="btn-container">
            {!isEditMode ? (
              <>
                <button
                  className={`btn-blue ${isfrmdisabled && "disable"}`}
                  onClick={handleSaveLog}
                >
                  Save
                </button>
              </>
            ) : (
              ""
            )}
            <button
              className={`btn-blue ${isfrmdisabled && "disable"}`}
              type="submit"
              form="myForm"
            >
              Submit
            </button>
            <div className="btn-blue" onClick={() => hidePopup()}>
              Cancel
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {showpeoplepicker ? (
        <PeoplePickerPopup
          title={"Action Responsible"}
          name={"actionResponsible"}
          usertype="actionResponsible"
          actionResponsible={
            formfield.actionResponsible ? [formfield.actionResponsibleAD] : []
          }
          assignPeoplepikerUser={assignPeoplepikerUser}
          hideAddPopup={hidePeoplePickerPopup}
          singleSelection={true}
        />
      ) : (
        ""
      )}
      {showuwrInvolved ? (
        <PeoplePickerPopup
          title={"UWr involved"}
          name={"uwrInvolved"}
          usertype="uwrInvolved"
          actionResponsible={
            formfield.uwrInvolved ? [...formfield.uwrInvolvedAD] : []
          }
          assignPeoplepikerUser={assignPeoplepikerUser}
          hideAddPopup={hidePeoplePickerPopup}
          singleSelection={false}
        />
      ) : (
        ""
      )}
      {showBreachCC ? (
        <PeoplePickerPopup
          title={"Breach CC"}
          name={"breachCC"}
          usertype="breachCC"
          actionResponsible={
            formfield.breachCC ? [...formfield.breachCCAD] : []
          }
          assignPeoplepikerUser={assignPeoplepikerUser}
          hideAddPopup={hidePeoplePickerPopup}
          singleSelection={false}
        />
      ) : (
        ""
      )}
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
  getToolTip: commonActions.getToolTip,
  getAlllob: lobActions.getAlllob,
  getAllSegment: segmentActions.getAllSegment,
  getAllSublob: sublobActions.getAllSublob,
  getAllOffice: officeActions.getAllOffice,
  uploadFile: commonActions.uploadFile,
  deleteFile: commonActions.deleteFile,
  downloadFile: commonActions.downloadFile,
  getAllUsers: userActions.getAllUsers,
  getallZNASegments: znaorgnization1Actions.getAllOrgnization,
  getallZNASBU: znaorgnization2Actions.getAllOrgnization,
  getallZNAMarketBasket: znaorgnization3Actions.getAllOrgnization,
};
export default connect(mapStateToProp, mapActions)(AddEditForm);
