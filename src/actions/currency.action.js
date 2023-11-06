import { currencyConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = () => {
  const request = () => {
    return { type: currencyConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: currencyConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: currencyConstants.GETALL_FAILURE, payload: error };
  };
  const requestParams = {};

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await currencyService.getAllService(requestParams);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getAllCurrency = (requestParam) => {
  const success = (data) => {
    return { type: currencyConstants.GETALLCURRENCY_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: currencyConstants.GETALLCURRENCY_FAILURE, payload: error };
  };
  let requestParams = requestParam ? requestParam : {};
  return async (dispatch) => {
    try {
      const response = await currencyService.getAllCurrencyService(
        requestParams
      );
      dispatch(success(response.data));
      return response.data;
    } catch (err) {
      dispatch(failure(err));
      return false;
    }
  };
};

const getUserCurrency = (requestParams) => {
  return async (dispatch) => {
    try {
      const response = await currencyService.getAllCurrencyService(
        requestParams
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await currencyService.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const checkNameExist = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await currencyService.checkNameExistService(
        requestParam
      );
      return response.data;
    } catch (err) {}
  };
};
const checkIsInUse = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await currencyService.checkIsInUseService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const postItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await currencyService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await currencyService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const currencyActions = {
  getAll,
  getAllCurrency,
  getUserCurrency,
  getById,
  checkNameExist,
  checkIsInUse,
  postItem,
  deleteItem,
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`currency/getallcurrencylist`, param);
  return response;
};
const getAllCurrencyService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`currency/getallcurrency`, param);
  return response;
};
const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`currency/getcurrency`, param);
  return response;
};
const checkNameExistService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`currency/iscurrencynameinuse`, param);
  return response;
};
const checkIsInUseService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`currency/isinusecount`, param);
  return response;
};
const postItemService = async (requestParam) => {
  const response = await Axios.post(`currency/addeditcurrency`, requestParam);
  return response;
};
const deleteItemService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`currency/deletecurrency`, param);
  return response;
};
const currencyService = {
  getAllService,
  getAllCurrencyService,
  getByIdService,
  checkNameExistService,
  checkIsInUseService,
  postItemService,
  deleteItemService,
};
