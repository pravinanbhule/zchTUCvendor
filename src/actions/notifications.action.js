import { notificationsConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = (requestParam) => {
  const request = () => {
    return { type: notificationsConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: notificationsConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: notificationsConstants.GETALL_FAILURE, payload: error };
  };

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await notificationsService.getAllService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await notificationsService.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const postItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await notificationsService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await notificationsService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const checkNameExist = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await notificationsService.checkNameExistService(requestParam);
      return response.data;
    } catch (err) {}
  };
};
export const notificationsActions = {
  getAll,
  getById,
  postItem,
  deleteItem,
  checkNameExist
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`common/getalllognotification`, param);
  return response;
};
const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`common/getlognotification`, param);
  return response;
};
const postItemService = async (requestParam) => {
  const response = await Axios.post(`common/addeditlognotification`, requestParam);
  return response;
};
const deleteItemService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`common/deletelognotification`, param);
  return response;
};
const checkNameExistService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`common/islognotificationinuse`, param);
  return response;
};
const notificationsService = {
  getAllService,
  getByIdService,
  postItemService,
  deleteItemService,
  checkNameExistService
};
