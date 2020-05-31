import ScreenBase from "../common/screen-base";
import React from "react";
import { HomeState } from "../../store/reducers/home";
import { NavigationScreenOptions } from "react-navigation";
import { Icon, H3, Button } from 'native-base';
import Modal from 'react-native-modal';
import { Image, View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, LayoutAnimation, GeolocationReturnType } from 'react-native';
import LocationModel from "../../models/firebase/location-model";
import { connect } from "react-redux";
import RequestModal from './requestModal';
import DevicesList from './devicesList'
import { RequestStatusEnum } from "../../models/enum/request-status-enum";
import DeviceModel from "../../models/firebase/device-model";
import { setCurrentRequest } from "../../store/actions/home";
import RequestModel from "../../models/firebase/request-model";
import RequestAccepted from './requestAccepted';
import { GeoUtils } from "../../utils/geo.utils";
import PhotographerService from "../../services/firebase-photographer-service";
import PhotographerModel from "../../models/firebase/photographer-model";
import { FullScreenLoader } from "../../container/fullscreen-loader";
import { firestore, RNFirebase } from "react-native-firebase";
import Collections from "../../utils/collections.utils";

interface Props {
    home: HomeState,
    setCurrentRequest: (request: RequestModel) => void,
}

interface State {
  deviceSelected: DeviceModel;
  qtdMinSelected: number;
  location: GeolocationReturnType;
  photographer?: PhotographerModel;
}

const { width } = Dimensions.get('window')

class ProfilePhotographer extends ScreenBase<Props> {
    private photographerLocation: LocationModel;
    private locationWatchId: number;
    private listener = null;

    static navigationOptions: NavigationScreenOptions = {
        title: 'Portfolio',
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: '#000'
    };

    state: State = {
        deviceSelected: {},
        qtdMinSelected: 0,
        location: null,
    };
 
    constructor(props: Props) {
        super(props);

        // @ts-ignore
        this.photographerLocation = this.props.navigation.getParam('location', null);
    }

    componentDidMount() {
        PhotographerService.getById(this.photographerLocation.userId).then((photographer) => {
            this.setState({ photographer } as State);
        });

        navigator.geolocation.getCurrentPosition((position) => {
            this.updatePosition(position);

            this.locationWatchId = navigator.geolocation.watchPosition((position) => {
                this.updatePosition(position);
            });
        });
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener();
        }

        navigator.geolocation.clearWatch(this.locationWatchId);
    }

    updatePosition(position: GeolocationReturnType) {
        this.setState({ location: position } as State);
    }

    listPhotos() {
        return this.state.photographer.portfolioImages.map((item, index) => {
            if (!item || item === '') return;

            return(
                <View key={`photo-${index}`} style={[{width: (width/3)}, {height: (width/3)},
                    { marginBottom: 2 }, index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }]}>
                    <Image style={{flex: 1, width: undefined, height: undefined}}
                        source={{ uri: item }}
                    />
                </View>
            )
        })
    }

    openRequestModal = (device: DeviceModel) => {
        var clonedDevice = Object.assign({}, device);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        this.setState({
            deviceSelected: clonedDevice,
            qtdMinSelected: device.qtdMin
        });

        this.updateRequestStatus(RequestStatusEnum.SELECTING);
    }

    updateRequestStatus = (status: RequestStatusEnum) => {
        const request = Object.assign({}, this.props.home.activeRequest);
        request.status = status;

        this.props.setCurrentRequest(request);
    }

    closeRequestModal = () => {
        this.setState({
            deviceSelected: null,
            qtdMinSelected: 0
        } as State);

        const request = { ...this.props.home.activeRequest };
        request.status = -1;
    
        this.props.setCurrentRequest(request);
    }

    sendRequest = async (quantity: number) => {
        if (quantity * this.state.deviceSelected.priceMin > this.props.home.user.currentMoney) {
            return;
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.updateRequestStatus(RequestStatusEnum.WAITING);

        const { latitude, longitude } = this.state.location.coords;

        const requestModel = Object.assign({}, this.props.home.activeRequest);
        requestModel.targetPhotographerId = this.photographerLocation.userId;
        requestModel.creationDate = new Date();
        requestModel.equipment = this.state.deviceSelected;
        requestModel.location = { latitude, longitude, latitudeDelta: 0, longitudeDelta: 0 };
        requestModel.requester = this.props.home.user;
        requestModel.quantity = quantity;
        requestModel.status = RequestStatusEnum.WAITING;

        const requestId = await PhotographerService.sendRequest(requestModel);
        this.listenToRequest(requestId, this.photographerLocation.userId);
    }

    listenToRequest = async (requestId: string, photographerId: string) => {
        this.listener = firestore()
            .collection(Collections.PHOTOGRAPHERS).doc(photographerId)
            .collection(Collections.REQUESTS).doc(requestId).onSnapshot(this.onRequestSnapshot);
    }

    onRequestSnapshot = (docSnapshot: RNFirebase.firestore.DocumentSnapshot) => {        
        const request = docSnapshot.data() as RequestModel;

        if (!request) return;
        this.props.setCurrentRequest(request);

        if (request.status === RequestStatusEnum.RATING) {
            this.props.navigation.pop();
        }
    }

    backHome = () => {
        this.setState({
            showUnacceptedModal: false
        })
        this.navigate("Splash")
    }

    closeUnacceptedModal = () => {
        this.props.setCurrentRequest({status: RequestStatusEnum.SELECTING});
    }

    getDistance = () => {
        if (!this.state.location) {
            return 0;
        }

        return GeoUtils.calculateDistance({ 
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude
         }, this.photographerLocation.coordinates);
    }

    render() {
        const { activeRequest } = this.props.home;

        if (!this.photographerLocation) {
            return (
                <View>
                    <Text>Erro!!!</Text>
                </View>
            );
        }

        if (!this.state.photographer) {
            return (
                <FullScreenLoader />
            );
        }

        if (activeRequest && activeRequest.status === RequestStatusEnum.MEETING) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <H3 style={{ textAlign: 'center' }}>Aguarde o fotógrafo finalizar a sessão.</H3>
                </View>
            );
        }

        return(
            <View style={{ flex: 1 }}>
                <View style={{width: '100%', height: 200, borderBottomWidth: 1, borderBottomColor: '#CED4DA' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ width: '15%', height: 55, alignItems: 'center', justifyContent: 'center', top: 10, left: 25}}>
                            <View style={{ width: 80, height: 80, backgroundColor: "#FF4170", borderRadius: 80/2 }}>
                                
                            </View>                        
                            <View style={{ width: 40, height: 25, paddingRight: 3, backgroundColor: "#000", borderRadius: 5, position: 'absolute', bottom: -5, right: -16, alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: '#fff', fontSize: 14}}>★ {
                                    this.photographerLocation.summaryData.ratingAverage
                                }</Text>
                            </View>
                        </View>

                        <View style={{ marginLeft: 60, width: '55%'}}>
                            <Text numberOfLines={1} style={{fontSize: 18, marginBottom: 3, fontWeight: 'bold', color: '#000'}}>{this.state.photographer.firstName} {this.state.photographer.lastName}</Text>
                            <Text style={{ color: "#696969", fontSize: 14, marginTop: -5}}>
                                <Icon type='FontAwesome5' name='map-marker-alt' style={{color: '#696969', fontSize: 14 }} /> a {this.getDistance().toFixed(1)} metro{this.getDistance() === 1 ? '' : 's'}
                            </Text>
                        </View>

                        <View>                            
                            <Icon type='FontAwesome5' name='heart'></Icon>
                        </View>

                    </View>

                    <View style={{ width: undefined, height: 100, top: -5 }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            { this.photographerLocation.equipments.map((equipment, index) => {
                                return <DevicesList device={equipment} qtdDevices={this.photographerLocation.equipments.length} openRequestPanel={this.openRequestModal} index={index} key={`prof-${index}`} />
                            })}
                        </ScrollView>
                    </View>
                </View>

                { 
                    (this.state.photographer.portfolioImages &&
                    this.state.photographer.portfolioImages.length > 0) ? 
                    <ScrollView style={{ height: '100%'}}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
                            {this.listPhotos()}
                        </View>
                    </ScrollView>
                    :
                    <View style={{ alignItems: 'center', justifyContent: 'center', margin: 50}}>
                        <Icon type="FontAwesome5" name="images" style={{ color: "#CED4DA", width: 50, height: 50}}></Icon>
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>Este fotógrafo ainda não adicionou fotos ao seu portfolio</Text>
                    </View>
                }
                
                <Modal isVisible={ activeRequest && activeRequest.status === RequestStatusEnum.SELECTING } style={{ position: 'absolute', width: '100%', height: '80%', marginLeft: 0, bottom: -20, backgroundColor: 'white', borderTopStartRadius: 10, borderTopEndRadius: 10 }}>
                    <RequestModal
                        closeRequestModal={this.closeRequestModal}
                        sendRequest={this.sendRequest}
                        device={this.state.deviceSelected}
                    />  
                </Modal>

                <Modal isVisible={ activeRequest && activeRequest.status === RequestStatusEnum.WAITING } style={{ position: 'absolute', width: '100%', height: '60%', marginLeft: 0, bottom: -20, backgroundColor: 'white', borderTopStartRadius: 10, borderTopEndRadius: 10 }}>
                    <View style={styles.alertBox}>

                        <View style={{ alignItems: 'center' }}>
                            <H3 style={{ marginTop: 16, marginBottom: 16 }}>Aguarde</H3>
                        </View>

                        <View>
                            <Text style={{ textAlign: 'center' }}>O fotógrafo já recebeu sua solicitação. Aguarde até que ele a aceite.</Text>
                        </View>

                        <View style={{ width: '100%', height: 170, alignItems: 'center' }}>
                            <Image 
                                source={require('./../../../assets/animations/alert.gif')}  
                                style={{width: 170, height: '100%' }}
                            />
                        </View>                    
                    </View>
                </Modal>

                <Modal isVisible={ activeRequest && activeRequest.status === RequestStatusEnum.ACCEPTED } style={{ position: 'absolute', width: '100%', height: '60%', marginLeft: 0, bottom: -20, backgroundColor: 'white', borderTopStartRadius: 10, borderTopEndRadius: 10 }}>
                    <RequestAccepted styles={styles} />
                </Modal>

                <Modal isVisible={ activeRequest && activeRequest.status === RequestStatusEnum.REJECTED } style={{ position: 'absolute', width: '100%', height: '60%', marginLeft: 0, bottom: -20, backgroundColor: 'white', borderTopStartRadius: 10, borderTopEndRadius: 10 }}>
                    <TouchableOpacity onPress={ () => this.closeUnacceptedModal() } style={{ position: 'absolute', marginLeft: 20, top: 20 }}>
                        <Icon type='FontAwesome5' name='times' style={{ fontSize: 20 }} />
                    </TouchableOpacity>

                    <View style={styles.alertBox}>

                        <View style={{ alignItems: 'center' }}>
                            <H3 style={{ marginTop: 16, marginBottom: 16 }}>Pooxa :(</H3>
                        </View>

                        <View>
                            <Text style={{ textAlign: 'center' }}>Infelizmente o fotógrafo não aceitou sua solicitação a tempo.</Text>
                        </View>

                        <View style={{ width: '100%', height: 150, marginTop: 10, alignItems: 'center' }}>
                            <Image 
                                source={require('./../../../assets/animations/sad.gif')}  
                                style={{width: 90, height: '60%' }}
                            />
                        </View>
                        <Button onPress={ this.backHome } style={{ marginTop: -30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1EA896', borderRadius: 20 }}><Text style={{ color: 'white', fontSize: 16}}>VOLTAR PARA HOME</Text></Button>
                    </View>
                </Modal>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    alertBox: {
        marginHorizontal: 24,
        borderRadius: 16,
        padding: 16
    }
})

const mapStateToProps = (state) => ({
    home: state.home
});
const mapDispatchToProps = (dispatch) => ({
    setCurrentRequest: (request: RequestModel) => dispatch(setCurrentRequest(request))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePhotographer);