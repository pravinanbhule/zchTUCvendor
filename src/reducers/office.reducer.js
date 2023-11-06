import { officeConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  officeItems: [],
  error: "",
};
export const officeReducer = (state = initialState, action) => {
  switch (action.type) {
    case officeConstants.GETALL_REQUEST:
      return {
        ...state,
        items: [],
        loading: true,
      };
    case officeConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case officeConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case officeConstants.GETALLOFFICE_SUCCESS:
      return {
        ...state,
        officeItems: action.payload,
      };
    case officeConstants.GETALLOFFICE_FAILURE:
      return {
        ...state,
        officeItems: [],
      };
    default:
      return state;
  }
};
