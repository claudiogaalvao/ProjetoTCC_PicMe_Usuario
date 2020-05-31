import React from 'react';
import { TouchableOpacity } from "react-native";
import { Icon, Text, Button, View } from "native-base";
import Modal from 'react-native-modal';
import { AirbnbRating } from 'react-native-ratings';

interface Props {
  visible?: boolean;
  onClosed?: () => void;
  onFinish?: (rating: number) => void;
  photographerName: string;
}

interface State {
  rating: number;
}

export default class RatingModal extends React.Component<Props> {
  state: State = {
    rating: 5
  };

  private ratingOptions = [
    'Péssimo',
    'Ruim',
    'Regular',
    'Bom',
    'Excelente',
  ];

  render() {
    return(
      <Modal isVisible={this.props.visible} style={{ position: 'absolute', width: '100%', height: '45%', marginLeft: 0, bottom: -20, backgroundColor: 'white', borderTopStartRadius: 10, borderTopEndRadius: 10 }}>       
        <TouchableOpacity onPress={this.props.onClosed} style={{ position: 'absolute', marginLeft: 20, top: 20 }}>
            <Icon type='FontAwesome5' name='times' style={{ fontSize: 20 }} />
        </TouchableOpacity>
        
        <View style={{ marginHorizontal: 15, padding: 10, alignItems: 'center', marginTop: 15 }}>
          <Text style={{ marginBottom: 15 }}>Por favor, avalie {this.props.photographerName}</Text>
          <AirbnbRating
            count={5}
            reviews={this.ratingOptions}
            defaultRating={5}
            size={30}
            onFinishRating={(rating) => this.setState({rating})}
            showRating={true}
          />

          <Button onPress={() => this.props.onFinish(this.state.rating)} style={{ marginTop: 20, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1EA896', borderRadius: 20 }}>
            <Text style={{ color: 'white', fontSize: 16}}>PRONTO</Text>
          </Button>
        </View>
      </Modal>
    );
  }
};