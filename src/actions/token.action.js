import { tokenConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = () => {
  const request = () => {
    return { type: tokenConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: tokenConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: tokenConstants.GETALL_FAILURE, payload: error };
  };
  const requestParams = {};

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await tokenService.getAllService(requestParams);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const postItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await tokenService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const putItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await tokenService.putItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await tokenService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const tokenActions = {
  getAll,
  postItem,
  putItem,
  deleteItem,
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`getAllTokenDetails`, param);
  return response;
};
const postItemService = async (requestParam) => {
  const response = await Axios.get(`generateToken?emailAddress=${requestParam.emailAddress}&applicationId=${requestParam.applicationId}`)
  return response;
};
const putItemService = async (requestParam) => {
  const response = await Axios.get(`generateToken?emailAddress=${requestParam.emailAddress}&applicationId=${requestParam.applicationId}&tokenId=${requestParam.tokenId}`)
  return response;
};
const deleteItemService = async (requestParam) => {
  const response = await Axios.delete(`deleteToken?TokenId=${requestParam.tokenId}`);
  return response;
};
const tokenService = {
  getAllService,
  postItemService,
  putItemService,
  deleteItemService,
};
