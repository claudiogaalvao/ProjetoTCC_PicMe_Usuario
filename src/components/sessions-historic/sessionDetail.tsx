import ScreenBase from "../common/screen-base";
import React from "react";
import { NavigationScreenOptions } from "react-navigation";
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Icon } from "native-base";
import { SliderBox } from 'react-native-image-slider-box';
import firebase,{ auth, firestore } from "react-native-firebase";
import SessionService from "../../services/session-service";
import Share from 'react-native-share';
import ImageUtils from "../../utils/image.utils";
import { FullScreenLoader } from "../../container/fullscreen-loader";

interface Props {
    
}

interface State {
    session: any,
    loading: boolean
}

class SessionDetail extends ScreenBase<Props> {
    session = {};

    static navigationOptions: NavigationScreenOptions = {
        title: 'Detalhes',
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: '#000'
    };

    state: State = {
        session: {},
        loading: false
    };
 
    constructor(props: Props) {
        super(props);
        // @ts-ignore
        this.session = this.props.navigation.getParam('session', {});
    }

    componentDidMount() {
        this.setState({
            session: this.session
        });

        console.log(this.session);
    }

    onSharePressed = () => {
        const image = this.state.session.pictures;

        if (image && image.length > 0) {
            this.shareImage();
        }
    }

    shareImage = async () => {
        this.setState({ loading: true });

        const urls = [];
        for (let i = 0; i < this.state.session.pictures.length; i++) {
            const image = this.state.session.pictures[i];
            const base64 = await ImageUtils.getImageBase64(image);
            urls.push(`data:image/png;base64,${base64}`);
        }

        this.setState({ loading: false });

        Share.open({
            urls,
            showAppsToView: true,
        })
    }

    render() {
        const { session, loading } = this.state;

        if (loading) {
            return <FullScreenLoader />;
        }

        if (!session) {
            return <View />;
        } 

        if (!session.equipment) {
            return <View />;
        }

        return(
            <View>
                <View style={{ width: '100%', height: '78%' }}>
                    <SliderBox
                        images={session.pictures}
                        dotColor="#F39A40"
                        inactiveDotColor="#90A4AE"
                        paginationBoxVerticalPadding={20}
                        circleLoop
                        sliderBoxHeight={'100%'} />
                </View>

                <View style={{ width: '100%', height: '22%', borderTopWidth: 1, borderTopColor: '#CED4DA', padding: 20, paddingTop: 18 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>

                        <View style={{ width: '15%', height: 55, alignItems: 'center', justifyContent: 'center', top: 10 }}>
                            <View style={{ width: 60, height: 60, backgroundColor: "#B7C3EC", borderRadius: 60/2, marginRight: 10,  alignItems: 'center', justifyContent: 'center', }}>
                            <Text style={{ fontSize: 25, color: 'red' }}>
                                    {"\n\n"+session.photographerName.charAt(0)}
                            </Text>
                                <Image style={{ width: 60, height: 60, borderRadius: 60/2 }} source={{ uri: null }} />
                            </View>
                        </View>

                        <View style={{ marginLeft: 15, width: '85%'}}>
                            <Text numberOfLines={1} style={{fontSize: 18, marginBottom: 3, fontWeight: 'bold', color: '#000'}}>Fotógrafo(a) {session.photographerName}</Text>
                            <Text style={{ fontSize: 16, marginTop: 2 }}>Fotos tiradas com: { session.equipment.brand } { session.equipment.model}</Text>                            
                            <Text style={{ fontSize: 16 }}>Valor pago na sessão: R$ { session.picturesQtd * session.pricePerPicture }</Text>
                            
                        </View>

                    </View>

                    <TouchableOpacity onPress={this.onSharePressed} style={{ position: 'absolute', flexDirection: 'row', top: -15, right: 10, width: 120, height: 30, backgroundColor: '#4563CD', alignItems: 'center', justifyContent: 'center', borderRadius: 15 }}>
                        <Icon type='FontAwesome5' name='share' style={{ color: 'white', fontSize: 14 }} />
                        <Text style={{ color: 'white', marginLeft: 5 }}>Compartilhar</Text>
                    </TouchableOpacity>

                </View>

            </View>
        );
    }
}

export default SessionDetail;