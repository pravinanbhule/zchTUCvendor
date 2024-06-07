import { rfelogConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = (requestParam) => {
  const request = () => {
    return { type: rfelogConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: rfelogConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: rfelogConstants.GETALL_FAILURE, payload: error };
  };

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await rfelogService.getAllService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};

const getAllPolicyAccounts = (requestParam) => {
  const request = () => {
    return { type: rfelogConstants.GETALLACCOUNT_REQUEST };
  };
  const success = (data) => {
    return { type: rfelogConstants.GETALLACCOUNT_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: rfelogConstants.GETALLACCOUNT_FAILURE, payload: error };
  };

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await rfelogService.getAllAccountService(requestParam);
      dispatch(success(response.data));
      return response.data;
    } catch (err) {
      dispatch(failure(err));
      return false;
    }
  };
};
const getPolicyTermId = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await rfelogService.getPolicyTermIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await rfelogService.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

const postItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await rfelogService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await rfelogService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getallCount = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await rfelogService.getallCountService(requestParam);

      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getallLogs = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await rfelogService.getallLogsService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getallunderwriter = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await rfelogService.getallunderwriterService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getallLocalLinks = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await rfelogService.getallLocalLinksService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getallDeletedLogs = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await rfelogService.getallDeletedLogsService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const exportReportLogs = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await rfelogService.exportReportLogsService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

const linkedLogLogs = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await rfelogService.linkedLogsService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

const referenceLog = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await rfelogService.referenceLogsService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
}
export const rfelogActions = {
  getAll,
  getAllPolicyAccounts,
  getPolicyTermId,
  getallDeletedLogs,
  getallCount,
  getallLogs,
  getallunderwriter,
  getallLocalLinks,
  getById,
  postItem,
  deleteItem,
  exportReportLogs,
  linkedLogLogs,
  referenceLog
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`rfelog/getallrfelogs`, param);
  return response;
};
const getAllAccountService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`common/getExternalApi`, param);
  return response;
};
const getPolicyTermIdService = async (requestParam) => {
  const response = await Axios.post(`common/GetPolicyTearmId`, requestParam);
  return response;
};
const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`rfelog/getrfelog`, param);
  return response;
};

const postItemService = async (requestParam) => {
  const response = await Axios.post(`rfelog/addeditrfelog`, requestParam);
  return response;
};
const deleteItemService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`rfelog/deleterfelog`, param);
  return response;
};
const getallunderwriterService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`rfelog/getallunderwriter`, param);
  return response;
};
const getallCountService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`rfelog/getallrfelogscount`, param);
  return response;
};
const getallLogsService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`rfelog/getallrfelogs`, param);
  return response;
};
const getallLocalLinksService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`rfelog/getalllocallinks`, param);
  return response;
};
const getallDeletedLogsService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`rfelog/getalldeletedrfelogs`, param);
  return response;
};
const exportReportLogsService = async (requestParam) => {
  const param = { params: requestParam, responseType: "blob" };
  const response = await Axios.get(`rfelog/exportrfelogs`, param);
  return response;
};
const linkedLogsService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`rfelog/getlinkrfeentrynumber`, param);
  return response;
};
const referenceLogsService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`rfelog/getdatabaseonaccountcountrylob`, param);
  return response;
};
const rfelogService = {
  getAllService,
  getAllAccountService,
  getPolicyTermIdService,
  getallDeletedLogsService,
  getallCountService,
  getallLogsService,
  getByIdService,
  postItemService,
  deleteItemService,
  getallunderwriterService,
  getallLocalLinksService,
  exportReportLogsService,
  linkedLogsService,
  referenceLogsService
};
