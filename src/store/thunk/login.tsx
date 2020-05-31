import { loginIsLoading, loginError, loginSuccess } from "../actions/login";
import firebase from "react-native-firebase";
import Collections from "../../utils/collections.utils";

export function login(email: string, password: string) {
  return async (dispatch: Function) => {
    try {
      dispatch(loginIsLoading(true));

      if (email == '' || password == '') {
        throw { message: 'Preencha todos os campos para autenticar' } as Error;
      }

      const documents = await firebase.firestore()
      .collection(Collections.USERS).where('email', '==', email).get();
      
      if (documents.empty) {
        throw { message: 'Usuário não existe' } as Error;
      }

      const credential = await firebase.auth().signInWithEmailAndPassword(email, password);
      dispatch(loginSuccess(credential.user));
    } catch (exception) {
      dispatch(loginError(exception.message));
    }
  }
}