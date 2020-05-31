import { GeolocationReturnType } from "react-native";
import { RNFirebase } from "react-native-firebase";
import LocationModel from "../../models/firebase/location-model";
import UserModel from "../../models/firebase/user-model";
import RequestModel from "../../models/firebase/request-model";

export const HOME_SET_LOCATIONS = 'HOME_SET_LOCATIONS';
export const HOME_LOCATIONS_FROM_DOCS = 'HOME_LOCATIONS_FROM_DOCS';
export const HOME_CURRENT_POSITION_UPDATE = 'HOME_CURRENT_POSITION_UPDATE';
export const HOME_FIREBASE_POSITION_UPDATE = 'HOME_FIREBASE_POSITION_UPDATE';
export const HOME_SET_EQUIPMENT = 'HOME_SET_EQUIPMENT';
export const HOME_SET_USER = 'HOME_SET_USER';
export const HOME_SIGN_OUT = 'HOME_SIGN_OUT';
export const HOME_SET_CURRENT_REQUEST = 'HOME_SET_CURRENT_REQUEST';

export const setLocations = (locations: LocationModel[]) => ({
  type: HOME_SET_LOCATIONS,
  payload: locations
});

export const getLocationsFromDocs = (docs: RNFirebase.firestore.DocumentSnapshot[]) => ({
  type: HOME_LOCATIONS_FROM_DOCS,
  payload: docs
});

export const updateCurrentPosition = (position: GeolocationReturnType) => ({
  type: HOME_CURRENT_POSITION_UPDATE,
  payload: position
});

export const updateFirebasePosition = (location: LocationModel) => ({
  type: HOME_FIREBASE_POSITION_UPDATE,
  payload: location
});

export const setEquipment = (equipment: String) => ({
  type: HOME_SET_EQUIPMENT,
  payload: equipment
});

export const setUser = (user: UserModel) => ({
  type: HOME_SET_USER,
  payload: user
});

export const signOut = () => ({
  type: HOME_SIGN_OUT
});

export const setCurrentRequest = (request: RequestModel) => ({
  type: HOME_SET_CURRENT_REQUEST,
  payload: request
});