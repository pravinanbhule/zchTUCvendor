import { branchConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  branchItems: [],
  error: "",
};
export const branchReducer = (state = initialState, action) => {
  switch (action.type) {
    case branchConstants.GETALL_REQUEST:
      return {
        ...state,
        items: [],
        loading: true,
      };
    case branchConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case branchConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case branchConstants.GETALLBRANCH_SUCCESS:
      return {
        ...state,
        branchItems: action.payload,
      };
    case branchConstants.GETALLBRANCH_FAILURE:
      return {
        ...state,
        branchItems: [],
      };
    default:
      return state;
  }
};
