import ScreenBase from "../common/screen-base";
import React from "react";
import MapView, { Marker, Circle } from 'react-native-maps';
import { NavigationScreenOptions } from "react-navigation";
import { Toast, Root } from 'native-base';
import { Dimensions, GeolocationReturnType, PermissionsAndroid, GeoOptions, StyleSheet, Image, Alert, TouchableHighlight } from "react-native";
import firebase, { firestore } from "react-native-firebase";
import PhotographerService from "../../services/firebase-photographer-service";
import Collections from "../../utils/collections.utils";
import RequestModel from "../../models/firebase/request-model";
import { connect } from "react-redux";
import { updateRemotePosition, ratePhotographer } from "../../store/thunk/home";
import { Header } from 'react-native-elements';
import { HomeState } from "../../store/reducers/home";
import { updateCurrentPosition, getLocationsFromDocs, setEquipment, setCurrentRequest } from "../../store/actions/home";
import ListPhotographers from './listPhotographers'
import { GeoUtils } from "../../utils/geo.utils";
import { auth } from "react-native-firebase";
import { RequestStatusEnum } from "../../models/enum/request-status-enum";
import StatusBar from './statusBar';
import { FullScreenLoader } from "../../container/fullscreen-loader";
import RatingModal from "./rating-modal";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import LocationModel from "../../models/firebase/location-model";

interface Props {
  handleRealTimePhotographers: Function,
  updatePosition: Function,
  updateRemotePosition: Function,
  setLocations: Function,
  setEquipment: Function,
  home: HomeState,
  navigation: any,
  setActiveRequest: (activeRequest: RequestModel) => void,
  ratePhotographer: (photographerId: string, userId: string, rating: number, sessionId: string) => void,
}
interface State {
  locationAllowed: boolean;
  isLoading: boolean;
  isRating: boolean;
}
class HomeScreen extends ScreenBase<Props> {
  private photographerService = new PhotographerService();
  private photographerListener;
  private requestListener;
  private requestTimer: NodeJS.Timeout;
  private requestTimeout = 60;
  private navigatorWatchId: number;
  private isRating: boolean;
  private lastRemoteUpdate: Date;

  state: State = {
    locationAllowed: false,
    isLoading: false,
    isRating: false,
  };

  geoOptions: GeoOptions = {
    enableHighAccuracy: true
  };

  static navigationOptions: NavigationScreenOptions = {
    header: null
  };

  constructor(props: Props) {
    super(props);

    // @ts-ignore
    this.isRating = this.props.navigation.getParam('rating', false);
  }

  componentDidMount() {
    this.requestPermission();
  }

  requestPermission = async () => {
    const granted = await PermissionsAndroid.request("android.permission.ACCESS_FINE_LOCATION", {
      title: 'Permissão de Localização',
      message: 'Para solicitar um fotógrafo precisamos da sua permissão de GPS.',
      buttonPositive: 'Permitir',
      buttonNeutral: 'Perguntar depois',
      buttonNegative: 'Cancelar'
    });

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      this.setState({ locationAllowed: true } as State);
      this.geolocationInit();
    } else {
      Toast.show({ text: 'Failed to get current location!', type: 'danger' });
      this.setState({ locationAllowed: false } as State);
    }
  }

  geolocationInit = async () => {
    Toast.show({ text: 'Getting current location...', type: 'success', position: 'top' });

    navigator.geolocation.getCurrentPosition(this.onPositionUpdated, this.onPositionError, this.geoOptions);
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(this.onPositionUpdated, this.onPositionError, this.geoOptions);
    }, 15000);
    this.navigatorWatchId = navigator.geolocation.watchPosition(this.onPositionUpdated, this.onPositionError, this.geoOptions);
  }

  setSelectedEquipment = (equipment: String) => {
    this.props.setEquipment(equipment);
  }

  onPositionUpdated = (position: GeolocationReturnType) => {
    const { user } = this.props.home;

    this.props.updatePosition(position);

    if (this.requestListener) {
      this.requestListener();
    }

    this.requestListener = this.photographerService.getLocationsQuery(
      this.props.home.currentPosition
    ).onSnapshot((snapshot) => {
      this.props.setLocations(snapshot.docs);
    });
    
    if (!user) {
      return;
    }

    const locationModel = this.props.home.firebaseCurrentPosition;
    locationModel.lastUpdate = new Date();
    locationModel.userId = user.userId;
    locationModel.coordinates = new firebase.firestore.GeoPoint(
      position.coords.latitude,
      position.coords.longitude
    );


    const updateLimit = new Date(new Date().getTime() - 20 * 1000);
    if (this.lastRemoteUpdate && this.lastRemoteUpdate > updateLimit) return;

    this.lastRemoteUpdate = new Date();

    this.props.updateRemotePosition(locationModel);
  }

  buildRequest = (photographerId: string) => {
    const { user, selectedEquipment, currentPosition } = this.props.home;

    const request: RequestModel = {
      creationDate: new Date(),
      // @ts-ignore
      equipment: selectedEquipment,
      requester: user,
      location: currentPosition,
      targetPhotographerId: photographerId,
      requestId: null
    };

    return request;
  }

  onRequestPhotographerPressed = async () => {
    try {
      if (this.props.home.nearLocations.length == 0) {
        throw { message: 'No photographers available.' };
      }

      this.setState({ isLoading: true });

      const photographerId = this.props.home.nearLocations[0].userId;

      const request = this.buildRequest(photographerId);
      request.requestId = await PhotographerService.sendRequest(request);

      this.props.setActiveRequest(request);
      this.listenToRequest();
    } catch (error) {
      Toast.show({ text: error.message, type: 'danger', position: 'top' , duration: 10000});
    } finally {
      this.setState({ isLoading: false });
    }
  }

  listenToRequest = () => {
    const { activeRequest } = this.props.home;

    firestore()
    .collection(Collections.PHOTOGRAPHERS).doc(activeRequest.targetPhotographerId)
    .collection(Collections.REQUESTS).doc(activeRequest.requestId)
    .onSnapshot((documentSnapshot) => {
      if (!documentSnapshot.exists) {
        return;
      }

      const request = documentSnapshot.data() as RequestModel;

      if (request.status === RequestStatusEnum.ACCEPTED) {
        this.onRequestAccepted();
      } else if (request.status === RequestStatusEnum.REJECTED) {
        this.onRequestRejected();
      }
    });
  }

  onRequestAccepted = () => {
    // fotografo aceitou solicitacao
  }

  onRequestRejected = async () => {
    await this.photographerService.deleteRequest(this.props.home.activeRequest);

    Toast.show({ text: 'O fotografo recusou a solicitacao.', duration: 3000, type: 'danger', position: 'top' })
  }

  onRequestCancel = async () => {
    await this.photographerService.deleteRequest(this.props.home.activeRequest);
  }

  onPositionError = async () => {
  }

  logout = async () => {
    await firebase.auth().signOut();
    this.navigateNoHistory('Welcome');
  }

  onLogoutPressed = async () => {
    this.logout();
  }

  onDrawer = async () => {
    try{
    this.drawer();
    } catch (error) {
      //this.showError(error);
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.navigatorWatchId);
    if (this.photographerListener) {
      this.photographerListener();
    }

    this.props.setActiveRequest(null);
  }

  get isWaitingPhotographer() {
    const { activeRequest } = this.props.home;
    return (activeRequest && activeRequest.status === RequestStatusEnum.MEETING);
  };

  renderNearPhotographers = () => {
    const { currentPosition } = this.props.home;
    return this.props.home.nearLocations.map((location, index) => {
      const { coordinates } = location;
      return <Marker
              title={ location.summaryData.name }
              description={ `${GeoUtils.calculateDistance(currentPosition, location.coordinates)}m` }
              key={index}
              coordinate={{
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
              }}>
                <Image
                  source={ require('./../../../assets/images/icon_map_photographer.png') }
                  style={{ width: 24, height: 24 }} />
              </Marker>
    });
  }

  render() {
    const { height, width } = Dimensions.get('window'); 
    const { user, activeRequest } = this.props.home;
    const authenticated = auth().currentUser;

    if (!authenticated) {
      this.navigateNoHistory('Splash');
      return <Root />
    }

    if (!user) {
      return (
        <FullScreenLoader />
      );
    }

    return(
      <Root>

        <Header
        leftComponent={{ icon: 'menu', size: 28, color: '#fff', onPress: () => this.drawer() }}
        centerComponent={{ text: 'PRINCIPAL', style: { color: '#fff', fontSize: 16 } }}
        containerStyle={{ paddingTop: 5, height: 60, backgroundColor: '#224CB4' }}
        />

        <MapView
          initialRegion={this.props.home.currentPosition}
          region={this.props.home.currentPosition}
          style={{width: '100%', height: height }}>
          <Marker
            coordinate={{
              latitude: this.props.home.currentPosition.latitude,
              longitude: this.props.home.currentPosition.longitude
            }}>
            <Image
              source={ require('./../../../assets/images/icon_map_user.png') }
              style={{ width: 24, height: 24 }} />
            </Marker>
          <Circle
            center={{
              latitude: this.props.home.currentPosition.latitude,
              longitude: this.props.home.currentPosition.longitude
            }}
            radius={500}
            fillColor='rgba(0, 90, 100, 0.10)'
            strokeColor='rgba(0, 90, 100, 40)'
            strokeWidth={1}
            />
            { this.renderNearPhotographers() }
        </MapView>

        {
          !this.isWaitingPhotographer &&
          <ListPhotographers navigation={this.props.navigation} />
        }
        
        {
          this.isWaitingPhotographer &&
          <StatusBar />
        }

        {
          activeRequest && activeRequest.status === RequestStatusEnum.RATING &&
          <RatingModal
            photographerName={'como foi a sua experiência com o fotógrafo.'}
            onClosed={() => this.setState({ isRating: false })}
            onFinish={(rating) => {
              this.setState({ isRating: false });
              this.props.ratePhotographer(
                activeRequest.targetPhotographerId,
                user.userId,
                rating,
                activeRequest.requestId
              );
            }}
            visible={activeRequest.status === RequestStatusEnum.RATING} />
        }
      </Root>
    );
  }

  styles = StyleSheet.create({
    alertBox: {
      marginHorizontal: 24,
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 16,
      alignItems: 'center'
    }
  });
}

const mapStateToProps = (state: any) => ({
  home: state.home
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return bindActionCreators({
    updatePosition: updateCurrentPosition,
    setLocations: getLocationsFromDocs,
    setActiveRequest: setCurrentRequest,
    setEquipment,
    ratePhotographer,
    updateRemotePosition,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);