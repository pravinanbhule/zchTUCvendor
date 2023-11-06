import { dashboardConstants } from "../constants";
import Axios from "../services/Axios";
const setDashboardClick = (value) => {
  return {
    type: dashboardConstants.SETDASHBOARD_LINK,
    payload: value,
  };
};
const clearDashboardClick = () => {
  return {
    type: dashboardConstants.CLEARDASHBOARD_LINK,
  };
};
const getBreachlogCount = (requestParam) => {
  const success = (data) => {
    return {
      type: dashboardConstants.GETBREACHLOGCOUNT_SUCCESS,
      payload: data,
    };
  };
  const failure = (error) => {
    return {
      type: dashboardConstants.GETBREACHLOGCOUNT_FAILURE,
      payload: error,
    };
  };

  return async (dispatch) => {
    try {
      const response = await dashboardService.getBreachlogCountService(
        requestParam
      );
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getRFElogCount = (requestParam) => {
  const success = (data) => {
    return {
      type: dashboardConstants.GETRFELOGCOUNT_SUCCESS,
      payload: data,
    };
  };
  const failure = (error) => {
    return {
      type: dashboardConstants.GETRFELOGCOUNT_FAILURE,
      payload: error,
    };
  };

  return async (dispatch) => {
    try {
      const response = await dashboardService.getRFElogCountService(
        requestParam
      );
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};

const getExemptionlogCount = (requestParam) => {
  const success = (data) => {
    return {
      type: dashboardConstants.GETEXEMPTIONLOGCOUNT_SUCCESS,
      payload: data,
    };
  };
  const failure = (error) => {
    return {
      type: dashboardConstants.GETEXEMPTIONLOGCOUNT_FAILURE,
      payload: error,
    };
  };

  return async (dispatch) => {
    try {
      const response = await dashboardService.getExemptionlogCountService(
        requestParam
      );
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
export const dashboardActions = {
  setDashboardClick,
  clearDashboardClick,
  getBreachlogCount,
  getRFElogCount,
  getExemptionlogCount,
};
const getBreachlogCountService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`breachlog/breachlogdashboard`, param);
  return response;
};
const getRFElogCountService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`rfelog/rfelogdashboard`, param);
  return response;
};
const getExemptionlogCountService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemption/exemptionlogdashboard`, param);
  return response;
};
const dashboardService = {
  getBreachlogCountService,
  getRFElogCountService,
  getExemptionlogCountService,
};
