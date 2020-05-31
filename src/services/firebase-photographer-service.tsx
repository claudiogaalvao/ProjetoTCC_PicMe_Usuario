import firebase, { firestore } from "react-native-firebase";
import RequestModel from "../models/firebase/request-model";
import Collections from "../utils/collections.utils";
import FirebaseProfileService from "./firebase-profile-service";
import { StatusEnum } from "../models/enum/status-enum";
import UserPositionModel from "../models/common/user-position-model";
import { GeoFirestore, GeoQuery } from 'geofirestore';
import { Timestamp } from "react-native-firebase/firestore";
import LocationModel from "../models/firebase/location-model";
import PhotographerModel from "../models/firebase/photographer-model";
import UserModel from "../models/firebase/user-model";

export default class PhotographerService {
  getLocationsQuery = (position: UserPositionModel): GeoQuery => {
    // @ts-ignore
    const geoFirestore = new GeoFirestore(firestore());
    const collection = geoFirestore.collection(Collections.LOCATIONS);

    let query: GeoQuery = collection
      .near({
        center: new firebase.firestore.GeoPoint(position.latitude, position.longitude),
        radius: 0.5
      }).limit(10);

    return query;
  };

  static getFilteredResult = (locations: LocationModel[], equipment?: String) => {
    const limitDate = (new Date((new Date().getTime() - 5 * 60000)));

    const result = locations
      .filter(x => x.status == StatusEnum.ONLINE)
      .filter(x => (x.lastUpdate as Timestamp).toDate() >= limitDate)
      .filter(x => x.isPhotographer);
    
    if (equipment) {
      return result.filter(x => x.equipments.includes(equipment));
    }

    return result;
  }

  getLocations = async (position: UserPositionModel) => {
    const response: LocationModel[] = [];
    const result = await this.getLocationsQuery(position).get();

    for (const document of result.docs) {
      const location = document.data() as LocationModel;
      if (!location.isPhotographer) continue;

      response.push(location);
    }

    return response;
  }

  static getById = async (photographerId: string) => {
    let response: PhotographerModel;

    const result = await firebase.firestore()
      .collection(Collections.PHOTOGRAPHERS)
      .where('photographerId', '==', photographerId)
      .get();

    if (result.docs.length == 1) {
      response = PhotographerService.deleteSensitiveData(result.docs[0].data() as PhotographerModel);
    }

    return response;
  }

  private static deleteSensitiveData = (photographer: PhotographerModel): PhotographerModel => {
    let safePhotographer = photographer;
    safePhotographer.city = null;
    safePhotographer.complement = null;
    safePhotographer.cpf = null;
    safePhotographer.email = null;
    safePhotographer.number = null;
    safePhotographer.permission = null;
    safePhotographer.street = null;
    safePhotographer.zipCode = null;

    return safePhotographer;
  }

  public static sendRequest = async (request: RequestModel) => {
    const doc = await firebase.firestore()
    .collection(Collections.PHOTOGRAPHERS).doc(request.targetPhotographerId)
    .collection(Collections.REQUESTS).add(request);

    return doc.id;
  }

  public static getRatingAverage = async (photographerId: string) => {
    const doc = await firebase.firestore()
    .collection(Collections.PHOTOGRAPHERS).doc(photographerId).get();

    if (!doc.exists) {
      return '-';
    }

    const data = doc.data() as PhotographerModel;
    const count = data.ratingCount ? data.ratingCount : 0;
    const sum = data.ratingSum ? data.ratingSum : 0;

    return (sum / count).toFixed(2);
  }

  public deleteRequest = async (request: RequestModel) => {
    await firebase.firestore()
    .collection(Collections.PHOTOGRAPHERS).doc(request.targetPhotographerId)
    .collection(Collections.REQUESTS).doc(request.requestId).delete();
  }
}