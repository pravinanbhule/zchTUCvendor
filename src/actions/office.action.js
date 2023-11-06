import { officeConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = () => {
  const request = () => {
    return { type: officeConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: officeConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: officeConstants.GETALL_FAILURE, payload: error };
  };
  const requestParams = {};

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await officeService.getAllService(requestParams);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getAllOffice = (requestParam) => {
  const success = (data) => {
    return { type: officeConstants.GETALLOFFICE_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: officeConstants.GETALLOFFICE_FAILURE, payload: error };
  };
  let requestParams = requestParam ? requestParam : {};
  return async (dispatch) => {
    try {
      const response = await officeService.getAllOfficeService(requestParams);
      dispatch(success(response.data));
      return response.data;
    } catch (err) {
      dispatch(failure(err));
      return false;
    }
  };
};

const getUserOffice = (requestParams) => {
  return async (dispatch) => {
    try {
      const response = await officeService.getAllOfficeService(requestParams);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await officeService.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const checkNameExist = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await officeService.checkNameExistService(requestParam);
      return response.data;
    } catch (err) {}
  };
};
const checkIsInUse = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await officeService.checkIsInUseService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const postItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await officeService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await officeService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const officeActions = {
  getAll,
  getAllOffice,
  getUserOffice,
  getById,
  checkNameExist,
  checkIsInUse,
  postItem,
  deleteItem,
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`office/getallofficelist`, param);
  return response;
};
const getAllOfficeService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`office/getalloffice`, param);
  return response;
};
const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`office/getoffice`, param);
  return response;
};
const checkNameExistService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`office/isofficenameinuse`, param);
  return response;
};
const checkIsInUseService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`office/isinusecount`, param);
  return response;
};
const postItemService = async (requestParam) => {
  const response = await Axios.post(`office/addeditoffice`, requestParam);
  return response;
};
const deleteItemService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`office/deleteoffice`, param);
  return response;
};
const officeService = {
  getAllService,
  getAllOfficeService,
  getByIdService,
  checkNameExistService,
  checkIsInUseService,
  postItemService,
  deleteItemService,
};
