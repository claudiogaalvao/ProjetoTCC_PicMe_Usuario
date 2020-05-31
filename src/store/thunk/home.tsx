import { setLocations, updateFirebasePosition, setUser, signOut, setCurrentRequest } from '../actions/home';
import PhotographerService from '../../services/firebase-photographer-service';
import UserPositionModel from '../../models/common/user-position-model';
import FirebaseProfileService from "../../services/firebase-profile-service";
import LocationModel from "../../models/firebase/location-model";
import UserService from "../../services/user-service";
import { auth, firestore } from "react-native-firebase";
import Collections from '../../utils/collections.utils';
import RatingModel from '../../models/firebase/rating-model';

export function getLocationsOnce(position: UserPositionModel) {
  return async (dispatch: Function) => {
    const service = new PhotographerService();    
    const result = await service.getLocations(position);
    
    dispatch(setLocations(result));
  }
}

export function updateRemotePosition(location: LocationModel) {
  return async (dispatch: Function) => {
    await FirebaseProfileService.updatePosition(location);
    
    dispatch(updateFirebasePosition(location));
  }
}

export function getRemoteUserModel() {
  return async (dispatch: (args: any) => void) => {
    try {
      const user = await UserService.getUser(auth().currentUser.uid);

      if (user) {
        dispatch(setUser(user));
      }  
    } catch (error) {
      console.log(error);
    }
  }
}

export function remoteSignOut() {
  return async (dispatch: (args: any) => void) => {
    try {
      await auth().signOut();

      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  }
}

export function ratePhotographer(photographerId: string, userId: string, rating: number, sessionId: string) {
  return async (dispatch: (args: any) => void) => {
    try {
      const ratingModel: RatingModel = {
        date: new Date(),
        userId,
        sessionId,
        rating,
      };

      await firestore().collection(Collections.PHOTOGRAPHERS)
      .doc(photographerId).collection(Collections.RATES)
      .add(ratingModel);

      await firestore()
      .collection(Collections.PHOTOGRAPHERS).doc(photographerId)
      .collection(Collections.REQUESTS).doc(sessionId).delete();

      await firestore()
      .collection(Collections.PHOTOGRAPHERS).doc(photographerId)
      .update({
        ratingCount: firestore.FieldValue.increment(1),
        ratingSum: firestore.FieldValue.increment(rating)
      });

      dispatch(setCurrentRequest(null));
    } catch (error) {
      console.error(error);
    }
  }
}