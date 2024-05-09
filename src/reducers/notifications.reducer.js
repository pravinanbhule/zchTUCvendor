import { notificationsConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  notificationsItems: [],
  error: "",
};
export const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case notificationsConstants.GETALL_REQUEST:
      return {
        ...state,
        items: [],
        loading: true,
      };
    case notificationsConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case notificationsConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case notificationsConstants.GETALLOFFICE_SUCCESS:
      return {
        ...state,
        notificationsItems: action.payload,
      };
    case notificationsConstants.GETALLOFFICE_FAILURE:
      return {
        ...state,
        notificationsItems: [],
      };
    default:
      return state;
  }
};
