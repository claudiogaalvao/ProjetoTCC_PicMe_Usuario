import React from "react";
import { Icon, Button } from 'native-base';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from "react-redux";
import DeviceModel from "../../models/firebase/device-model";
import { HomeState } from "../../store/reducers/home";

interface Props {
  closeRequestModal: () => void;
  sendRequest: (quantity: number) => void;
  device: DeviceModel;
  home: HomeState
}

interface State {
  selectedQuantity: number;
  balance: number;
  colorBalance: string;
}

class RequestModal extends React.Component<Props> {
  public state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedQuantity: this.props.device.qtdMin,
      balance: this.props.home.user.currentMoney,
      colorBalance: 'gray'
    };
  }

  public changePhotoQuantity = (buttonPressed: string) => {
    const { device } = this.props;
  
    if(buttonPressed === 'less') {
      if(device.qtdMin < this.state.selectedQuantity)
        this.setState((prevState: State) => ({ selectedQuantity: prevState.selectedQuantity - 1 }));
      
      if(this.state.colorBalance === 'red')
        this.setState({ colorBalance: 'gray' })
    } else {
      if((device.priceMin * (this.state.selectedQuantity+1)) > this.state.balance) {
        this.setState({
          colorBalance: 'red'
        })
      } else {
        if(this.state.colorBalance === 'red')
          this.setState({ colorBalance: 'gray' })
        
        this.setState((prevState: State) => ({ selectedQuantity: prevState.selectedQuantity + 1 }));
      }        
    }
  }

  public render() {
    const { device } = this.props;

    if (!device) {
      return <></>
    }

    return(
      <>
        <TouchableOpacity onPress={ this.props.closeRequestModal } style={{ position: 'absolute', marginLeft: 20, top: 20 }}>
            <Icon type='FontAwesome5' name='times' style={{ fontSize: 20 }} />
        </TouchableOpacity>

        <View style={{ position: 'absolute', width: '100%', alignItems: 'center', justifyContent: 'center', top: 50 }}>
            
            <Text style={{ fontSize: 20, color: 'black', marginBottom: 2 }}>{device.brand} {device.model}</Text>
            <Text style={{ fontSize: 15, color: '#73777B' }}>{device.type}</Text>

            <View style={{ width: '80%', height: 70, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: '45%', height: '100%', borderWidth: 1, borderColor: '#ED254E', borderRadius: 5, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 26, color: '#ED254E', textAlign: 'center' }}>R$ { device.priceMin }</Text>
                    <Text style={{ fontSize: 16, color: '#ED254E', textAlign: 'center' }}>por foto</Text>
                </View>
                <View style={{ width: '45%', height: '100%', borderWidth: 1, borderColor: '#ED254E', borderRadius: 5, justifyContent: 'center', marginLeft: 20}}>
                    <Text style={{ fontSize: 26, color: '#ED254E', textAlign: 'center' }}>{device.qtdMin} fotos</Text>
                    <Text style={{ fontSize: 16, color: '#ED254E', textAlign: 'center' }}>qtd mínima</Text>
                </View>
            </View>
            <View style={{ width: 280, height: 40, marginTop: 10, backgroundColor: '#ED254E', borderRadius: 5, justifyContent: 'center'}}>
                <Text style={{ fontSize: 18, color: 'white', textAlign: 'center' }}>Preço total: R$ {(device.priceMin * this.state.selectedQuantity).toFixed(2).replace(".", ",")}</Text>
            </View>
            <View style={{ marginTop: 5 }}>
              <Text style={{ color: this.state.colorBalance }}>Saldo atual: R$ { this.state.balance.toFixed(2).replace(".", ",") }</Text>
            </View>
        </View>

        <View style={{ marginTop: 270, marginLeft: 30, marginRight: 30, paddingTop: 20, width: undefined, height: 200, borderTopWidth: 1, borderColor: '#9FACBD'}}>
            <Text style={{ color: 'black', textAlign: 'center', fontSize: 18 }}>Escolha a quantidade de fotos</Text>
            
            <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    
                <TouchableOpacity onPress={() => this.changePhotoQuantity('less')} style={{ backgroundColor: '#EA4335', width: 20, height: 20, borderRadius: 20/2, justifyContent: 'center'}}>
                    <Text style={{ color: '#fff', fontSize: 38, top: -3, textAlign: 'center'}}>-</Text>
                </TouchableOpacity>

                <Text style={{ color: '#000', fontSize: 30, marginLeft: 15, marginRight: 15 }}>{this.state.selectedQuantity} fotos</Text>
                
                <TouchableOpacity onPress={() => this.changePhotoQuantity('grow')} style={{ backgroundColor: '#4BB543', width: 20, height: 20, borderRadius: 20/2, justifyContent: 'center'}}>
                    <Text style={{ color: '#fff', fontSize: 20, top: -1, fontWeight: 'bold', textAlign: 'center'}}>+</Text>
                </TouchableOpacity>

            </View>

            <Button onPress={ () => this.props.sendRequest(this.state.selectedQuantity) } style={{ marginTop: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1EA896', borderRadius: 20 }}><Text style={{ color: 'white', fontSize: 16}}>SOLICITAR</Text></Button>
        </View>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  home: state.home
});
const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(RequestModal);