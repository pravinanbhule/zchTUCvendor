import { rfelogConstants } from "../constants";

const initialState = {
  loading: true,
  items: [],
  accounts: [],
  error: "",
};
export const rfelogReducer = (state = initialState, action) => {
  switch (action.type) {
    case rfelogConstants.GETALL_REQUEST:
      return {
        ...state,
        items: [],
        loading: true,
      };
    case rfelogConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case rfelogConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case rfelogConstants.GETALLACCOUNT_REQUEST:
      return {
        ...state,
        accounts: [],
      };
    case rfelogConstants.GETALLACCOUNT_SUCCESS:
      return {
        ...state,
        accounts: action.payload,
      };
    case rfelogConstants.GETALLACCOUNT_FAILURE:
      return {
        ...state,
        accounts: [],
        error: action.payload,
      };
    default:
      return state;
  }
};
