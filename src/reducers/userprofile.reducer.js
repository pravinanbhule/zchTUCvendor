import { userprofileConstants } from "../constants";
const initialState = {
  loading: false,
  userProfile: "",
  token: "",
  isAuthenticated: false,
  isUnAuthenticated: false,
  error: "",
};
export const userprofileReducer = (state = initialState, action) => {
  switch (action.type) {
    case userprofileConstants.GETPROFILE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case userprofileConstants.SET_PROFILE_SUCCSS:
      return {
        ...state,
        userProfile: action.payload,
        loading: false,
      };
    case userprofileConstants.SET_TOKEN_SUCCSS:
      return {
        ...state,
        loading: false,
        token: action.payload,
      };
    case userprofileConstants.SET_OKTAAUTHENTICATED:
      return {
        ...state,
        isAuthenticated: true,
      };
    case userprofileConstants.SET_OKTAUNAUTHENTICATED:
      return {
        ...state,
        isUnAuthenticated: true,
      };
    default:
      return state;
  }
};
