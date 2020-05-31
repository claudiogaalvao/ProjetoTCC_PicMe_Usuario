import Collections from "../utils/collections.utils"
import { firestore } from "react-native-firebase";
import UserModel from "../models/firebase/user-model";

export default class UserService {
  static getUser = async (userId: string) => {
    const collection = firestore().collection(Collections.USERS);
    const document = await collection.doc(userId).get();

    if (document.exists) {
      return document.data() as UserModel;
    }
  }
}