import React from "react";
import { connect } from 'react-redux';
import { NavigationScreenOptions } from "react-navigation";
import ScreenBase from "../common/screen-base";
import { Container, Content, Form, Item, Label, Input, Button, Text, Row, Col, Root, Spinner } from "native-base";
import firebase, { RNFirebase } from "react-native-firebase";
import { login } from "../../store/thunk/login";

interface State {
  email: string;
  password: string;
}
class LoginScreen extends ScreenBase<Props> {
  static navigationOptions: NavigationScreenOptions = {
     title: 'Entrar'
  };

  state: State = {
    email: '',
    password: ''
  }

  constructor(props: Props) {
    super(props);
  }

  onLoginPressed = () => {
    const { email, password } = this.state;  

    this.props.login(email, password);
  }

  onRegisterPressed = () => {
    this.navigate('Register');
  }

  updateState(state: State) {
    this.setState(state);
  }

  render() {
    if (this.props.user) {
      this.navigateNoHistory('Splash');
    }

    return(
      <Root>
        <Container>
          <Content>
            <Form>
              <Row>
                <Col>
                  <Item floatingLabel>
                    <Label>Endereço de e-mail</Label>
                    <Input
                      disabled={ this.props.isLoading }
                      autoCapitalize='none'
                      autoCorrect={false}
                      returnKeyType='next'
                      textContentType='emailAddress'
                      maxLength={50}
                      onChangeText={(text) => this.updateState({ email: text } as State)} />
                  </Item>

                  <Item floatingLabel>
                    <Label>Senha</Label>
                    <Input
                      disabled={ this.props.isLoading }
                      autoCorrect={false}
                      returnKeyType='done'
                      textContentType='password'
                      secureTextEntry={true}
                      onChangeText={(text) => this.updateState({ password: text } as State)} />
                  </Item>
                </Col>
              </Row>

              <Row style={{ marginVertical: 8 }}>
                <Col>
                  <Button disabled={ this.props.isLoading } full transparent primary>
                    <Text>Forgot my password</Text>
                  </Button>
                </Col>
              </Row>

              <Row style={{ marginVertical: 8, marginHorizontal: 8 }}>
                <Col style={{ marginRight: 8 }}>
                  <Button disabled={ this.props.isLoading } full rounded success onPress={ this.onRegisterPressed }>
                    <Text>Create account</Text>
                  </Button>
                </Col>
                <Col>
                  <Button disabled={ this.props.isLoading } full rounded info onPress={ this.onLoginPressed }>
                    <Spinner color='white' style={{ display: (this.props.isLoading) ? 'flex' : 'none' }} />
                    <Text>Login</Text>
                  </Button>
                </Col>
              </Row>

              <Row style={{ marginVertical: 8 }}>
                <Col>
                  <Text>{ this.props.error }</Text>
                </Col>
              </Row>
            </Form>
          </Content>
        </Container>
      </Root>
    );
  }
}

interface Props {
  isLoading: boolean,
  error: string,
  user: RNFirebase.User,
  login: Function
}

const mapStateToProps = (state) => ({
  isLoading: state.login.isLoading,
  error: state.login.error,
  user: state.login.user
});
const mapDispatchToProps = (dispatch) => ({
  login: async (email: string, password: string) => {
    await dispatch(login(email, password));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);