import React, { useState, useEffect, useLayoutEffect } from "react";
import { connect } from "react-redux";
import FrmInput from "../common-components/frminput/FrmInput";
import FrmDatePicker from "../common-components/frmdatepicker/FrmDatePicker";
import FrmSelect from "../common-components/frmselect/FrmSelect";
import FrmToggleSwitch from "../common-components/frmtoggelswitch/FrmToggleSwitch";
import FrmFileUpload from "../common-components/frmfileupload/FrmFileUpload";
import FrmMultiselect from "../common-components/frmmultiselect/FrmMultiselect";
import Loading from "../common-components/Loading";
import moment from "moment";
import { Prompt } from "react-router-dom";
import { isNotEmptyValue } from "../../helpers";
import "./Style.css";
import {
  EXEMPTION_LOG_STATUS,
  EXEMPTION_CONSTANT,
  REGION_ZNA,
} from "../../constants";
import {
  userActions,
  lookupActions,
  lobchapterActions,
  commonActions,
  countryActions,
  znaorgnization1Actions,
  znaorgnization2Actions,
  znaorgnization3Actions,
  znaorgnization4Actions,
} from "../../actions";

import FrmRichTextEditor from "../common-components/frmrichtexteditor/FrmRichTextEditor5";

import { alertMessage, dynamicSort, formatDate } from "../../helpers";
import PeoplePickerPopup from "./PeoplePickerPopup";
import { handlePermission } from "../../permissions/Permission";

function AddEditForm(props) {
  const {
    lobchapterState,
    userState,
    countryState,
    znaorgnization1State,
    znaorgnization2State,
    znaorgnization3State,
    znaorgnization4State,
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
    getAllCountry,
    getLookupByType,
    getToolTip,
    getAlllobChapter,
    getallZNASegments,
    getallZNASBU,
    getallZNAMarketBasket,
    getallZNAProducts,
    uploadFile,
    deleteFile,
    downloadFile,
    userProfile,
    queryparam,
    selectedExemptionLog,
    setExemLogTypeFn,
    exemptionlogsType,
    formInitialValueURPM,
    formInitialValueZUG,
    handleDataVersion,
    sellogTabType
  } = props;
  const selectInitiVal = { label: "Select", value: "" };
  const [formfield, setformfield] = useState({});
  const [issubmitted, setissubmitted] = useState(false);
  const [countryopts, setcountryopts] = useState([]);
  const [isfrmdisabled, setisfrmdisabled] = useState(false);
  const [isstatusdisabled, setisstatusdisabled] = useState(false);
  const [frmLoBChapter, setfrmLoBChapter] = useState([]);
  const [frmTypeOfExemption, setfrmTypeOfExemption] = useState([]);
  const [frmTypeOfBusiness, setfrmTypeOfBusiness] = useState([]);
  const [frmFullTransitional, setfrmFullTransitional] = useState([]);
  const [frmURPMSection, setfrmURPMSection] = useState([]);
  const [frmZNASegmentOpts, setfrmZNASegmentOpts] = useState([]);
  const [frmZNASBUOpts, setfrmZNASBUOpts] = useState([]);
  const [frmZNAMarketBasketOpts, setfrmZNAMarketBasketOpts] = useState([]);
  const [frmZNAProductOpts, setfrmZNAProductOpts] = useState([]);
  const [isZNARegion, setisZNARegion] = useState(false);
  const [frmstatus, setfrmstatus] = useState([]);
  const [tooltip, settooltip] = useState({});
  const [isEditRights, setisEditRights] = useState(false);
  const exemption_status = {
    Pending: EXEMPTION_LOG_STATUS.Pending,
    Empowerment_granted: EXEMPTION_LOG_STATUS.Empowerment_granted,
    Empowerment_not_granted: EXEMPTION_LOG_STATUS.Empowerment_not_granted,
    More_Information_Needed: EXEMPTION_LOG_STATUS.More_Information_Needed,
    Withdrawn: EXEMPTION_LOG_STATUS.Withdrawn,
    No_longer_required: EXEMPTION_LOG_STATUS.No_longer_required,
  };

  const exemptionType_Individual = EXEMPTION_CONSTANT.TypeExemption_Individual;
  const exemptionType_Portfolio = EXEMPTION_CONSTANT.TypeExemption_Portfolio;
  const znaRegionValue = REGION_ZNA;
  const fullTransitional_Transitional =
    EXEMPTION_CONSTANT.FullTransitional_Transitional;
  const full_Transitional = EXEMPTION_CONSTANT.Full_Transitional;
  const [userroles, setuserroles] = useState({
    issubmitter: false,
    isapprover: false,
    isadmin: false,
    issuperadmin: false,
    isgrantedempowrment: false,
    isroleloaded: false,
  });
  const FileDownload = require("js-file-download");
  const ZUGMandatoryFields = [
    "countryID",
    "typeOfExemption",
    "typeOfBusiness",
    "lobChapter",
    "approver",
    "status",
    "section",
    "empowermentAndFeedbackRequest",
    "empowermentRequestedBy",
  ];
  const URPMMandatoryFields = [
    "countryID",
    "typeOfExemption",
    "typeOfBusiness",
    "approver",
    "status",
    "expiringDate",
    "section",
    "requestDetails",
    "empowermentRequestedBy",
  ];
  const [mandatoryFields, setmandatoryFields] = useState([]);
  const [fileuploadloader, setfileuploadloader] = useState(false);

  const [logStatus, setlogStatus] = useState({});

  const [pcurmpmopts, setpcurmpmopts] = useState([
    {
      label: "No",
      value: false,
    },
    {
      label: "Yes",
      value: true,
    },
  ]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const tempuserroles = {
      issubmitter: false,
      isapprover: false,
      isadmin: false,
      issuperadmin: false,
      isgrantedempowrment: false,
      isroleloaded: true,
    };
    if (formIntialState.isSubmit) {
      if (
        formIntialState.individualGrantedEmpowerment &&
        formIntialState.individualGrantedEmpowerment.indexOf(
          userProfile.emailAddress
        ) !== -1
      ) {
        tempuserroles.isgrantedempowrment = true;
      }
      if (
        formIntialState.approver &&
        formIntialState.approver.indexOf(userProfile.emailAddress) !== -1
      ) {
        tempuserroles.isapprover = true;
      }
      if (
        formIntialState.empowermentRequestedBy &&
        formIntialState.empowermentRequestedBy.indexOf(
          userProfile.emailAddress
        ) !== -1
      ) {
        tempuserroles.issubmitter = true;
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
    getallZNASegments();
    getallZNAProducts();
    if (formIntialState.znaSegmentId) {
      getallZNASBU({ znaSegmentId: formIntialState.znaSegmentId });
    }
    if (formIntialState.znasbuId) {
      getallZNAMarketBasket({ znasbuId: formIntialState.znasbuId });
    }
    const dbvalues = await Promise.all([
      getAllCountry(),
      getAlllobChapter({ isActive: true }),
      getLookupByType({
        LookupType: "EXMPTypeOfExemption",
      }),
      getLookupByType({
        LookupType: "EXMPTypeOfBusiness",
      }),
      getLookupByType({
        LookupType: "EXMPFullTransitional",
      }),
      getLookupByType({
        LookupType: "EXMPZUGStatus",
      }),
      getLookupByType({
        LookupType: "EXMPURPMSection",
      }),
      getToolTip({ type: "ExemptionLogs" }),
    ]);
    let countrylist = dbvalues[0];
    if (
      !isEditMode &&
      !isReadMode &&
      userProfile.profileCountry &&
      !formIntialState.countryList.length
    ) {
      countrylist.forEach((item) => {
        if (item.isActive) {
          if (item.countryID === userProfile.profileCountry) {
            formIntialState.countryList = [
              {
                label: item.countryName,
                value: item.countryID,
                regionId: item.regionID,
              },
            ];
          }
        }
      });
    }
    let tempopts = [];

    let lobChapterItems = dbvalues[1];

    lobChapterItems.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (item.isActive || item.lobChapterID === formIntialState.lobChapter) {
          tempopts.push({
            label: item.lobChapterName,
            value: item.lobChapterID,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          label: item.lobChapterName,
          value: item.lobChapterID,
        });
      }
    });
    tempopts.sort(dynamicSort("label"));
    setfrmLoBChapter([selectInitiVal, ...tempopts]);
    tempopts = [];
    let tempTypeOfExemption = dbvalues[2];
    let tempTypeOfBusiness = dbvalues[3];
    let tempFullTransitional = dbvalues[4];
    let tempZUGStatus = dbvalues[5];
    let tempURPMStatus = tempZUGStatus;
    let tempURPMSection = dbvalues[6];
    let tempToolTips = dbvalues[7];
    let tooltipObj = {};
    tempToolTips.forEach((item) => {
      tooltipObj[item.toolTipField] = item.toolTipText;
    });
    settooltip(tooltipObj);

    tempTypeOfExemption.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (
          item.isActive ||
          item.lookupID === formIntialState.typeOfExemption
        ) {
          tempopts.push({ label: item.lookUpValue, value: item.lookupID });
        }
      } else if (item.isActive) {
        tempopts.push({ label: item.lookUpValue, value: item.lookupID });
      }
    });
    tempTypeOfExemption = [...tempopts];
    tempopts = [];
    tempTypeOfBusiness.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (item.isActive || item.lookupID === formIntialState.typeOfBusiness) {
          tempopts.push({ label: item.lookUpValue, value: item.lookupID });
        }
      } else if (item.isActive) {
        tempopts.push({ label: item.lookUpValue, value: item.lookupID });
      }
    });
    tempTypeOfBusiness = [...tempopts];
    tempopts = [];

    tempFullTransitional.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (
          item.isActive ||
          item.lookupID === formIntialState.fullTransitional
        ) {
          tempopts.push({ label: item.lookUpValue, value: item.lookupID });
        }
      } else if (item.isActive) {
        tempopts.push({ label: item.lookUpValue, value: item.lookupID });
      }
    });
    tempFullTransitional = [...tempopts];
    tempopts = [];
    tempURPMSection = tempURPMSection.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (item.isActive || item.lookupID === formIntialState.section) {
          tempopts.push({ label: item.lookUpValue, value: item.lookupID });
        }
      } else if (item.isActive) {
        tempopts.push({ label: item.lookUpValue, value: item.lookupID });
      }
    });
    tempURPMSection = [...tempopts];
    let frmstatus = [];
    const statusArray =
      selectedExemptionLog === "zug" ? tempZUGStatus : tempURPMStatus;
    if (selectedExemptionLog === "zug") {
      setmandatoryFields([...ZUGMandatoryFields]);
    } else {
      setmandatoryFields([...URPMMandatoryFields]);
    }
    statusArray.forEach((item) => {
      let isshow = false;
      //status pending
      if (!formIntialState.isSubmit) {
        if (item.lookupID === exemption_status.Pending) {
          isshow = true;
        }
      } else if (formIntialState.isSubmit) {
        if (userroles.isapprover || userroles.issuperadmin) {
          isshow = true;
        } else {
          if (item.lookupID === formIntialState.status) {
            isshow = true;
          }
          if (
            (formIntialState.status === exemption_status.Pending ||
              formIntialState.status ===
                exemption_status.Empowerment_granted) &&
            item.lookupID === exemption_status.Withdrawn
          ) {
            isshow = true;
          }
          if (
            formIntialState.status === exemption_status.Empowerment_granted &&
            item.lookupID === exemption_status.No_longer_required
          ) {
            isshow = true;
          }
          if ((formIntialState.status === exemption_status.Empowerment_not_granted ||
                formIntialState.status === exemption_status.Empowerment_granted ||
                formIntialState.status === exemption_status.More_Information_Needed) &&
             item.lookupID === exemption_status.Pending 
          ) {
            isshow = true;  
          }
        }
      }
      /*if (
        item.lookupID !== exemption_status.Pending &&
        formIntialState.isSubmit
      ) {
        isshow = true;
      }*/

      if (isshow && item.isActive) {
        frmstatus.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
      }
    });
    tempTypeOfExemption.sort(dynamicSort("label"));
    tempTypeOfBusiness.sort(dynamicSort("label"));
    tempFullTransitional.sort(dynamicSort("label"));
    tempURPMSection.sort(dynamicSort("label"));
    setfrmTypeOfExemption([selectInitiVal, ...tempTypeOfExemption]);
    setfrmTypeOfBusiness([...tempTypeOfBusiness]);
    setfrmFullTransitional([selectInitiVal, ...tempFullTransitional]);
    setfrmURPMSection([selectInitiVal, ...tempURPMSection]);
    if (frmstatus.length) {
      setfrmstatus([...frmstatus]);
    }
    setloading(false);
    let isedit = false;
    let loggeduser = userProfile.emailAddress;

    if (formIntialState.isSubmit) {
      if (
        (formIntialState.individualGrantedEmpowerment &&
          formIntialState.individualGrantedEmpowerment.indexOf(loggeduser) !==
            -1) ||
        (formIntialState.empowermentRequestedBy &&
          formIntialState.empowermentRequestedBy.indexOf(loggeduser) !== -1) ||
        (formIntialState.approver &&
          formIntialState.approver.indexOf(loggeduser) !== -1) ||
        userProfile.isSuperAdmin ||
        userProfile.isGlobalAdmin
      ) {
        isedit = true;
      }
    } else {
      isedit = true;
    }
    if (userProfile.isAdminGroup && userProfile.scopeCountryList) {
      let countryList = formIntialState.countryID
        ? formIntialState.countryID.split(",")
        : [];
      countryList.forEach((country) => {
        if (userProfile.scopeCountryList.indexOf(country) !== -1) {
          isedit = true;
        }
      });
    }
    setisEditRights(isedit);
  };

  useEffect(() => {
    if (frmstatus.length) {
      setDefaultLogStatus();
    }
  }, [frmstatus]);

  const setDefaultLogStatus = () => {
    if (formIntialState.isSubmit) {
      if (userroles.isapprover || userroles.issuperadmin) {
        setisstatusdisabled(false);
      } else if (
        (userroles.isadmin ||
          userroles.issubmitter ||
          userroles.isgrantedempowrment) &&
        formIntialState.status !== exemption_status.Empowerment_granted &&
        formIntialState.status !== exemption_status.Empowerment_not_granted &&
        formIntialState.status !== exemption_status.More_Information_Needed &&
        formIntialState.status !== exemption_status.Pending
      ) {
        if (!isReadMode) {
          setisstatusdisabled(true);
        }
      }
      if (userroles.isapprover && !userroles.issuperadmin && !isReadMode) {
        //setisapprovermode(true);
      }
      setformfield({
        ...formIntialState,
      });
    } else {
      formIntialState.fullTransitional = formIntialState.fullTransitional
        ? formIntialState.fullTransitional
        : full_Transitional;
      setformfield({
        ...formIntialState,
        status: exemption_status.Pending,
      });
    }
  };

  useEffect(() => {
    let isFound = [];
    if (formfield.countryList?.length) {
      isFound = formfield.countryList.filter(
        (item) => item.regionId === znaRegionValue
      );
    }
    if (isFound.length) {
      setisZNARegion(true);
    } else {
      setisZNARegion(false);
    }
  }, [formfield.countryList]);

  useEffect(() => {
    let tempopts = [];
    let selectedItems = formIntialState.countryList;
    countryState.countryItems.forEach((item) => {
      if (isEditMode || isReadMode) {
        let isfound = false;
        selectedItems.forEach((country) => {
          if (item.countryID === country.value) {
            isfound = true;
          }
        });
        if (item.isActive || isfound) {
          tempopts.push({
            label: item.countryName.trim(),
            value: item.countryID,
            regionId: item.regionID,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          label: item.countryName.trim(),
          value: item.countryID,
          regionId: item.regionID,
        });
      }
    });
    tempopts.sort(dynamicSort("label"));
    setcountryopts([...tempopts]);
  }, [countryState.countryItems]);

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
    let tempopts = [];
    znaorgnization4State.org4Items.forEach((item) => {
      if (isEditMode || isReadMode) {
        if (
          item.isActive ||
          item.znaProductsId === formIntialState.znaProductsId
        ) {
          tempopts.push({
            label: item.znaProductsName,
            value: item.znaProductsId,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          label: item.znaProductsName,
          value: item.znaProductsId,
        });
      }
    });
    tempopts.sort(dynamicSort("label"));
    setfrmZNAProductOpts([...tempopts]);
  }, [znaorgnization4State.org4Items]);

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
    let selectedsbuid = [];
    if (formfield.znasbuList?.length) {
      selectedsbuid = formfield.znasbuList.map((item) => item.value);
      getallZNAMarketBasket({ znasbuId: selectedsbuid.join(",") });
    } else if (
      (!formfield.znasbuList?.length && formfield.isdirty) ||
      !formIntialState.znasbuId
    ) {
      getallZNAMarketBasket({ znasbuId: "none" });
    }
  }, [formfield.znasbuList]);

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

  useEffect(() => {
    if (!formfield.status) {
      return;
    }
    let tempmandatoryfields = [];
    if (formfield.status === exemption_status.No_longer_required) {
      tempmandatoryfields.push("expiringDate");
    }
    if (formfield.fullTransitional == fullTransitional_Transitional) {
      tempmandatoryfields.push("transitionalExpireDate");
    }
    setmandatoryFields([...ZUGMandatoryFields, ...tempmandatoryfields]);
  }, [formfield.status, formfield.fullTransitional]);

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
        znasbuList: [],
        marketBasketList: [],
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
  };

  const handleMultiSelectChange = (name, value) => {
    //const tempval = value.map((item) => item.value);
    if (name === "znasbuList") {
      setformfield({
        ...formfield,
        marketBasketList: [],
        isdirty: true,
        [name]: value,
      });
    } else {
      setformfield({ ...formfield, isdirty: true, [name]: value });
    }
  };
  const handleDateSelectChange = (name, value) => {
    let dateval = value ? moment(value).format("YYYY-MM-DD") : "";

    let fieldname = "";

    fieldname =
      name === "expiringDate" &&
      formfield.fullTransitional === fullTransitional_Transitional
        ? "transitionalExpireDate"
        : fieldname;
    fieldname =
      name === "transitionalExpireDate" &&
      formfield.status === exemption_status.No_longer_required
        ? "expiringDate"
        : fieldname;
    if (fieldname) {
      setformfield({
        ...formfield,
        isdirty: true,
        [name]: dateval,
        [fieldname]: dateval,
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
      let folderID =
        selectedExemptionLog === "zug"
          ? formfield.zugExemptionLogId
            ? formfield.zugExemptionLogId
            : formfield.folderID
            ? formfield.folderID
            : ""
          : formfield.urpmExemptionLogId
          ? formfield.urpmExemptionLogId
          : formfield.folderID
          ? formfield.folderID
          : "";

      formData.append("TempId", folderID);
      if (formfield.zugExemptionLogId) {
        formData.append("LogType", "zugLogs");
      } else {
        formData.append("LogType", "urpmLogs");
      }
    }
    setfileuploadloader(true);
    let response = await uploadFile(formData);
    if (response) {
      setfileuploadloader(false);
      if (!formfield.rfeLogId) {
        formfield.folderID = response.tempId;
      }
      let tempattachementfiles = [...formfield.exmpAttachmentList];

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
        exmpAttachmentList: [...tempattachementfiles],
      });
      alert(alertMessage.commonmsg.fileuploadsuccess);
    } else {
      setfileuploadloader(false);
      alert(alertMessage.commonmsg.fileuploaderror);
    }
  };
  const handleFileDelete = async (id, url) => {
    if (!window.confirm(alertMessage.exemptionlog.deleteAttachmentConfirm)) {
      return;
    }
    const requestParam = {
      id: id,
      uploadedFile: url,
    };
    const response = await deleteFile(requestParam);
    if (response) {
      alert(alertMessage.exemptionlog.deleteAttachment);
      let tempattachementfiles = [...formfield.exmpAttachmentList];
      tempattachementfiles = tempattachementfiles.filter(
        (item) => item.filePath !== url
      );
      setformfield({
        ...formfield,
        isdirty: true,
        exmpAttachmentList: [...tempattachementfiles],
      });
    }
  };

  const [scrollPosition, setScrollPosition] = useState(0);
  const [showApprover, setshowApprover] = useState(false);
  const [showempowermentRequestedBy, setshowempowermentRequestedBy] =
    useState(false);
  const [showGrantedEmpowerment, setshowGrantedEmpowerment] = useState(false);
  const [showEmpowermentCC, setshowEmpowermentCC] = useState(false);
  const handleshowpeoplepicker = (usertype, e) => {
    e.target.blur();
    const position = window.pageYOffset;
    setScrollPosition(position);
    if (usertype === "approver") {
      setshowApprover(true);
    } else if (usertype === "empowermentRequestedBy") {
      setshowempowermentRequestedBy(true);
    } else if (usertype === "individualGrantedEmpowerment") {
      setshowGrantedEmpowerment(true);
    } else if (usertype === "exemptionCC") {
      setshowEmpowermentCC(true);
    }
  };
  const hidePeoplePickerPopup = () => {
    setshowApprover(false);
    setshowempowermentRequestedBy(false);
    setshowGrantedEmpowerment(false);
    setshowEmpowermentCC(false);
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

    if (usertype === "approver") {
      namefield = "approverName";
      adfield = "approverAD";
      selvalue = value[0];
    } else if (usertype === "empowermentRequestedBy") {
      namefield = "empowermentRequestedByName";
      adfield = "empowermentRequestedByAD";
      selvalue = value[0];
    } else if (usertype === "individualGrantedEmpowerment") {
      namefield = "individualGrantedEmpowermentName";
      adfield = "individualGrantedEmpowermentAD";
    } else if (usertype === "exemptionCC") {
      namefield = "exemptionCCName";
      adfield = "exemptionCCAD";
    }

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
        if (!value || !value.length) {
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
    formfield.countryID = selectedCountryItems.join(",");
    if (validateform()) {
      /*formfield.underwriterAD = {
        userName: formfield.underwriterName,
        emailAddress: formfield.underwriter,
      };*/
      if (selectedExemptionLog === "zug") {
        let empowermentAndFeedbackRequest =
          formfield.empowermentAndFeedbackRequest
            ? formfield.empowermentAndFeedbackRequest.replace(
                /<\/?[^>]+(>|$)/g,
                ""
              )
            : "";
        let additionalApprovalComments = formfield.additionalApprovalComments
          ? formfield.additionalApprovalComments.replace(/<\/?[^>]+(>|$)/g, "")
          : "";
        if (!additionalApprovalComments.trim()) {
          formfield.additionalApprovalComments = "";
        }
        if (!empowermentAndFeedbackRequest.trim()) {
          formfield.empowermentAndFeedbackRequest = "";
        }
      } else {
        let additionalApprovalComments = formfield.additionalApprovalComments
          ? formfield.additionalApprovalComments.replace(/<\/?[^>]+(>|$)/g, "")
          : "";
        let requestDetails = formfield.requestDetails
          ? formfield.requestDetails.replace(/<\/?[^>]+(>|$)/g, "")
          : "";
        if (!additionalApprovalComments.trim()) {
          formfield.additionalApprovalComments = "";
        }
        if (!requestDetails.trim()) {
          formfield.requestDetails = "";
        }
      }

      let approverfieldname = "approver";
      if (
        formfield[approverfieldname].indexOf(formfield.empowermentRequestedBy) <
        0
      ) {
        if (isEditMode) {
          if (
            (userroles.isadmin ||
              userroles.issubmitter ||
              userroles.isgrantedempowrment) &&
            !userroles.isapprover &&
            !userroles.issuperadmin &&
            formfield.status === exemption_status.More_Information_Needed
          ) {
            setfrmstatus([
              ...frmstatus,
              { label: "Pending", value: exemption_status.Pending },
            ]);
            formfield.status = exemption_status.Pending;
          }
          putItem({...formfield, isSubmit: true});
        } else {
          postItem({ ...formfield, isSubmit: true });
        }
        setisfrmdisabled(true);
      } else {
        alert(alertMessage.exemptionlog.invalidapprovermsg);
      }
    }
  };
  const handleSaveLog = () => {
    if (isfrmdisabled) {
      return;
    }
    if (formfield.countryList.length) {
      let selectedCountryItems = formfield.countryList.map(
        (item) => item.value
      );
      formfield.countryID = selectedCountryItems.join(",");
      //setissubmitted(true);
      postItem({ ...formfield, isSubmit: false });
      setisfrmdisabled(true);
    } else {
      alert(alertMessage.exemptionlog.draftInvalid);
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
        window.location = "/exemptionlogs";
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
  const setExemptionlogtype = (value) => {
    setExemLogTypeFn(value);
    if (value === "zug") {
      formInitialValueZUG.fullTransitional = full_Transitional;
      formInitialValueZUG.status = exemption_status.Pending;
      setformfield({
        ...formInitialValueZUG,
      });
    } else {
      formInitialValueURPM.fullTransitional = full_Transitional;
      formInitialValueURPM.status = exemption_status.Pending;
      setformfield({
        ...formInitialValueURPM,
      });
    }
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
                handleDataVersion(
                  selectedExemptionLog === "zug"
                    ? formfield.zugExemptionLogId
                    : formfield.urpmExemptionLogId
                )
              }
              style={{ marginRight: "10px" }}
            >
              Version History
            </div>
          )}
          {handlePermission(window.location.pathname.slice(1), "isEdit") && !isEditMode && isReadMode && isEditRights && (
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
      {!formfield.zugExemptionLogId && !formfield.urpmExemptionLogId && (
        <div className="tabs-container">
          {exemptionlogsType.map((item) => (
            <div
              key={item.label}
              className={`tab-btn ${
                selectedExemptionLog === item.value ? "selected" : "normal"
              }`}
              onClick={() => setExemptionlogtype(item.value)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
      <div className="popup-formitems logs-form">
        <form onSubmit={handleSubmit} id="myForm">
          <>
            <Prompt
              when={formfield.isdirty ? true : false}
              message={(location) => alertMessage.commonmsg.promptmsg}
            />
            <div className="frm-field-bggray">
              <div className="row">
                {isNotEmptyValue(formfield.entryNumber) ? (
                  <div
                    className="col-md-12"
                    style={{ marginBottom: "15px", fontSize: "16px" }}
                  >
                    <label>Entry Number:</label> {formfield.entryNumber}
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="row">
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
                  <FrmSelect
                    title={"Type of Exemption"}
                    name={"typeOfExemption"}
                    value={formfield.typeOfExemption}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    isToolTip={true}
                    tooltipmsg={tooltip["TypeOfExemption"]}
                    issubmitted={issubmitted}
                    selectopts={frmTypeOfExemption}
                    isdisabled={isfrmdisabled}
                  />
                </div>
                <div className="col-md-3">
                  <FrmMultiselect
                    title={"Type of Business"}
                    name={"typeOfBusiness"}
                    value={formfield.typeOfBusiness}
                    handleChange={handleMultiSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmTypeOfBusiness}
                    isdisabled={isfrmdisabled}
                    isAllOptNotRequired={true}
                  />
                </div>
                {formfield.typeOfExemption === exemptionType_Individual && (
                  <div className="col-md-3">
                    <FrmInput
                      title={<>Individual Granted Empowerment</>}
                      name={"individualGrantedEmpowermentName"}
                      value={formfield.individualGrantedEmpowermentName}
                      type={"text"}
                      handleChange={handleChange}
                      handleClick={(e) =>
                        handleshowpeoplepicker(
                          "individualGrantedEmpowerment",
                          e
                        )
                      }
                      isReadMode={isReadMode}
                      isRequired={false}
                      isdisabled={isfrmdisabled}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isToolTip={true}
                      tooltipmsg={tooltip["IndividualGrantedEmpowerment"]}
                    />
                  </div>
                )}
              </div>
              {isZNARegion && (
                <div className="row">
                  <div className="col-md-3">
                    <FrmSelect
                      title={"ZNA BU"}
                      name={"znaSegmentId"}
                      value={formfield.znaSegmentId}
                      handleChange={handleSelectChange}
                      isRequired={false}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={frmZNASegmentOpts}
                    />
                  </div>
                  <div className="col-md-3">
                    <FrmMultiselect
                      title={"ZNA SBU"}
                      name={"znasbuList"}
                      value={
                        formfield.znasbuList.length ? formfield.znasbuList : []
                      }
                      handleChange={handleMultiSelectChange}
                      isRequired={false}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={frmZNASBUOpts}
                      isdisabled={isfrmdisabled}
                      isAllOptNotRequired={true}
                    />
                  </div>
                  <div className="col-md-3">
                    <FrmMultiselect
                      title={"ZNA Market Basket"}
                      name={"marketBasketList"}
                      value={
                        formfield.marketBasketList.length
                          ? formfield.marketBasketList
                          : []
                      }
                      handleChange={handleMultiSelectChange}
                      isRequired={false}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={frmZNAMarketBasketOpts}
                      isdisabled={isfrmdisabled}
                      isAllOptNotRequired={true}
                    />
                  </div>
                  <div className="col-md-3">
                    <FrmMultiselect
                      title={"ZNA Products"}
                      name={"znaProductsList"}
                      value={
                        formfield.znaProductsList.length
                          ? formfield.znaProductsList
                          : []
                      }
                      handleChange={handleMultiSelectChange}
                      isRequired={false}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={frmZNAProductOpts}
                      isdisabled={isfrmdisabled}
                      isAllOptNotRequired={true}
                    />
                  </div>
                </div>
              )}

              <div className="row">
                {selectedExemptionLog === "zug" && (
                  <div className="col-md-3">
                    <FrmSelect
                      title={<>LoB Chapter/Document</>}
                      name={"lobChapter"}
                      value={formfield.lobChapter}
                      handleChange={handleSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      isToolTip={false}
                      issubmitted={issubmitted}
                      selectopts={frmLoBChapter}
                      isdisabled={isfrmdisabled}
                    />
                  </div>
                )}

                <div className="col-md-3">
                  <FrmInput
                    title={"Section"}
                    name={"section"}
                    value={formfield.section}
                    type={"text"}
                    handleChange={handleChange}
                    isReadMode={isReadMode}
                    isRequired={true}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isToolTip={true}
                    tooltipmsg={tooltip["Section"]}
                  />
                </div>

                <div
                  className={`${
                    selectedExemptionLog === "zug" ? "col-md-3" : "col-md-6"
                  }`}
                >
                  <FrmInput
                    title={"Section Subject"}
                    name={"sectionSubject"}
                    value={formfield.sectionSubject}
                    type={"text"}
                    handleChange={handleChange}
                    isReadMode={isReadMode}
                    isRequired={false}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isToolTip={true}
                    tooltipmsg={tooltip["SectionSubject"]}
                  />
                </div>
                {selectedExemptionLog === "zug" ? (
                  <div className="col-md-3">
                    <FrmInput
                      title={"ZUG Chapter Version"}
                      name={"zugChapterVersion"}
                      value={formfield.zugChapterVersion}
                      type={"text"}
                      handleChange={handleChange}
                      isReadMode={isReadMode}
                      isRequired={false}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isToolTip={true}
                      tooltipmsg={tooltip["ZUGChapterVersion"]}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div
                className={`row ${
                  selectedExemptionLog !== "zug" && "border-bottom"
                }`}
              >
                <div className="col-md-12">
                  {selectedExemptionLog === "zug" ? (
                    <FrmRichTextEditor
                      title={"Empowerment request details"}
                      name={"empowermentAndFeedbackRequest"}
                      value={
                        formfield.empowermentAndFeedbackRequest
                          ? formfield.empowermentAndFeedbackRequest
                          : formIntialState.empowermentAndFeedbackRequest
                      }
                      handleChange={handleSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isdisabled={isfrmdisabled}
                      isToolTip={true}
                      tooltipmsg={tooltip["EmpowermentAndFeedbackRequest"]}
                    />
                  ) : (
                    <FrmRichTextEditor
                      title={"Empowerment request details"}
                      name={"requestDetails"}
                      value={formfield.requestDetails}
                      handleChange={handleSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isdisabled={isfrmdisabled}
                    />
                  )}
                </div>
              </div>
              <div className="row border-bottom">
                <div className="col-md-3">
                  <FrmInput
                    title={<>Empowerment Requested By</>}
                    titlelinespace={true}
                    name={"empowermentRequestedByName"}
                    value={formfield.empowermentRequestedByName}
                    type={"text"}
                    handleChange={handleChange}
                    handleClick={(e) =>
                      handleshowpeoplepicker("empowermentRequestedBy", e)
                    }
                    isReadMode={isReadMode}
                    isRequired={true}
                    isdisabled={isfrmdisabled}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                  />
                </div>

                <div className="col-md-3">
                  <FrmSelect
                    title={<>Full/Transitional</>}
                    titlelinespace={true}
                    name={"fullTransitional"}
                    value={formfield.fullTransitional}
                    handleChange={handleSelectChange}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    isToolTip={true}
                    tooltipmsg={tooltip["FullTransitional"]}
                    issubmitted={issubmitted}
                    selectopts={frmFullTransitional}
                    isdisabled={isfrmdisabled}
                  />
                </div>
                {formfield.fullTransitional ==
                  fullTransitional_Transitional && (
                  <div className="col-md-3">
                    <FrmDatePicker
                      title={"Transitional Expiring Date of Empowerment"}
                      name={"transitionalExpireDate"}
                      value={formfield.transitionalExpireDate}
                      type={"date"}
                      handleChange={handleDateSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      minDate={""}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isdisabled={isfrmdisabled}
                      isToolTip={true}
                      tooltipmsg={tooltip["TransitionalExpireDate"]}
                    />
                  </div>
                )}
                {selectedExemptionLog === "zug" && (
                  <div className="col-md-3">
                    <FrmToggleSwitch
                      title={
                        <>
                          P&C URPM exemption <br></br>required
                        </>
                      }
                      name={"pC_URPMExemptionRequired"}
                      value={formfield.pC_URPMExemptionRequired}
                      handleChange={handleSelectChange}
                      isRequired={false}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      isToolTip={true}
                      tooltipmsg={tooltip["pC_URPMExemptionRequired"]}
                      issubmitted={issubmitted}
                      selectopts={pcurmpmopts}
                      isdisabled={isfrmdisabled}
                    />
                  </div>
                )}
              </div>
            </div>
            <div class="frm-container-bggray">
              <div className="row">
                <div className="col-md-3">
                  <FrmInput
                    title={"Approver"}
                    name={"approverName"}
                    value={formfield.approverName}
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

                <div className="col-md-3">
                  <FrmSelect
                    title={<>Status</>}
                    name={"status"}
                    value={formfield.status}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmstatus}
                    isdisabled={isfrmdisabled || isstatusdisabled}
                  />
                </div>
                {formfield.status === exemption_status.No_longer_required && (
                  <div className="col-md-3">
                    <FrmDatePicker
                      title={"Expiring Date"}
                      name={"expiringDate"}
                      value={formfield.expiringDate}
                      type={"date"}
                      handleChange={handleDateSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      minDate={""}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isdisabled={isfrmdisabled}
                    />
                  </div>
                )}
                {selectedExemptionLog === "zug" && (
                  <div className="col-md-3">
                    <FrmInput
                      title={"Previous Exemption ID"}
                      name={"ciGuidlineId"}
                      value={formfield.ciGuidlineId}
                      type={"text"}
                      handleChange={handleChange}
                      isReadMode={isReadMode}
                      isRequired={false}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isdisabled={isfrmdisabled}
                      isToolTip={true}
                      tooltipmsg={tooltip["PreviousExemptionID"]}
                    />
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-md-3">
                  <FrmInput
                    title={"Exemption CC"}
                    name={"exemptionCCName"}
                    value={formfield.exemptionCCName}
                    type={"text"}
                    handleChange={handleChange}
                    handleClick={(e) =>
                      handleshowpeoplepicker("exemptionCC", e)
                    }
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    isToolTip={true}
                    tooltipmsg={tooltip["ExemptionCC"]}
                    issubmitted={issubmitted}
                    isdisabled={isfrmdisabled}
                  />
                </div>
              </div>
              <div className="row border-bottom">
                <div className="col-md-12">
                  <FrmRichTextEditor
                    title={"Additional Approval Comments"}
                    name={"additionalApprovalComments"}
                    value={
                      formfield.additionalApprovalComments
                        ? formfield.additionalApprovalComments
                        : formIntialState.additionalApprovalComments
                    }
                    handleChange={handleSelectChange}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isdisabled={
                      (!isReadMode && isfrmdisabled) ||
                      (!userroles.isapprover &&
                        !userroles.issuperadmin &&
                        !userroles.issubmitter) ||
                      (userroles.issubmitter &&
                        formfield.status !== exemption_status.Withdrawn)
                    }
                    isToolTip={true}
                    tooltipmsg={tooltip["AdditionalApprovalComments"]}
                  />
                </div>
              </div>
            </div>

            <div class="">
              <div className="row ">
                <div className="col-md-6">
                  <FrmFileUpload
                    title={"Upload Attachment"}
                    name={"fullFilePath"}
                    uploadedfiles={formfield.exmpAttachmentList}
                    value={""}
                    type={""}
                    handleFileUpload={handleFileUpload}
                    handleFileDelete={handleFileDelete}
                    isRequired={false}
                    isReadMode={isReadMode}
                    isShowDelete={
                      (!isReadMode && !formfield.isSubmit) ||
                      (!isReadMode && userProfile.isAdminGroup)
                    }
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isshowloading={fileuploadloader ? fileuploadloader : false}
                    isdisabled={isfrmdisabled}
                    downloadfile={downloadfile}
                  />
                </div>
                {/* <div className="col-md-4">
                  <FrmInput
                    title={"Exemption Detail for local addendum"}
                    name={"exemptionDetailForLocalAddendum"}
                    value={formfield.exemptionDetailForLocalAddendum}
                    type={"text"}
                    handleChange={handleChange}
                    isReadMode={isReadMode}
                    isRequired={false}
                    issubmitted={issubmitted}
                    isToolTip={true}
                    tooltipmsg={tooltip["ExemptionDetailForLocalAddendum"]}
                  />
                </div> */}
              </div>
            </div>
            {isEditMode || isReadMode ? (
              <div className="row mb20 border-top pt10">
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
            {(!isEditMode || sellogTabType === 'draft') ? (
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

      {showApprover ? (
        <PeoplePickerPopup
          title={"Approver"}
          name={"approver"}
          usertype="approver"
          actionResponsible={formfield.approver ? [formfield.approverAD] : []}
          assignPeoplepikerUser={assignPeoplepikerUser}
          hideAddPopup={hidePeoplePickerPopup}
          lobChapter={formfield.lobChapter}
          singleSelection={true}
          selectedExemptionLog={selectedExemptionLog}
        />
      ) : (
        ""
      )}
      {showempowermentRequestedBy ? (
        <PeoplePickerPopup
          title={"Empowerment Requested By"}
          name={"empowermentRequestedBy"}
          usertype="empowermentRequestedBy"
          actionResponsible={
            formfield.empowermentRequestedBy
              ? [formfield.empowermentRequestedByAD]
              : []
          }
          assignPeoplepikerUser={assignPeoplepikerUser}
          hideAddPopup={hidePeoplePickerPopup}
          singleSelection={true}
        />
      ) : (
        ""
      )}
      {showGrantedEmpowerment ? (
        <PeoplePickerPopup
          title={"Individual Granted Empowerment"}
          name={"individualGrantedEmpowerment"}
          usertype="individualGrantedEmpowerment"
          actionResponsible={
            formfield.individualGrantedEmpowerment
              ? [...formfield.individualGrantedEmpowermentAD]
              : []
          }
          assignPeoplepikerUser={assignPeoplepikerUser}
          hideAddPopup={hidePeoplePickerPopup}
          singleSelection={false}
          isToolTip={true}
          tooltipmsg={tooltip["IndividualGrantedEmpowerment"]}
        />
      ) : (
        ""
      )}
      {showEmpowermentCC ? (
        <PeoplePickerPopup
          title={"Exemption CC"}
          name={"exemptionCC"}
          usertype="exemptionCC"
          actionResponsible={
            formfield.exemptionCC ? [...formfield.exemptionCCAD] : []
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
  getAlllobChapter: lobchapterActions.getAlllobChapter,
  getAllCountry: countryActions.getAllCountry,
  uploadFile: commonActions.uploadFile,
  deleteFile: commonActions.deleteFile,
  downloadFile: commonActions.downloadFile,
  getallZNASegments: znaorgnization1Actions.getAllOrgnization,
  getallZNASBU: znaorgnization2Actions.getAllOrgnization,
  getallZNAMarketBasket: znaorgnization3Actions.getAllOrgnization,
  getallZNAProducts: znaorgnization4Actions.getAllOrgnization,
};
export default connect(mapStateToProp, mapActions)(AddEditForm);
