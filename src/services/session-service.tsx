import Session from "../models/firebase/session-model";
import { firestore } from "react-native-firebase";
import Collections from "../utils/collections.utils";

export default class SessionService {
  static save(session: Session) {
    return firestore().collection(Collections.SESSIONS).add(session);
  }

  /*static async getUserSessions(requesterId: string) {
    const sessions = await firestore().collection(Collections.SESSIONS)
    .where('requesterId', '==', requesterId).get();

    if (!sessions) return 0;
    if (!sessions.docs) return 0;

    return sessions.docs.data();
  }*/
  static async getUserSessions() {
    const collection = firestore().collection(Collections.SESSIONS);

    const result = await collection.get();

    return result.docs.map(doc => doc.data());
    
    //if (result.exists) {
    //  return result.data() as PhotographerModel;
    //}

    //return null;
  }

  static async getPhotographerSessions(photographerId: string) {
    const sessions = await firestore().collection(Collections.SESSIONS)
    .where('photographerId', '==', photographerId).get();

    if (!sessions) return 0;
    if (!sessions.docs) return 0;

    return sessions.docs.length;
  }

  static async getSessionInfo(photographerId: string, requesterId: string, seconds: number, nanoseconds: number) {
    const date = new firestore.Timestamp(seconds, nanoseconds)
    const sessions = await firestore().collection(Collections.SESSIONS)
    .where('photographerId', '==', photographerId)
    .where('requesterId', '==', requesterId)
    .where('date', '==', date)
    .get();

    if (!sessions) return 0;
    if (!sessions.docs) return 0;

    return sessions.docs;
  }
}