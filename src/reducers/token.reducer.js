import { tokenConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  tokenItems: [],
  error: "",
};
export const tokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case tokenConstants.GETALL_REQUEST:
      return {
        ...state,
        items: [],
        loading: true,
      };
    case tokenConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case tokenConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case tokenConstants.GETALLTOKEN_SUCCESS:
      return {
        ...state,
        tokenItems: action.payload,
      };
    case tokenConstants.GETALLTOKEN_FAILURE:
      return {
        ...state,
        tokenItems: [],
      };
    default:
      return state;
  }
};
