import { coConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = () => {
  const request = () => {
    return { type: coConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: coConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: coConstants.GETALL_FAILURE, payload: error };
  };
  const requestParams = {};

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await coService.getAllService(requestParams);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await coService.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const checkNameExist = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await coService.checkNameExistService(requestParam);
      return response.data;
    } catch (err) {}
  };
};
const checkIsInUse = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await coService.checkIsInUseService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const postItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await coService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const putItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await coService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await coService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const downloadCO = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await coService.downloadService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const coActions = {
  getAll,
  getById,
  checkNameExist,
  checkIsInUse,
  postItem,
  putItem,
  deleteItem,
  downloadCO
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`co/getallcolist`, param);
  return response;
};
const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`co/getco`, param);
  return response;
};
const checkNameExistService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`co/isconameinuse`, param);
  return response;
};
const checkIsInUseService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`co/isinusecount`, param);
  return response;
};
const postItemService = async (requestParam) => {
    const response = await Axios.post(`co/addeditco`, requestParam);
    return response;
};
const deleteItemService = async (requestParam) => {
    const param = { params: requestParam };
    const response = await Axios.delete(`co/deleteco`, param);
    return response;
};
const downloadService = async (requestParam) => {
  const param = { params: requestParam, responseType: "blob" };
  const response = await Axios.get(`co/getallcodownload`, param);
  return response;
};
const coService = {
  getAllService,
  getByIdService,
  checkNameExistService,
  checkIsInUseService,
  postItemService,
  deleteItemService,
  downloadService
};
