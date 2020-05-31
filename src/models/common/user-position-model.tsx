import { Region } from "react-native-maps";

export default interface UserPositionModel extends Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}