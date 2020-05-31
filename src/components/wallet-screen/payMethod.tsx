import React from 'react';
import ScreenBase from "../common/screen-base";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import FirebaseProfileService from "../../services/firebase-profile-service";
import firebase, { firestore, RNFirebase } from "react-native-firebase";
import { NavigationScreenOptions } from 'react-navigation';
import { HomeState } from '../store/reducers/home';
import { Button, Icon } from 'native-base';
import { connect } from 'react-redux';

interface Props {
    home: HomeState,
}

interface State {
    payMethods: object[],
    currentMoney: any;
    value: any;
    loading: boolean;
}

class PayMethod extends ScreenBase<Props> {

    static navigationOptions: NavigationScreenOptions = {
        headerTintColor: '#000',
        headerStyle: { backgroundColor: 'transparent' },
    };

    state: State = {
        payMethods: [
            {
                flag: 'Visa',
                name: 'Lawrence Norman',
                cardNumber: '•••• •••• •••• 6754',
                expire: '11/2021',
                selected: true
            },
            {
                flag: 'MasterCard',
                name: 'Lawrence Norman',
                cardNumber: '•••• •••• •••• 7832',
                expire: '02/2021',
                selected: false
            }
        ],
        currentMoney: 0,
        value: 0,
        loading: true,
    };

    selectionPay(id){

        var arrayCard = this.state.payMethods

        arrayCard.map((element) => {
            if(element.id !== id && element.selected === true)
                element.selected = false
            if(element.id === id)
                element.selected = !element.selected
        })

        this.setState({
            payMethods: arrayCard
        })
    }

    updateCurrentMoney = async () => {
        await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({currentMoney: firestore.FieldValue.increment(parseFloat(this.state.value))});
        this.navigateNoHistory('Home');
    }

    componentDidMount = () => {
        this.setState({
            // @ts-ignore
            value: this.props.navigation.getParam('value', '0')
        })
    }

    render() {
        const { user } = this.props.home;

        return (
            
            <View style = {{ flex: 1, marginTop: '20%' }}>

                <View style={{ marginLeft: 20, marginRight: 20 }}>
                
                    <Text 
                    style={{ color: "#000", fontSize: 24, marginBottom: 30 }}
                    > Selecione a forma de pagamento </Text >


                    { this.state.payMethods.map((element, index) => {

                        return(
                            <View key={index} style={{ width: '100%', height: 70, backgroundColor: '#F9F9F9', borderRadius: 4, marginBottom: 15, borderWidth: element.selected ? 1.5 : 0, borderColor: element.selected ? '#5CB85C' : '', flexDirection: 'row'}}>
                               <View style={{ width: 50, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                               { element.selected ? 
                                    <TouchableOpacity onPress={() => this.selectionPay(element.id) } style={{ height: 25, width: 25, borderRadius: 25/2, borderWidth: 1, borderColor: '#5CB85C', backgroundColor: '#5CB85C', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon type="FontAwesome5" name="check" style={{ color: 'white', fontSize: 18 }}></Icon>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => this.selectionPay(element.id)} style={{ height: 25, width: 25, borderRadius: 25/2, borderWidth: 1, borderColor: '#ACACAC' }}> 
                                        
                                    </TouchableOpacity>
                                }
                               </View>

                               <View style={{width: 60, height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection : 'row'}}>
                                   <View  style={{width: 50, height: 30, backgroundColor: 'white', borderWidth: 1, borderColor: '#DEDEDE', alignItems: 'center', justifyContent: 'center'}}>
                                   <Image style={{width: element.flag === 'Visa'? 30 : 33, height: element.flag === 'Visa'? 10 : 20}}
                                        source={ element.flag === 'Visa'? require("../../../assets/images/bandeira_visa.png") : require("../../../assets/images/bandeira_mastercard.png") }>

                                   </Image>

                                   </View>
   
                               </View>
                               <View style={{width: 130, height: '100%', alignContent: 'center', justifyContent: 'center', paddingLeft: 4}} >
                                   <Text numberOfLines = {1} style={{fontSize: 12, color: 'black'}}>
                                        {(user.firstName+" "+user.lastName).toUpperCase()}   
                                   </Text>
                                   <Text style={{color: 'black'}}>
                                        {element.cardNumber} 
                                   </Text>
                               </View>
                               <View style={{width: 60, height: '100%', alignContent: 'flex-end', justifyContent: 'center', paddingLeft: 10}}>
                                    <Text style={{fontSize: 12, color: 'grey', textAlign: 'right' }}>
                                        EXP.
                                    </Text>
                                    <Text style={{fontSize: 12, color: 'grey', textAlign: 'right' }}>
                                        {element.expire}
                                    </Text>
                                </View>

                            </View>
                        )
                    })}
                
                </View>

                <Button
                onPress={ () => this.updateCurrentMoney() }
                style={{ width: '100%', position: 'absolute', bottom: 0, borderRadius: 0, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 22 }}>Confirmar</Text>
                </Button>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    home: state.home
});

export default connect(mapStateToProps, null)(PayMethod);