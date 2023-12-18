import React, { useState, useEffect, useLayoutEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import FrmInput from "../common-components/frminput/FrmInput";
import FrmDatePicker from "../common-components/frmdatepicker/FrmDatePicker";
import FrmSelect from "../common-components/frmselect/FrmSelect";
import FrmMultiselect from "../common-components/frmmultiselect/FrmMultiselect";
import FrmInputAutocomplete from "../common-components/frminputautocomplete/FrmInputAutocomplete";
import FrmFileUpload from "../common-components/frmfileupload/FrmFileUpload";
import Loading from "../common-components/Loading";
import moment from "moment";
import { Prompt } from "react-router-dom";
import { isNotEmptyValue } from "../../helpers";
import { formfieldsmapping } from "./Rfelogconstants";
import { isEmptyObjectKeys } from "../../helpers";
import "./Style.css";
import {
  RFE_LOG_ORGALINMENT,
  RFE_LOG_STATUS,
  REGION_LATAM,
  REGION_ZNA,
  REGION_EMEA,
  USER_ROLE,
  INCOUNTRY_FLAG,
  INCOUNTRTY_IDS,
} from "../../constants";
import {
  userActions,
  lookupActions,
  rfelogActions,
  lobActions,
  sublobActions,
  commonActions,
  countryActions,
  segmentActions,
  currencyActions,
  branchActions,
  userprofileActions,
} from "../../actions";
import FrmRadio from "../common-components/frmradio/FrmRadio";
import FrmRichTextEditor from "../common-components/frmrichtexteditor/FrmRichTextEditor5";
import { alertMessage, dynamicSort, formatDate } from "../../helpers";
import PeoplePickerPopup from "./PeoplePickerPopup";
import Rfelocallog from "./Rfelocallog";

function AddEditForm(props) {
  const {
    rfelogState,
    lobState,
    sublobState,
    userState,
    countryState,
    segmentState,
    currencyState,
    branchState,
  } = props.state;
  const {
    title,
    hideAddPopup,
    postItem,
    putItem,
    isReadMode,
    isEditMode,
    setInEditMode,
    formIntialState,
    accountOpts,
    getAllCountry,
    getallLocalLinks,
    getLookupByType,
    getToolTip,
    getAlllob,
    getAllSublob,
    getAllSegment,
    getAllCurrency,
    getAllBranch,
    getAllPolicyAccounts,
    getPolicyTermId,
    getMultiUserProfile,
    uploadFile,
    deleteFile,
    downloadFile,
    getLogFields,
    userProfile,
    queryparam,
    handleDataVersion,
  } = props;
  const selectInitiVal = { label: "Select", value: "" };
  const [formfield, setformfield] = useState({});
  const [frmDurationOpts, setDurationOpts] = useState([]);
  const [issubmitted, setissubmitted] = useState(false);
  const [countryopts, setcountryopts] = useState([]);
  const [isfrmdisabled, setisfrmdisabled] = useState(false);
  const [isshowlocallink, setisshowlocallink] = useState(false);
  const [isstatusdisabled, setisstatusdisabled] = useState(false);
  const [isdurationdisabled, setisdurationdisabled] = useState(true);
  //const [isapprovermode, setisapprovermode] = useState(false);
  const [frmLoB, setfrmLoB] = useState([]);
  const [frmSublob, setfrmSublob] = useState([]);
  const [frmSublobAll, setfrmSublobAll] = useState([]);
  const [frmorgnizationalalignment, setfrmorgnizationalalignment] = useState(
    []
  );
  const [frmConditionOpts, setConditionOpts] = useState([]);
  const [frmrfechz, setfrmrfechz] = useState([]);
  const [frmrfeempourment, setfrmrfeempourment] = useState([]);
  const [frmrfeempourmentuk, setfrmrfeempourmentuk] = useState([]);
  const [frmrfeempourmentglobal, setfrmrfeempourmentglobal] = useState([]);
  const [frmstatus, setfrmstatus] = useState([]);
  const [tooltip, settooltip] = useState({});

  const [frmSegmentOpts, setfrmSegmentOpts] = useState([]);
  const [frmSegmentOptsAll, setfrmSegmentOptsAll] = useState([]);
  const [frmBranchOpts, setfrmBranchOpts] = useState([]);
  const [frmBranchOptsAll, setfrmBranchOptsAll] = useState([]);
  const [frmCurrencyOpts, setfrmCurrencyOpts] = useState([]);
  const [policyaccountOpts, setpolicyaccountOpts] = useState({});
  const [policyaccloader, setpolicyaccloader] = useState(false);
  const [frmAccountOpts, setfrmAccountOpts] = useState([]);
  const [policyTermIds, setpolicyTermIds] = useState([]);
  const policyURL = "https://insight360.zurich.com/policy360/?policy_term_id=";
  const [inCountryOptsLATAM, setinCountryOptsLATAM] = useState({
    frmNewRenewalOpts: [],
  });

  const [frmselectedRegion, setfrmselectedRegion] = useState([]);
  const [IncountryFlag, setIncountryFlag] = useState(undefined);
  const [fromfieldsdblist, setfromfieldsdblist] = useState();
  const [formdomfields, setformdomfields] = useState([]);
  const [isorgalignmentdisabled, setisorgalignmentdisabled] = useState(false);
  const OrganizationalAlignment = {
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
  const regions = {
    latam: REGION_LATAM,
    zna: REGION_ZNA,
    emea: REGION_EMEA,
  };
  const approverIntialRole = {
    isAdminGroup: false,
    isSuperAdmin: false,
    isGlobalAdmin: false,
    isRegionAdmin: false,
    isCountryAdmin: false,
    isNormalUser: false,
  };

  const [approverRole, setapproverRole] = useState(approverIntialRole);
  const FileDownload = require("js-file-download");
  const [userroles, setuserroles] = useState({
    isunderwriter: false,
    isapprover: false,
    isadmin: false,
    issuperadmin: false,
    iscc: false,
    isroleloaded: false,
  });
  const IncountryFlagConst = INCOUNTRY_FLAG;
  const IncountryIds = INCOUNTRTY_IDS;
  const initialMandotoryFields = [
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
  ];
  const [mandatoryFields, setmandatoryFields] = useState(
    initialMandotoryFields
  );
  const [LATAMMandatoryFields, setLATAMMandatoryFields] = useState([
    "CustomerSegment",
    "NewRenewal",
    "GWP",
  ]);
  const [fileuploadloader, setfileuploadloader] = useState(false);

  const [loading, setloading] = useState(true);

  useEffect(() => {
    const tempuserroles = {
      isunderwriter: false,
      isapprover: false,
      isadmin: false,
      issuperadmin: false,
      iscc: false,
      isroleloaded: true,
    };
    if (formIntialState?.IsSubmit) {
      if (
        formIntialState.Underwriter.indexOf(userProfile.emailAddress) !== -1
      ) {
        tempuserroles.isunderwriter = true;
      }
      if (
        formIntialState.UnderwriterGrantingEmpowerment &&
        formIntialState.UnderwriterGrantingEmpowerment.indexOf(
          userProfile.emailAddress
        ) !== -1
      ) {
        tempuserroles.isapprover = true;
      }
      if (
        formIntialState.RequestForEmpowermentCC &&
        formIntialState.RequestForEmpowermentCC.indexOf(
          userProfile.emailAddress
        ) !== -1
      ) {
        tempuserroles.iscc = true;
      }
      if (userProfile.isAdminGroup) {
        tempuserroles.isadmin = true;
      }
      if (userProfile.isSuperAdmin) {
        tempuserroles.issuperadmin = true;
      }
    }
    setuserroles({ ...userroles, ...tempuserroles });
  }, []);

  useEffect(() => {
    if (userroles.isroleloaded) {
      fnOnInit();
    }
  }, [userroles]);

  const fnOnInit = async () => {
    let tempopts = [];
    let tempcountryItems = [];
    getAllSegment({ logType: "rfelogs" });
    getAllCurrency();
    getAllBranch();
    getAllSublob();
    const dbvalues = await Promise.all([
      getAllCountry({ profileCountryId: userProfile.profileCountry }),
      //getAllCountry(),
      getAlllob({ isActive: true }),
      getLookupByType({ LookupType: "DurationofApproval" }),
      getLookupByType({ LookupType: "ConditionApplicableTo" }),
      getLookupByType({ LookupType: "RFEOrganizationalAlignment" }),
      getLookupByType({ LookupType: "RFECHZ" }),
      getLookupByType({ LookupType: "RFEEmpowermentReasonRequest" }),
      getLookupByType({ LookupType: "RFEEmpowermentStatusRequest" }),
      getLookupByType({ LookupType: "RFELogNewRenewal" }),
      getToolTip({ type: "RFELogs" }),
      //getLookupByType({ LookupType: "RFEEmpowermentReasonRequestUK" }),
    ]);
    //tempcountryItems = await getAllCountry();
    tempcountryItems = dbvalues[0];
    let regions = [];
    let countrycode = [];
    tempcountryItems.forEach((item) => {
      if (isEditMode || isReadMode || formIntialState.CountryList.length) {
        let ispresent = false;
        formIntialState.CountryList.forEach((countryitem) => {
          if (item.countryID === countryitem.value) {
            ispresent = true;
          }
        });
        if (item.isActive || ispresent) {
          let tempObj = {
            label: item.countryName.trim(),
            value: item.countryID,
            regionId: item.regionID,
            countryCode: item.countryCode,
          };
          tempopts.push(tempObj);
          if (ispresent) {
            //formIntialState.countryCode = formIntialState.countryCode?.concat(",", item.countryCode);
            countrycode.push(item.countryCode);
          }
        }
      } else if (item.isActive) {
        let tempObj = {
          label: item.countryName.trim(),
          value: item.countryID,
          regionId: item.regionID,
          countryCode: item.countryCode,
        };
        tempopts.push(tempObj);
        if (
          userProfile.profileCountry &&
          item.countryID === userProfile.profileCountry &&
          item.countryID !== IncountryIds.UK &&
          item.countryID !== IncountryIds.IRELANDFOS &&
          item.countryID !== IncountryIds.SPAINFOS &&
          item.countryID !== IncountryIds.BENELUX &&
          item.countryID !== IncountryIds.BENELUXBELGIUM &&
          item.countryID !== IncountryIds.BENELUXLUXEMBOURG &&
          item.countryID !== IncountryIds.BENELUXNETHERLANDS &&
          item.countryID !== IncountryIds.NORDIC &&
          item.countryID !== IncountryIds.NORDICDENMARK &&
          item.countryID !== IncountryIds.NORDICFINALAND &&
          item.countryID !== IncountryIds.NORDICSWEDEN
        ) {
          formIntialState.countryCode = item.countryCode;
          formIntialState.CountryId = item.countryID;
          formIntialState.CountryList.push(tempObj);
        }
      }

      if (formIntialState.CountryId.indexOf(item.countryID) !== -1) {
        regions.push(item.regionID);
      }
    });
    formIntialState.countryCode = countrycode.join(",");
    //tempopts.sort(dynamicSort("label"));
    setfrmselectedRegion([...regions]);
    setcountryopts([...tempopts]);

    //let tempLoBItems = await getAlllob({ isActive: true });
    tempopts = [];
    let tempLoBItems = dbvalues[1];
    tempLoBItems.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (item.isActive || item.lobid === formIntialState.LOBId) {
          // tempopts.push({...item, label: item.lobName, value: item.lobid, DurationofApprovalValue:item.DurationofApprovalValue });
          tempopts.push({ ...item, label: item.lobName, value: item.lobid });
        }
      } else if (item.isActive) {
        // tempopts.push({...item, label: item.lobName, value: item.lobid, DurationofApprovalValue:item.DurationofApprovalValue });
        tempopts.push({ ...item, label: item.lobName, value: item.lobid });
      }
      if (
        !formIntialState.DurationofApproval &&
        item.lobid === formIntialState.LOBId
      ) {
        formIntialState.DurationofApproval = item.durationofApproval;
      }
      if (item.lobid === formIntialState.LOBId) {
        formIntialState.mappedLOBs = item.mappedLOBs;
      }
    });
    tempopts.sort(dynamicSort("label"));
    setfrmLoB([selectInitiVal, ...tempopts]);

    let tempoptsDoA = [];
    //let tempDurationOfApproval = await getLookupByType({LookupType: "DurationofApproval"});
    let tempDurationOfApproval = dbvalues[2];

    tempDurationOfApproval.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (
          item.isActive ||
          item.lookupID === formIntialState.DurationofApproval
        ) {
          tempoptsDoA.push({
            label: item.lookUpValue,
            value: item.lookupID,
          });
        }
      } else if (item.isActive) {
        tempoptsDoA.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
      }
    });
    tempDurationOfApproval = [...tempoptsDoA];
    setDurationOpts([selectInitiVal, ...tempoptsDoA]);
    let tempoptsCondition = [];
    //let tempCondition = await getLookupByType({      LookupType: "ConditionApplicableTo",    });
    let tempCondition = dbvalues[3];
    tempCondition.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (
          item.isActive ||
          item.lookupID === formIntialState.ConditionApplicableTo
        ) {
          tempoptsCondition.push({
            label: item.lookUpValue,
            value: item.lookupID,
          });
        }
      } else if (item.isActive) {
        tempoptsCondition.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
      }
    });
    tempCondition = [...tempoptsCondition];
    setConditionOpts(tempoptsCondition);

    tempopts = [];

    setDurationOpts([selectInitiVal, ...tempoptsDoA]);

    let temporgnizationalalignment = dbvalues[4];
    let temprfechz = dbvalues[5];
    let temprfeempourment = dbvalues[6];

    let tempstatus = dbvalues[7];
    let temNewRenewal = dbvalues[8];
    let tempToolTips = dbvalues[9];
    //let temprfeempourmentuk = dbvalues[10];
    let tooltipObj = {};
    tempToolTips.forEach((item) => {
      tooltipObj[item.toolTipField] = item.toolTipText;
    });
    settooltip(tooltipObj);
    tempopts = [];

    temporgnizationalalignment.forEach((item) => {
      let tempObj = {};
      if (isEditMode || isReadMode) {
        if (
          item.isActive ||
          item.lookupID === formIntialState.OrganizationalAlignment
        ) {
          tempObj = {
            label: item.lookUpValue,
            value: item.lookupID,
          };
          if (item.lookupID === OrganizationalAlignment.region) {
            tempObj = { ...tempObj, isdisabled: true };
          }
          tempopts.push(tempObj);
        }
      } else if (item.isActive) {
        tempObj = {
          label: item.lookUpValue,
          value: item.lookupID,
        };
        if (item.lookupID === OrganizationalAlignment.region) {
          tempObj = { ...tempObj, isdisabled: true };
        }
        tempopts.push(tempObj);
      }
    });
    temporgnizationalalignment = [...tempopts];
    tempopts = [];
    temprfechz.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (item.isActive || item.lookupID === formIntialState.CHZ) {
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
    temprfechz = [...tempopts];
    tempopts = [];
    temprfeempourment.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (
          item.isActive ||
          item.lookupID === formIntialState.RequestForEmpowermentReason
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
    tempopts.sort(dynamicSort("label"));
    temprfeempourment = [...tempopts];

    tempopts = [];
    temNewRenewal.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (item.isActive || item.lookupID === formIntialState.NewRenewal) {
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
    temNewRenewal = [...tempopts];
    let frmstatus = [];
    tempstatus.forEach((item) => {
      let isshow = false;
      //status pending
      if (formIntialState.IsSubmit) {
        if (userroles.isapprover || userroles.issuperadmin) {
          isshow = true;
        } else {
          if (item.lookupID === formIntialState.RequestForEmpowermentStatus) {
            isshow = true;
          }
          //for pending - show status -withdrawn
          if (
            formIntialState.RequestForEmpowermentStatus ===
              rfelog_status.Pending &&
            (userroles.isunderwriter || userroles.isadmin) &&
            item.lookupID === rfelog_status.Withdrawn
          ) {
            isshow = true;
          }
          //for more information needed - show status - withdrawn/Pending
          if (
            formIntialState.RequestForEmpowermentStatus ===
              rfelog_status.More_information_needed &&
            userroles.isunderwriter &&
            (item.lookupID === rfelog_status.Withdrawn ||
              item.lookupID === rfelog_status.Pending)
          ) {
            isshow = true;
          }
          //for empowerment not granted/empowerment granted/emporment granted with condition - show status - Pending
          if (
            (formIntialState.RequestForEmpowermentStatus ===
              rfelog_status.Empowerment_not_granted ||
              formIntialState.RequestForEmpowermentStatus ===
                rfelog_status.Empowerment_granted ||
              formIntialState.RequestForEmpowermentStatus ===
                rfelog_status.Empowerment_granted_with_conditions) &&
            userroles.isunderwriter &&
            item.lookupID === rfelog_status.Pending
          ) {
            isshow = true;
          }
          //for admin user empowerment granted to Withdrawn
          if (
            formIntialState.RequestForEmpowermentStatus ===
              rfelog_status.Empowerment_granted &&
            userroles.isadmin &&
            item.lookupID === rfelog_status.Withdrawn
          ) {
            isshow = true;
          }
        }
      } else {
        if (item.lookupID === rfelog_status.Pending) {
          isshow = true;
        }
      }

      if (isshow) {
        frmstatus.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
      }
    });

    setfrmorgnizationalalignment([...temporgnizationalalignment]);
    setfrmrfechz([selectInitiVal, ...temprfechz]);
    setfrmrfeempourment([selectInitiVal, ...temprfeempourment]);
    setfrmrfeempourmentglobal([selectInitiVal, ...temprfeempourment]);
    //setfrmrfeempourmentuk([selectInitiVal, ...temprfeempourmentuk]);
    setfrmstatus([...frmstatus]);

    setinCountryOptsLATAM((prevstate) => ({
      ...prevstate,
      frmNewRenewalOpts: [selectInitiVal, ...temNewRenewal],
    }));

    if (formIntialState.IsSubmit) {
      if (userroles.isapprover || userroles.issuperadmin) {
        setisstatusdisabled(false);
      } else if (
        (userroles.isadmin || userroles.isunderwriter) &&
        formIntialState.RequestForEmpowermentStatus !==
          rfelog_status.Empowerment_granted &&
        formIntialState.RequestForEmpowermentStatus !== rfelog_status.Pending
      ) {
        if (!isReadMode) {
          setisstatusdisabled(true);
        }
      }
      if (userroles.isapprover && !userroles.issuperadmin && !isReadMode) {
        //setisapprovermode(true);
      }
      if (isEditMode && (userroles.isapprover || userroles.issuperadmin)) {
        setisdurationdisabled(false);
      } else {
        setisdurationdisabled(true);
      }
    } else {
      formIntialState.RequestForEmpowermentStatus = rfelog_status.Pending;
    }

    if (formIntialState.UnderwriterGrantingEmpowerment) {
      const tmpapprover = await getMultiUserProfile({
        EmailAddress: formIntialState.UnderwriterGrantingEmpowerment,
      });
      if (tmpapprover) {
        setUserApproverRole(tmpapprover?.userRoles[0]);
      } else {
        setapproverRole({ ...approverIntialRole });
      }
    }
    setIncountryFlag(formIntialState.IncountryFlag);
    setformfield(formIntialState);
    if (formIntialState.PolicyTermId) {
      const tempIds = await getPolicyTermId({
        policyId: formIntialState.PolicyTermId,
      });
      setpolicyTermIds([...tempIds]);
    }
    setloading(false);
  };
  useEffect(() => {
    if (IncountryFlag !== undefined) {
      const fnonIncountryFlagChange = async () => {
        if (IncountryFlag === IncountryFlagConst.LATAM) {
          if (frmBranchOpts.length > 1) {
            setmandatoryFields([
              ...initialMandotoryFields,
              ...LATAMMandatoryFields,
              "Branch",
            ]);
          } else {
            setmandatoryFields([
              ...initialMandotoryFields,
              ...LATAMMandatoryFields,
            ]);
          }
        } else {
          setmandatoryFields([...initialMandotoryFields]);
        }
        //condition to set RequestForEmpowermentReason for uk
        if (IncountryFlag) {
          let temprfeempourment = await getLookupByType({
            LookupType: "RFEEmpowermentReasonRequest",
            IncountryFlag: IncountryFlag,
          });
          let tempopts = [];
          temprfeempourment.forEach((item) => {
            if (isEditMode || isReadMode) {
              if (
                item.isActive ||
                item.lookupID === formIntialState.RequestForEmpowermentReason
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
          tempopts.sort(dynamicSort("label"));
          temprfeempourment = [...tempopts];
          setfrmrfeempourment([selectInitiVal, ...temprfeempourment]);
        } else {
          setfrmrfeempourment([...frmrfeempourmentglobal]);
          if (formfield.RequestForEmpowermentReason) {
            const isPresent = frmrfeempourmentglobal.filter(
              (item) => item.value === formfield.RequestForEmpowermentReason
            );
            if (!isPresent?.length) {
              setformfield({ ...formfield, RequestForEmpowermentReason: "" });
            }
          }
        }
        fnloadcountryview();
      };
      fnonIncountryFlagChange();
    }
  }, [IncountryFlag]);

  const fnloadcountryview = async () => {
    const tempdbfields = await getLogFields({
      IncountryFlag: IncountryFlag,
      FieldType: "Form",
    });
    // setfromfieldsdblist(tempfields);
    let tempfields = [];
    tempdbfields?.forEach((item) => {
      if (item.isActive) {
        let tempformobj = formfieldsmapping[item.fieldName];
        if (tempformobj) {
          let tempobj = {
            componenttype: tempformobj["componenttype"],
            title: item.displayName,
            name: tempformobj["fieldname"]
              ? tempformobj["fieldname"]
              : item.fieldName,
            eventhandler: tempformobj["eventhandler"],
            colspan: tempformobj["colspan"],
            clsrowname: tempformobj["clsrowname"]
              ? tempformobj["clsrowname"]
              : "",
            ismandotory: mandatoryFields.includes(item.fieldName),
          };
          if (tempformobj["options"]) {
            tempobj = {
              ...tempobj,
              options: tempformobj["options"],
            };
          }
          if (tempformobj["minDate"] || tempformobj["maxDate"]) {
            tempobj = {
              ...tempobj,
              minDate: tempformobj["minDate"],
              maxDate: tempformobj["maxDate"],
            };
          }
          if (tempformobj["tooltipmsg"]) {
            tempobj = {
              ...tempobj,
              tooltipmsg: tempformobj["tooltipmsg"],
            };
          }
          if (tempformobj["titlelinespace"]) {
            tempobj = {
              ...tempobj,
              titlelinespace: tempformobj["titlelinespace"],
            };
          }
          if (tempformobj["peoplepickertype"]) {
            tempobj = {
              ...tempobj,
              peoplepickertype: tempformobj["peoplepickertype"],
            };
          }
          if (tempformobj["startbgcls"]) {
            tempobj = {
              ...tempobj,
              startbgcls: tempformobj["startbgcls"],
            };
          }
          if (tempformobj["breakblock"]) {
            tempobj = {
              ...tempobj,
              breakblock: tempformobj["breakblock"],
            };
          }
          if (tempformobj["conditionaldisplay"]) {
            tempobj = {
              ...tempobj,
              conditionaldisplay: tempformobj["conditionaldisplay"],
            };
          }
          if (tempformobj["disablecondition"]) {
            tempobj = {
              ...tempobj,
              disablecondition: tempformobj["disablecondition"],
            };
          }
          if (tempformobj["fieldTitleHtml"]) {
            tempobj = {
              ...tempobj,
              fieldTitleHtml: tempformobj["fieldTitleHtml"],
            };
          }
          tempfields.push(tempobj);
        }
      }
    });
    if (tempfields.length) {
      setformdomfields(tempfields);
    }
  };

  useEffect(() => {
    let tempopts = [];
    sublobState.sublobitems.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (item.isActive || item.subLOBID === formIntialState.SUBLOBID) {
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
    if (formIntialState.LOBId) {
      let sublobopts = tempopts.filter(
        (item) => item.lob === formIntialState.LOBId
      );
      setfrmSublob([selectInitiVal, ...sublobopts]);
    }
  }, [sublobState.sublobitems]);

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
    if (branchState.branchItems.length) {
      let tempopts = [];
      branchState.branchItems.forEach((item) => {
        if (isEditMode || isReadMode || formIntialState.Branch) {
          if (item.isActive || item.branchId === formIntialState.Branch) {
            tempopts.push({
              ...item,
              label: item.branchName,
              value: item.branchId,
            });
          }
        } else if (item.isActive) {
          tempopts.push({
            ...item,
            label: item.branchName,
            value: item.branchId,
          });
        }
      });
      tempopts.sort(dynamicSort("label"));
      setfrmBranchOptsAll([...tempopts]);
      if (formIntialState.Branch) {
        let tempBranchOpts = [];
        let tempOptNotApplicable = [];
        tempopts.forEach((item) => {
          if (formIntialState?.CountryId.indexOf(item.country) !== -1) {
            tempBranchOpts.push(item);
          }
          if (item.country === "0") {
            tempOptNotApplicable.push(item);
          }
        });
        setfrmBranchOpts([
          selectInitiVal,
          ...tempBranchOpts,
          ...tempOptNotApplicable,
        ]);
      } else {
        setfrmBranchOpts([selectInitiVal]);
      }
    }
  }, [branchState.branchItems]);

  useEffect(() => {
    let tempopts = [];
    currencyState.currencyItems.forEach((item) => {
      if (isEditMode || isReadMode || formIntialState.Currency) {
        if (item.isActive || item.currencyID === formIntialState.Currency) {
          tempopts.push({
            ...item,
            label: item.currencyName,
            value: item.currencyID,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          ...item,
          label: item.currencyName,
          value: item.currencyID,
        });
      }
    });
    //tempopts.sort(dynamicSort("label"));
    setfrmCurrencyOpts([selectInitiVal, ...tempopts]);
  }, [currencyState.currencyItems]);

  useEffect(() => {
    const getPolicyAccounts = async () => {
      if (!isEmptyObjectKeys(formfield)) {
        setpolicyaccloader(true);
        const tempAccounts = await getAllPolicyAccounts({
          countryCode: formfield?.countryCode ? formfield?.countryCode : "",
          lineOfBusiness: formfield?.mappedLOBs ? formfield?.mappedLOBs : "",
        });
        let tempAccObj = {};

        Array.isArray(tempAccounts) &&
          tempAccounts?.forEach((iteam) => {
            // if (isNaN(iteam.charAt(0))) {
            if (tempAccObj[iteam.charAt(0).toLowerCase()]) {
              tempAccObj[iteam.charAt(0).toLowerCase()].push(iteam);
            } else {
              tempAccObj[iteam.charAt(0).toLowerCase()] = [];
              tempAccObj[iteam.charAt(0).toLowerCase()].push(iteam);
            }
            //}
          });
        setpolicyaccountOpts({ ...tempAccObj });
        setfrmAccountOpts([]);
        setpolicyaccloader(false);
      } else {
        setpolicyaccountOpts({});
        setfrmAccountOpts([]);
      }
    };
    getPolicyAccounts();
  }, [formfield?.countryCode, formfield?.mappedLOBs]);

  useEffect(() => {
    const getIds = async () => {
      if (
        formfield.AccountName &&
        formfield.countryCode &&
        formfield.mappedLOBs &&
        !loading
      ) {
        const tempIds = await getPolicyTermId({
          producing_country: formfield?.countryCode,
          customer_name_input: formfield?.AccountName,
          line_of_business: formfield?.mappedLOBs,
        });

        let policytermids = [];
        if (tempIds.length) {
          setpolicyTermIds([...tempIds]);
          policytermids = tempIds.map((item) => item.policy_term_id);
        } else {
          setpolicyTermIds([]);
          setformfield((prevstate) => ({ ...prevstate, PolicyTermId: "" }));
        }
        setformfield((prevstate) => ({
          ...prevstate,
          PolicyTermId: policytermids.join(","),
        }));
      } else {
        setpolicyTermIds([]);
        setformfield((prevstate) => ({ ...prevstate, PolicyTermId: "" }));
      }
    };
    getIds();
  }, [formfield.AccountName, formfield.countryCode, formfield.mappedLOBs]);

  const [locallinks, setlocallinks] = useState([]);
  useEffect(async () => {
    let templinks = [];
    templinks = await getallLocalLinks({});
    if (templinks.length) {
      templinks = templinks.map((item) => ({
        country: item.country,
        link: item.links,
      }));
      setlocallinks(templinks);
    }
  }, []);

  useEffect(() => {
    if (formIntialState.IsSubmit) {
      if (isEditMode && (userroles.isapprover || userroles.issuperadmin)) {
        setisdurationdisabled(false);
      } else {
        setisdurationdisabled(true);
      }
    }
  }, [isEditMode]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    if (
      name === "OrganizationalAlignment" &&
      value === OrganizationalAlignment.country
    ) {
      setisfrmdisabled(true);
      showlogPopup();
      alert(alertMessage.rfelog.orgalignmetmsg);
    } else if (
      name === "OrganizationalAlignment" &&
      value !== OrganizationalAlignment.country
    ) {
      setisfrmdisabled(false);
      hidelogPopup();
    }
    setformfield({ ...formfield, isdirty: true, [name]: value });
  };
  const handleSelectChange = (name, value) => {
    let newDOA = "";
    if (name === "LOBId") {
      let tempopts = [];
      let mappedLOBs = "";
      frmLoB.forEach((item) => {
        if (item.value === value) {
          newDOA = item.durationofApproval;
          tempopts.push({
            ...item,
            durationofApproval: item.durationofApproval,
          });
          mappedLOBs = item.mappedLOBs ? item.mappedLOBs : item.lobName;
        }
      });

      //setfrmLoB([selectInitiVal, ...tempopts]);
      setformfield({
        ...formfield,
        isdirty: true,
        [name]: value,
        mappedLOBs: mappedLOBs,
        DurationofApproval: newDOA,
      });
      let sublobopts = frmSublobAll.filter((item) => item.lob === value);
      setfrmSublob([selectInitiVal, ...sublobopts]);
    } else if (name === "LOBId" && value === "") {
      setfrmSublob([]);
    } else {
      /*if (name === "CountryId") {
        let countrycode = "";
        countryopts.forEach((item) => {
          if (item.value === value) {
            setfrmselectedRegion(item.regionId);
            countrycode = item.countryCode;
          }
        });
        setformfield({
          ...formfield,
          isdirty: true,
          [name]: value,
          Branch: "",
          countryCode: countrycode,
        });
      } else {*/
      setformfield({
        ...formfield,
        isdirty: true,
        [name]: value,
      });
      //}
    }
  };
  const onSearchFilterInputAutocomplete = (name, value) => {
    //const { name, value } = e.target;
    setformfield({ ...formfield, isdirty: true, [name]: value });
    setfrmAccountOpts(policyaccountOpts[value.charAt(0).toLowerCase()]);
  };
  useEffect(() => {
    let tempBranchOpts = [];
    let tempOptNotApplicable = [];
    if (formfield?.CountryList?.length) {
      frmBranchOptsAll.forEach((item) => {
        formfield.CountryList.forEach((countryItem) => {
          if (countryItem.value === item.country) {
            tempBranchOpts.push(item);
          }
        });
        if (item.country === "0") {
          tempOptNotApplicable.push(item);
        }
      });
      if (tempBranchOpts.length) {
        setfrmBranchOpts([
          selectInitiVal,
          ...tempBranchOpts,
          ...tempOptNotApplicable,
        ]);
      } else {
        setfrmBranchOpts([...tempBranchOpts]);
      }
    }
  }, [formfield?.CountryList]);

  const handleMultiSelectChange = (name, value) => {
    //const tempval = value.map((item) => item.value);
    if (name === "CountryList") {
      let countrycode = [];
      let selectedregions = [];
      let selregionObj = {};
      countryopts.forEach((item) => {
        value?.forEach((selcountry) => {
          if (item.value === selcountry.value) {
            if (!selregionObj[item.regionId]) {
              selectedregions.push(item.regionId);
              selregionObj[item.regionId] = item.regionId;
            }
            if (item.countryCode) {
              countrycode.push(item.countryCode);
            }
          }
        });
      });
      setfrmselectedRegion([...selectedregions]);
      setformfield({
        ...formfield,
        isdirty: true,
        [name]: value,
        Branch: "",
        countryCode: countrycode.join(","),
      });
    }
    //setformfield({ ...formfield, isdirty: true, [name]: value });
  };
  const handleDateSelectChange = (name, value) => {
    let dateval = value ? moment(value).format("YYYY-MM-DD") : "";
    if (
      name === "ReceptionInformationDate" &&
      formfield.ResponseDate &&
      moment(value).isAfter(formfield.ResponseDate)
    ) {
      setformfield({
        ...formfield,
        isdirty: true,
        [name]: dateval,
        ResponseDate: null,
      });
    } else {
      setformfield({ ...formfield, isdirty: true, [name]: dateval });
    }
  };
  const handleFileUpload = async (name, selectedfile) => {
    const formData = new FormData();
    if (selectedfile) {
      // Update the formData object
      for (let i = 0; i < selectedfile.length; i++) {
        let file = selectedfile[i];
        formData.append("files", file, file.name);
      }
      let folderID = formfield.RFELogId
        ? formfield.RFELogId
        : formfield.folderID
        ? formfield.folderID
        : "";

      formData.append("TempId", folderID);
      formData.append("LogType", "RFELogs");
    }
    setfileuploadloader(true);
    let response = await uploadFile(formData);
    if (response) {
      setfileuploadloader(false);
      if (!formfield.RFELogId) {
        formfield.folderID = response.tempId;
      }
      let tempattachementfiles = [...formfield.RFEAttachmentList];
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
        RFEAttachmentList: [...tempattachementfiles],
      });
      alert(alertMessage.commonmsg.fileuploadsuccess);
    } else {
      setfileuploadloader(false);
      alert(alertMessage.commonmsg.fileuploaderror);
    }
  };
  const handleFileDelete = async (id, url) => {
    if (!window.confirm(alertMessage.rfelog.deleteAttachmentConfirm)) {
      return;
    }
    const requestParam = {
      id: id,
      uploadedFile: url,
    };
    const response = await deleteFile(requestParam);
    if (response) {
      alert(alertMessage.rfelog.deleteAttachment);
      let tempattachementfiles = [...formfield.RFEAttachmentList];
      tempattachementfiles = tempattachementfiles.filter(
        (item) => item.filePath !== url
      );
      setformfield({
        ...formfield,
        isdirty: true,
        RFEAttachmentList: [...tempattachementfiles],
      });
    }
  };

  const [scrollPosition, setScrollPosition] = useState(0);
  const [showApprover, setshowApprover] = useState(false);
  const [showCCUser, setshowCCUser] = useState(false);
  const [showUnderwriter, setshowUnderwriter] = useState(false);
  const handleshowpeoplepicker = (usertype, e) => {
    e.target.blur();
    const position = window.pageYOffset;
    setScrollPosition(position);
    if (usertype === "approver") {
      setshowApprover(true);
    } else if (usertype === "ccuser") {
      setshowCCUser(true);
    } else if (usertype === "underwriter") {
      setshowUnderwriter(true);
    }
  };
  const hidePeoplePickerPopup = () => {
    setshowApprover(false);
    setshowCCUser(false);
    setshowUnderwriter(false);
    window.scrollTo({ top: scrollPosition, behavior: "smooth" });
  };
  const assignPeoplepikerUser = async (name, value, usertype) => {
    let displayname = [];
    let email = [];

    value.forEach((item) => {
      displayname.push(item.firstName + " " + item.lastName);
      email.push(item["emailAddress"]);
    });
    let namefield = "";
    let adfield = "";
    let selvalue = value;
    if (usertype === "approver") {
      namefield = "UnderwriterGrantingEmpowermentName";
      adfield = "UnderwriterGrantingEmpowermentAD";
      const tmpapprover = await getMultiUserProfile({
        EmailAddress: email.join(","),
      });
      if (tmpapprover) {
        setUserApproverRole(tmpapprover?.userRoles[0]);
      } else {
        setapproverRole({ ...approverIntialRole });
      }
    } else if (usertype === "ccuser") {
      namefield = "RequestForEmpowermentCCName";
      adfield = "RequestForEmpowermentCCAD";
    } else if (usertype === "underwriter") {
      namefield = "UnderwriterName";
      adfield = "UnderwriterAD";
      selvalue = value[0];
    }

    setformfield({
      ...formfield,
      isdirty: true,
      [name]: email.join(","),
      [namefield]: displayname.join(","),
      [adfield]: selvalue,
    });
  };
  const setUserApproverRole = (userRole) => {
    if (userRole.roleId === USER_ROLE.superAdmin) {
      setapproverRole({ ...approverIntialRole, isSuperAdmin: true });
    } else if (userRole.roleId === USER_ROLE.globalAdmin) {
      setapproverRole({ ...approverIntialRole, isGlobalAdmin: true });
    } else if (userRole.roleId === USER_ROLE.regionAdmin) {
      setapproverRole({ ...approverIntialRole, isRegionAdmin: true });
    } else if (userRole.roleId === USER_ROLE.countryAdmin) {
      setapproverRole({ ...approverIntialRole, isCountryAdmin: true });
    } else if (userRole.roleId === USER_ROLE.normalUser) {
      setapproverRole({ ...approverIntialRole, isNormalUser: true });
    }
  };
  useEffect(() => {
    if (
      !isEmptyObjectKeys(formfield) &&
      frmselectedRegion?.length &&
      formfield?.CountryList?.length
    ) {
      let isUKcountry = true;
      let isSingaporecountry = true;
      let isChinacountry = true;
      let isHongKongcountry = true;
      let isMalaysiacountry = true;
      let isFrancecountry = true;
      let isMiddleEastcountry = true;
      let isSpaincountry = true;
      let isItalycountry = true;
      let isBeneluxcountry = true;
      let isNordiccountry = true;
      let isAustraliacountry = true;
      let isIndonesiacountry = true;
      let isLatamregion = true;
      let isIncountryselected = true;
      frmselectedRegion.forEach((item) => {
        if (item === regions.latam) {
          isLatamregion = isLatamregion ? true : false;
        } else {
          isLatamregion = false;
        }
      });

      formfield.CountryList.forEach((item) => {
        if (
          item.value === IncountryIds.UK ||
          item.value === IncountryIds.IRELANDFOS ||
          item.value === IncountryIds.SPAINFOS
        ) {
          isUKcountry = isUKcountry ? true : false;
        } else {
          isUKcountry = false;
        }
        if (item.value === IncountryIds.SINGAPORE) {
          isSingaporecountry = isSingaporecountry ? true : false;
        } else {
          isSingaporecountry = false;
        }
        if (item.value === IncountryIds.CHINA) {
          isChinacountry = isChinacountry ? true : false;
        } else {
          isChinacountry = false;
        }
        if (item.value === IncountryIds.HONGKONG) {
          isHongKongcountry = isHongKongcountry ? true : false;
        } else {
          isHongKongcountry = false;
        }
        if (item.value === IncountryIds.MALAYSIA) {
          isMalaysiacountry = isMalaysiacountry ? true : false;
        } else {
          isMalaysiacountry = false;
        }
        if (item.value === IncountryIds.FRANCE) {
          isFrancecountry = isFrancecountry ? true : false;
        } else {
          isFrancecountry = false;
        }
        if (item.value === IncountryIds.MIDDLEEAST) {
          isMiddleEastcountry = isMiddleEastcountry ? true : false;
        } else {
          isMiddleEastcountry = false;
        }
        if (item.value === IncountryIds.SPAIN) {
          isSpaincountry = isSpaincountry ? true : false;
        } else {
          isSpaincountry = false;
        }
        if (item.value === IncountryIds.ITALY) {
          isItalycountry = isItalycountry ? true : false;
        } else {
          isItalycountry = false;
        }
        if (item.value === IncountryIds.AUSTRALIA) {
          isAustraliacountry = isAustraliacountry ? true : false;
        } else {
          isAustraliacountry = false;
        }
        if (
          item.value === IncountryIds.BENELUX ||
          item.value === IncountryIds.BENELUXBELGIUM ||
          item.value === IncountryIds.BENELUXLUXEMBOURG ||
          item.value === IncountryIds.BENELUXNETHERLANDS
        ) {
          isBeneluxcountry = isBeneluxcountry ? true : false;
        } else {
          isBeneluxcountry = false;
        }
        if (
          item.value === IncountryIds.NORDIC ||
          item.value === IncountryIds.NORDICDENMARK ||
          item.value === IncountryIds.NORDICFINALAND ||
          item.value === IncountryIds.NORDICSWEDEN
        ) {
          isNordiccountry = isNordiccountry ? true : false;
        } else {
          isNordiccountry = false;
        }
        if (item.value === IncountryIds.INDONESIA) {
          isIndonesiacountry = isIndonesiacountry ? true : false;
        } else {
          isIndonesiacountry = false;
        }

        if (
          Object.values(IncountryIds).join(",").indexOf(item.value) !== -1 ||
          item.regionId === regions.latam
        ) {
          isIncountryselected = isIncountryselected ? true : false;
        } else {
          isIncountryselected = false;
        }
      });

      if (isLatamregion) {
        if (approverRole.isRegionAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: OrganizationalAlignment.region,
          });
          setIncountryFlag(IncountryFlagConst.LATAM);
        } else if (approverRole.isCountryAdmin || approverRole.isNormalUser) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.LATAM);
        } else {
          setformfield({
            ...formfield,
            OrganizationalAlignment: OrganizationalAlignment.global,
          });
          setIncountryFlag("");
        }
      } else if (
        isUKcountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser)
      ) {
        setformfield({
          ...formfield,
          OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
        });
        setIncountryFlag(IncountryFlagConst.UK);
      } else if (
        isSingaporecountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser)
      ) {
        setformfield({
          ...formfield,
          OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
        });
        setIncountryFlag(IncountryFlagConst.SINGAPORE);
      }
      else if (
        isChinacountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser)
      ) {
        setformfield({
          ...formfield,
          OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
        });
        setIncountryFlag(IncountryFlagConst.CHINA);
      } 
      else if (
        isHongKongcountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser)
      ) {
        setformfield({
          ...formfield,
          OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
        });
        setIncountryFlag(IncountryFlagConst.HONGKONG);
      } 
      else if (
        isMalaysiacountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser)
      ) {
        setformfield({
          ...formfield,
          OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
        });
        setIncountryFlag(IncountryFlagConst.MALAYSIA);
      } 
      else if (
        isFrancecountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser)
      ) {
        setformfield({
          ...formfield,
          OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
        });
        setIncountryFlag(IncountryFlagConst.FRANCE);
      } 
      else if (
        isMiddleEastcountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser)
      ) {
        setformfield({
          ...formfield,
          OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
        });
        setIncountryFlag(IncountryFlagConst.MIDDLEEAST);
      } 
      else if (
        isSpaincountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser)
      ) {
        setformfield({
          ...formfield,
          OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
        });
        setIncountryFlag(IncountryFlagConst.SPAIN);
      } 
      else if (
        isItalycountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser)
      ) {
        setformfield({
          ...formfield,
          OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
        });
        setIncountryFlag(IncountryFlagConst.ITALY);
      } 
      else if (
        isBeneluxcountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser)
      ) {
        setformfield({
          ...formfield,
          OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
        });
        setIncountryFlag(IncountryFlagConst.BENELUX);
      }
      else if (
        isNordiccountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser)
      ) {
        setformfield({
          ...formfield,
          OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
        });
        setIncountryFlag(IncountryFlagConst.NORDIC);
      }
      else if (
        isAustraliacountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser)
      ) {
        setformfield({
          ...formfield,
          OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
        });
        setIncountryFlag(IncountryFlagConst.AUSTRALIA);
      }
      else if (
        isIndonesiacountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser)
      ) {
        setformfield({
          ...formfield,
          OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
        });
        setIncountryFlag(IncountryFlagConst.INDONESIA);
      } else {
        setformfield({
          ...formfield,
          OrganizationalAlignment: OrganizationalAlignment.global,
        });
        //setInCountryLatam(false);
        setIncountryFlag("");
      }
      //added below condition to set organization alignment disable

      if (isIncountryselected) {
        setisorgalignmentdisabled(true);
      } else {
        setisorgalignmentdisabled(false);
      }
    } else {
      setformfield({
        ...formfield,
        OrganizationalAlignment: OrganizationalAlignment.global,
      });
      setIncountryFlag("");
      setisorgalignmentdisabled(false);
    }
  }, [
    formfield?.UnderwriterGrantingEmpowerment,
    frmselectedRegion,
    formfield?.CountryList,
  ]);

  /*useEffect(() => {
    if (
      formfield?.CountryId === "" &&
      (approverRole.isRegionAdmin ||
        approverRole.isCountryAdmin ||
        approverRole.isNormalUser)
    ) {
      setformfield({
        ...formfield,
        OrganizationalAlignment: OrganizationalAlignment.country,
      });
       setIncountryFlag(IncountryFlagConst.UK);
    }
  }, [formfield?.UnderwriterGrantingEmpowerment, formfield?.CountryId]);*/

  const validateform = () => {
    let isvalidated = true;
    for (let key in formfield) {
      if (mandatoryFields.includes(key) && isvalidated) {
        let value = formfield[key];
        if (key === "RFELogDetails") {
          value = formfield[key].replace(/<\/?[^>]+(>|$)/g, "");
        }
        if (!value) {
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
    let selectedCountryItems = formfield.CountryList.map((item) => item.value);
    formfield.CountryId = selectedCountryItems.join(",");
    if (validateform()) {
      /*formfield.underwriterAD = {
        userName: formfield.underwriterName,
        emailAddress: formfield.underwriter,
      };*/
      if (
        formfield.UnderwriterGrantingEmpowerment.indexOf(
          formfield.Underwriter
        ) < 0
      ) {
        if (isEditMode) {
          if (
            (userroles.isadmin || userroles.isunderwriter) &&
            !userroles.isapprover &&
            !userroles.issuperadmin &&
            formfield.RequestForEmpowermentStatus ===
              rfelog_status.More_information_needed
          ) {
            formfield.RequestForEmpowermentStatus = rfelog_status.Pending;
          }
          putItem({ ...formfield, IncountryFlag: IncountryFlag });
        } else {
          postItem({
            ...formfield,
            IsSubmit: true,
            IncountryFlag: IncountryFlag,
          });
        }
        setisfrmdisabled(true);
      } else {
        alert(alertMessage.rfelog.invalidapprovermsg);
      }
    }
  };
  const handleSaveLog = () => {
    if (isfrmdisabled) {
      return;
    }
    let selectedCountryItems = formfield.CountryList.map((item) => item.value);
    formfield.CountryId = selectedCountryItems.join(",");
    if (formfield.AccountName) {
      //setissubmitted(true);
      postItem({ ...formfield, IsSubmit: false, IncountryFlag: IncountryFlag });
      setisfrmdisabled(true);
    } else {
      alert(alertMessage.rfelog.draftInvalid);
    }
    // }
    // hideAddPopup();
  };
  const history = useHistory()
  const hidePopup = () => {
    let isconfirmed = true;
    if (formfield.isdirty) {
      isconfirmed = window.confirm(alertMessage.commonmsg.promptmsg);
    }
    if (isconfirmed) {
      if (queryparam.id) {
        localStorage.removeItem("id");
        localStorage.removeItem("status");
        localStorage.removeItem("in-app");
        history.push("/rfelogs")
      } else {
        hideAddPopup();
      }
    }
  };
  const showlogPopup = () => {
    setisshowlocallink(true);
  };
  const hidelogPopup = () => {
    setisshowlocallink(false);
  };
  const openLocalLink = (link) => {
    let win = window.open(link);
    hidePopup();
  };
  const downloadfile = async (fileurl) => {
    const responsedata = await downloadFile({
      uploadedFile: fileurl,
    });

    const filename = fileurl.split("/")[fileurl.split("/").length - 1];
    FileDownload(responsedata, filename);
  };
  const getformsfieldsblock = (arrayObjs, clsrowname) => {
    let startbgcls = "";
    arrayObjs.forEach((element) => {
      if (element.startbgcls) {
        startbgcls = element.startbgcls;
      }
    });
    return (
      <div className={`row ${clsrowname} ${startbgcls}`}>
        {arrayObjs.map((item) => Fromdomobj(item, moment))}
      </div>
    );
  };
  const Fromdomobj = (obj, moment) => {
    let tempelement;
    switch (obj.componenttype) {
      case "FrmInput":
        return (
          <div className={`col-md-${obj.colspan}`}>
            {obj.peoplepickertype ? (
              <FrmInput
                title={
                  obj.fieldTitleHtml ? (
                    <span
                      dangerouslySetInnerHTML={{ __html: obj.title }}
                    ></span>
                  ) : (
                    obj.title
                  )
                }
                titlelinespace={obj.titlelinespace ? true : false}
                name={obj.name}
                value={formfield[obj.name]}
                type={"text"}
                handleClick={
                  obj.peoplepickertype
                    ? (e) => handleshowpeoplepicker(obj.peoplepickertype, e)
                    : ""
                }
                isReadMode={isReadMode}
                isRequired={obj.ismandotory}
                validationmsg={"Mandatory field"}
                issubmitted={issubmitted}
                isdisabled={isfrmdisabled}
                isToolTip={obj.tooltipmsg ? true : false}
                tooltipmsg={eval(obj.tooltipmsg)}
              />
            ) : (
              <FrmInput
                title={obj.title}
                titlelinespace={obj.titlelinespace ? true : false}
                name={obj.name}
                value={formfield[obj.name]}
                type={"text"}
                handleChange={handleChange}
                isReadMode={isReadMode}
                isRequired={mandatoryFields.includes(obj.name)}
                validationmsg={"Mandatory field"}
                issubmitted={issubmitted}
                isdisabled={isfrmdisabled}
                isToolTip={obj.tooltipmsg ? true : false}
                tooltipmsg={eval(obj.tooltipmsg)}
              />
            )}
          </div>
        );
      case "FrmInputAutocomplete":
        tempelement = (
          <div className={`col-md-${obj.colspan}`}>
            <FrmInputAutocomplete
              title={obj.title}
              titlelinespace={obj.titlelinespace ? true : false}
              name={obj.name}
              type={"input"}
              handleChange={onSearchFilterInputAutocomplete}
              value={formfield[obj.name]}
              options={eval(obj.options)}
              isReadMode={isReadMode}
              isRequired={mandatoryFields.includes(obj.name)}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
              isdisabled={isfrmdisabled}
              isToolTip={obj.tooltipmsg ? true : false}
              tooltipmsg={eval(obj.tooltipmsg)}
            />
            {obj.name === "AccountName" && policyaccloader ? (
              <div style={{ marginTop: "-20px" }}>
                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
              </div>
            ) : (
              ""
            )}
          </div>
        );
        return obj.conditionaldisplay
          ? eval(obj.conditionaldisplay)
            ? tempelement
            : ""
          : tempelement;
      case "FrmSelect":
        tempelement = (
          <div className={`col-md-${obj.colspan}`}>
            <FrmSelect
              title={
                obj.fieldTitleHtml ? (
                  <span dangerouslySetInnerHTML={{ __html: obj.title }}></span>
                ) : (
                  obj.title
                )
              }
              titlelinespace={obj.titlelinespace ? true : false}
              name={obj.name}
              value={formfield[obj.name]}
              handleChange={handleSelectChange}
              isRequired={mandatoryFields.includes(obj.name)}
              isReadMode={isReadMode}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
              selectopts={eval(obj.options)}
              isdisabled={
                isfrmdisabled ||
                (obj.disablecondition && eval(obj.disablecondition))
              }
              isToolTip={obj.tooltipmsg ? true : false}
              tooltipmsg={eval(obj.tooltipmsg)}
            />
          </div>
        );
        return obj.conditionaldisplay
          ? eval(obj.conditionaldisplay)
            ? tempelement
            : ""
          : tempelement;
      case "FrmMultiselect":
        return (
          <div className={`col-md-${obj.colspan}`}>
            <FrmMultiselect
              title={
                obj.fieldTitleHtml ? (
                  <span dangerouslySetInnerHTML={{ __html: obj.title }}></span>
                ) : (
                  obj.title
                )
              }
              titlelinespace={obj.titlelinespace ? true : false}
              name={obj.name}
              value={formfield[obj.name] ? formfield[obj.name] : []}
              handleChange={handleMultiSelectChange}
              isRequired={mandatoryFields.includes(obj.name)}
              isReadMode={isReadMode}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
              selectopts={eval(obj.options)}
              isdisabled={
                isfrmdisabled ||
                (obj.disablecondition && eval(obj.disablecondition))
              }
              isToolTip={obj.tooltipmsg ? true : false}
              tooltipmsg={eval(obj.tooltipmsg)}
              isAllOptNotRequired={true}
            />
          </div>
        );
      case "FrmRadio":
        return (
          <>
            <div className={`col-md-${obj.colspan}`}>
              <FrmRadio
                title={obj.title}
                titlelinespace={obj.titlelinespace ? true : false}
                name={obj.name}
                value={
                  formfield[obj.name]
                    ? formfield[obj.name]
                    : OrganizationalAlignment.global
                }
                handleChange={handleChange}
                isRequired={mandatoryFields.includes(obj.name)}
                isReadMode={isReadMode}
                validationmsg={"Mandatory field"}
                isToolTip={obj.tooltipmsg ? true : false}
                tooltipmsg={eval(obj.tooltipmsg)}
                issubmitted={issubmitted}
                selectopts={eval(obj.options)}
                isdisabled={
                  (isfrmdisabled && isshowlocallink) ||
                  IncountryFlag === IncountryFlagConst.LATAM ||
                  IncountryFlag === IncountryFlagConst.UK ||
                  IncountryFlag === IncountryFlagConst.INDONESIA ||
                  IncountryFlag === IncountryFlagConst.SINGAPORE ||
                  IncountryFlag === IncountryFlagConst.CHINA ||
                  IncountryFlag === IncountryFlagConst.MALAYSIA ||
                  IncountryFlag === IncountryFlagConst.FRANCE ||
                  IncountryFlag === IncountryFlagConst.MIDDLEEAST ||
                  IncountryFlag === IncountryFlagConst.SPAIN ||
                  IncountryFlag === IncountryFlagConst.HONGKONG ||
                  IncountryFlag === IncountryFlagConst.ITALY ||
                  IncountryFlag === IncountryFlagConst.AUSTRALIA ||
                  IncountryFlag === IncountryFlagConst.BENELUX ||
                  IncountryFlag === IncountryFlagConst.NORDIC ||
                  isorgalignmentdisabled
                }
              />
            </div>
            {formfield.OrganizationalAlignment ===
              OrganizationalAlignment.country && !IncountryFlag ? (
              <div className="col-md-3 btn-blue" onClick={showlogPopup}>
                Local country log
              </div>
            ) : (
              ""
            )}
          </>
        );
      case "FrmRichTextEditor":
        tempelement = (
          <>
            <div className={`col-md-${obj.colspan}`}>
              <FrmRichTextEditor
                title={obj.title}
                titlelinespace={obj.titlelinespace ? true : false}
                name={obj.name}
                value={formfield[obj.name]}
                handleChange={handleSelectChange}
                isRequired={mandatoryFields.includes(obj.name)}
                isReadMode={isReadMode}
                validationmsg={"Mandatory field"}
                issubmitted={issubmitted}
                isdisabled={
                  isfrmdisabled ||
                  (obj.disablecondition && eval(obj.disablecondition))
                }
                isToolTip={obj.tooltipmsg ? true : false}
                tooltipmsg={eval(obj.tooltipmsg)}
              />

              {obj.name === "RFELogDetails" && policyTermIds.length ? (
                <div className="row ">
                  <div className="col-md-12" style={{ padding: "10px" }}>
                    <table className="policyterms table-bordered">
                      <thead>
                        <th width="25%">Account Name</th>
                        <th width="25%">Policy Term Id</th>
                        <th width="17%">Product Name</th>
                        <th width="17%">Sub-Product Name</th>
                        <th>DUNS number</th>
                      </thead>
                      {policyTermIds.map((item) => (
                        <tr key={item.policy_term_id}>
                          <td>{item.customer_name}</td>
                          <td>
                            <a
                              href={`${policyURL}${item.policy_term_id}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {item.policy_term_id}
                            </a>
                          </td>
                          <td>
                            {item.product_name ? (
                              <span>{item.product_name} </span>
                            ) : (
                              ""
                            )}
                          </td>
                          <td>
                            {item.sub_product_name ? (
                              <span>{item.sub_product_name}</span>
                            ) : (
                              ""
                            )}
                          </td>
                          <td>
                            {item.duns_number ? (
                              <span>{item.duns_number}</span>
                            ) : (
                              ""
                            )}
                          </td>
                        </tr>
                      ))}
                    </table>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </>
        );
        return obj.conditionaldisplay
          ? eval(obj.conditionaldisplay)
            ? tempelement
            : ""
          : tempelement;
      case "FrmDatePicker":
        tempelement = (
          <div className={`col-md-${obj.colspan}`}>
            <FrmDatePicker
              title={obj.title}
              name={obj.name}
              titlelinespace={obj.titlelinespace ? true : false}
              value={formfield[obj.name]}
              type={"date"}
              handleChange={handleDateSelectChange}
              isRequired={mandatoryFields.includes(obj.name)}
              isReadMode={isReadMode}
              minDate={obj.minDate ? eval(obj.minDate) : ""}
              maxDate={obj.maxDate ? eval(obj.maxDate) : ""}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
              isToolTip={obj.tooltipmsg ? true : false}
              tooltipmsg={eval(obj.tooltipmsg)}
              isdisabled={
                isfrmdisabled ||
                (obj.disablecondition && eval(obj.disablecondition))
              }
            />
          </div>
        );
        return obj.conditionaldisplay
          ? eval(obj.conditionaldisplay)
            ? tempelement
            : ""
          : tempelement;
      default:
        break;
    }
  };
  let blockelelements = [];
  let domblockspancnt = 0;
  let clsrowname = "";

  return loading ? (
    <Loading />
  ) : (
    <div className="addedit-logs-container">
      <div className="addedit-header-container">
        <div className="addedit-header-title">{title}</div>
        <div className="header-btn-container">
          {formfield?.IsSubmit && (
            <div
              className="btn-blue"
              onClick={() =>
                handleDataVersion(formfield?.RFELogId, formfield?.IsSubmit)
              }
              style={{ marginRight: "10px" }}
            >
              Version History
            </div>
          )}
          {!isEditMode &&
            isReadMode &&
            (!userroles.iscc || userroles.isadmin) && (
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
      {!formdomfields.length ? (
        <Loading />
      ) : (
        <div className="popup-formitems logs-form">
          <form onSubmit={handleSubmit} id="myForm">
            <>
              <Prompt
                when={formIntialState?.isdirty ? true : false}
                message={(location) => alertMessage.commonmsg.promptmsg}
              />
              <div className="frm-field-bggray">
                <div className="row">
                  {isNotEmptyValue(formfield?.EntryNumber) ? (
                    <div
                      className="col-md-12"
                      style={{ marginBottom: "15px", fontSize: "16px" }}
                    >
                      <label>Entry Number:</label> {formfield?.EntryNumber}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <>
                {formdomfields.map((item, index) => {
                  let nextelement = formdomfields[index + 1]
                    ? formdomfields[index + 1]
                    : {};
                  domblockspancnt += item.colspan;
                  clsrowname = item.clsrowname ? item.clsrowname : clsrowname;
                  if (
                    domblockspancnt === 12 ||
                    domblockspancnt + nextelement?.colspan > 12 ||
                    (item.breakblock && !nextelement.breakblock) ||
                    index === formdomfields.length - 1
                  ) {
                    blockelelements.push(item);
                    const eleblock = getformsfieldsblock(
                      blockelelements,
                      clsrowname
                    );
                    blockelelements = [];
                    domblockspancnt = 0;
                    clsrowname = "";
                    return eleblock;
                  } else {
                    blockelelements.push(item);
                  }
                })}
              </>
              {/*
              <div>
              <div className="row">
                <div className="col-md-3">
                  {
                    <FrmInputAutocomplete
                      title={"Account Name"}
                      titlelinespace={true}
                      name={"AccountName"}
                      type={"input"}
                      handleChange={onSearchFilterInputAutocomplete}
                      value={formfield.AccountName ? formfield.AccountName : ""}
                      options={frmAccountOpts}
                      isReadMode={isReadMode}
                      isRequired={true}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isdisabled={isfrmdisabled}
                    />
                  }
                </div>
                <div className="col-md-3">
                  <FrmSelect
                    title={"Country"}
                    titlelinespace={true}
                    name={"CountryId"}
                    value={formfield.CountryId}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={countryopts}
                    isdisabled={isfrmdisabled}
                  />
                </div>
                <div className="col-md-3">
                  <FrmSelect
                    title={<>LoB</>}
                    titlelinespace={true}
                    name={"LOBId"}
                    value={formfield.LOBId}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmLoB}
                    isdisabled={isfrmdisabled}
                  />
                </div>
                <div className="col-md-3">
                  <FrmSelect
                    title={
                      <>
                        Request for empowerment<br></br>reason
                      </>
                    }
                    name={"RequestForEmpowermentReason"}
                    value={formfield.RequestForEmpowermentReason}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmrfeempourment}
                    isdisabled={isfrmdisabled}
                    isToolTip={true}
                    tooltipmsg={tooltip["RequestForEmpowermentReason"]}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <FrmInput
                    title={
                      <>
                        Underwriter granting<br></br>empowerment
                      </>
                    }
                    name={"UnderwriterGrantingEmpowermentName"}
                    value={formfield.UnderwriterGrantingEmpowermentName}
                    type={"text"}
                    handleChange={handleChange}
                    handleClick={(e) => handleshowpeoplepicker("approver", e)}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isdisabled={isfrmdisabled}
                  />
                </div>
                {IncountryFlag === IncountryFlagConst.LATAM &&
                frmBranchOpts.length ? (
                  <div className="col-md-3">
                    <FrmSelect
                      title={"Branch"}
                      titlelinespace={true}
                      name={"Branch"}
                      value={formfield.Branch}
                      handleChange={handleSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={frmBranchOpts}
                    />
                  </div>
                ) : (
                  ""
                )}
                {frmselectedRegion === regions.latam &&
                formfield.UnderwriterGrantingEmpowermentName === "" ? (
                  ""
                ) : (
                  <div className="col-md-3">
                    <FrmRadio
                      title={"Organizational alignment"}
                      titlelinespace={true}
                      name={"OrganizationalAlignment"}
                      value={
                        formfield.OrganizationalAlignment
                          ? formfield.OrganizationalAlignment
                          : OrganizationalAlignment.global
                      }
                      handleChange={handleChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      isToolTip={true}
                      tooltipmsg={tooltip["OrgnizationalAlignment"]}
                      issubmitted={issubmitted}
                      selectopts={frmorgnizationalalignment}
                      isdisabled={
                        (isfrmdisabled && isshowlocallink) ||
                        IncountryFlag === IncountryFlagConst.LATAM
                      }
                    />
                  </div>
                )}
                {formfield.OrganizationalAlignment ===
                  OrganizationalAlignment.country && !IncountryFlag ? (
                  <div className="col-md-3 btn-blue" onClick={showlogPopup}>
                    Local country log
                  </div>
                ) : (
                  ""
                )}
                <div className="col-md-3">
                  <FrmInput
                    title={
                      <>
                        Underwriter<i>(submitter)</i>
                      </>
                    }
                    titlelinespace={true}
                    name={"UnderwriterName"}
                    value={formfield.UnderwriterName}
                    type={"text"}
                    handleChange={handleChange}
                    handleClick={(e) =>
                      handleshowpeoplepicker("underwriter", e)
                    }
                    isReadMode={isReadMode}
                    isRequired={true}
                    isdisabled={isfrmdisabled}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                  />
                </div>
              </div>
              <div className="row border-bottom">
                <div className="col-md-12">
                  <FrmRichTextEditor
                    title={<>Specific Details</>}
                    name={"RFELogDetails"}
                    value={
                      formfield.RFELogDetails
                        ? formfield.RFELogDetails
                        : formIntialState.RFELogDetails
                    }
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isdisabled={isfrmdisabled}
                    isToolTip={true}
                    tooltipmsg={tooltip["SpecificDetails"]}
                  />
                </div>
              </div>
            </div>
            {IncountryFlag === IncountryFlagConst.LATAM ? (
              <div className="frm-field-bggray">
                <div className="row ">
                  <div className="col-md-3">
                    <FrmSelect
                      title={"Customer Segment"}
                      name={"CustomerSegment"}
                      value={formfield.CustomerSegment}
                      handleChange={handleSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={frmSegmentOpts}
                    />
                  </div>
                  <div className="col-md-3">
                    <FrmSelect
                      title={"New/Renewal"}
                      name={"NewRenewal"}
                      value={formfield.NewRenewal}
                      handleChange={handleSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={inCountryOptsLATAM.frmNewRenewalOpts}
                    />
                  </div>

                  <div className="col-md-3">
                    <FrmInput
                      title={"Policy Period"}
                      name={"PolicyPeriod"}
                      value={formfield.PolicyPeriod}
                      type={"text"}
                      handleChange={handleChange}
                      isReadMode={isReadMode}
                      isRequired={false}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isdisabled={isfrmdisabled}
                    />
                  </div>
                </div>
                <div className="row border-bottom">
                  <div className="col-md-3">
                    <FrmSelect
                      title={"Currency"}
                      name={"Currency"}
                      value={formfield.Currency}
                      handleChange={handleSelectChange}
                      isRequired={false}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={frmCurrencyOpts}
                    />
                  </div>
                  <div className="col-md-3">
                    <FrmInput
                      title={"Limit"}
                      name={"Limit"}
                      value={formfield.Limit}
                      type={"text"}
                      handleChange={handleChange}
                      isReadMode={isReadMode}
                      isRequired={false}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isdisabled={isfrmdisabled}
                    />
                  </div>
                  <div className="col-md-3">
                    <FrmInput
                      title={"GWP"}
                      name={"GWP"}
                      value={formfield.GWP}
                      type={"text"}
                      handleChange={handleChange}
                      isReadMode={isReadMode}
                      isRequired={true}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isdisabled={isfrmdisabled}
                    />
                  </div>

                  <div className="col-md-3">
                    <FrmInput
                      title={"Zurich Share"}
                      name={"ZurichShare"}
                      value={formfield.ZurichShare}
                      type={"text"}
                      handleChange={handleChange}
                      isReadMode={isReadMode}
                      isRequired={false}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isdisabled={isfrmdisabled}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <div class="frm-container-bggray">
              <div className="row">
                {!IncountryFlag ? (
                  <div className="col-md-3">
                    <FrmSelect
                      title={<>CHZ Sustainability Desk / CHZ GI Credit Risk</>}
                      name={"CHZ"}
                      value={formfield.CHZ}
                      handleChange={handleSelectChange}
                      isRequired={false}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      isToolTip={true}
                      tooltipmsg={tooltip["CHZ"]}
                      issubmitted={issubmitted}
                      selectopts={frmrfechz}
                      isdisabled={isfrmdisabled}
                    />
                  </div>
                ) : (
                  ""
                )}
                <div className="col-md-3">
                  <FrmInput
                    title={"Request for empowerment CC"}
                    name={"RequestForEmpowermentCCName"}
                    value={formfield.RequestForEmpowermentCCName}
                    type={"text"}
                    handleChange={handleChange}
                    handleClick={(e) => handleshowpeoplepicker("ccuser", e)}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    isToolTip={true}
                    tooltipmsg={tooltip["Rfecc"]}
                    issubmitted={issubmitted}
                    isdisabled={isfrmdisabled}
                  />
                </div>
                {IncountryFlag === IncountryFlagConst.LATAM ? (
                  <div className="col-md-3">
                    <FrmDatePicker
                      title={"Decision Date"}
                      name={"DecisionDate"}
                      value={formfield.DecisionDate}
                      type={"date"}
                      handleChange={handleDateSelectChange}
                      isRequired={false}
                      isReadMode={isReadMode}
                      minDate={""}
                      maxDate={""}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="row">
                <div className="col-md-3">
                  <FrmSelect
                    title={
                      <>
                        Request for empowerment<br></br>status
                      </>
                    }
                    name={"RequestForEmpowermentStatus"}
                    value={formfield.RequestForEmpowermentStatus}
                    handleChange={handleSelectChange}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmstatus}
                    isdisabled={isfrmdisabled || isstatusdisabled}
                    isToolTip={true}
                    tooltipmsg={tooltip["RequestForEmpowermentStatus"]}
                  />
                </div>

                {formfield.RequestForEmpowermentStatus ===
                  rfelog_status.Empowerment_granted_with_conditions && (
                  <div className="col-md-3">
                    <FrmSelect
                      title={<>Condition Applicable To</>}
                      titlelinespace={true}
                      name={"ConditionApplicableTo"}
                      value={formfield.ConditionApplicableTo}
                      handleChange={handleSelectChange}
                      isRequired={false}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={frmConditionOpts}
                      isdisabled={isfrmdisabled || isstatusdisabled}
                      isToolTip={true}
                      tooltipmsg={tooltip["ConditionApplicableTo"]}
                    />
                  </div>
                )}
                <div className="col-md-3">
                  <FrmSelect
                    title={<>Duration of approval (in years)</>}
                    name={"DurationofApproval"}
                    value={formfield.DurationofApproval}
                    handleChange={handleSelectChange}
                    isRequired={
                      isEditMode && userroles.isapprover ? true : false
                    }
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmDurationOpts}
                    isdisabled={isfrmdisabled || isdurationdisabled}
                    isToolTip={true}
                    tooltipmsg={tooltip["DurationofApproval"]}
                  />
                </div>
              </div>
              <div className="row ">
                <div className="col-md-12">
                  <FrmRichTextEditor
                    title={
                      "Underwriter granting empowerment comments / condition"
                    }
                    name={"UnderwriterGrantingEmpowermentComments"}
                    value={
                      formfield.UnderwriterGrantingEmpowermentComments
                        ? formfield.UnderwriterGrantingEmpowermentComments
                        : formIntialState.UnderwriterGrantingEmpowermentComments
                    }
                    handleChange={handleSelectChange}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isdisabled={
                      isfrmdisabled ||
                      isstatusdisabled ||
                      formfield.RequestForEmpowermentStatus ===
                        rfelog_status.Pending
                    }
                    isToolTip={true}
                    tooltipmsg={
                      tooltip["UnderwriterGrantingEmpowermentComments"]
                    }
                  />
                </div>
              </div>
              <div className="row border-bottom">
                <div className="col-md-3">
                  <FrmDatePicker
                    title={
                      "Date of reception of information needed by approver"
                    }
                    name={"ReceptionInformationDate"}
                    value={formfield.ReceptionInformationDate}
                    type={"date"}
                    handleChange={handleDateSelectChange}
                    isRequired={false}
                    isReadMode={isReadMode}
                    minDate={""}
                    maxDate={moment().toDate()}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isdisabled={
                      isfrmdisabled ||
                      isstatusdisabled ||
                      formfield.RequestForEmpowermentStatus ===
                        rfelog_status.Pending
                    }
                  />
                </div>
                <div className="col-md-3">
                  <FrmDatePicker
                    title={"Date of response"}
                    titlelinespace={true}
                    name={"ResponseDate"}
                    value={formfield.ResponseDate}
                    type={"date"}
                    handleChange={handleDateSelectChange}
                    isRequired={false}
                    isReadMode={isReadMode}
                    minDate={moment(
                      formfield.ReceptionInformationDate
                    ).toDate()}
                    maxDate={moment().toDate()}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isdisabled={
                      isfrmdisabled ||
                      isstatusdisabled ||
                      formfield.RequestForEmpowermentStatus ===
                        rfelog_status.Pending
                    }
                  />
                </div>
              </div>
            </div>
                  */}
              <div class="frm-field-bggray">
                <div className="row ">
                  <div className="col-md-6">
                    <FrmFileUpload
                      title={"Upload Attachment"}
                      name={"FullFilePath"}
                      uploadedfiles={formfield?.RFEAttachmentList}
                      value={""}
                      type={""}
                      handleFileUpload={handleFileUpload}
                      handleFileDelete={handleFileDelete}
                      isRequired={false}
                      isReadMode={isReadMode}
                      isShowDelete={
                        (!isReadMode && !formfield?.IsSubmit) ||
                        (!isReadMode && userProfile.isAdminGroup)
                      }
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isshowloading={
                        fileuploadloader ? fileuploadloader : false
                      }
                      isdisabled={isfrmdisabled}
                      downloadfile={downloadfile}
                    />
                  </div>
                </div>
              </div>
              {isEditMode || isReadMode ? (
                <div className="row mb20 border-top pt10">
                  <div className="col-md-3">
                    <label>Created by</label>
                    <br></br>
                    {formfield?.CreatorName}
                  </div>
                  <div className="col-md-3">
                    <label>Created Date</label>
                    <br></br>
                    {formfield?.CreatedDate
                      ? formatDate(formfield?.CreatedDate)
                      : ""}
                  </div>
                  <div className="col-md-3">
                    <label>Modified By</label>
                    <br></br>
                    {formfield?.LastModifiorName}
                  </div>
                  <div className="col-md-3">
                    <label>Modified Date</label>
                    <br></br>
                    {formfield?.ModifiedDate
                      ? formatDate(formfield?.ModifiedDate)
                      : ""}
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          </form>
        </div>
      )}

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
            <div className={`btn-blue`} onClick={() => hidePopup()}>
              Cancel
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {isshowlocallink ? (
        <Rfelocallog
          title={"My Country Quick Links"}
          locallinks={locallinks}
          hidePopup={hidelogPopup}
          openLocalLink={openLocalLink}
        />
      ) : (
        ""
      )}
      {showApprover ? (
        <PeoplePickerPopup
          title={"Underwriter Granting Empowerment"}
          name={"UnderwriterGrantingEmpowerment"}
          usertype="approver"
          actionResponsible={
            formfield.UnderwriterGrantingEmpowerment
              ? [...formfield.UnderwriterGrantingEmpowermentAD]
              : []
          }
          assignPeoplepikerUser={assignPeoplepikerUser}
          hideAddPopup={hidePeoplePickerPopup}
          lobId={formfield.LOBId}
        />
      ) : (
        ""
      )}
      {showCCUser ? (
        <PeoplePickerPopup
          title={"Empowerment CC"}
          name={"RequestForEmpowermentCC"}
          usertype="ccuser"
          actionResponsible={
            formfield.RequestForEmpowermentCC
              ? [...formfield.RequestForEmpowermentCCAD]
              : []
          }
          assignPeoplepikerUser={assignPeoplepikerUser}
          hideAddPopup={hidePeoplePickerPopup}
        />
      ) : (
        ""
      )}
      {showUnderwriter ? (
        <PeoplePickerPopup
          title={"Underwriter"}
          name={"Underwriter"}
          usertype="underwriter"
          actionResponsible={
            formfield.Underwriter ? [formfield.UnderwriterAD] : []
          }
          assignPeoplepikerUser={assignPeoplepikerUser}
          hideAddPopup={hidePeoplePickerPopup}
          singleSelection={true}
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
  getAllUsers: userActions.getAllUsers,
  getLookupByType: lookupActions.getLookupByType,
  getallLocalLinks: rfelogActions.getallLocalLinks,
  getToolTip: commonActions.getToolTip,
  getAlllob: lobActions.getAlllob,
  getAllCountry: countryActions.getAllCountry,
  getAllSublob: sublobActions.getAllSublob,
  uploadFile: commonActions.uploadFile,
  deleteFile: commonActions.deleteFile,
  downloadFile: commonActions.downloadFile,
  getLogFields: commonActions.getLogFields,
  getAllUsers: userActions.getAllUsers,
  getAllSegment: segmentActions.getAllSegment,
  getAllCurrency: currencyActions.getAllCurrency,
  getAllBranch: branchActions.getAllBranch,
  getMultiUserProfile: userprofileActions.getMultiUserProfile,
  getAllPolicyAccounts: rfelogActions.getAllPolicyAccounts,
  getPolicyTermId: rfelogActions.getPolicyTermId,
};
export default connect(mapStateToProp, mapActions)(AddEditForm);
