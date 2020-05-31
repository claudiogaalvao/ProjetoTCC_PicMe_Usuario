import React from 'react';
import ScreenBase from "../common/screen-base";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { NavigationScreenOptions } from 'react-navigation';
import { Button } from 'native-base';


interface Props {

}

class AddBalance extends ScreenBase<Props> {

   static navigationOptions: NavigationScreenOptions = {
      title: 'Adicionar saldo',
      headerTintColor: '#000',
      headerStyle: { backgroundColor: 'transparent' },
   };

   state = {
      typeValue: '',
      currentMoney: '',
      loading: true,
   }
   
   handleValue = (value) => {
      this.setState({ typeValue: value })
   }

   goPayMethodScreen = () => {
      this.props.navigation.navigate(('PayMethod'), {
         value: this.state.typeValue
      })
   }

   render() {
      
      return (
         
         <View style = {{ flex: 1, marginTop: '20%' }}>

            <View style={{ marginLeft: 30, marginRight: 30 }}>
               
               <Text 
               style={{ color: "#000", fontSize: 24 }}
               > Quanto deseja adicionar na sua carteira? </Text>

               <View style={{ flexDirection: 'row', marginTop: 5, width: '100%', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <Text style={{ color: "#000", fontSize: 32 }}>R$ </Text>
                  <TextInput 
                  style = {{ borderWidth: 0, color: "#000", fontSize: 32 }}
                  placeholder="0,00"
                  autoFocus={true}
                  keyboardType="number-pad"
                  onChangeText = {this.handleValue}
                  
                  />
               </View>
               
            </View>

            <Button
            onPress={this.goPayMethodScreen}
            style={{ width: '100%', position: 'absolute', bottom: 0, borderRadius: 0, alignItems: 'center', justifyContent: 'center' }}>
               <Text style={{ color: '#fff', fontSize: 22 }}>Continuar</Text>
            </Button>
         </View>
      )
   }
}

  export default AddBalance