import { HOME_SET_LOCATIONS, HOME_CURRENT_POSITION_UPDATE, HOME_FIREBASE_POSITION_UPDATE, HOME_LOCATIONS_FROM_DOCS, HOME_SET_EQUIPMENT, HOME_SET_USER, HOME_SIGN_OUT, HOME_SET_CURRENT_REQUEST } from "../actions/home";
import Action from "../../models/common/action-model";
import { StatusEnum } from "../../models/enum/status-enum";
import UserPositionModel from "../../models/common/user-position-model";
import { GeolocationReturnType } from "react-native";
import { auth, RNFirebase } from "react-native-firebase";
import { GeoPoint } from "react-native-firebase/firestore";
import PhotographerService from "../../services/firebase-photographer-service";
import LocationModel from "../../models/firebase/location-model";
import UserModel from "../../models/firebase/user-model";
import RequestModel from "../../models/firebase/request-model";

export interface HomeState {
  nearLocations?: LocationModel[],
  status?: StatusEnum,
  currentPosition?: UserPositionModel,
  firebaseCurrentPosition?: LocationModel,
  selectedEquipment?: string,
  user?: UserModel,
  activeRequest?: RequestModel
}

const initialState: HomeState = {
  nearLocations: [],
  status: StatusEnum.OFFLINE,
  currentPosition: { latitude: 0, longitude: 0, latitudeDelta: 0.01, longitudeDelta: 0.01 },
  firebaseCurrentPosition: {
    isPhotographer: false,
    lastUpdate: new Date(),
    coordinates: { latitude: 0, longitude: 0 } as GeoPoint,
    status: StatusEnum.ONLINE,
    userId: null
  },
  selectedEquipment: null,
  user: null,
}

export default (state: HomeState = initialState, action: Action<any>): HomeState => {
  switch (action.type) {

  case HOME_SET_LOCATIONS:
    return { ...state, nearLocations: action.payload };

  case HOME_LOCATIONS_FROM_DOCS: {
    const docs: RNFirebase.firestore.DocumentSnapshot[] = action.payload;
    const locations: LocationModel[] = [];

    for (const doc of docs) {
      const location = doc.data() as LocationModel;

      locations.push(location);
    }

    const filteredLocations = PhotographerService.getFilteredResult(locations, state.selectedEquipment);
    return { ...state, nearLocations: filteredLocations };
  }

  case HOME_CURRENT_POSITION_UPDATE: {
    const position: GeolocationReturnType = action.payload;

    const userPosition = { ... state.currentPosition};
    userPosition.latitude = position.coords.latitude;
    userPosition.longitude = position.coords.longitude;

    return { ...state, currentPosition: userPosition };
  }

  case HOME_FIREBASE_POSITION_UPDATE: {
    const resultLocation: LocationModel = state.firebaseCurrentPosition;
    const location = action.payload as LocationModel;
    
    if (location.isPhotographer) {
      resultLocation.isPhotographer = location.isPhotographer;
    }

    if (location.coordinates.latitude && location.coordinates.longitude) {
      resultLocation.coordinates = {
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude
      };
    }

    if (location.status) {
      resultLocation.status = location.status;
    }

    if (location.userId) {
      resultLocation.userId = location.userId;
    }

    resultLocation.lastUpdate = new Date();

    return { ...state, firebaseCurrentPosition: resultLocation };
  }

  case HOME_SET_EQUIPMENT:
    return { ...state, selectedEquipment: action.payload };

  case HOME_SET_USER:
    return { ...state, user: action.payload };

  case HOME_SIGN_OUT:
    return { ...state, user: null };

  case HOME_SET_CURRENT_REQUEST:
    return { ...state, activeRequest: action.payload };

  default:
    return state;
  }
};
