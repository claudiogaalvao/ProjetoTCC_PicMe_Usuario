import ScreenBase from "../common/screen-base";
import React from "react";
import { NavigationScreenOptions } from "react-navigation";
import { Header } from 'react-native-elements';
import { Icon } from 'native-base'
import { View, Text, FlatList, TouchableOpacity, Alert, Button, RefreshControl } from 'react-native';
import firebase,{ auth, firestore } from "react-native-firebase";
import SessionService from "../../services/session-service";

//import console = require("console");
interface Props {
    
}

interface State {
    dataSource: any[],
    loading: boolean,
}

class SessionsHistoric extends ScreenBase<Props> {

    static navigationOptions: NavigationScreenOptions = {
        title: 'Histórico de sessões',
        header: null
    };

    state: State = {
        dataSource: [],
        loading: false
    };
 
    constructor(props: Props) {
        super(props);        
    }

    componentDidMount (){
        this.getUserData();   
    }

    setLoading = (isLoading: boolean) => {
        this.setState({ loading: isLoading });
    }
 
    getUserData = async () => {
        this.setLoading(true);    
        const currentUser = firebase.auth().currentUser.uid;
        const dataUser = await SessionService.getUserSessions();
        const someArray = dataUser.filter((e: any) => e.requesterId === currentUser);

        this.setState({
            dataSource: someArray,
            loading: false
        });
    }

    listHistoric = () => {
        return (
            <FlatList
                data={this.state.dataSource}
                showsVerticalScrollIndicator={false}
                style={{ marginBottom: 50, height: '100%' }}
                refreshControl={
                    <RefreshControl refreshing={this.state.loading} onRefresh={this.getUserData} />
                }
                keyExtractor={(item, index) => `${item.id}${index}`}
                renderItem={({item, index}) => 
                    <TouchableOpacity onPress={ () => this.goDetails(item)} key={`history_item${index}`} style={{ flexDirection: 'column', paddingLeft: 14, paddingTop: 20, paddingBottom: 20, borderBottomWidth: 1, borderColor: '#9FACBD' }}>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{  width: 50, height: 50, borderRadius: 50/2, backgroundColor: '#B7C3EC', marginRight: 10, alignItems: 'center', justifyContent: 'center' }} >
                            <Text style={{ fontSize: 25, color: 'red' }}>
                                    {item.requesterName.charAt(0)}
                            </Text>
                            </View>
                            <View>
                                <Text style={{ color: 'black', fontWeight: 'bold' }}>{item.photographerName}</Text>
                                {/*<Text>{ item.data }</Text>*/}
                                <Text>{  item.equipment.brand } {  item.equipment.model }</Text>
                                
                            </View>
                           {/* <Text style={{ position: 'absolute', right: 10, color: 'black' }}>
                                { this.rateLayout(item.rated) }                                
                                </Text> */}
                        </View>

                        { item.pictures.length > 0 ? 
                        <View style={{ position: 'absolute', bottom: 30, right: 10 }}>
                            <Text style={{ fontSize: 16, color: 'black' }}>R$ { item.picturesQtd * item.pricePerPicture }</Text>
                        </View>
                        
                        : 
                        <View style={{ position: 'absolute', width: 110, height: 25, bottom: 22, borderWidth: 1, borderColor: '#FDCA5A', borderRadius: 4, right: 10, justifyContent: 'center' }}>
                            <Text style={{ color: '#F39A40', fontSize: 12, textAlign: 'center' }}>Aguardando Envio</Text>
                        </View>
                        }
                        
                    </TouchableOpacity>
                }
            />
        )
    }

    noHistoricYet = () => {
        return(
            <View style={{ width: '100%', height: '90%', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20 }}>Nenhum histórico</Text>
                <TouchableOpacity onPress={ () => this.getUserData() } >
                    <Text style={{ color: '#76A7F8', textAlign: 'center', marginLeft: 5 }}>Atualizar</Text>
                </TouchableOpacity>
            </View>
        )
    }
    
    rateLayout = (rate) => {
        let i = 0;
        let stars = ''

        for(i=0; i<rate; i++) {
            stars = stars + '★'
        }
        for(i=0; i<5-rate; i++) {
            stars = stars + '☆'
        }
        return stars
    }

    goDetails(session) {
        if (session.pictures.length > 0) {
            //@ts-ignore
            this.props.navigation.navigate('SessionDetails', {
                'session': session
            });
        }
    }

    render() {

        return(
            <View>

                <Header
                leftComponent={{ icon: 'menu', size: 28, color: '#fff', onPress: () => this.drawer() }}
                centerComponent={{ text: 'MINHAS SESSÕES', style: { color: '#fff', fontSize: 16 } }}
                containerStyle={{ paddingTop: 5, height: 60, backgroundColor: '#224CB4' }}
                />

                {
                    this.state.dataSource.length > 0 ?
                    this.listHistoric()
                    :
                    this.noHistoricYet()
                }

            </View>
        );
    }
}

export default SessionsHistoric;