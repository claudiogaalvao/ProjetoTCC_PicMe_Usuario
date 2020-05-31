import React from 'react';
import { connect } from 'react-redux';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Container, Header, Body, Content, Icon } from 'native-base'
import { DrawerItems, DrawerItemsProps } from 'react-navigation';
import { HomeState } from '../store/reducers/home';
import { remoteSignOut } from '../store/thunk/home';

interface Props extends DrawerItemsProps {
  home: HomeState,
  signOut: () => void
}

class NavigatorLayout extends React.Component<Props> {
  private pictureSize = 120;

  public render() {
    const { user } = this.props.home;

    if (!user) {
      return (
        <Container />
      );
    }

    return(
        <Container>
          <Header style={{ height: 250 }}>
              <Body style={{ alignItems: 'center' }}>
                  { this.userPicture() }
                  <Text style={{ color: 'white', fontSize: 18, marginTop: 10 }}>
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text style={{ color: 'white', marginTop: 5 }}>Saldo atual: R$ {
                    user.currentMoney === undefined ? '0,00' : 
                    user.currentMoney.toFixed(2).toString().replace('.', ',')
                  }</Text>
              </Body>
          </Header>
          <Content>
              <DrawerItems {...this.props} />
              <TouchableOpacity style={{ borderTopWidth: 1, borderColor: '#CED4DA', paddingLeft: 16, paddingTop: 12, flexDirection: 'row', alignItems: 'center'}} onPress={this.onSignOutPressed}>
                <Text style={{ color: '#CC0000', fontSize: 16 }}>Sair</Text>
              </TouchableOpacity>
          </Content>
      </Container>
    );
  }

  private userPicture = () => {
    const { user } = this.props.home;

    return (
      <View style={{ width: this.pictureSize, height: this.pictureSize, 
      borderRadius: this.pictureSize/2, backgroundColor: '#fff',
      alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'red', fontSize: 60 }}>
          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
        </Text>
      </View>
    );
  }

  private onSignOutPressed = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?',
      [
        {text: 'Cancelar', onPress: () => {} },
        {text: 'Sair', onPress: this.onSignOutConfirm},
      ], { cancelable: false });
  };

  private onSignOutConfirm = () => {
    this.props.signOut();
  };
}

const mapStateToProps = (state) => ({
  home: state.home
});
const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(remoteSignOut())
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigatorLayout);