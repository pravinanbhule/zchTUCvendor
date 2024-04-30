import Axios from "../services/Axios";
const getAll = (requestParam) => {
  return async (dispatch) => {
    let response = false
    try {
      if (requestParam.UserViewType === "breachlog") {
        delete requestParam.UserViewType
        response = await userViewService.getAllBreachUserViewList(
          requestParam
        );
      } else if (requestParam.UserViewType === "rfelog") {
        delete requestParam.UserViewType
        response = await userViewService.getAllRfEUserViewList(
          requestParam
        );
      } else if (requestParam.UserViewType === "exemptionlog") {
        delete requestParam.UserViewType
        if (requestParam.exemptiontype === 'zug') {
          delete requestParam.exemptiontype
          response = await userViewService.getAllZUGExemptionUserViewList(
            requestParam
            );
          } else if (requestParam.exemptiontype === 'urpm') {
          delete requestParam.exemptiontype
          response = await userViewService.getAllURPMExemptionUserViewList(
            requestParam
          );
        }
      }
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getViewsByUserId = (requestParam) => {
  return async (dispatch) => {
    let response = false
    try {
      if (requestParam.UserViewType === "breachlog") {
        delete requestParam.UserViewType
        response = await userViewService.getBreachViewOnUserId(
          requestParam
        );
      } else if (requestParam.UserViewType === "rfelog") {
        delete requestParam.UserViewType
        response = await userViewService.getRfEViewOnUserId(
          requestParam
        );
      } else if (requestParam.UserViewType === "exemptionlog") {
        delete requestParam.UserViewType
        if (requestParam.exemptiontype === 'zug') {
          delete requestParam.exemptiontype
          response = await userViewService.getZUGExemptionViewOnUserId(requestParam);
          } else if (requestParam.exemptiontype === 'urpm') {
          delete requestParam.exemptiontype
          response = await userViewService.getURPMExemptionViewOnUserId(requestParam); 
        }
      }
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

const checkIsInUse = (requestParam) => {
  return async (dispatch) => {
    let response = false
    try {
      if (requestParam.UserViewType === "breachlog") {
        delete requestParam.UserViewType
        response = await userViewService.isBreachUserViewinUse(
          requestParam
        );
      } else if (requestParam.UserViewType === "rfelog") {
        delete requestParam.UserViewType
        response = await userViewService.isRfEUserViewinUse(
          requestParam
        );
      } else if (requestParam.UserViewType === "exemptionlog") {
        delete requestParam.UserViewType
        response = await userViewService.isExemptionUserViewinUse(
          requestParam
        );
      }
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const postItem = (requestParam) => {
  return async (dispatch) => {
    let response = false
    try {
      if (requestParam.UserViewType === "breachlog") {
        delete requestParam.UserViewType
        response = await userViewService.addEditBreachUserView(
          requestParam
        );
      } else if (requestParam.UserViewType === "rfelog") {
        delete requestParam.UserViewType
        response = await userViewService.addEditRfEUserView(
          requestParam
        );
      } else if (requestParam.UserViewType === "exemptionlog") {
        delete requestParam.UserViewType
        if (requestParam.exemptiontype === 'zug') {
          response = await userViewService.addEditZUGExemptionUserView(
            requestParam
          );
        } else if (requestParam.exemptiontype === 'urpm') {
          delete requestParam.UserViewType
          response = await userViewService.addEditURPMExemptionUserView(
            requestParam
          );
        }
      }
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    let response = false
    try {
      if (requestParam.UserViewType === "breachlog") {
        delete requestParam.UserViewType
        response = await userViewService.deleteBreachUserView(
          requestParam
        );
      } else if (requestParam.UserViewType === "rfelog") {
        delete requestParam.UserViewType
        response = await userViewService.deleteRfEUserView(
          requestParam
        );
      } else if (requestParam.UserViewType === "exemptionlog") {
        delete requestParam.UserViewType
        if (requestParam.exemptiontype === 'zug') {
          response = await userViewService.deleteZUGExemptionUserView(
            requestParam
          );
        } else if (requestParam.exemptiontype === 'urpm') {
          delete requestParam.UserViewType
          response = await userViewService.deleteURPMExemptionUserView(
            requestParam
          );
        }
      }
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const userViewActions = {
  getAll,
  checkIsInUse,
  postItem,
  deleteItem,
  getViewsByUserId
};
const getAllZUGExemptionUserViewList = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemptionviews/getallzugexemptionviewslist`, param);
  return response;
};
const addEditZUGExemptionUserView = async (requestParam) => {
  const response = await Axios.post(`exemptionviews/addeditzugexemptionviews`, requestParam);
  return response;
};
const deleteZUGExemptionUserView = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`exemptionviews/deletezugexemptionviews`, param);
  return response;
};
const isZUGExemptionUserViewinUse = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemptionviews/iszugexemptionviewsnameinuse`, param);
  return response;
};
const getZUGExemptionViewOnUserId = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemptionviews/getzugviewsbasedonuserid`, param);
  return response;
};

const getAllURPMExemptionUserViewList = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemptionviews/getallurpmexemptionviewslist`, param);
  return response;
};
const addEditURPMExemptionUserView = async (requestParam) => {
  const response = await Axios.post(`exemptionviews/addediturpmexemptionviews`, requestParam);
  return response;
};
const deleteURPMExemptionUserView = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`exemptionviews/deleteurpmexemptionviews`, param);
  return response;
};
const isURPMExemptionUserViewinUse = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemptionviews/isurpmexemptionviewsnameinuse`, param);
  return response;
};
const getURPMExemptionViewOnUserId = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemptionviews/geturpmviewsbasedonuserid`, param);
  return response;
};


const getAllBreachUserViewList = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`breachViews/getallbreachviewslist`, param);
  return response;
};
const addEditBreachUserView = async (requestParam) => {
  const response = await Axios.post(`breachViews/addeditbreachviews`, requestParam);
  return response;
};
const deleteBreachUserView = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`breachViews/deletebreachViews`, param);
  return response;
};
const isBreachUserViewinUse = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`breachViews/isbreachviewsnameinUse`, param);
  return response;
};
const getBreachViewOnUserId = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`breachviews/getviewsbasedonuserid`, param);
  return response;
};


const getAllRfEUserViewList = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`rfewiews/getallrfeviewslist`, param);
  return response;
};
const addEditRfEUserView = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.post(`rfeviews/addeditrfeviews`, requestParam);
  return response;
};
const deleteRfEUserView = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`rfeviews/deleterfeviews`, param);
  return response;
};
const isRfEUserViewinUse = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`rfeviews/isrfeviewsnameinuse`, param);
  return response;
};
const getRfEViewOnUserId = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`rfeviews/getrfeviewsbasedonuserid`, param);
  return response;
};

const userViewService = {
  getAllZUGExemptionUserViewList,
  addEditZUGExemptionUserView,
  deleteZUGExemptionUserView,
  isZUGExemptionUserViewinUse,
  getZUGExemptionViewOnUserId,

  getAllURPMExemptionUserViewList,
  addEditURPMExemptionUserView,
  deleteURPMExemptionUserView,
  isURPMExemptionUserViewinUse,
  getURPMExemptionViewOnUserId,

  getAllBreachUserViewList,
  addEditBreachUserView,
  deleteBreachUserView,
  isBreachUserViewinUse,
  getBreachViewOnUserId,

  getAllRfEUserViewList,
  addEditRfEUserView,
  deleteRfEUserView,
  isRfEUserViewinUse,
  getRfEViewOnUserId
};
