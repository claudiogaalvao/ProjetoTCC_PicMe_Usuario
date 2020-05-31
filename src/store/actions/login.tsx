import { RNFirebase } from 'react-native-firebase';
import Action from '../../models/common/action-model';

export const LOGIN_IS_LOADING = 'LOGIN_IS_LOADING';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const loginIsLoading = (bool: boolean): Action<boolean> => ({
  type: LOGIN_IS_LOADING,
  payload: bool
});

export const loginSuccess = (credential: RNFirebase.User): Action<RNFirebase.User> => ({
  type: LOGIN_SUCCESS,
  payload: credential
});

export const loginError = (message: string): Action<string> => ({
  type: LOGIN_ERROR,
  payload: message
});