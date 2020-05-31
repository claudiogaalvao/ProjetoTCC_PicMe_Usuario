import React from 'react';
import ScreenBase from "../common/screen-base";
import { View, Text, TouchableOpacity, TextInput, Dimensions, TouchableHighlight } from 'react-native'
import FirebaseProfileService from "../../services/firebase-profile-service";
import firebase, { firestore } from "react-native-firebase";
import { Header } from 'react-native-elements';
import { NavigationScreenOptions } from 'react-navigation';
import { Button, Icon } from 'native-base';


interface Props {

}

const { width, height } = Dimensions.get('window')

class Wallet extends ScreenBase<Props> {

   state = {
      typeValue: '',
      currentMoney: '',
      loading: true,
   }
   
   handleValue = (value) => {
      this.setState({ typeValue: value })
   }
   
   async currentMoney (){
      const user = await FirebaseProfileService.getUserDetails(firebase.auth().currentUser.uid);

      this.setState({ currentMoney: user.currentMoney, loading: false })
   }
   
   updateCurrentMoney = async () => {
      await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({currentMoney: parseFloat(this.state.currentMoney) + parseFloat(this.state.typeValue)});
      this.currentMoney();
   }

   onDrawer = async () => {
      try{
      this.drawer();
      } catch (error) {
        //this.showError(error);
      }
   }

   goAddBalance = () => {
      this.navigate('AddBalance')
   }

   render() {
      if(this.state.loading == true)
         this.currentMoney();
      
      return (
         <View>

            <Header
            leftComponent={{ icon: 'menu', size: 28, color: '#fff', onPress: () => this.drawer() }}
            centerComponent={{ text: 'CARTEIRA', style: { color: '#fff', fontSize: 16 } }}
            containerStyle={{ paddingTop: 5, height: 60, backgroundColor: '#224CB4' }}
            />
            
            <View style = {{ width: '100%', height: '90%', alignItems: 'center', justifyContent: 'center' }}>
               
               <TouchableOpacity onPress={this.goAddBalance} style={{ width: 150, height: 150, backgroundColor: '#0075DA', borderRadius: 10, elevation: 5, alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>
                  <Icon type='FontAwesome5' name='wallet' style={{
                     color: 'white', marginBottom: 2
                  }}></Icon>
                  <Text style={{ color: 'white', fontSize: 22, textAlign: 'center', elevation: 1 }}>Adicionar Saldo</Text>
               </TouchableOpacity>

               <TouchableOpacity style={{ width: 150, height: 150, backgroundColor: '#5CB85C', borderRadius: 10, elevation: 5, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon type='FontAwesome5' name='credit-card' style={{
                     color: 'white', marginBottom: 2
                  }}></Icon>
                  <Text style={{ color: 'white', fontSize: 21, textAlign: 'center', elevation: 1 }}>Gerenciar Cartões</Text>
               </TouchableOpacity>
            </View>
         </View>
         
         
      )
   }
}

  export default Wallet