import firebase from "react-native-firebase";
import Collections from "../utils/collections.utils";
import FirebaseUserModel from "../models/firebase/user-model";
import { GeoFirestore } from "geofirestore";
import LocationModel from "../models/firebase/location-model";

export default class FirebaseProfileService {
  static updatePosition = async (userPosition: LocationModel) => {
    const user = firebase.auth().currentUser;

    if (!user) {
      throw 'User not logged in.';
    }

    // @ts-ignore
    const geoFirestore = new GeoFirestore(firebase.firestore());
    
    const geoCollection = geoFirestore.collection(Collections.LOCATIONS);

    await geoCollection.doc(user.uid).set(userPosition);
  }

  static getUserDetails = async (userId: string): Promise<FirebaseUserModel> => {
    const document = await firebase.firestore().collection(Collections.USERS).doc(userId).get();

    if (document.exists) {
      return document.data() as FirebaseUserModel;
    } else {
      throw { message: 'No user found with id.' };
    }
  }

  static isEmailAvailable = async (email: string) => {
    const user = await firebase.firestore().collection(Collections.USERS).where('email', '==', email).get();
    const photographer = await firebase.firestore().collection(Collections.PHOTOGRAPHERS).where('email', '==', email).get();

    return (user.empty && photographer.empty);
  }
}