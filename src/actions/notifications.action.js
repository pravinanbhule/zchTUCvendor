import { notificationsConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = () => {
  const request = () => {
    return { type: notificationsConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: notificationsConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: notificationsConstants.GETALL_FAILURE, payload: error };
  };
  const requestParams = {};

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await notificationsService.getAllService(requestParams);
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
export const notificationsActions = {
  getAll,
  getById,
  postItem,
  deleteItem,
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
const notificationsService = {
  getAllService,
  getByIdService,
  postItemService,
  deleteItemService,
};
