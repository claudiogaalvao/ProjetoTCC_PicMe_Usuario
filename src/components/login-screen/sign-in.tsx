import React from "react";
import { NavigationScreenOptions } from "react-navigation";
import ScreenBase from "../common/screen-base";
import { Button, Toast, Spinner, Root } from "native-base";
import { View, TextInput, Alert, TouchableOpacity, Text } from 'react-native';
import firebase, { RNFirebase, auth } from "react-native-firebase";
import { login } from "../../store/thunk/login";
import { connect } from "react-redux";
import { loginError } from "../../store/actions/login";
import { FullScreenLoader } from "../../container/fullscreen-loader";

interface Props {
    isLoading: boolean,
    error: string,
    user: RNFirebase.User,
    login: Function,
    setLoginError: Function,
}

class SignInScreen extends ScreenBase<Props> {

  static navigationOptions: NavigationScreenOptions = {
    title: '',
    headerStyle: { backgroundColor: 'transparent' },
    headerTintColor: 'white'
  };

  state = {
    email: '',
    password: '',
    isLoading: false,
    inputSelected: '',
  }

  constructor(props: Props) {
    super(props);
  }

  onLoginPressed = async () => {
    const { email, password } = this.state;
    
    this.props.login(email, password);
  }

  onForgotPasswordPressed = async () => {
    const { email } = this.state;

    try {
      if (email && email.length > 3) {
        this.setState({ isLoading: true });

        await firebase.auth().sendPasswordResetEmail(email);
        Alert.alert(
          'Esqueci minha senha',
          `Você receberá um e-mail na caixa de entrada de ${email} caso o e-mail digitado for valido e cadastrado em nosso sistema.`
        );
      } else {
        Alert.alert('Esqueci minha senha', 'Informe seu endereço de e-mail antes de continuar.');
      } 
      this.setState({ isLoading: false });
    } catch (error) {
      if (!error) return;

      this.setState({ isLoading: false });
      this.showError(error.message);
    }
  }

  componentDidUpdate = () => {
    if(this.props.error !== null) {
      this.showError(this.props.error)
      this.props.setLoginError(null);
      this.setState({ isLoading: false })
    }
  }

  showError = (message: string) => Toast.show({ text: message, type: 'danger', position: 'top', duration: 5000 });

  render() {
    if (this.props.user && auth().currentUser) {
      this.navigateNoHistory('Splash');
    }
    
    if (this.state.isLoading) {
      return <FullScreenLoader />
    }

    return(
      <Root>
        <View style={{ backgroundColor: '#DADBDF', height: '120%', width: '100%', top: -50 }}>
          <View style={{ width: '100%', height: '60%', backgroundColor: '#3B5FCD', borderRadius: 30, top: -50 }} />
          
          <Text style={{ position: 'absolute', top: '12%', left: '20%', right: '20%', color: 'white', fontSize: 30, textAlign: 'center' }}>
              Entrar
          </Text>
          
          <View style={{ position: 'absolute', width: undefined, height: 300, top: '25%', left: 20, right: 20, borderRadius: 20, backgroundColor: 'white' }}>
            
            <View style={{ alignItems: 'center', paddingTop: '10%' }}>
              {
                  this.state.email !== '' ?
                  <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 30, paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', top: this.state.email !== '' ? '35%' : 15, fontSize: this.state.email !== '' ? 12 : 16, color: this.state.inputSelected === 'email' ? '#4563CD' : '#A7A7A7', }}>
                      E-mail
                  </Text>
                  :
                  null
              }
              <TextInput
              placeholder='Digite seu e-mail'
              onChangeText={ (text) => this.setState({ email: text }) }
              onFocus={() => this.setState({ inputSelected: 'email' })}
              onBlur={() => this.setState({ inputSelected: '' }) }
              style={{ width: '90%', height: 50, paddingLeft: 20, marginBottom: 15, borderWidth: 1, borderColor: this.state.inputSelected === 'email' ? '#4563CD' : '#C1C1C1', borderRadius: 30, fontSize: 16, zIndex: -1 }}
              />
            </View>

            <View style={{ alignItems: 'center' }}>
              {
                  this.state.password !== '' ?
                  <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 30, paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', top: this.state.password !== '' ? -8 : 15, fontSize: this.state.password !== '' ? 12 : 16, color: this.state.inputSelected === 'password' ? '#4563CD' : '#A7A7A7', }}>
                      Senha
                  </Text>
                  :
                  null
              }
              <TextInput
              placeholder='Digite sua senha'
              secureTextEntry={true}
              onChangeText={ (text) => this.setState({ password: text }) }
              onFocus={() => this.setState({ inputSelected: 'password' })}
              onBlur={() => this.setState({ inputSelected: '' }) }
              style={{ width: '90%', height: 50, paddingLeft: 20, marginBottom: 15, borderWidth: 1, borderColor: this.state.inputSelected === 'password' ? '#4563CD' : '#C1C1C1', borderRadius: 30, fontSize: 16, zIndex: -1 }}
              />
            </View>
            
            <Button
            onPress={() => this.onLoginPressed() }
            style={{ position: 'absolute', width: undefined, left: 10, right: 10, bottom: 60, borderRadius: 5, backgroundColor: '#3B5FCD', alignItems: 'center', marginTop: 30, justifyContent: 'center' }}
            >
              {
                this.props.isLoading ?
                <Spinner color='white' style={{ display: 'flex' }} />
                :
                <Text style={{ color: 'white', textAlign: 'center' }}>Entrar</Text>
              }
            </Button>

            <TouchableOpacity
            onPress={this.onForgotPasswordPressed}
            style={{ position: 'absolute', width: undefined, left: 10, right: 10, bottom: 25, marginTop: 5, alignItems: 'center', justifyContent: 'center' }}
            >
                <Text style={{ color: '#3B5FCD', textAlign: 'center' }}>Esqueci minha senha</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Root>
    );
  }
}

const mapStateToProps = (state) => ({
    isLoading: state.login.isLoading,
    error: state.login.error,
    user: state.login.user
});

const mapDispatchToProps = (dispatch) => ({
    login: async (email: string, password: string) => {
      await dispatch(login(email, password));
    },
    setLoginError: (message) => {
      dispatch(loginError(message))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);