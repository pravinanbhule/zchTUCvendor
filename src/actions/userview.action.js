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
        response = await userViewService.getAllExemptionUserViewList(
          requestParam
        );
      }
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
// const getById = (requestParam) => {
//   return async (dispatch) => {
//     let response = false
//     try {
//       if (requestParam.UserViewType === "breachlog") {
//         delete requestParam.UserViewType
//         response = await userViewService.getBreachViewOnUserId(
//           requestParam
//         );
//       } else if (requestParam.UserViewType === "rfelog") {
//         delete requestParam.UserViewType
//         response = await userViewService.getRfEViewOnUserId(
//           requestParam
//         );
//       } else if (requestParam.UserViewType === "exemptionlog") {
//         delete requestParam.UserViewType
//         response = await userViewService.getExemptionViewOnUserId(
//           requestParam
//         );
//       }
//       return response.data;
//     } catch (err) {
//       return false;
//     }
//   };
// };

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
        response = await userViewService.addEditExemptionUserView(
          requestParam
        );
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
        response = await userViewService.deleteExemptionUserView(
          requestParam
        );
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
};
const getAllExemptionUserViewList = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemptionviews/getallzugexemptionviewslist`, param);
  return response;
};
const addEditExemptionUserView = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.post(`exemptionviews/addeditzugexemptionviews`, param);
  return response;
};
const deleteExemptionUserView = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`exemptionviews/deletezugexemptionviews`, param);
  return response;
};
const isExemptionUserViewinUse = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemptionviews/iszugexemptionviewsnameinuse`, param);
  return response;
};
const getExemptionViewOnUserId = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemptionviews/getzugviewsbasedonuserid`, param);
  return response;
};


const getAllBreachUserViewList = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`breachViews/getallbreachviewslist`, param);
  return response;
};
const addEditBreachUserView = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.post(`breachViews/addeditbreachviews`, param);
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
  getAllExemptionUserViewList,
  addEditExemptionUserView,
  deleteExemptionUserView,
  isExemptionUserViewinUse,
  getExemptionViewOnUserId,

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
