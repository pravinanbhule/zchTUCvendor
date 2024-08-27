import { userprofileConstants } from "../constants";
import Axios from "../services/Axios";

const setUserProfile = (profile) => {
  return {
    type: userprofileConstants.SET_PROFILE_SUCCSS,
    payload: profile,
  };
};
const setOktaToken = (token) => {
  return {
    type: userprofileConstants.SET_TOKEN_SUCCSS,
    payload: token,
  };
};
const setOktaAuthenticated = () => {
  return {
    type: userprofileConstants.SET_OKTAAUTHENTICATED,
  };
};
const setOktaUnAuthenticated = () => {
  return {
    type: userprofileConstants.SET_OKTAUNAUTHENTICATED,
  };
};
const getUserProfile = (requestParams) => {
  const request = () => {
    return { type: userprofileConstants.GETPROFILE_REQUEST };
  };
  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await userProfileService.getUserProfileService(
        requestParams
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getMultiUserProfile = (requestParams) => {
  const request = () => {
    return { type: userprofileConstants.GETPROFILE_REQUEST };
  };
  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await userProfileService.getMultiUserProfileService(
        requestParams
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getAdUserProfile = (requestParams) => {
  const request = () => {
    return { type: userprofileConstants.GETPROFILE_REQUEST };
  };
  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await userProfileService.getADUserProfileService(
        requestParams
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const userprofileActions = {
  getUserProfile,
  getMultiUserProfile,
  getAdUserProfile,
  setUserProfile,
  setOktaToken,
  setOktaAuthenticated,
  setOktaUnAuthenticated,
};

const getUserProfileService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`user/getuserdetailbyemail`, param);
  return response;
};
const getMultiUserProfileService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`user/getalluserdetailbyemail`, param);
  return response;
};
const getADUserProfileService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`user/getaduserdetailsbyemail`, param);
  return response;
};
const userProfileService = {
  getUserProfileService,
  getMultiUserProfileService,
  getADUserProfileService
};
