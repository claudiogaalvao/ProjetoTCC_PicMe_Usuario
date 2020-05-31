import Action from "../../models/common/action-model";
import { LOGIN_IS_LOADING, LOGIN_ERROR, LOGIN_SUCCESS, LOGIN_SIGN_OUT } from "../actions/login";

const initialState = {
  isLoading: false,
  error: null,
  user: null
}

export default (state = initialState, action: Action<any>) => {
  switch (action.type) {

  case LOGIN_IS_LOADING:
    return { ...state, isLoading: action.payload };

  case LOGIN_ERROR:
    return { ...state, error: action.payload, isLoading: false };

  case LOGIN_SUCCESS:
    return { ...state, user: action.payload, isLoading: false };

  default:
    return state
  }
};
