import React from 'react';
import { H3, Text } from 'native-base';
import { View, Image } from 'react-native';
import { render } from 'enzyme';

interface Props {
  styles: any;
}

export default class RequestAccepted extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return(
      <View style={this.props.styles.alertBox}>
          <View style={{ alignItems: 'center' }}>
              <H3 style={{ marginTop: 16, marginBottom: 16 }}>Uhuuul</H3>
          </View>

          <View>
              <Text style={{ textAlign: 'center' }}>O fotógrafo aceitou sua solicitação.</Text>
              <Text style={{ textAlign: 'center' }}>Você será redirecionado.</Text>
          </View>

          <View style={{ width: '100%', height: 150, alignItems: 'center' }}>
              <Image 
                  source={require('./../../../assets/animations/excited.gif')}  
                  style={{width: 150, height: '100%' }}
              />
          </View>
      </View>
    );
  }
}