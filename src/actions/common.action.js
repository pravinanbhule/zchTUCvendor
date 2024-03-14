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

export const commonActions = {
  uploadFile,
  deleteFile,
  downloadFile,
  downloadTemplate,
  getToolTip,
  sendLogNotification,
  setMasterdataActive,
  getDataVersion,
  importExcelLogs,
  validateActDirEmail,
  shareLogEmail,
  deleteLog,
  getLogUsers,
  getAllEntryNumbers,
  getLogCount,
  getLogFields,
  getLanguageDetails
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

const commonService = {
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
  getLanguageDetailsService
};
