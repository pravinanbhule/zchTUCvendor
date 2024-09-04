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
import AppLocale from "../../IngProvider";
import moment from "moment";
import { Prompt } from "react-router-dom";
import { isNotEmptyValue } from "../../helpers";
import { formfieldsmapping } from "./Rfelogconstants";
import { isEmptyObjectKeys } from "../../helpers";
import Dropdown from "react-dropdown";
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
import { handlePermission } from "../../permissions/Permission";
import Pagination from "../common-components/pagination/Pagination";
import RfELinkedPopupDetails from "./RfELinkedPopupDetails";
import ConfirmPopup from "../common-components/confirmpopup/ConfirmPopup";

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
    isDraft,
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
    getLanguageDetails,
    uploadFile,
    deleteFile,
    downloadFile,
    getLogFields,
    userProfile,
    queryparam,
    handleDataVersion,
    sellogTabType,
    linkedLogLogs,
    referenceLog,
    getById,
    setInAddMode,
    isFlow3,
    linkSpecificDetails
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
  const [countryReasons, setCountryReasons] = useState([]);
  const [referralReasonLevel2Option, setReferralReasonLevel2Option] = useState([]);
  const [referralReasonLevel3Option, setReferralReasonLevel3Option] = useState([]);
  const [referralReasonLevel4Option, setReferralReasonLevel4Option] = useState([]);
  const [referralReasonLevel5Option, setReferralReasonLevel5Option] = useState([]);
  const [frmrfeempourmentglobal, setfrmrfeempourmentglobal] = useState([]);
  const [frmstatus, setfrmstatus] = useState([]);
  const [popupFrmStatus, setPopupFrmStatus] = useState([]);
  const [tooltip, settooltip] = useState({});

  const [frmSegmentOpts, setfrmSegmentOpts] = useState([]);
  const [frmSegmentOptsAll, setfrmSegmentOptsAll] = useState([]);
  const [frmBranchOpts, setfrmBranchOpts] = useState([]);
  const [frmBranchOptsAll, setfrmBranchOptsAll] = useState([]);
  const [frmCurrencyOpts, setfrmCurrencyOpts] = useState([]);
  const [policyaccountOpts, setpolicyaccountOpts] = useState([]);
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
    isCountrySuperAdmin: false,
    isDualRole: false,
    isLoBAdmin: false,
    isGlobalUW: false
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
  const [mandatoryFields, setmandatoryFields] = useState([]);
  const [LATAMMandatoryFields, setLATAMMandatoryFields] = useState([
    "CustomerSegment",
    "NewRenewal",
    "GWP",
  ]);
  const [fileuploadloader, setfileuploadloader] = useState(false);

  const [loading, setloading] = useState(true);
  const [languageDetails, setLanguageDetails] = useState([
    { label: "German", value: "DE001" },
    { label: "English", value: "EN001" },
  ]);
  const [selectedlanguage, setSelectedlanguage] = useState();
  const [isGermany, setIsGermany] = useState(false);
  const [showTextBox, setShowTextBox] = useState(false);
  const [buttonsDisable, setButtonsDisable] = useState(true);
  const [showButtons, setShowButtons] = useState(false);
  const [reasonfields, setReasonfields] = useState({
    ReferralReasonLevel2:
      (isEditMode || isReadMode || isDraft) &&
      formIntialState?.ReferralReasonLevel2
        ? true
        : false,
    ReferralReasonLevel3:
      (isEditMode || isReadMode || isDraft) &&
      formIntialState?.ReferralReasonLevel3
        ? true
        : false,
    ReferralReasonLevel4:
      (isEditMode || isReadMode || isDraft) &&
      formIntialState?.ReferralReasonLevel4
        ? true
        : false,
    ReferralReasonLevel5:
      (isEditMode || isReadMode || isDraft) &&
      formIntialState?.ReferralReasonLevel5
        ? true
        : false,
  });
  const [segmentAccount, setSegmentAccount] = useState([
    "personallines",
    "middlemarket",
    "smallbusiness",
  ]);
  const [accountNumberShow, setAccountNumberShow] = useState(false);
  const [reasonOtherValue, setReasonOtherValue] = useState(
    "others(indiesemfallbitteimkommentardenrfegrundeingeben)"
  );
  const [reasonOtherValueUK, setReasonOtherValueUK] = useState(
    "others"
  );
  const [selectedApprover, setSelectedApprover] = useState('')

  useEffect(async () => {
    const language = await getLanguageDetails();
    let objLanguage = [];
    language.filter((item) => {
      objLanguage.push({
        label: item.languageName,
        value: item.languageCode,
      });
    });
    if (userProfile?.profileCountryName === "Germany") {
      setSelectedlanguage({ label: "German", value: "DE001" });
    } else {
      setSelectedlanguage({ label: "English", value: "EN001" });
    }
    setLanguageDetails(objLanguage);
  }, []);

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
        formIntialState.Underwriter.toLowerCase().indexOf(userProfile.emailAddress.toLowerCase()) !== -1
      ) {
        tempuserroles.isunderwriter = true;
      }
      if (
        formIntialState.UnderwriterGrantingEmpowerment &&
        formIntialState.UnderwriterGrantingEmpowerment.toLowerCase().indexOf(userProfile.emailAddress.toLowerCase()) !== -1
      ) {
        tempuserroles.isapprover = true;
      }
      if (
        formIntialState.RequestForEmpowermentCC &&
        formIntialState.RequestForEmpowermentCC.toLowerCase().indexOf(userProfile.emailAddress.toLowerCase()) !== -1
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
  }, [formIntialState]);

  useEffect(() => {
    if (userroles.isroleloaded) {
      fnOnInit();
    }
  }, [userroles]);

  const fnOnInit = async () => {
    let tempopts = [];
    let tempcountryItems = [];
    // getAllSegment({ logType: "rfelogs" });
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
      getLookupByType({
        LookupType: "RFEEmpowermentReasonRequest",
      }),
      getLookupByType({ LookupType: "RFEEmpowermentStatusRequest" }),
      getLookupByType({ LookupType: "RFELogNewRenewal" }),
      getToolTip({ type: "RFELogs" }),
      getLookupByType({
        LookupType: "RFEEmpowermentReasonRequest",
        IncountryFlag: formIntialState?.IncountryFlag
          ? formIntialState.IncountryFlag
          : "",
      }),
      //getLookupByType({ LookupType: "RFEEmpowermentReasonRequestUK" }),
    ]);
    //tempcountryItems = await getAllCountry();
    tempcountryItems = dbvalues[0];
    let regions = [];
    let countrycode = [];
    tempcountryItems.forEach((item) => {
      if (
        isEditMode ||
        isReadMode ||
        isDraft ||
        formIntialState.CountryList.length
      ) {
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

      if (formIntialState.CountryId?.indexOf(item.countryID) !== -1) {
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
    let temprfeempourmentcountry = dbvalues[10];
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
    if (IncountryFlag !== IncountryFlagConst.GERMANY) {
      tempopts.sort(dynamicSort("label"));
    }
    temprfeempourment = [...tempopts];
    
    tempopts = [];
    temprfeempourmentcountry.forEach((item) => {
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
    if (IncountryFlag !== IncountryFlagConst.GERMANY) {
      tempopts.sort(dynamicSort("label"));
    }
    temprfeempourmentcountry = [...tempopts];

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
    let popupstatus = [];
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
      popupstatus.push({
        label: item.lookUpValue,
        value: item.lookupID,
      })
    });

    setfrmorgnizationalalignment([...temporgnizationalalignment]);
    setfrmrfechz([selectInitiVal, ...temprfechz]);
    setfrmrfeempourment([selectInitiVal, ...temprfeempourmentcountry]);
    setCountryReasons([...temprfeempourmentcountry]);
    setfrmrfeempourmentglobal([selectInitiVal, ...temprfeempourment]);
    //setfrmrfeempourmentuk([selectInitiVal, ...temprfeempourmentuk]);
    setfrmstatus([...frmstatus]);
    setPopupFrmStatus([...popupstatus])

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
        setUserApproverRole(tmpapprover?.userRoles[0], tmpapprover);
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
      if (tempIds !== false) {
        setpolicyTermIds([...tempIds]);
      }
    }
    setloading(false);
  };
  useEffect(() => {
    if (IncountryFlag !== undefined) {
      const fnonIncountryFlagChange = async () => {
        // if (IncountryFlag === IncountryFlagConst.LATAM) {
        //   if (frmBranchOpts.length > 1) {
        //     setmandatoryFields([
        //       ...initialMandotoryFields,
        //       ...LATAMMandatoryFields,
        //       "Branch",
        //     ]);
        //   } else {
        //     setmandatoryFields([
        //       ...initialMandotoryFields,
        //       ...LATAMMandatoryFields,
        //     ]);
        //   }
        // } else {
        //   setmandatoryFields([...initialMandotoryFields]);
        // }
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
          if (IncountryFlag !== IncountryFlagConst.GERMANY) {
            tempopts.sort(dynamicSort("label"));
          }
          temprfeempourment = [...tempopts];
          setfrmrfeempourment([selectInitiVal, ...temprfeempourment]);
          setCountryReasons([...temprfeempourment]);
          if (formfield.RequestForEmpowermentReason) {
            // const isPresent = temprfeempourment.filter(
            //   (item) => item.value === formfield.RequestForEmpowermentReason
            // );
            // if (!isPresent?.length) {
            setformfield({ ...formfield, RequestForEmpowermentReason: "" });
            // }
          }
        } else {
          setfrmrfeempourment([...frmrfeempourmentglobal]);
          if (formfield.RequestForEmpowermentReason) {
            // const isPresent = frmrfeempourmentglobal.filter(
            //   (item) => item.value === formfield.RequestForEmpowermentReason
            // );
            // if (!isPresent?.length) {
            setformfield({ ...formfield, RequestForEmpowermentReason: "" });
            // }
          }
        }
        fnloadcountryview();
      };
      fnonIncountryFlagChange();
    }
  }, [IncountryFlag]);

  useEffect(async () => {
    localStorage.setItem(
      "language",
      selectedlanguage?.value ? selectedlanguage.value : "EN001"
    );
    if (selectedlanguage?.value) {
      fnloadcountryview();
      let tempToolTips = await getToolTip({
        type: "RFELogs",
        LanguageCode: selectedlanguage?.value,
      });
      let tooltipObj = {};
      tempToolTips.forEach((item) => {
        tooltipObj[item.toolTipField] = item.toolTipText;
      });
      settooltip(tooltipObj);
    }
  }, [selectedlanguage]);

  const [isFirst, setIsFirst] = useState(true);

  const fnloadcountryview = async () => {
    if ((isEditMode || isReadMode) && isFirst && (IncountryFlag === IncountryFlagConst.GERMANY || IncountryFlag === IncountryFlagConst.UK)) {
      setIsFirst(false);
    }
    if (!isFirst) {
      handleResetGermany();
    } 
    if (!isEditMode && !isReadMode) {
      handleResetGermany();
    }
    const tempdbfields = await getLogFields({
      IncountryFlag: IncountryFlag,
      FieldType: "Form",
      LanguageCode: selectedlanguage?.value,
    });
    setmandatoryFields([]);
    if (IncountryFlag === IncountryFlagConst.GERMANY) {
      let newFields = tempdbfields;
      let index = newFields.findIndex(
        (item) => item.fieldName === "CustomerSegment"
      );
      let AccountNumber = newFields.filter(
        (item) => item.fieldName === "AccountNumber"
      );
      for (let i = 0; i < newFields.length; i++) {
        if (newFields[i]?.fieldName === "GWP") {
          newFields[i].isMandatory = false;
        }
        if (newFields[i]?.fieldName === "CustomerSegment") {
          newFields.splice(index + 1, 0, AccountNumber[0]);
        } else if (
          newFields[i]?.fieldName === "AccountNumber" &&
          newFields[i - 1]?.fieldName !== "CustomerSegment"
        ) {
          newFields.splice(i, 1);
        }
      }
    }
    if (
      formIntialState?.CountryName === "Germany" &&
      (isEditMode || isReadMode || isDraft) &&
      segmentAccount.includes(
        formIntialState?.CustomerSegmentValue?.toLowerCase().replace(/\s/g, "")
      )
    ) {
      setAccountNumberShow(true);
    }
    let tempfields = [];
    tempdbfields?.forEach((item) => {
      if (item.isActive) {
        if (item.isMandatory) {
          setmandatoryFields((mandatoryFields) => [
            ...mandatoryFields,
            item.fieldName,
          ]);
        }
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
            ismandatory: item.isMandatory,
          };
          if (item.fieldName === "RequestForEmpowermentReason") {
            tempobj = {
              ...tempobj,
              isAddButton:
                formIntialState.ReferralReasonLevel2 ||
                (formfield.ReferralReasonLevel2 !== null &&
                  formfield.ReferralReasonLevel2 !== "" &&
                  formfield.ReferralReasonLevel2 !== undefined)
                  ? false
                  : true,
            };
            if (isEditMode || isReadMode || isDraft) {
              handleReasonOptions(
                "RequestForEmpowermentReason",
                formIntialState.RequestForEmpowermentReason
              );
            }
          }
          if (item.fieldName === "ReferralReasonLevel2") {
            tempobj = {
              ...tempobj,
              isAddButton:
                formIntialState.ReferralReasonLevel3 ||
                (formfield.ReferralReasonLevel3 !== null &&
                  formfield.ReferralReasonLevel3 !== "" &&
                  formfield.ReferralReasonLevel3 !== undefined)
                  ? false
                  : true,
              titlelinespace:
                selectedlanguage?.value === "DE001" ? false : true,
              colspan:
                (formIntialState?.RequestForEmpowermentReasonValue?.toLowerCase().replace(
                  /\s/g,
                  ""
                ) === reasonOtherValue ||
                formIntialState?.RequestForEmpowermentReasonValue?.toLowerCase().replace(
                  /\s/g,
                  ""
                ) === reasonOtherValueUK)
                  ? 0
                  : formIntialState.ReferralReasonLevel2 ||
                    (formfield.ReferralReasonLevel2 !== null &&
                      formfield.ReferralReasonLevel2 !== "" &&
                      formfield.ReferralReasonLevel2 !== undefined)
                  ? 3
                  : 0,
            };
            if (isEditMode || isReadMode || isDraft) {
              handleReasonOptions2(
                "ReferralReasonLevel2",
                formIntialState?.ReferralReasonLevel2
              );
            }
          }
          if (item.fieldName === "ReferralReasonLevel3") {
            tempobj = {
              ...tempobj,
              isAddButton: IncountryFlag === IncountryFlagConst.GERMANY ? false :
              formIntialState.ReferralReasonLevel4 ||
              (formfield.ReferralReasonLevel4 !== null &&
                formfield.ReferralReasonLevel4 !== "" &&
                formfield.ReferralReasonLevel4 !== undefined)
                ? false
                : true,
              titlelinespace:
                selectedlanguage?.value === "DE001" ? false : true,
              colspan:
              (formIntialState?.RequestForEmpowermentReasonValue?.toLowerCase().replace(
                /\s/g,
                ""
              ) === reasonOtherValue ||
              formIntialState?.RequestForEmpowermentReasonValue?.toLowerCase().replace(
                /\s/g,
                ""
              ) === reasonOtherValueUK)
                  ? 0
                  : formIntialState.ReferralReasonLevel3 ||
                    (formfield.ReferralReasonLevel3 !== null &&
                      formfield.ReferralReasonLevel3 !== "" &&
                      formfield.ReferralReasonLevel3 !== undefined)
                  ? 3
                  : 0,
            };
            if (isEditMode || isReadMode || isDraft) {
              handleReasonOptions3(
                "ReferralReasonLevel3",
                formIntialState?.ReferralReasonLevel3
              );
            }
          }
          if (item.fieldName === "ReferralReasonLevel4") {
            tempobj = {
              ...tempobj,
              isAddButton: formIntialState.ReferralReasonLevel5 ||
              (formfield.ReferralReasonLevel5 !== null &&
                formfield.ReferralReasonLevel5 !== "" &&
                formfield.ReferralReasonLevel5 !== undefined)
                ? false
                : true,
              titlelinespace:
                selectedlanguage?.value === "DE001" ? false : true,
              colspan:
              (formIntialState?.RequestForEmpowermentReasonValue?.toLowerCase().replace(
                /\s/g,
                ""
              ) === reasonOtherValue ||
              formIntialState?.RequestForEmpowermentReasonValue?.toLowerCase().replace(
                /\s/g,
                ""
              ) === reasonOtherValueUK)
                  ? 0
                  : formIntialState.ReferralReasonLevel4 ||
                    (formfield.ReferralReasonLevel4 !== null &&
                      formfield.ReferralReasonLevel4 !== "" &&
                      formfield.ReferralReasonLevel4 !== undefined)
                  ? 3
                  : 0,
            };
            if (isEditMode || isReadMode || isDraft) {
              handleReasonOptions4(
                "ReferralReasonLevel4",
                formIntialState?.ReferralReasonLevel4
              );
            }
          }
          if (item.fieldName === "ReferralReasonLevel5") {
            tempobj = {
              ...tempobj,
              isAddButton: false,
              titlelinespace:
                selectedlanguage?.value === "DE001" ? false : true,
              colspan:
              (formIntialState?.RequestForEmpowermentReasonValue?.toLowerCase().replace(
                /\s/g,
                ""
              ) === reasonOtherValue ||
              formIntialState?.RequestForEmpowermentReasonValue?.toLowerCase().replace(
                /\s/g,
                ""
              ) === reasonOtherValueUK)
                  ? 0
                  : formIntialState.ReferralReasonLevel5 ||
                    (formfield.ReferralReasonLevel5 !== null &&
                      formfield.ReferralReasonLevel5 !== "" &&
                      formfield.ReferralReasonLevel5 !== undefined)
                  ? 3
                  : 0,
            };
            if (isEditMode || isReadMode || isDraft) {
              handleReasonOptions5(
                "ReferralReasonLevel5",
                formIntialState?.ReferralReasonLevel5
              );
            }
          }
          if (item.fieldName === "SUBLOBID") {
            tempobj = {
              ...tempobj,
              colspan: formIntialState.SUBLOBID || frmSublob.length > 1 ? 3 : 0,
            };
          }
          if (item.fieldName === "AccountNumber") {
            tempobj = {
              ...tempobj,
              colspan:
                formIntialState.AccountNumber || accountNumberShow ? 3 : 0,
            };
          }
          if (item.fieldName === "CustomerSegment") {
            tempobj = {
              ...tempobj,
              titlelinespace:
                selectedlanguage?.value === "DE001" && window.innerWidth < 1488
                  ? true
                  : false,
            };
          }
          if (item.fieldName === "NewRenewal") {
            tempobj = {
              ...tempobj,
              titlelinespace:
                selectedlanguage?.value === "DE001" && window.innerWidth < 1488
                  ? true
                  : false,
            };
          }
          if (item.fieldName === "GWP") {
            tempobj = {
              ...tempobj,
              titlelinespace:
                selectedlanguage?.value === "DE001" && window.innerWidth < 1488
                  ? true
                  : false,
            };
          }
          if (item.fieldName === "ZurichShare") {
            tempobj = {
              ...tempobj,
              titlelinespace:
                selectedlanguage?.value === "DE001" && window.innerWidth < 1488
                  ? true
                  : false,
            };
          }
          if (item.fieldName === "ConditionApplicableTo") {
            tempobj = {
              ...tempobj,
              titlelinespace: window.innerWidth < 1488 ? true : false,
            };
          }
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
        // let tempAccObj = {};
        // Array.isArray(tempAccounts) &&
        //   tempAccounts?.forEach((iteam) => {
        //     // if (isNaN(iteam.charAt(0))) {
        //     if (tempAccObj[iteam.charAt(0).toLowerCase()]) {
        //       tempAccObj[iteam.charAt(0).toLowerCase()].push(iteam);
        //     } else {
        //       tempAccObj[iteam.charAt(0).toLowerCase()] = [];
        //       tempAccObj[iteam.charAt(0).toLowerCase()].push(iteam);
        //     }
        //     //}
        // });
        // setpolicyaccountOpts({ ...tempAccObj });
        setpolicyaccountOpts([...tempAccounts]);
        setfrmAccountOpts([...tempAccounts]);
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
  }, [formfield.AccountName, formfield.countryCode, formfield.mappedLOBs, loading]);

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
    // if (
    //   name === "OrganizationalAlignment" &&
    //   value === OrganizationalAlignment.country
    // ) {
    //   setisfrmdisabled(true);
    //   // showlogPopup();
    //   // alert(alertMessage.rfelog.orgalignmetmsg);
    // } else if (
    //   name === "OrganizationalAlignment" &&
    //   value !== OrganizationalAlignment.country
    // ) {
    //   setisfrmdisabled(false);
    //   // hidelogPopup();
    // }
    setformfield({ ...formfield, isdirty: true, [name]: value });
  };

  useEffect(() => {
    if (IncountryFlag !== IncountryFlagConst.GERMANY) {
      setIsGermany(false);
      setShowTextBox(false);
      setShowButtons(false);
      setButtonsDisable(true);
    } 
    if (IncountryFlag === IncountryFlagConst.GERMANY) {
      setIsGermany(true);
      getAllSegment({ logType: "rfelogsGermany" });
      if (
        formIntialState?.RequestForEmpowermentReasonValue?.toLowerCase().replace(
          /\s/g,
          ""
        ) !== reasonOtherValue &&
        formIntialState.RequestForEmpowermentReason !== ""
      ) {
        setShowButtons(true);
        setButtonsDisable(false);
      }
      if (
        formIntialState?.RequestForEmpowermentReasonValue?.toLowerCase().replace(
          /\s/g,
          ""
        ) === reasonOtherValue
      ) {
        setShowButtons(false);
        setButtonsDisable(true);
        setShowTextBox(true);
      }
      if (
        formIntialState?.RequestForEmpowermentReason === "" ||
        formIntialState.RequestForEmpowermentReason === undefined
      ) {
        setShowButtons(true);
        setButtonsDisable(true);
      }
    } 
    if (IncountryFlag === IncountryFlagConst.UK) {
      if ( formIntialState?.RequestForEmpowermentReasonValue?.toLowerCase().replace(
          /\s/g,
          ""
        ) !== reasonOtherValueUK &&
        formIntialState.RequestForEmpowermentReason !== "") {
        setShowButtons(true);
        setButtonsDisable(false);
      }
      if (
        formIntialState?.RequestForEmpowermentReasonValue?.toLowerCase().replace(
          /\s/g,
          ""
        ) === reasonOtherValueUK
      ) {
        setShowButtons(false);
        setButtonsDisable(true);
        setShowTextBox(true);
      }
      if (
        formIntialState?.RequestForEmpowermentReason === "" ||
        formIntialState.RequestForEmpowermentReason === undefined
      ) {
        setShowButtons(true);
        setButtonsDisable(true);
      }
    }
    if (
      IncountryFlag !== undefined &&
      IncountryFlag !== IncountryFlagConst.GERMANY
    ) {
      getAllSegment({ logType: "rfelogs" });
    }
  }, [IncountryFlag]);

  const handleMultiDropdown = (value, name) => {
    
    if (name === "RequestForEmpowermentReason") {
      setReasonfields({
        ...reasonfields,
        ReferralReasonLevel2: true,
      });
      setButtonsDisable(true);
      formdomfields.filter((item) =>
        item.name === "RequestForEmpowermentReason"
          ? (item.isAddButton = false)
          : item.name === "ReferralReasonLevel2"
          ? (item.colspan = 3, item.isAddButton = (reasonfields.ReferralReasonLevel3 === false ? true : false))
          : (item.colspan = item.colspan)
      );
    } else if (name === "ReferralReasonLevel2") {
      setReasonfields({
        ...reasonfields,
        ReferralReasonLevel3: true,
      });
      formdomfields.filter((item) =>
        item.name === "ReferralReasonLevel2"
          ? (item.isAddButton = false)
          : item.name === "ReferralReasonLevel3"
          ? (item.colspan = 3, item.isAddButton = (IncountryFlag === IncountryFlagConst.UK && reasonfields.ReferralReasonLevel4 === false ? true : false))
          : (item.colspan = item.colspan)
      );
      setButtonsDisable(true);
    } else if (name === "ReferralReasonLevel3" && IncountryFlag === IncountryFlagConst.UK) {
      setReasonfields({
        ...reasonfields,
        ReferralReasonLevel4: true,
      });
      formdomfields.filter((item) =>
        item.name === "ReferralReasonLevel3"
          ? (item.isAddButton = false)
          : item.name === "ReferralReasonLevel4"
          ? (item.colspan = 3, item.isAddButton = (reasonfields.ReferralReasonLevel5 === false ? true : false))
          : (item.colspan = item.colspan)
      );
      setButtonsDisable(true);
    } else if (name === "ReferralReasonLevel4" && IncountryFlag === IncountryFlagConst.UK) {
      setReasonfields({
        ...reasonfields,
        ReferralReasonLevel5: true,
      });
      formdomfields.filter((item) =>
        item.name === "ReferralReasonLevel4"
          ? (item.isAddButton = false)
          : item.name === "ReferralReasonLevel5"
          ? (item.colspan = 3)
          : (item.colspan = item.colspan)
      );
    }
  };

  const handleReasonOptions = (name, value) => {
    if (
      (isEditMode || isReadMode || isDraft) &&
      formIntialState.ReferralReasonLevel2
    ) {
      setReasonfields({
        ...reasonfields,
        ReferralReasonLevel2: true,
      });
    }
    if (
      (isEditMode || isReadMode || isDraft) &&
      formIntialState.ReferralReasonLevel3
    ) {
      setReasonfields({
        ...reasonfields,
        ReferralReasonLevel3: true,
      });
    }
    const Options = countryReasons;
    let ReasonOption = Options.filter(
      (item) => {
        if ((IncountryFlag === IncountryFlagConst.GERMANY ?
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValue :
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValueUK) &&
          item.value !== value &&
          item.value !== formfield.ReferralReasonLevel3 &&
          item.value !== formfield.ReferralReasonLevel4 &&
          item.value !== formfield.ReferralReasonLevel5 &&
          item.value !== formIntialState.ReferralReasonLevel3 &&
          item.value !== formIntialState.ReferralReasonLevel4 &&
          item.value !== formIntialState.ReferralReasonLevel5
        ) {
          return item;
        }
      }
    )
    let ReasonOption1 = Options.filter(
      (item) => {
        if ((IncountryFlag === IncountryFlagConst.GERMANY ?
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValue :
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValueUK) &&
          item.value !== value &&
          item.value !== formfield.ReferralReasonLevel2 &&
          item.value !== formfield.ReferralReasonLevel4 &&
          item.value !== formfield.ReferralReasonLevel5 &&
          item.value !== formIntialState.ReferralReasonLevel2 &&
          item.value !== formIntialState.ReferralReasonLevel4 &&
          item.value !== formIntialState.ReferralReasonLevel5
        ) {
          return item;
        }
      }
    );
    let ReasonOption2 = Options.filter(
      (item) => {
        if ((IncountryFlag === IncountryFlagConst.GERMANY ?
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValue :
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValueUK) &&
          item.value !== value &&
          item.value !== formfield.ReferralReasonLevel2 &&
          item.value !== formfield.ReferralReasonLevel3 &&
          item.value !== formfield.ReferralReasonLevel5 &&
          item.value !== formIntialState.ReferralReasonLevel2 &&
          item.value !== formIntialState.ReferralReasonLevel3 &&
          item.value !== formIntialState.ReferralReasonLevel5
        ) {
          return item;
        }
      }
    );
    let ReasonOption3 = Options.filter(
      (item) => {
        if ((IncountryFlag === IncountryFlagConst.GERMANY ?
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValue :
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValueUK) &&
          item.value !== value &&
          item.value !== formfield.ReferralReasonLevel2 &&
          item.value !== formfield.ReferralReasonLevel3 &&
          item.value !== formfield.ReferralReasonLevel4 &&
          item.value !== formIntialState.ReferralReasonLevel2 &&
          item.value !== formIntialState.ReferralReasonLevel3 &&
          item.value !== formIntialState.ReferralReasonLevel4
        ) {
          return item;
        }
      }
    );
    setReferralReasonLevel2Option([selectInitiVal, ...ReasonOption]);
    setReferralReasonLevel3Option([selectInitiVal, ...ReasonOption1]);
    setReferralReasonLevel4Option([selectInitiVal, ...ReasonOption2]);
    setReferralReasonLevel5Option([selectInitiVal, ...ReasonOption3]);
  };
  const handleReasonOptions2 = (name, value) => {
    if (
      (isEditMode || isReadMode || isDraft) &&
      formIntialState.ReferralReasonLevel2
    ) {
      setReasonfields({
        ...reasonfields,
        ReferralReasonLevel2: true,
      });
    }
    if (
      (isEditMode || isReadMode || isDraft) &&
      formIntialState.ReferralReasonLevel3
    ) {
      setReasonfields({
        ...reasonfields,
        ReferralReasonLevel3: true,
      });
    }
    if (
      (isEditMode || isReadMode || isDraft) &&
      formIntialState.ReferralReasonLevel4
    ) {
      setReasonfields({
        ...reasonfields,
        ReferralReasonLevel4: true,
      });
    }
    if (
      (isEditMode || isReadMode || isDraft) &&
      formIntialState.ReferralReasonLevel5
    ) {
      setReasonfields({
        ...reasonfields,
        ReferralReasonLevel5: true,
      });
    }
    const Options = countryReasons;
    let ReasonOption = Options.filter(
      (item) => {
        if (item.value !== value &&
          item.value !== formfield.ReferralReasonLevel3 &&
          item.value !== formfield.ReferralReasonLevel4 &&
          item.value !== formfield.ReferralReasonLevel5 &&
          item.value !== formIntialState.ReferralReasonLevel3 &&
          item.value !== formIntialState.ReferralReasonLevel4 &&
          item.value !== formIntialState.ReferralReasonLevel5
        ) {
          return item;
        }
      }
    );
    let ReasonOption1 = Options.filter(
      (item) => {
        if ((IncountryFlag === IncountryFlagConst.GERMANY ?
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValue :
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValueUK) &&
          item.value !== value &&
          item.value !== formfield.RequestForEmpowermentReason &&
          item.value !== formfield.ReferralReasonLevel4 &&
          item.value !== formfield.ReferralReasonLevel5 &&
          item.value !== formIntialState.RequestForEmpowermentReason &&
          item.value !== formIntialState.ReferralReasonLevel4 &&
          item.value !== formIntialState.ReferralReasonLevel5
        ) {
          return item;
        }
      }
    );
    let ReasonOption2 = Options.filter(
      (item) => {
        if ((IncountryFlag === IncountryFlagConst.GERMANY ?
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValue :
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValueUK) &&
          item.value !== value &&
          item.value !== formfield.RequestForEmpowermentReason &&
          item.value !== formfield.ReferralReasonLevel3 &&
          item.value !== formfield.ReferralReasonLevel5 &&
          item.value !== formIntialState.RequestForEmpowermentReason &&
          item.value !== formIntialState.ReferralReasonLevel3 &&
          item.value !== formIntialState.ReferralReasonLevel5
        ) {
          return item;
        }
      }
    );
    let ReasonOption3 = Options.filter(
      (item) => {
        if ((IncountryFlag === IncountryFlagConst.GERMANY ?
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValue :
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValueUK) &&
          item.value !== value &&
          item.value !== formfield.RequestForEmpowermentReason &&
          item.value !== formfield.ReferralReasonLevel3 &&
          item.value !== formfield.ReferralReasonLevel4 &&
          item.value !== formIntialState.RequestForEmpowermentReason &&
          item.value !== formIntialState.ReferralReasonLevel3 &&
          item.value !== formIntialState.ReferralReasonLevel4

        ) {
          return item;
        }
      }
    );
    setfrmrfeempourment([selectInitiVal, ...ReasonOption]);
    setReferralReasonLevel3Option([selectInitiVal, ...ReasonOption1]);
    setReferralReasonLevel4Option([selectInitiVal, ...ReasonOption2]);
    setReferralReasonLevel5Option([selectInitiVal, ...ReasonOption3]);
  };
  const handleReasonOptions3 = (name, value) => {
    const Options = countryReasons;
    let ReasonOption = Options.filter(
      (item) => {
        if (
          item.value !== value &&
          item.value !== formfield.ReferralReasonLevel2 &&
          item.value !== formfield.ReferralReasonLevel4 &&
          item.value !== formfield.ReferralReasonLevel5 &&
          item.value !== formIntialState.ReferralReasonLevel2 &&
          item.value !== formIntialState.ReferralReasonLevel4 &&
          item.value !== formIntialState.ReferralReasonLevel5
        ) {
          return item;
        }
      }
    );
    let ReasonOption1 = Options.filter(
      (item) => {
        if ((IncountryFlag === IncountryFlagConst.GERMANY ?
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValue :
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValueUK) &&
          item.value !== value &&
          item.value !== formfield.RequestForEmpowermentReason &&
          item.value !== formfield.ReferralReasonLevel4 &&
          item.value !== formfield.ReferralReasonLevel5 &&
          item.value !== formIntialState.RequestForEmpowermentReason &&
          item.value !== formIntialState.ReferralReasonLevel4 &&
          item.value !== formIntialState.ReferralReasonLevel5
        ) {
          return item;
        }
      }
    );
    let ReasonOption2 = Options.filter(
      (item) => {
        if ((IncountryFlag === IncountryFlagConst.GERMANY ?
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValue :
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValueUK) &&
          item.value !== value &&
          item.value !== formfield.RequestForEmpowermentReason &&
          item.value !== formfield.ReferralReasonLevel2 &&
          item.value !== formfield.ReferralReasonLevel5 &&
          item.value !== formIntialState.RequestForEmpowermentReason &&
          item.value !== formIntialState.ReferralReasonLevel2 &&
          item.value !== formIntialState.ReferralReasonLevel5
        ) {
          return item;
        }
      }
    );
    let ReasonOption3 = Options.filter(
      (item) => {
        if ((IncountryFlag === IncountryFlagConst.GERMANY ?
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValue :
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValueUK) &&
          item.value !== value &&
          item.value !== formfield.RequestForEmpowermentReason &&
          item.value !== formfield.ReferralReasonLevel2 &&
          item.value !== formfield.ReferralReasonLevel4 &&
          item.value !== formIntialState.RequestForEmpowermentReason &&
          item.value !== formIntialState.ReferralReasonLevel2 &&
          item.value !== formIntialState.ReferralReasonLevel4
        ) {
          return item;
        }
      }
    );
    setfrmrfeempourment([selectInitiVal, ...ReasonOption]);
    setReferralReasonLevel2Option([selectInitiVal, ...ReasonOption1]);
    setReferralReasonLevel4Option([selectInitiVal, ...ReasonOption2]);
    setReferralReasonLevel5Option([selectInitiVal, ...ReasonOption3]);
  };

  const handleReasonOptions4 = (name, value) => {
    const Options = countryReasons;
    let ReasonOption = Options.filter(
      (item) => {
        if (
          item.value !== value &&
          item.value !== formfield.ReferralReasonLevel2 &&
          item.value !== formfield.ReferralReasonLevel3 &&
          item.value !== formfield.ReferralReasonLevel5 &&
          item.value !== formIntialState.ReferralReasonLevel2 &&
          item.value !== formIntialState.ReferralReasonLevel3 &&
          item.value !== formIntialState.ReferralReasonLevel5
        ) {
          return item;
        }
      }
    );
    let ReasonOption1 = Options.filter(
      (item) => {
        if ((IncountryFlag === IncountryFlagConst.GERMANY ?
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValue :
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValueUK) &&
          item.value !== value &&
          item.value !== formfield.RequestForEmpowermentReason &&
          item.value !== formfield.ReferralReasonLevel3 &&
          item.value !== formfield.ReferralReasonLevel5 &&
          item.value !== formIntialState.RequestForEmpowermentReason &&
          item.value !== formIntialState.ReferralReasonLevel3 &&
          item.value !== formIntialState.ReferralReasonLevel5
        ) {
          return item;
        }
      }
    );
    let ReasonOption2 = Options.filter(
      (item) => {
        if ((IncountryFlag === IncountryFlagConst.GERMANY ?
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValue :
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValueUK) &&
          item.value !== value &&
          item.value !== formfield.RequestForEmpowermentReason &&
          item.value !== formfield.ReferralReasonLevel2 &&
          item.value !== formfield.ReferralReasonLevel5 &&
          item.value !== formIntialState.RequestForEmpowermentReason &&
          item.value !== formIntialState.ReferralReasonLevel2 &&
          item.value !== formIntialState.ReferralReasonLevel5
        ) {
          return item;
        }
      }
    );
    let ReasonOption3 = Options.filter(
      (item) => {
        if ((IncountryFlag === IncountryFlagConst.GERMANY ?
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValue :
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValueUK) &&
          item.value !== value &&
          item.value !== formfield.RequestForEmpowermentReason &&
          item.value !== formfield.ReferralReasonLevel2 &&
          item.value !== formfield.ReferralReasonLevel3 &&
          item.value !== formIntialState.RequestForEmpowermentReason &&
          item.value !== formIntialState.ReferralReasonLevel2 &&
          item.value !== formIntialState.ReferralReasonLevel3
        ) {
          return item;
        }
      }
    );
    setfrmrfeempourment([selectInitiVal, ...ReasonOption]);
    setReferralReasonLevel2Option([selectInitiVal, ...ReasonOption1]);
    setReferralReasonLevel3Option([selectInitiVal, ...ReasonOption2]);
    setReferralReasonLevel5Option([selectInitiVal, ...ReasonOption3]);
  };

  const handleReasonOptions5 = (name, value) => {
    const Options = countryReasons;
    let ReasonOption = Options.filter(
      (item) => {
        if (
          item.value !== value &&
          item.value !== formfield.ReferralReasonLevel2 &&
          item.value !== formfield.ReferralReasonLevel3 &&
          item.value !== formfield.ReferralReasonLevel4 &&
          item.value !== formIntialState.ReferralReasonLevel2 &&
          item.value !== formIntialState.ReferralReasonLevel3 &&
          item.value !== formIntialState.ReferralReasonLevel4
        ) {
          return item;
        }
      }
    );
    let ReasonOption1 = Options.filter(
      (item) => {
        if ((IncountryFlag === IncountryFlagConst.GERMANY ?
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValue :
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValueUK) &&
          item.value !== value &&
          item.value !== formfield.RequestForEmpowermentReason &&
          item.value !== formfield.ReferralReasonLevel3 &&
          item.value !== formfield.ReferralReasonLevel4 &&
          item.value !== formIntialState.RequestForEmpowermentReason &&
          item.value !== formIntialState.ReferralReasonLevel3 &&
          item.value !== formIntialState.ReferralReasonLevel4
        ) {
          return item;
        }
      }
    );
    let ReasonOption2 = Options.filter(
      (item) => {
        if ((IncountryFlag === IncountryFlagConst.GERMANY ?
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValue :
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValueUK) &&
          item.value !== value &&
          item.value !== formfield.RequestForEmpowermentReason &&
          item.value !== formfield.ReferralReasonLevel2 &&
          item.value !== formfield.ReferralReasonLevel4 &&
          item.value !== formIntialState.RequestForEmpowermentReason &&
          item.value !== formIntialState.ReferralReasonLevel2 &&
          item.value !== formIntialState.ReferralReasonLevel4
        ) {
          return item;
        }
      }
    );
    let ReasonOption3 = Options.filter(
      (item) => {
        if ((IncountryFlag === IncountryFlagConst.GERMANY ?
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValue :
          item.label.toLowerCase().replace(/\s/g, "") !== reasonOtherValueUK) &&
          item.value !== value &&
          item.value !== formfield.RequestForEmpowermentReason &&
          item.value !== formfield.ReferralReasonLevel2 &&
          item.value !== formfield.ReferralReasonLevel3 &&
          item.value !== formIntialState.RequestForEmpowermentReason &&
          item.value !== formIntialState.ReferralReasonLevel2 &&
          item.value !== formIntialState.ReferralReasonLevel3
        ) {
          return item;
        }
      }
    );
    setfrmrfeempourment([selectInitiVal, ...ReasonOption]);
    setReferralReasonLevel2Option([selectInitiVal, ...ReasonOption1]);
    setReferralReasonLevel3Option([selectInitiVal, ...ReasonOption2]);
    setReferralReasonLevel4Option([selectInitiVal, ...ReasonOption3]);
  };

  const handleSelectChange = (name, value, fieldName, label) => {
    let SelectedLabel = "";
    if (
      label &&
      (name === "RequestForEmpowermentReason" || name === "CustomerSegment")
    ) {
      SelectedLabel = label.toLowerCase().replace(/\s/g, "");
    }
    // handleReasonOptionsData(name, value, fieldName, label)
    if (name === "RequestForEmpowermentReason") {
      handleReasonOptions(name, value);
    }
    if (name === "ReferralReasonLevel2") {
      handleReasonOptions2(name, value);
    }
    if (name === "ReferralReasonLevel3") {
      handleReasonOptions3(name, value);
    }
    if (name === "ReferralReasonLevel4") {
      handleReasonOptions4(name, value);
    }
    if (name === "ReferralReasonLevel5") {
      handleReasonOptions5(name, value);
    }
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
      if (sublobopts?.length > 0) {
        formdomfields.filter((item) =>
          item.name === "SUBLOBID"
            ? (item.colspan = 3)
            : (item.colspan = item.colspan)
        );
      } else {
        formdomfields.filter((item) =>
          item.name === "SUBLOBID"
            ? (item.colspan = 0)
            : (item.colspan = item.colspan)
        );
      }
    } else if (name === "LOBId" && value === "") {
      setfrmSublob([]);
    } else if (name === "RequestForEmpowermentReason" && value === "") {
      formdomfields.filter((item, i) =>
        item.name === "RequestForEmpowermentReason" &&
        formdomfields[i + 1]?.colspan !== 3
          ? (item.isAddButton = true)
          : (item.colspan = item.colspan)
      );
      delete formfield.OtherReferralReason;
      setShowTextBox(false);
      setShowButtons(true);
      setButtonsDisable(true);
      setformfield({
        ...formfield,
        isdirty: true,
        [name]: value,
      });
    } else if (
      name === "RequestForEmpowermentReason" &&
      (SelectedLabel === reasonOtherValue || SelectedLabel === reasonOtherValueUK)
    ) {
      setShowTextBox(true);
      setShowButtons(false);
      setReasonfields({
        ...reasonfields,
        ReferralReasonLevel2: false,
        ReferralReasonLevel3: false,
        ReferralReasonLevel4: false,
        ReferralReasonLevel5: false,
      });
      delete formIntialState.ReferralReasonLevel2;
      delete formIntialState.ReferralReasonLevel3;
      delete formIntialState.ReferralReasonLevel4;
      delete formIntialState.ReferralReasonLevel5;
      formdomfields.filter((item) =>
        item.name === "RequestForEmpowermentReason"
          ? (item.isAddButton = true)
          : item.name === "ReferralReasonLevel2"
          ? (item.colspan = 0)
          : item.name === "ReferralReasonLevel3"
          ? (item.colspan = 0)
          : item.name === "ReferralReasonLevel4"
          ? (item.colspan = 0)
          : item.name === "ReferralReasonLevel5"
          ? (item.colspan = 0)
          : (item.colspan = item.colspan)
      );
      setformfield({
        ...formfield,
        ReferralReasonLevel2: null,
        ReferralReasonLevel3: null,
        ReferralReasonLevel4: null,
        ReferralReasonLevel5: null,
        isdirty: true,
        [name]: value,
      });
    } else if (
      name === "RequestForEmpowermentReason" &&
      fieldName === "Textboxvalue"
    ) {
      setformfield({
        ...formfield,
        isdirty: true,
        OtherReferralReason: value,
      });
    } else if (
      name === "RequestForEmpowermentReason" &&
      ((SelectedLabel !== reasonOtherValue || value !== "") ||
        (SelectedLabel !== reasonOtherValueUK || value !== ""))
    ) {
      formdomfields.filter((item, i) =>
        item.name === "RequestForEmpowermentReason" &&
        formdomfields[i + 1]?.colspan !== 3
          ? (item.isAddButton = true)
          : (item.colspan = item.colspan)
      );
      setShowTextBox(false);
      setShowButtons(true);
      setButtonsDisable(false);
      delete formIntialState?.RequestForEmpowermentReasonValue;
      setformfield({
        ...formfield,
        OtherReferralReason: null,
        RequestForEmpowermentReasonValue: null,
        isdirty: true,
        [name]: value,
      });
    } else if (
      name === "CustomerSegment" &&
      !segmentAccount.includes(SelectedLabel)
    ) {
      formdomfields.filter((item) =>
        item.name === "AccountNumber"
          ? (item.colspan = 0)
          : (item.colspan = item.colspan)
      );
      setAccountNumberShow(false);
      setformfield({
        ...formfield,
        AccountNumber: null,
        isdirty: true,
        [name]: value,
      });
    } else if (
      name === "CustomerSegment" &&
      segmentAccount.includes(SelectedLabel)
    ) {
      formdomfields.filter((item) =>
        item.name === "AccountNumber"
          ? (item.colspan = 3)
          : (item.colspan = item.colspan)
      );
      setAccountNumberShow(true);
      setformfield({
        ...formfield,
        isdirty: true,
        [name]: value,
      });
    } else if (name === "ReferralReasonLevel2" && value === "") {
      setButtonsDisable(true);
      setformfield({
        ...formfield,
        isdirty: true,
        [name]: value,
      });
    } else if (name === "ReferralReasonLevel2" && value !== "") {
      setButtonsDisable(false);
      setformfield({
        ...formfield,
        isdirty: true,
        [name]: value,
      });
    } else if (name === "ReferralReasonLevel3" && value === "" && IncountryFlag === IncountryFlagConst.UK) {
      setButtonsDisable(true);
      setformfield({
        ...formfield,
        isdirty: true,
        [name]: value,
      });
    } else if (name === "ReferralReasonLevel3" && value !== "" && IncountryFlag === IncountryFlagConst.UK) {
      setButtonsDisable(false);
      setformfield({
        ...formfield,
        isdirty: true,
        [name]: value,
      });
    } else if (name === "ReferralReasonLevel4" && value === "" && IncountryFlag === IncountryFlagConst.UK) {
      setButtonsDisable(true);
      setformfield({
        ...formfield,
        isdirty: true,
        [name]: value,
      });
    } else if (name === "ReferralReasonLevel4" && value !== "" && IncountryFlag === IncountryFlagConst.UK) {
      setButtonsDisable(false);
      setformfield({
        ...formfield,
        isdirty: true,
        [name]: value,
      });
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
      // setReasonfields({
      //   ...reasonfields,
      //   ReferralReasonLevel2: false,
      //   ReferralReasonLevel3: false,
      //   ReferralReasonLevel4: false,
      //   ReferralReasonLevel5: false,
      // });
      // setAccountNumberShow(false);
      // setButtonsDisable(true);
      // delete formIntialState.RequestForEmpowermentReason;
      // delete formIntialState.ReferralReasonLevel2;
      // delete formIntialState.ReferralReasonLevel3;
      // delete formIntialState.ReferralReasonLevel4;
      // delete formIntialState.ReferralReasonLevel5;
      // delete formIntialState.AccountNumber;
      // delete formIntialState.CustomerSegment;
      setformfield({
        ...formfield,
        // RequestForEmpowermentReason: null,
        // ReferralReasonLevel2: null,
        // ReferralReasonLevel3: null,
        // ReferralReasonLevel4: null,
        // ReferralReasonLevel5: null,
        // CustomerSegment: null,
        // AccountNumber: null,
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
  const handleResetGermany = () => {
    if (IncountryFlag === IncountryFlagConst.UK || IncountryFlag === IncountryFlagConst.GERMANY) {
      if (selectedlanguage?.value === "DE001") {
        formdomfields.filter((item) =>
          item.name === "ReferralReasonLevel2"
            ? (item.titlelinespace = false)
            : item.name === "ReferralReasonLevel3"
            ? (item.titlelinespace = false)
            : item.name === "ReferralReasonLevel4"
            ? (item.titlelinespace = false)
            : item.name === "ReferralReasonLevel5"
            ? (item.titlelinespace = false)
            : item.name === "AccountNumber" && accountNumberShow && IncountryFlag === IncountryFlagConst.GERMANY
            ? (item.colspan = 3)
            : (item.colspan = item.colspan)
        );
      } else {
        formdomfields.filter((item) =>
          item.name === "ReferralReasonLevel2"
            ? (item.titlelinespace = true)
            : item.name === "ReferralReasonLevel3"
            ? (item.titlelinespace = true)
            : item.name === "ReferralReasonLevel4"
            ? (item.titlelinespace = true)
            : item.name === "ReferralReasonLevel5"
            ? (item.titlelinespace = true)
            : item.name === "AccountNumber" && accountNumberShow && IncountryFlag === IncountryFlagConst.GERMANY
            ? (item.colspan = 3)
            : (item.colspan = item.colspan)
        );
      }
      if (IncountryFlag === IncountryFlagConst.GERMANY) {
        delete formIntialState.ReferralReasonLevel4;
        delete formIntialState.ReferralReasonLevel5;
      }
      setReasonfields({
        ...reasonfields,
        ReferralReasonLevel2: !(formfield.ReferralReasonLevel2 === "" ||
          formfield.ReferralReasonLevel2 === null ||
          formfield.ReferralReasonLevel2 === undefined),
        ReferralReasonLevel3: !(formfield.ReferralReasonLevel3 === "" ||
          formfield.ReferralReasonLevel3 === null ||
          formfield.ReferralReasonLevel3 === undefined),
        ReferralReasonLevel4: !(formfield.ReferralReasonLevel4 === "" ||
          formfield.ReferralReasonLevel4 === null ||
          formfield.ReferralReasonLevel4 === undefined),
        ReferralReasonLevel5: !(formfield.ReferralReasonLevel5 === "" ||
          formfield.ReferralReasonLevel5 === null ||
          formfield.ReferralReasonLevel5 === undefined),
      });
    } else {
      setReasonfields({
        ...reasonfields,
        ReferralReasonLevel2: false,
        ReferralReasonLevel3: false,
        ReferralReasonLevel4: false,
        ReferralReasonLevel5: false,
      });
      setAccountNumberShow(false);
      setButtonsDisable(true);
      delete formIntialState.RequestForEmpowermentReason;
      delete formIntialState.ReferralReasonLevel2;
      delete formIntialState.ReferralReasonLevel3;
      delete formIntialState.ReferralReasonLevel4;
      delete formIntialState.ReferralReasonLevel5;
      delete formIntialState.AccountNumber;
      delete formIntialState.CustomerSegment;
      setformfield({
        ...formfield,
        RequestForEmpowermentReason: null,
        ReferralReasonLevel2: null,
        ReferralReasonLevel3: null,
        ReferralReasonLevel4: null,
        ReferralReasonLevel5: null,
        CustomerSegment: null,
        AccountNumber: null,
      });
    }
  }
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
        setUserApproverRole(tmpapprover?.userRoles[0], tmpapprover);
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
  const setUserApproverRole = (userRole, userInfo) => {
    setSelectedApprover(userInfo)
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
    } else if (userRole.roleId === USER_ROLE.countrySuperAdmin) {
      setapproverRole({ ...approverIntialRole, isCountrySuperAdmin: true });
    } else if (userRole.roleId === USER_ROLE.dualRole) {
      setapproverRole({ ...approverIntialRole, isDualRole: true });
    } else if (userRole.roleId === USER_ROLE.lobAdmin) {
      setapproverRole({ ...approverIntialRole, isLoBAdmin: true });
    } else if (userRole.roleId === USER_ROLE.globalUW) {
      setapproverRole({ ...approverIntialRole, isGlobalUW: true });
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
      let isIndiacountry = true;
      let isChinacountry = true;
      let isHongKongcountry = true;
      let isMalaysiacountry = true;
      let isFrancecountry = true;
      let isMiddleEastcountry = true;
      let isGermanycountry = true;
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
        if (item.value === IncountryIds.INDIA) {
          isIndiacountry = isIndiacountry ? true : false;
        } else {
          isIndiacountry = false;
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
        if (item.value === IncountryIds.GERMANY) {
          isGermanycountry = isGermanycountry ? true : false;
        } else {
          isGermanycountry = false;
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
        } else if (approverRole.isCountryAdmin || approverRole.isNormalUser || approverRole.isCountrySuperAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.LATAM);
        } else if (approverRole.isDualRole) {
          handleAlignmentForDualRole(IncountryFlagConst.LATAM)
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
          approverRole.isNormalUser ||
          approverRole.isDualRole || 
          approverRole.isCountrySuperAdmin
        )
      ) {
        if (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser || 
          approverRole.isCountrySuperAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.UK);
        } else if (approverRole.isDualRole) {
          handleAlignmentForDualRole(IncountryFlagConst.UK)
        }
      } else if (
        isSingaporecountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser ||
          approverRole.isDualRole || 
          approverRole.isCountrySuperAdmin
        )
      ) {
        if (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser || 
          approverRole.isCountrySuperAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.SINGAPORE);
        } else if (approverRole.isDualRole) {
          handleAlignmentForDualRole(IncountryFlagConst.SINGAPORE)
        }
      } else if (
        isIndiacountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser ||
          approverRole.isDualRole || 
          approverRole.isCountrySuperAdmin
        )
      ) {
        if (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser || 
          approverRole.isCountrySuperAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.INDIA);
        } else if (approverRole.isDualRole) {
          handleAlignmentForDualRole(IncountryFlagConst.INDIA)
        }
      } else if (
        isChinacountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser ||
          approverRole.isDualRole || 
          approverRole.isCountrySuperAdmin
        )
      ) {
        if (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser || 
          approverRole.isCountrySuperAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.CHINA);
        } else if (approverRole.isDualRole) {
          handleAlignmentForDualRole(IncountryFlagConst.CHINA)
        }
      } else if (
        isHongKongcountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser ||
          approverRole.isDualRole || 
          approverRole.isCountrySuperAdmin
        )
      ) {
        if (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser || 
          approverRole.isCountrySuperAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.HONGKONG);
        } else if (approverRole.isDualRole) {
          handleAlignmentForDualRole(IncountryFlagConst.HONGKONG)
        }
      } else if (
        isMalaysiacountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser ||
          approverRole.isDualRole || 
          approverRole.isCountrySuperAdmin
        )
      ) {
        if (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser || 
          approverRole.isCountrySuperAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.MALAYSIA);
        } else if (approverRole.isDualRole) {
          handleAlignmentForDualRole(IncountryFlagConst.MALAYSIA)
        }
      } else if (
        isFrancecountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser ||
          approverRole.isDualRole || 
          approverRole.isCountrySuperAdmin
        )
      ) {
        if (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser || 
          approverRole.isCountrySuperAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.FRANCE);
        } else if (approverRole.isDualRole) {
          handleAlignmentForDualRole(IncountryFlagConst.FRANCE)
        }
      } else if (
        isMiddleEastcountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser ||
          approverRole.isDualRole || 
          approverRole.isCountrySuperAdmin
        )
      ) {
        if (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser || 
          approverRole.isCountrySuperAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.MIDDLEEAST);
        } else if (approverRole.isDualRole) {
          handleAlignmentForDualRole(IncountryFlagConst.MIDDLEEAST)
        }
      } else if (
        isGermanycountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser ||
          approverRole.isDualRole || 
          approverRole.isCountrySuperAdmin
        )
      ) {
        if (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser || 
          approverRole.isCountrySuperAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.GERMANY);
        } else if (approverRole.isDualRole) {
          handleAlignmentForDualRole(IncountryFlagConst.GERMANY)
        }
      } else if (
        isSpaincountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser ||
          approverRole.isDualRole || 
          approverRole.isCountrySuperAdmin
        )
      ) {
        if (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser || 
          approverRole.isCountrySuperAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.SPAIN);
        } else if (approverRole.isDualRole) {
          handleAlignmentForDualRole(IncountryFlagConst.SPAIN)
        }
      } else if (
        isItalycountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser ||
          approverRole.isDualRole || 
          approverRole.isCountrySuperAdmin
        )
      ) {
        if (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser || 
          approverRole.isCountrySuperAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.ITALY);
        } else if (approverRole.isDualRole) {
          handleAlignmentForDualRole(IncountryFlagConst.ITALY)
        }
      } else if ( 
        isBeneluxcountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser ||
          approverRole.isDualRole || 
          approverRole.isCountrySuperAdmin
        )
      ) {
        if (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser || 
          approverRole.isCountrySuperAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.BENELUX);
        } else if (approverRole.isDualRole) {
          handleAlignmentForDualRole(IncountryFlagConst.BENELUX)
        }
      } else if (
        isNordiccountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser ||
          approverRole.isDualRole || 
          approverRole.isCountrySuperAdmin
        )
      ) {
        if (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser || 
          approverRole.isCountrySuperAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.NORDIC);
        } else if (approverRole.isDualRole) {
          handleAlignmentForDualRole(IncountryFlagConst.NORDIC)
        }
      } else if (
        isAustraliacountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser ||
          approverRole.isDualRole || 
          approverRole.isCountrySuperAdmin
        )
      ) {
        if (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser || 
          approverRole.isCountrySuperAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.AUSTRALIA);
        } else if (approverRole.isDualRole) {
          handleAlignmentForDualRole(IncountryFlagConst.AUSTRALIA)
        }
      } else if (
        isIndonesiacountry &&
        (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser ||
          approverRole.isDualRole || 
          approverRole.isCountrySuperAdmin
        )
      ) {
        if (approverRole.isRegionAdmin ||
          approverRole.isCountryAdmin ||
          approverRole.isNormalUser || 
          approverRole.isCountrySuperAdmin) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: approverRole.isRegionAdmin
            ? OrganizationalAlignment.region
            : OrganizationalAlignment.country,
          });
          setIncountryFlag(IncountryFlagConst.INDONESIA);
        } else if (approverRole.isDualRole) {
          handleAlignmentForDualRole(IncountryFlagConst.INDONESIA)
        }
      } else {
        if (approverRole.isDualRole) {
          handleAlignmentForDualRole("")
        }
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

  // useEffect(async()=>{
  //   if (formfield?.UnderwriterGrantingEmpowerment && formfield?.CountryList && approverRole.isDualRole) {

  //   }
  // },[
  //   formfield?.UnderwriterGrantingEmpowerment,
  //   frmselectedRegion,
  //   formfield?.CountryList
  // ])

  const handleAlignmentForDualRole = async(flag) => {
    let dualRoleList = await getLookupByType({ LookupType: "DualRole" })
    let dualRoleType = dualRoleList.filter((item, i) => item.lookupID === selectedApprover.dualRole)?.[0]?.lookUpValue
    let dualRoleCountryList = selectedApprover?.dualRoleCountry?.split(',')
    let dualRoleRegionList = selectedApprover?.dualRoleRegion?.split(',')
    let selectedCountryList = []
    let selctedCountryRegionList = ""
    let isOneRegion = true
    formfield?.CountryList.map((item, i) => {
      selectedCountryList.push(item.value)
      if (selctedCountryRegionList) {
        isOneRegion = selctedCountryRegionList === item.regionId ? true : false;  
      }
      selctedCountryRegionList = item.regionId
    })
    if (formfield?.CountryList?.length === 1) {
      if (dualRoleType === 'Global-Country') {
        if (dualRoleCountryList.includes(selectedCountryList[0])) {
          setformfield({
            ...formfield,
            OrganizationalAlignment: OrganizationalAlignment.country,
          });  
          setIncountryFlag(flag)
        } 
      }
    }
    if (dualRoleType === 'Global-Regional') {
      if (dualRoleRegionList.includes(selctedCountryRegionList) && isOneRegion) {
        setformfield({
          ...formfield,
          OrganizationalAlignment: OrganizationalAlignment.region,
        });  
        setIncountryFlag(flag)
      }
    }
    if (dualRoleType === 'Global-Regional-Country' || dualRoleType === "Regional-Country") {
      let countryselected = false
      if (isOneRegion) {
        dualRoleCountryList.map((item, i) => {
          selectedCountryList.map((value, j) => {
            if (item === value) {
              countryselected = true
            }
          })
        })
      }
      if (formfield?.CountryList?.length === 1 && countryselected) {
        setformfield({
          ...formfield,
          OrganizationalAlignment: OrganizationalAlignment.country,
        });  
        setIncountryFlag(flag)
      } else if (dualRoleRegionList.includes(selctedCountryRegionList) && isOneRegion) {
        setformfield({
          ...formfield,
          OrganizationalAlignment: OrganizationalAlignment.region,
        }); 
        setIncountryFlag(flag) 
      }
    }
  }

  // Linked RfEs 
  const [selctedTab, setSelectedTab] = useState('rfelog')
  const [showLinkedPopup, setShowLinkedPopup] = useState(false);
  const [showReferenceBtn, setShowReferenceBtn] = useState(false);
  const [showConfirmationMsg, setShowConfirmationMsg] = useState(false)
  const [isConfirmedCreate, setIsConfirmedCreate] = useState(false)
  const [referenceRfEId, setReferenceRfEId] = useState("");
  const [linkedPopupDetails, setLinkedPopupDetails] = useState({})
  const [entryNumberRfE, setEntryNumberRfE] = useState('')
  const [specificDetails, setSpecificDetails] = useState(linkSpecificDetails)
  const [logTypes, setlogTypes] = useState([
    {
      label: "RfE Log",
      value: "rfelog",
    },
    {
      label: "Linked RfEs",
      value: "linkedrfes",
    }
  ]);
  const [paginationdata, setpaginationdata] = useState([]);
  const [isLodaing, setIsLoading] = useState(false);
  const [resonForReference, setResonForReference] = useState([]);
  const [selSortFiled, setselSortFiled] = useState({
    name: "ModifiedDate",
    order: "desc",
  });
  const [linkedRfEId, setLinkedRfEId] = useState('')
  const handleChangeTab = (value) => {
    setSelectedTab(value)
  }

  
  useEffect(async()=>{    
    if ((isReadMode || isEditMode) && formIntialState?.RFELogId) {
      setIsLoading(true);
      let response = await linkedLogLogs({rfeLogId: formIntialState.RFELogId });
      let linkedRfEId = response.filter((item) => item.entryNumber === formIntialState?.LinkedRFEEntryNumber);
      if (linkedRfEId.length > 0) {
        setLinkedRfEId(linkedRfEId[0]?.rfeLogId);
      }
      setpaginationdata(response);
      setIsLoading(false);
    }
  },[])

  const columns = [
    {
      dataField: "viewaction",
      text: "View",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="view-icon"
            onClick={() => handleViewLinkedRfE(row.rfeLogId)}
            rowid={row.rfeLogId}
            mode={"view"}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "40px",
          textAlign: "center",
        };
      },
    },
    // {
    //   dataField: "DataVersion",
    //   text: "Data Version",
    //   formatter: (cell, row, rowIndex, formatExtraData) => {
    //     return (
    //       <div
    //         className="versionhistory-icon"
    //         onClick={() => handleDataVersion(row.rfeLogId, row.isSubmit)}
    //         rowid={row.rfeLogId}
    //         mode={"view"}
    //       ></div>
    //     );
    //   },
    //   sort: false,
    //   headerStyle: (colum, colIndex) => {
    //     return {
    //       width: "70px",
    //       textAlign: "center",
    //     };
    //   },
    // },
    {
      dataField: "entryNumber",
      text: "RfE ID",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      },
    },
    {
      dataField: "accountName",
      text: "Account Name",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      },
    },
    {
      dataField: "countryName",
      text: "Country",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      },
    },
    {
      dataField: "regionName",
      text: "Region",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
  ];
  const defaultSorted = [
    {
      dataField: selSortFiled.name,
      order: selSortFiled.order,
    },
  ];
  const handleViewLinkedRfE = async(id) => {
    let response = await getById({
      rfeLogId: id,
    });
    if (response.FieldValues) {
      response = response.FieldValues;
      response.UnderwriterName = response.UnderwriterAD
          ? response.UnderwriterAD.userName
          : "";

      if (
          response.RequestForEmpowermentCCAD &&
          response.RequestForEmpowermentCCAD.length
      ) {
          let users = "";
          users = response.RequestForEmpowermentCCAD.map((item) => item.userName);
          response.RequestForEmpowermentCCName = users.join(",");
      }
      if (
          response.UnderwriterGrantingEmpowermentAD &&
          response.UnderwriterGrantingEmpowermentAD.length
      ) {
          let users = "";
          users = response.UnderwriterGrantingEmpowermentAD.map(
              (item) => item.userName
          );
          response.UnderwriterGrantingEmpowermentName = users.join(",");
      }
      let countryList = response.CountryList;
      countryList = countryList.map((country) => ({
          label: country.countryName,
          value: country.countryID,
          regionId: country.regionID,
      }));
      response["CountryList"] = [...countryList];
      setLinkedPopupDetails(response);
      setEntryNumberRfE(response.EntryNumber)
      await handleLinkedRfEReason(response?.IncountryFlag);
      setShowLinkedPopup(true);
    }
  }

  useEffect(()=>{
    if (!isEditMode && !isReadMode && !isFlow3 && formfield.AccountName && formfield.CountryList.length > 0 && formfield.LOBId) {
        const delayDebounceFn = setTimeout(() => {
          handleReferenceRfE();
        }, 2000)
  
        return () => clearTimeout(delayDebounceFn)
    }
  },[formfield.AccountName, formfield.CountryList, formfield.LOBId])

  useEffect(() => {
    if (isFlow3 === true) {
      handleCopyValueflow1()
    }
  }, [isFlow3])

  const handleReferenceRfE = async() =>{
    let selectedCountryItems = formfield?.CountryList?.map(
      (item) => item.value
    );
    let reqParam = {
      AccountName: formfield.AccountName,
      LOBId: formfield.LOBId,
      CountryId: selectedCountryItems?.join(",") 
    } 
  
    let response = await referenceLog(reqParam)
    if (response.length !== 0) {
      setEntryNumberRfE(response[0].entryNumber)
      setReferenceRfEId(response[0].rfeLogId)
      await handleLinkedRfEReason(response[0].incountryFlag);
      handleShowReferencebutton();
    }
  }

  const handleLinkedRfEReason = async(flag) => {
    let temprfeempourment = await getLookupByType({
      LookupType: "RFEEmpowermentReasonRequest",
      IncountryFlag: flag,
    });
    let tempopts = [];
    temprfeempourment.forEach((item) => {
        tempopts.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
    });
    if (flag !== IncountryFlagConst.GERMANY) {
      tempopts.sort(dynamicSort("label"));
    }
    temprfeempourment = [...tempopts];
    setResonForReference(temprfeempourment)
  }

  const handleShowReferencebutton = () => {
    setShowReferenceBtn(true)
  }

  const handleCopyValueflow1 = () => {
    setSelectedTab('rfelog')
    setLinkedRfEId(formIntialState.RFELogId)
    const referenceRfEData = {
      LinkedRFEEntryNumber: formIntialState.EntryNumber,
      EntryNumber: '',
      AccountName: formIntialState.AccountName,
      CountryList: formIntialState.CountryList,
      LOBId: formIntialState.LOBId,
      OrganizationalAlignment: "",
      RegionList: [],
      Underwriter: userProfile.emailAddress,
      UnderwriterName: userProfile.firstName + " " + userProfile.lastName,
      UnderwriterAD: {
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          userName: userProfile.firstName + " " + userProfile.lastName,
          emailAddress: userProfile.emailAddress,
      },
      CHZ: "",
      RequestForEmpowermentReason: "",
      RFELogDetails: "",
      UnderwriterGrantingEmpowerment: "",
      UnderwriterGrantingEmpowermentAD: [],
      UnderwriterGrantingEmpowermentName: "",
      RequestForEmpowermentCC: "",
      RequestForEmpowermentCCAD: [],
      RequestForEmpowermentCCName: "",
      RequestForEmpowermentStatus: "",
      RFEAttachmentList: [],
      ResponseDate: null,
      ReceptionInformationDate: null,
      UnderwriterGrantingEmpowermentComments: "",
      FullFilePath: "",
      IsSubmit: false,
      RFELogEmailLink: window.location.origin + '/rfelogs',
      isdirty: false,
      IsArchived: false,
      ConditionApplicableTo: "",
      DurationofApproval: "",
      Branch: "",
      CustomerSegment: "",
      NewRenewal: "",
      PolicyPeriod: "",
      Currency: "",
      Limit: "",
      GWP: "",
      ZurichShare: "",
      DecisionDate: null,
      IncountryFlag: "",
      SUBLOBID: "",
      mappedLOBs: "",
      PolicyTermId: "",
      invokedAPIFrom: "",
      ReferralReasonLevel2: null,
      ReferralReasonLevel3: null
    }
    setSpecificDetails(formIntialState.RFELogDetails)
    setInAddMode(referenceRfEData);
    setSelectedApprover('');
    setapproverRole({ ...approverIntialRole });
  }

  const handleCopyValueflow2 = () =>{
    setLinkedRfEId(linkedPopupDetails.RFELogId)
    setformfield({
      ...formfield,
      LinkedRFEEntryNumber: linkedPopupDetails.EntryNumber,
    });
    setSpecificDetails(linkedPopupDetails.RFELogDetails)
    setShowLinkedPopup(false);
  }

  const handleCopySpecificDetail = () => {
    setformfield({
      ...formfield,
      RFELogDetails: specificDetails
    });
  }

  const handleCloseLinkedPopup = () => {
    setLinkedPopupDetails({});
    setShowLinkedPopup(false);
  }

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
    for (let i = 0; i < mandatoryFields.length; i++) {
      const element = mandatoryFields[i];
      const keys = Object.keys(formfield)
      if (keys.includes(element) === false && isvalidated) {
          isvalidated = false;
      }
    }
    for (let key in formfield) {
      if (mandatoryFields.includes(key) && isvalidated) {
        let value = formfield[key];
        if (key === "RFELogDetails") {
          value = formfield[key]?.replace(/<\/?[^>]+(>|$)/g, "");
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
    let selectedCountryItems = formfield?.CountryList?.map(
      (item) => item.value
    );
    formfield.CountryId = selectedCountryItems?.join(",");
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
          putItem({
            ...formfield,
            IsSubmit: true,
            IncountryFlag: IncountryFlag,
          });
          setisfrmdisabled(true);
        } else {
          handleCheckPostRfE();
        }
      } else {
        alert(alertMessage.rfelog.invalidapprovermsg);
      }
    }
  };

  const handleConfirmed = (value) =>{
    if (value === 'yes') {
      setShowConfirmationMsg(false)
      postItem({
        ...formfield,
        IsSubmit: true,
        IncountryFlag: IncountryFlag,
      });
      setisfrmdisabled(true);
    } else if (value === 'no') {
      setShowConfirmationMsg(false)
      postItem({
        ...formfield,
        LinkedRFEEntryNumber: entryNumberRfE,
        IsSubmit: true,
        IncountryFlag: IncountryFlag,
      });
      setisfrmdisabled(true);
    }
  }

  const handleCheckPostRfE = () => {
    if (showReferenceBtn && (formfield?.LinkedRFEEntryNumber === undefined || formfield?.LinkedRFEEntryNumber === "")) {
      setShowConfirmationMsg(true)
    } else {
      postItem({
        ...formfield,
        IsSubmit: true,
        IncountryFlag: IncountryFlag,
      });
      setisfrmdisabled(true);
    }
  }

  const handleSaveLog = () => {
    if (isfrmdisabled) {
      return;
    }
    let selectedCountryItems = formfield.CountryList.map((item) => item.value);
    formfield.CountryId = selectedCountryItems.join(",");
    if (formfield?.LinkedRFEEntryNumber) {
      delete formfield?.LinkedRFEEntryNumber
    }
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
  const history = useHistory();
  const hidePopup = () => {
    let isconfirmed = true;
    if (formfield.isdirty) {
      isconfirmed = window.confirm(
        AppLocale[selectedlanguage?.value ? selectedlanguage.value : "EN001"]
          .messages["common.alert.promptmsg"]
      );
    }
    if (isconfirmed) {
      if (queryparam.id) {
        localStorage.removeItem("id");
        localStorage.removeItem("status");
        localStorage.removeItem("in-app");
        history.push("/rfelogs");
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
        tempelement = (
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
                isRequired={obj.ismandatory}
                validationmsg={
                  AppLocale[
                    selectedlanguage?.value ? selectedlanguage.value : "EN001"
                  ].messages["message.mandatory"]
                }
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
                validationmsg={
                  AppLocale[
                    selectedlanguage?.value ? selectedlanguage.value : "EN001"
                  ].messages["message.mandatory"]
                }
                issubmitted={issubmitted}
                isdisabled={isfrmdisabled}
                isToolTip={obj.tooltipmsg ? true : false}
                tooltipmsg={eval(obj.tooltipmsg)}
              />
            )}
          </div>
        );
        return obj.conditionaldisplay
          ? eval(obj.conditionaldisplay)
            ? tempelement
            : ""
          : tempelement;
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
              validationmsg={
                AppLocale[
                  selectedlanguage?.value ? selectedlanguage.value : "EN001"
                ].messages["message.mandatory"]
              }
              issubmitted={issubmitted}
              isdisabled={isfrmdisabled}
              isToolTip={obj.tooltipmsg ? true : false}
              tooltipmsg={eval(obj.tooltipmsg)}
              selectedlanguage={
                selectedlanguage?.value ? selectedlanguage?.value : "EN001"
              }
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
              titlelinespace={
                (obj.name === "ReferralReasonLevel2" ||
                  obj.name === "ReferralReasonLevel3" ||
                  obj.name === "ReferralReasonLevel4" ||
                  obj.name === "ReferralReasonLevel5") &&
                selectedlanguage?.value &&
                selectedlanguage?.value !== "EN001"
                  ? false
                  : obj.titlelinespace
                  ? true
                  : false
              }
              name={obj.name}
              value={formfield[obj.name]}
              handleChange={handleSelectChange}
              isRequired={
                mandatoryFields.includes(obj.name) 
                // ||
                // obj.name === "ReferralReasonLevel2" ||
                // obj.name === "ReferralReasonLevel3" ||
                // obj.name === "ReferralReasonLevel4" ||
                // obj.name === "ReferralReasonLevel5"
              }
              isReadMode={isReadMode}
              validationmsg={
                AppLocale[
                  selectedlanguage?.value ? selectedlanguage.value : "EN001"
                ].messages["message.mandatory"]
              }
              issubmitted={issubmitted}
              selectopts={eval(obj.options)}
              isdisabled={
                isfrmdisabled ||
                (obj.disablecondition && eval(obj.disablecondition))
              }
              isAddButton={
                (IncountryFlag === IncountryFlagConst.UK ||
                IncountryFlag === IncountryFlagConst.GERMANY) &&
                showButtons && obj.isAddButton === true
                  ? true
                  : false
              }
              isAddButtonDisable={buttonsDisable}
              handleClickButton={(value, name) =>
                handleMultiDropdown(value, name)
              }
              // isRemoveButton={obj.name === "ReferralReasonLevel2" || obj.name === "ReferralReasonLevel3" ? true : false}
              isToolTip={obj.tooltipmsg ? true : false}
              isShowTextBox={
                obj.name === "RequestForEmpowermentReason" &&
                showTextBox 
                // &&
                // isGermany
              }
              textValue={formfield.OtherReferralReason}
              tooltipmsg={eval(obj.tooltipmsg)}
              selectedlanguage={
                selectedlanguage?.value ? selectedlanguage?.value : "EN001"
              }
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
              isRequired={mandatoryFields.includes(obj.name) || obj.ismandatory}
              isReadMode={isReadMode}
              validationmsg={
                AppLocale[
                  selectedlanguage?.value ? selectedlanguage.value : "EN001"
                ].messages["message.mandatory"]
              }
              issubmitted={issubmitted}
              selectopts={eval(obj.options)}
              isdisabled={
                isfrmdisabled ||
                (obj.disablecondition && eval(obj.disablecondition))
              }
              isToolTip={obj.tooltipmsg ? true : false}
              tooltipmsg={eval(obj.tooltipmsg)}
              isAllOptNotRequired={true}
              selectedlanguage={
                selectedlanguage?.value ? selectedlanguage?.value : "EN001"
              }
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
                validationmsg={
                  AppLocale[
                    selectedlanguage?.value ? selectedlanguage.value : "EN001"
                  ].messages["message.mandatory"]
                }
                isToolTip={obj.tooltipmsg ? true : false}
                tooltipmsg={eval(obj.tooltipmsg)}
                issubmitted={issubmitted}
                selectopts={eval(obj.options)}
                isclickDisable={true}
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
                  isorgalignmentdisabled ||
                  obj.name === "OrganizationalAlignment"
                }
              />
            </div>
            {/* {formfield.OrganizationalAlignment ===
              OrganizationalAlignment.country && !IncountryFlag ? (
              <div className="col-md-3 btn-blue" onClick={showlogPopup}>
                Local country log
              </div>
            ) : (
              ""
            )} */}
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
                validationmsg={
                  AppLocale[
                    selectedlanguage?.value ? selectedlanguage.value : "EN001"
                  ].messages["message.mandatory"]
                }
                issubmitted={issubmitted}
                isdisabled={
                  isfrmdisabled ||
                  (obj.disablecondition && eval(obj.disablecondition))
                }
                isToolTip={obj.tooltipmsg ? true : false}
                tooltipmsg={eval(obj.tooltipmsg)}
                isRfEBtn={obj.name === "RFELogDetails" && specificDetails !== "" ? true : false}
                handleRfEBtnClick={handleCopySpecificDetail}
              />

              {obj.name === "RFELogDetails" && policyTermIds.length ? (
                <div className="row ">
                  <div className="col-md-12" style={{ padding: "10px" }}>
                    <table className="policyterms table-bordered">
                      <thead>
                        <th width="25%">
                          {
                            AppLocale[
                              selectedlanguage?.value
                                ? selectedlanguage.value
                                : "EN001"
                            ].messages["label.accountname"]
                          }
                        </th>
                        <th width="25%">
                          {
                            AppLocale[
                              selectedlanguage?.value
                                ? selectedlanguage.value
                                : "EN001"
                            ].messages["label.policytermid"]
                          }
                        </th>
                        <th width="17%">
                          {
                            AppLocale[
                              selectedlanguage?.value
                                ? selectedlanguage.value
                                : "EN001"
                            ].messages["label.productname"]
                          }
                        </th>
                        <th width="17%">
                          {
                            AppLocale[
                              selectedlanguage?.value
                                ? selectedlanguage.value
                                : "EN001"
                            ].messages["label.subproductname"]
                          }
                        </th>
                        <th>
                          {
                            AppLocale[
                              selectedlanguage?.value
                                ? selectedlanguage.value
                                : "EN001"
                            ].messages["label.dunsnumber"]
                          }
                        </th>
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
              validationmsg={
                AppLocale[
                  selectedlanguage?.value ? selectedlanguage.value : "EN001"
                ].messages["message.mandatory"]
              }
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

  return (loading || isLodaing) ? (
    <Loading />
  ) : (
    <div className="addedit-logs-container">
      <div className="addedit-header-container">
        <div className="addedit-header-title">
          {
            AppLocale[
              selectedlanguage?.value ? selectedlanguage.value : "EN001"
            ].messages[isReadMode ? "title.viewrfe" : "title.addeditrfe"]
          }
        </div>
        <div className="header-btn-container">
          {handlePermission("rfelogs", "isAdd") && sellogTabType === "all" &&
            formIntialState.RequestForEmpowermentStatus !== rfelog_status.Withdrawn &&
            !isEditMode &&
            isReadMode && (
            <div
              className="btn-blue plus-icon"
              onClick={() => handleCopyValueflow1()}
              style={{ marginRight: "10px" }}
            >
              {
                AppLocale[
                  selectedlanguage?.value ? selectedlanguage.value : "EN001"
                ].messages["button.add"]
              }
            </div>
          )}
          {formfield?.IsSubmit && (
            <div
              className={`btn-blue ${selctedTab === 'rfelog' ? '' : 'disable'}`}
              onClick={() =>
                handleDataVersion(formfield?.RFELogId, formfield?.IsSubmit)
              }
              style={{ marginRight: "10px" }}
            >
              {
                AppLocale[
                  selectedlanguage?.value ? selectedlanguage.value : "EN001"
                ].messages["button.versionhistory"]
              }
            </div>
          )}
          {handlePermission("rfelogs", "isEdit") &&
            !isEditMode &&
            isReadMode &&
            (!userroles.iscc || userroles.isadmin) && (
              <div
                className={`btn-blue ${selctedTab === 'rfelog' ? '' : 'disable'}`}
                onClick={() => setInEditMode()}
                style={{ marginRight: "10px" }}
              >
                {
                  AppLocale[
                    selectedlanguage?.value ? selectedlanguage.value : "EN001"
                  ].messages["button.edit"]
                }
              </div>
            )}
          {showReferenceBtn &&
            (
              <div
                className="addedit-close btn-blue"
                style={{ marginRight: "10px" }}
                onClick={() => handleViewLinkedRfE(referenceRfEId)}
              >
                {
                  AppLocale[
                    selectedlanguage?.value ? selectedlanguage.value : "EN001"
                  ].messages["button.referenceLog"]
                }
            </div>
            )
          }
          <div
            className="addedit-close btn-blue"
            style={{ marginRight: "10px" }}
            onClick={() => hidePopup()}
          >
            {
              AppLocale[
                selectedlanguage?.value ? selectedlanguage.value : "EN001"
              ].messages["button.back"]
            }
          </div>
          <div>
            <FrmSelect
              title={""}
              name={""}
              selectopts={languageDetails}
              handleChange={(e, value, id, label) =>
                setSelectedlanguage({ label: label, value: value })
              }
              value={
                selectedlanguage?.value
                  ? selectedlanguage.value
                  : { label: "English", value: "EN001" }
              }
              inlinetitle={true}
            />
          </div>
        </div>
      </div>
      {!isEditMode &&
        isReadMode && 
        sellogTabType === 'all' && (
          <div className="tabs-container">
          {logTypes.map((item) => (
            <div
            key={item.label}
            className={`tab-btn ${
              selctedTab === item.value
              ? "selected"
              : "normal"
            }`}
            onClick={() => handleChangeTab(item.value)}
            >
              {item.label}
            </div>
          ))}
        </div> 
        )
      }
      {!formdomfields.length ? (
        <Loading />
      ) : (
        <>
        {selctedTab === 'rfelog' ? (
          <div className="popup-formitems logs-form">
            <form onSubmit={handleSubmit} id="myForm">
              <>
                <Prompt
                  when={formIntialState?.isdirty ? true : false}
                  message={(location) =>
                    AppLocale[
                      selectedlanguage?.value ? selectedlanguage.value : "EN001"
                    ].messages["common.alert.promptmsg"]
                  }
                />
                <div className="frm-field-bggray">
                  <div className="row">
                    {isNotEmptyValue(formfield?.EntryNumber) ? (
                      <div
                        className="col-md-12"
                        style={{ marginBottom: "15px", fontSize: "16px" }}
                      >
                        <label>
                          {
                            AppLocale[
                              selectedlanguage?.value
                                ? selectedlanguage.value
                                : "EN001"
                            ].messages["label.entrynumber"]
                          }
                          :
                        </label>{" "}
                        {formfield?.EntryNumber}
                      </div>
                    ) : (
                      ""
                    )}
                    {isNotEmptyValue(formfield?.LinkedRFEEntryNumber) ? (
                      <div
                        className="col-md-12"
                        style={{ marginBottom: "15px", fontSize: "14px", cursor: 'pointer' }}
                        onClick={() => handleViewLinkedRfE(linkedRfEId)}
                      >
                        <label>
                          {
                            AppLocale[
                              selectedlanguage?.value
                                ? selectedlanguage.value
                                : "EN001"
                            ].messages["label.linkedrfe"]
                          }
                          :
                        </label>{" "}
                        {formfield?.LinkedRFEEntryNumber}
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
                      index === formdomfields.length - 1 ||
                      item.name === "ZurichShare"
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
                        title={
                          AppLocale[
                            selectedlanguage?.value
                              ? selectedlanguage.value
                              : "EN001"
                          ].messages["label.uploadattachment"]
                        }
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
                        validationmsg={
                          AppLocale[
                            selectedlanguage?.value
                              ? selectedlanguage.value
                              : "EN001"
                          ].messages["message.mandatory"]
                        }
                        issubmitted={issubmitted}
                        isshowloading={
                          fileuploadloader ? fileuploadloader : false
                        }
                        selectedlanguage={
                          selectedlanguage?.value
                            ? selectedlanguage?.value
                            : "EN001"
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
                      <label>
                        {
                          AppLocale[
                            selectedlanguage?.value
                              ? selectedlanguage.value
                              : "EN001"
                          ].messages["label.createdby"]
                        }
                      </label>
                      <br></br>
                      {formfield?.CreatorName}
                    </div>
                    <div className="col-md-3">
                      <label>
                        {
                          AppLocale[
                            selectedlanguage?.value
                              ? selectedlanguage.value
                              : "EN001"
                          ].messages["label.createddate"]
                        }
                      </label>
                      <br></br>
                      {formfield?.CreatedDate
                        ? formatDate(formfield?.CreatedDate)
                        : ""}
                    </div>
                    <div className="col-md-3">
                      <label>
                        {
                          AppLocale[
                            selectedlanguage?.value
                              ? selectedlanguage.value
                              : "EN001"
                          ].messages["label.modifiedby"]
                        }
                      </label>
                      <br></br>
                      {formfield?.LastModifiorName}
                    </div>
                    <div className="col-md-3">
                      <label>
                        {
                          AppLocale[
                            selectedlanguage?.value
                              ? selectedlanguage.value
                              : "EN001"
                          ].messages["label.modifieddate"]
                        }
                      </label>
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
          ) : (
            <>
              {isLodaing ? (
                <Loading />
              ) : (
                <Pagination
                  id={"userId"}
                  column={columns}
                  data={paginationdata}
                  defaultSorted={defaultSorted}
                  isAddButton={false}
                  isPagination={false}
                  isExportReport={false}
                  isImportLogs={false}
                  hidesearch={true}
                />
              )}
            </>
          )
        }
      </>
      )}

      {!isReadMode && selctedTab === 'rfelog' ? (
        <div className="popup-footer-container">
          <div className="btn-container">
            {(!isEditMode || sellogTabType === 'draft') ? (
              <>
                <button
                  className={`btn-blue ${isfrmdisabled && "disable"}`}
                  onClick={handleSaveLog}
                >
                  {
                    AppLocale[
                      selectedlanguage?.value ? selectedlanguage.value : "EN001"
                    ].messages["button.save"]
                  }
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
              {
                AppLocale[
                  selectedlanguage?.value ? selectedlanguage.value : "EN001"
                ].messages["button.submit"]
              }
            </button>
            <div className={`btn-blue`} onClick={() => hidePopup()}>
              {
                AppLocale[
                  selectedlanguage?.value ? selectedlanguage.value : "EN001"
                ].messages["button.cancel"]
              }
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {isshowlocallink ? (
        <Rfelocallog
          title={
            AppLocale[
              selectedlanguage?.value ? selectedlanguage.value : "EN001"
            ].messages["title.mycountryquicklinks"]
          }
          locallinks={locallinks}
          hidePopup={hidelogPopup}
          openLocalLink={openLocalLink}
        />
      ) : (
        ""
      )}

      {showConfirmationMsg &&
        <ConfirmPopup
          title={"Are You Sure?"}
          hidePopup={() => handleConfirmed('no')}
          showPage={() => handleConfirmed('yes')}
          itemDetails={`You are creating a RfE log without linking it to an existing RfE log. Please select Yes to continue without linking or No to link it with an existing account`}
        />
      }

      {showLinkedPopup ? (
        <RfELinkedPopupDetails
          hidePopup={handleCloseLinkedPopup}
          details={linkedPopupDetails}
          countryopts={countryopts}
          frmLoB={frmLoB}
          selectedlanguage={selectedlanguage}
          IncountryFlag={IncountryFlag}
          IncountryFlagConst={IncountryFlagConst}
          frmrfeempourmentgermany={resonForReference}
          frmrfeempourment={resonForReference}
          reasonOtherValue={reasonOtherValue}
          reasonOtherValueUK={reasonOtherValueUK}
          frmSublob={frmSublob}
          OrganizationalAlignment={OrganizationalAlignment}
          segmentAccount={segmentAccount}
          frmAccountOpts={frmAccountOpts}
          frmorgnizationalalignment={frmorgnizationalalignment}
          frmrfechz={frmrfechz}
          frmstatus={popupFrmStatus}
          frmConditionOpts={frmConditionOpts}
          frmDurationOpts={frmDurationOpts}
          rfelog_status={rfelog_status}
          frmBranchOpts={frmBranchOpts}
          handleCopyValue={handleCopyValueflow2}
          showReferenceBtn={showReferenceBtn}
          referralReasonLevel2Option={resonForReference}
          referralReasonLevel3Option={resonForReference}
          referralReasonLevel4Option={resonForReference}
          referralReasonLevel5Option={resonForReference}
          frmSegmentOpts={frmSegmentOpts}
          inCountryOptsLATAM={inCountryOptsLATAM}
          frmCurrencyOpts={frmCurrencyOpts}
          linkedRfEId={linkedRfEId}
        />
      ) : (
        ""
      )}

      {showApprover ? (
        <PeoplePickerPopup
          title={
            AppLocale[
              selectedlanguage?.value ? selectedlanguage.value : "EN001"
            ].messages["title.underwritergrantingempowerment"]
          }
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
          title={
            AppLocale[
              selectedlanguage?.value ? selectedlanguage.value : "EN001"
            ].messages["title.requestforempowermentCC"]
          }
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
          title={
            AppLocale[
              selectedlanguage?.value ? selectedlanguage.value : "EN001"
            ].messages["title.underwriter"]
          }
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
  getLanguageDetails: commonActions.getLanguageDetails,
  linkedLogLogs: rfelogActions.linkedLogLogs,
  referenceLog: rfelogActions.referenceLog,
  getById: rfelogActions.getById,
};
export default connect(mapStateToProp, mapActions)(AddEditForm);
