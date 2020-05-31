import FirebaseRegisterRequest from "../models/common/firebase-register-request";
import StringUtils from "../utils/string.utils";
import firebase from "react-native-firebase";
import Collections from "../utils/collections.utils";
import FirebaseProfileService from "./firebase-profile-service";
import { Alert } from "react-native";

export default class FirebaseAuthService {
  static registerUser = async (request: FirebaseRegisterRequest) => {
    const errors: String[] = [];
    
    if (!request)
      throw 'Invalid arguments for creating a new user.'

    if (!/^[a-z0-9._]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/.test(request.email))
      errors.push('Please insert a valid email address.');

    if (request.password.length < 6 || request.password.length > 30)
      errors.push('Your password must have between 6 and 30 characters.');

    if (!/^[a-zA-Z ]{2,30}$/.test(request.firstName))
      errors.push('Please insert a valid name.');

    if (!/^[a-zA-Z ]{2,30}$/.test(request.lastName))
      errors.push('Please insert a valid last name.');

    if (!/([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/g.test(request.cpf.replace('-', '').replace('.', '')))
      errors.push('Please insert a valid cpf number.');

    if (!/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/.test(request.phone))
      errors.push('Please enter a valid phone number.');

    if (errors.length > 0)
      throw { message: errors[0] };
    
    const emailAvailable = await FirebaseProfileService.isEmailAvailable(request.email);
    
    if (!emailAvailable)
      throw { message: 'There\'s already an account with the requested email address.' };

    const credential = await firebase.auth().createUserWithEmailAndPassword(request.email, request.password);
    const userId = credential.user.uid;

    const userData: any = {};
    userData.cpf = request.cpf;
    userData.email = request.email;
    userData.firstName = request.firstName;
    userData.lastName = request.lastName;
    userData.phone = request.phone;
    userData.photo = request.photo;
    userData.userId = userId;
    userData.createdAt = new Date();

    await firebase.firestore().collection(Collections.USERS).doc(userId).set(userData);
    const newCredential = await firebase.auth().signInWithEmailAndPassword(userData.email, request.password);
    await newCredential.user.sendEmailVerification();
  }
}