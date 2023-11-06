import { znaorgnization4Constants } from "../constants";
import Axios from "../services/Axios";
const getAll = () => {
  const request = () => {
    return { type: znaorgnization4Constants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: znaorgnization4Constants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: znaorgnization4Constants.GETALL_FAILURE, payload: error };
  };
  const requestParams = {
    PageIndex: 1,
    PageSize: 500,
  };

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await Orgnization4Service.getAllService(requestParams);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getAllOrgnization = (requestParam) => {
  const success = (data) => {
    return {
      type: znaorgnization4Constants.GETALLORGNIZATION_SUCCESS,
      payload: data,
    };
  };
  const failure = (error) => {
    return {
      type: znaorgnization4Constants.GETALLORGNIZATION_FAILURE,
      payload: error,
    };
  };
  let requestParams = requestParam ? requestParam : {};
  /*const requestParams = {
    PageIndex: 1,
    PageSize: 50,
  };*/
  return async (dispatch) => {
    try {
      const response = await Orgnization4Service.getAllOrgnization4Service(
        requestParams
      );
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await Orgnization4Service.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const checkNameExist = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await Orgnization4Service.checkNameExistService(
        requestParam
      );
      return response.data;
    } catch (err) {}
  };
};
const checkIsInUse = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await Orgnization4Service.checkIsInUseService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const postItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await Orgnization4Service.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await Orgnization4Service.deleteItemService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const znaorgnization4Actions = {
  getAll,
  getAllOrgnization,
  getById,
  checkNameExist,
  checkIsInUse,
  postItem,
  deleteItem,
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`znaorganisation/getallznaproducts`, param);
  return response;
};
const getAllOrgnization4Service = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`znaorganisation/getallznaproducts`, param);
  return response;
};
const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`znaorganisation/getznaproducts`, param);
  return response;
};
const checkNameExistService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(
    `znaorganisation/isznafieldnameinuse`,
    param
  );
  return response;
};
const checkIsInUseService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`znaorganisation/isinusecount`, param);
  return response;
};
const postItemService = async (requestParam) => {
  const response = await Axios.post(
    `znaorganisation/addeditznaproducts`,
    requestParam
  );
  return response;
};
const deleteItemService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(
    `znaorganisation/deletznaorganisation`,
    param
  );
  return response;
};
const Orgnization4Service = {
  getAllService,
  getAllOrgnization4Service,
  getByIdService,
  checkNameExistService,
  checkIsInUseService,
  postItemService,
  deleteItemService,
};
