import { exemptionlogConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = (requestParam) => {
  const request = () => {
    return { type: exemptionlogConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: exemptionlogConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: exemptionlogConstants.GETALL_FAILURE, payload: error };
  };

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await exemptionlogService.getAllService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getallZUGLogs = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.getallZUGLogsService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getallZUGCount = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.getallZUGCountService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getallURPMCount = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.getallURPMCountService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getByIdZUG = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.getByIdZUGService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

const postItemZUG = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.postItemZUGService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItemZUG = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.deleteItemZUGService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

const getallZUGunderwriter = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.getallZUGunderwriterService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

const getallURPMLogs = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.getallURPMLogsService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getURPMApprover = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.getURPMApproverService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getByIdURPM = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.getByIdURPMService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

const postItemURPM = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.postItemURPMService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getallZUGDeletedLogs = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.getallZUGDeletedLogsService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getallURPMDeletedLogs = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.getallURPMDeletedLogsService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const exportReportZUGLogs = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.exportReportZUGLogsService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const exportReportURPMLogs = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.exportReportURPMLogsService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const exemptionlogActions = {
  getAll,
  getallZUGDeletedLogs,
  getallURPMDeletedLogs,
  getallZUGCount,
  getallURPMCount,
  getallZUGLogs,
  getallZUGunderwriter,
  getByIdZUG,
  postItemZUG,
  deleteItemZUG,
  getURPMApprover,
  getallURPMLogs,
  getByIdURPM,
  postItemURPM,
  exportReportZUGLogs,
  exportReportURPMLogs,
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemption/getallzugexemptionlog`, param);
  return response;
};
const getallZUGCountService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(
    `exemption/getallzugexemptionlogcount`,
    param
  );
  return response;
};
const getallURPMCountService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(
    `exemption/getallurpmexemptionlogcount`,
    param
  );
  return response;
};
const getallZUGLogsService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemption/getallzugexemptionlog`, param);
  return response;
};
const getByIdZUGService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemption/getzugexemptionlog`, param);
  return response;
};

const postItemZUGService = async (requestParam) => {
  const response = await Axios.post(
    `exemption/addeditzugexemptionlog`,
    requestParam
  );
  return response;
};
const deleteItemZUGService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`rfelog/deleterfelog`, param);
  return response;
};
const getallZUGunderwriterService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`rfelog/getallunderwriter`, param);
  return response;
};

const getallURPMLogsService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemption/getallurpmexemptionlog`, param);
  return response;
};
const getByIdURPMService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemption/geturpmexemptionlog`, param);
  return response;
};
const getURPMApproverService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemption/geturpmapproverusers`, param);
  return response;
};
const postItemURPMService = async (requestParam) => {
  const response = await Axios.post(
    `exemption/addediturpmexemptionlog`,
    requestParam
  );
  return response;
};
const getallZUGDeletedLogsService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(
    `exemption/getalldeletedzugexemptionlog`,
    param
  );
  return response;
};
const getallURPMDeletedLogsService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(
    `exemption/getalldeletedURPMexemptionlog`,
    param
  );
  return response;
};
const exportReportZUGLogsService = async (requestParam) => {
  const param = { params: requestParam, responseType: "blob" };
  const response = await Axios.get(`exemption/exportzugexemptionLog`, param);
  return response;
};
const exportReportURPMLogsService = async (requestParam) => {
  const param = { params: requestParam, responseType: "blob" };
  const response = await Axios.get(`exemption/exporturpmexemptionLog`, param);
  return response;
};
const exemptionlogService = {
  getAllService,
  getallZUGDeletedLogsService,
  getallURPMDeletedLogsService,
  getallZUGCountService,
  getallURPMCountService,
  getallZUGLogsService,
  getByIdZUGService,
  postItemZUGService,
  deleteItemZUGService,
  getallZUGunderwriterService,
  getURPMApproverService,
  getallURPMLogsService,
  getByIdURPMService,
  postItemURPMService,
  exportReportZUGLogsService,
  exportReportURPMLogsService,
};
