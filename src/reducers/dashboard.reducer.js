import { dashboardConstants } from "../constants";
const initialState = {
  logType: "",
  status: "",
  breachlogcount: {},
  reflogcount: {},
  exemptionlogcount: {},
};
export const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case dashboardConstants.SETDASHBOARD_LINK:
      return {
        ...state,
        logType: action.payload.logType,
        status: action.payload.status,
      };
    case dashboardConstants.CLEARDASHBOARD_LINK:
      return {
        ...state,
        logType: "",
        status: "",
      };
    case dashboardConstants.GETBREACHLOGCOUNT_SUCCESS:
      return {
        ...state,
        breachlogcount: action.payload,
      };
    case dashboardConstants.GETBREACHLOGCOUNT_FAILURE:
      return {
        ...state,
        breachlogcount: {},
      };
    case dashboardConstants.GETRFELOGCOUNT_SUCCESS:
      return {
        ...state,
        reflogcount: action.payload,
      };
    case dashboardConstants.GETRFELOGCOUNT_FAILURE:
      return {
        ...state,
        reflogcount: {},
      };
    case dashboardConstants.GETEXEMPTIONLOGCOUNT_SUCCESS:
      return {
        ...state,
        exemptionlogcount: action.payload,
      };
    case dashboardConstants.GETEXEMPTIONLOGCOUNT_FAILURE:
      return {
        ...state,
        exemptionlogcount: {},
      };
    default:
      return state;
  }
};
