import { currencyConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  currencyItems: [],
  error: "",
};
export const currencyReducer = (state = initialState, action) => {
  switch (action.type) {
    case currencyConstants.GETALL_REQUEST:
      return {
        ...state,
        items: [],
        loading: true,
      };
    case currencyConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case currencyConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case currencyConstants.GETALLCURRENCY_SUCCESS:
      return {
        ...state,
        currencyItems: action.payload,
      };
    case currencyConstants.GETALLCURRENCY_FAILURE:
      return {
        ...state,
        currencyItems: [],
      };
    default:
      return state;
  }
};
