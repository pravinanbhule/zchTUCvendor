import { coConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  coItems: [],
  error: "",
};
export const coReducer = (state = initialState, action) => {
  switch (action.type) {
    case coConstants.GETALL_REQUEST:
      return {
        ...state,
        items: [],
        loading: true,
      };
    case coConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case coConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case coConstants.GETALLTOKEN_SUCCESS:
      return {
        ...state,
        coItems: action.payload,
      };
    case coConstants.GETALLTOKEN_FAILURE:
      return {
        ...state,
        coItems: [],
      };
    default:
      return state;
  }
};