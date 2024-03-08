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
export const coActions = {
  getAll,
  postItem,
  putItem,
  deleteItem,
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`co/getallcolist`, param);
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
const coService = {
  getAllService,
  postItemService,
  deleteItemService,
};
