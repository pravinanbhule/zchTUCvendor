import { branchConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = () => {
  const request = () => {
    return { type: branchConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: branchConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: branchConstants.GETALL_FAILURE, payload: error };
  };
  const requestParams = {};

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await branchService.getAllService(requestParams);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getAllBranch = (requestParam) => {
  const success = (data) => {
    return { type: branchConstants.GETALLBRANCH_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: branchConstants.GETALLBRANCH_FAILURE, payload: error };
  };
  let requestParams = requestParam ? requestParam : {};
  return async (dispatch) => {
    try {
      const response = await branchService.getAllBranchService(requestParams);
      dispatch(success(response.data));
      return response.data;
    } catch (err) {
      dispatch(failure(err));
      return false;
    }
  };
};

const getUserBranch = (requestParams) => {
  return async (dispatch) => {
    try {
      const response = await branchService.getAllBranchService(requestParams);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await branchService.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const checkNameExist = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await branchService.checkNameExistService(requestParam);
      return response.data;
    } catch (err) {}
  };
};
const checkIsInUse = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await branchService.checkIsInUseService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const postItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await branchService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await branchService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const branchActions = {
  getAll,
  getAllBranch,
  getUserBranch,
  getById,
  checkNameExist,
  checkIsInUse,
  postItem,
  deleteItem,
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`branch/getallbranchlist`, param);
  return response;
};
const getAllBranchService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`branch/getallbranch`, param);
  return response;
};
const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`branch/getbranch`, param);
  return response;
};
const checkNameExistService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`branch/isbranchnameinuse`, param);
  return response;
};
const checkIsInUseService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`branch/isinusecount`, param);
  return response;
};
const postItemService = async (requestParam) => {
  const response = await Axios.post(`branch/addeditbranch`, requestParam);
  return response;
};
const deleteItemService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`branch/deletebranch`, param);
  return response;
};
const branchService = {
  getAllService,
  getAllBranchService,
  getByIdService,
  checkNameExistService,
  checkIsInUseService,
  postItemService,
  deleteItemService,
};
