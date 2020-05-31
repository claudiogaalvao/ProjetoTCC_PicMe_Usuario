import { auth, firestore } from "react-native-firebase";
import Collections from "../utils/collections.utils";
import UserModel from "../models/firebase/user-model";
import { setUser } from "../store/actions/home";

let profileChangeListener = null;
let authListener = null;

const AuthenticationMiddleware = store => next => action => {
  try {
    if (authListener) {
      return;
    }

    authListener = auth().onAuthStateChanged((user) => {
      if (profileChangeListener) {
        profileChangeListener();
      }

      if (user && user.uid) {
        profileChangeListener = firestore().collection(Collections.USERS)
        .doc(user.uid).onSnapshot((documentSnapshot) => {
          if (!documentSnapshot.exists) {
            auth().signOut();
            return;
          }

          const data = documentSnapshot.data() as UserModel;
          store.dispatch(setUser(data));
        });
      }
    });
  } catch (exception) {
    console.error(exception);
  } finally {
    return next(action);
  }
}

export default AuthenticationMiddleware;