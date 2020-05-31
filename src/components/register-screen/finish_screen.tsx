import React, { Component } from "react";
import { View, Image, Text } from "react-native";
import { Button } from 'native-base';

interface Props {
  onFinishBackPressed: Function
}

interface State {
  
}

class FinishScreen extends Component<Props> {
  
  state: State = {
    
  };
 
  render() {

    return(
        <View 
        style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center',
        padding: 20 }}>
          <Text
          style={{ color: 'black', fontSize: 20, alignItems: 'center', justifyContent: 'center' }}>
            Cadastro realizado com sucesso
          </Text>

          <Image 
          source={require('../../../assets/images/correct.png')}
          style={{ width: '60%', height: '60%' }}
          />

          <Button 
          onPress={ () => this.props.onFinishBackPressed() } 
          style={{ width: '100%', alignItems: 'center', justifyContent: 'center', 
          backgroundColor: '#3B5FCD', borderRadius: 20 }}>
            <Text style={{ color: 'white', fontSize: 16}}>ENTRAR</Text>
          </Button> 

        </View>
    );
  }
}

export default FinishScreen;