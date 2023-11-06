import { znaorgnization4Constants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  org4Items: [],
  error: "",
};
export const znaorgnization4Reducer = (state = initialState, action) => {
  switch (action.type) {
    case znaorgnization4Constants.GETALL_REQUEST:
      return {
        ...state,
        items: [],
        loading: true,
      };
    case znaorgnization4Constants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case znaorgnization4Constants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case znaorgnization4Constants.GETALLORGNIZATION_SUCCESS:
      return {
        ...state,
        org4Items: action.payload,
      };
    case znaorgnization4Constants.GETALLORGNIZATION_FAILURE:
      return {
        ...state,
        org4Items: [],
      };
    default:
      return state;
  }
};
