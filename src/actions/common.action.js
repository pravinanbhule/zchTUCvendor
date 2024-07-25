import Axios from "../services/Axios";
const uploadFile = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.uploadFileService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteFile = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.deleteFileService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const downloadFile = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.downloadFileService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const downloadTemplate = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.downloadTemplateServive(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getToolTip = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.getToolTipService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const sendLogNotification = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.sendLogNotificationService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const setMasterdataActive = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.setMasterdataActiveService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getDataVersion = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.getDataVersionService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getMasterVersion = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.getMasterVersionService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const importExcelLogs = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.importExcelLogsService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const validateActDirEmail = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.validateActDirEmailService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const shareLogEmail = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.shareLogEmailService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteLog = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.deleteLogService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getLogUsers = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.getLogUsersService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getAllEntryNumbers = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.getAllEntryNumbersService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getLogCount = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.getLogCountService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getLogFields = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.getLogFieldsService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getLanguageDetails = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.getLanguageDetailsService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getExemptionUserView = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.getAllExemptionUserViewList(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const addEditUserView = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.addEditUserViewService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const downloadExcel = (requestParam, type) => {
  return async (dispatch) => {
    try {
      const response = await commonService.downaloadExcelManage(
        requestParam, type
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const EmailRequestAPI = (requestParam, type) => {
  return async (dispatch) => {
    try {
      const response = await commonService.EmailRequestService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const commonActions = {
  uploadFile,
  deleteFile,
  downloadFile,
  downloadTemplate,
  getToolTip,
  sendLogNotification,
  setMasterdataActive,
  getDataVersion,
  getMasterVersion,
  importExcelLogs,
  validateActDirEmail,
  shareLogEmail,
  deleteLog,
  getLogUsers,
  getAllEntryNumbers,
  getLogCount,
  getLogFields,
  getLanguageDetails,
  getExemptionUserView,
  addEditUserView,
  downloadExcel,
  EmailRequestAPI
};
const uploadFileService = async (requestParam) => {
  const response = await Axios.post(`common/uploadfile`, requestParam, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
const downloadFileService = async (requestParam) => {
  const param = { params: requestParam, responseType: "blob" };
  const response = await Axios.get(`common/downloadazureblob`, param);
  return response;
};
const downloadTemplateServive = async (requestParam) => {
  const param = { params: requestParam, responseType: "blob" };
  const response = await Axios.get(`common/downloadtemplate`, param);
  return response;
};
const deleteFileService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`common/deletefile`, param);
  return response;
};
const getToolTipService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`common/gettooltiptext`, param);
  return response;
};
const sendLogNotificationService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`common/sendlognotification`, param);
  return response;
};

const setMasterdataActiveService = async (requestParam) => {
  const response = await Axios.post(`common/masterstatusupdate`, requestParam);
  return response;
};
const getDataVersionService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`common/GetLogVersionHistory`, param);
  return response;
};
const getMasterVersionService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`common/GetMasterVersionHistory`, param);
  return response;
};
const importExcelLogsService = async (requestParam) => {
  const response = await Axios.post(`common/importlogdata`, requestParam);
  return response;
};
const validateActDirEmailService = async (requestParam) => {
  const response = await Axios.post(`common/validateemails`, requestParam);
  return response;
};
const shareLogEmailService = async (requestParam) => {
  const response = await Axios.post(`common/sendlinkbyemail`, requestParam);
  return response;
};
const deleteLogService = async (requestParam) => {
  const response = await Axios.post(`common/DeleteLog`, requestParam);
  return response;
};
const getLogUsersService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`common/getalluserdetail`, param);
  return response;
};

const getAllEntryNumbersService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`common/getallentrynumber`, param);
  return response;
};

const getLogCountService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`common/getlogcount`, param);
  return response;
};
const getLogFieldsService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(
    `common/getCountryFieldBasedOnCountryId`,
    param
  );
  return response;
};
const getLanguageDetailsService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`common/getLanguagedetails`, param);
  return response;
};
const getAllExemptionUserViewList = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemptionviews/getallzugexemptionviewslist`, param);
  return response;
};
const addEditUserViewService = async (requestParam) => {
  const response = await Axios.post(`common/addedituserview?LogType=${requestParam.LogType}&UserId=${requestParam.UserId}&ViewId=${requestParam.ViewId}`);
  return response;
};
const EmailRequestService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.post(`rfelog/autoapprover?RFELogId=${requestParam.RFELogId}&RequestForEmpowermentStatus=${requestParam.RequestForEmpowermentStatus}`, param);
  return response;
};
const downaloadExcelManage = async(requestParam, type) => {
  const param = { params: requestParam, responseType: "blob" };
  let response;
  switch (type) {
    case "Region":
      response = await Axios.get(`region/getallregiondownload`, param);
      return response;
    case "Country":
      response = await Axios.get(`country/getallcountrydownload`, param);
      return response;
    case "Segment":
      response = await Axios.get(`segment/getallsegmentdownload`, param);
      return response;
    case "LoB":
      response = await Axios.get(`lob/getalllobdownload`, param);
      return response;
    case "SubLoB":
      response = await Axios.get(`sublob/getallsublobdownload`, param);
      return response;
    case "LoBChapter":
      response = await Axios.get(`lobchapter/getalllobchapterdownload`, param);
      return response;
    case "ZNAOrganization1":
      response = await Axios.get(`znaorganisation/getallznasegmentdownload`, param);
      return response;
    case "ZNAOrganization2":
      response = await Axios.get(`znaorganisation/getallznasbudownload`, param);
      return response;
    case "ZNAOrganization3":
      response = await Axios.get(`znaorganisation/getallmarketbasketdownload`, param);
      return response;
    case "ZNAOrganization4":
      response = await Axios.get(`znaorganisation/getallznaproductsdownload`, param);
      return response;
    case "Office":
      response = await Axios.get(`office/getallofficedownload`, param);
      return response;
    case "Branch":
      response = await Axios.get(`branch/getallbranchdownload`, param);
      return response;
    case "Currency":
      response = await Axios.get(`currency/getallcurrencydownload`, param);
      return response;
    case "CO":
      response = await Axios.get(`co/getallcodownload`, param);
      return response;
    case "UserView":
      response = await Axios.get(`userview/getalluserviewdownload`, param);
      return response;
    case "User":
      response = await Axios.get(`user/getalluserdownload`, param);
      return response;
    case "Lookup":
      response = await Axios.get(`lookup/getalllookupdownload`, param);
      return response;
    default:
      break;
  }
}

const commonService = {
  getAllExemptionUserViewList,
  uploadFileService,
  deleteFileService,
  downloadFileService,
  getToolTipService,
  sendLogNotificationService,
  setMasterdataActiveService,
  getDataVersionService,
  importExcelLogsService,
  validateActDirEmailService,
  downloadTemplateServive,
  shareLogEmailService,
  deleteLogService,
  getLogUsersService,
  getAllEntryNumbersService,
  getLogCountService,
  getLogFieldsService,
  getLanguageDetailsService,
  getMasterVersionService,
  addEditUserViewService,
  downaloadExcelManage,
  EmailRequestService
};
