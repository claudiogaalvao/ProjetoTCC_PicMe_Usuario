import React, { Component } from "react";
import ScreenBase from "../common/screen-base";
import { NavigationScreenOptions } from "react-navigation";
import { Container, Content, Form, Item, Label, Input, Row, Col, H3, Text, Button, Toast, Root, Spinner } from "native-base";
import FirebaseRegisterRequest from "../../models/common/firebase-register-request";
import FirebaseAuthService from "../../services/firebase-auth-service";
import { TextInput } from "react-native";

interface Props {

}
interface State {
  firstName: string;
  lastName: string;
  birthDate: Date;
  cpf: string;
  email: string;
  password: string;
  password2: string;
  photo: string;
  phone: string;
  isLoading: boolean;
}
class RegisterScreen extends ScreenBase<Props> {
  static navigationOptions: NavigationScreenOptions = {
    title: 'Cadastro'
  }

  passwordInput: any;
  password2Input: any;
  firstNameInput: any;
  lastNameInput: any;
  cpfInput: any;
  birthDateInput: any;
  phoneInput: any;

  state: State = {
    birthDate: null,
    cpf: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    password2: '',
    phone: '',
    photo: '',
    isLoading: false
  };

  constructor(props: any) {
    super(props);
  }

  onRegisterPressed = async () => {
    try {
      this.setState({ isLoading: true } as State);

      const registerRequest: FirebaseRegisterRequest = {
        birthDate: this.state.birthDate,
        cpf: this.state.cpf,
        email: this.state.email,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        password: this.state.password,
        password2: this.state.password2,
        phone: this.state.phone,
        photo: ''
      }

      await FirebaseAuthService.registerUser(registerRequest);

      this.navigateNoHistory('RegisterFeedback');
    } catch (error) {
      this.setState({ isLoading: false } as State);
      Toast.show({ text: error.message, position: 'top', type: 'danger' });
    }
  }

  render() {
    const { isLoading } = this.state;

    return(
      <Root>
        <Container>
          <Content padder>
            <Form>
              <Row style={{ marginHorizontal: 24, marginTop: 24 }}>
                <Col>
                  <H3>Criar conta</H3>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Item floatingLabel>
                    <Label>Endereço de e-mail</Label>
                    <Input
                      blurOnSubmit={false}
                      value={this.state.email}
                      onSubmitEditing={() => this.passwordInput._root.focus()}
                      autoCapitalize='none'
                      autoCorrect={false}
                      returnKeyType='next'
                      textContentType='emailAddress'
                      maxLength={50}
                      onChangeText={(text) => this.setState({ email: text } as State)} />
                  </Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Item floatingLabel>
                    <Label>Senha</Label>
                    <Input
                      getRef={ (input) => this.passwordInput = input }
                      value={this.state.password}
                      blurOnSubmit={false}
                      onSubmitEditing={() => this.password2Input._root.focus()}
                      autoCorrect={false}
                      returnKeyType='next'
                      textContentType='password'
                      secureTextEntry={true}
                      onChangeText={(text) => this.setState({ password: text } as State)} />
                  </Item>
                </Col>
                <Col>
                  <Item floatingLabel>
                    <Label>Re-digite a senha</Label>
                    <Input
                      getRef={ (input) => this.password2Input = input }
                      value={this.state.password2}
                      blurOnSubmit={false}
                      onSubmitEditing={() => this.firstNameInput._root.focus()}
                      autoCorrect={false}
                      returnKeyType='next'
                      textContentType='password'
                      secureTextEntry={true}
                      onChangeText={(text) => this.setState({ password2: text } as State)} />
                  </Item>
                </Col>
              </Row>
              <Row style={{ marginHorizontal: 24, marginTop: 32 }}>
                <Col>
                  <H3>Dados pessoais</H3>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Item floatingLabel>
                    <Label>Nome</Label>
                    <Input
                      getRef={ (input) => this.firstNameInput = input }
                      value={this.state.firstName}
                      blurOnSubmit={false}
                      onSubmitEditing={() => this.lastNameInput._root.focus()}
                      returnKeyType='next'
                      textContentType='name'
                      maxLength={30}
                      onChangeText={(text) => this.setState({ firstName: text } as State)} />
                  </Item>
                </Col>
                <Col>
                  <Item floatingLabel>
                    <Label>Sobrenome</Label>
                    <Input
                      getRef={ (input) => this.lastNameInput = input }
                      value={this.state.lastName}
                      blurOnSubmit={false}
                      onSubmitEditing={() => this.cpfInput._root.focus()}
                      returnKeyType='next'
                      textContentType='name'
                      maxLength={30}
                      onChangeText={(text) => this.setState({ lastName: text } as State)} />
                  </Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Item floatingLabel>
                    <Label>CPF</Label>
                    <Input
                      getRef={ (input) => this.cpfInput = input }
                      value={this.state.cpf}
                      blurOnSubmit={false}
                      onSubmitEditing={() => this.birthDateInput._root.focus()}
                      returnKeyType='next'
                      textContentType='none'
                      maxLength={14}
                      onChangeText={(text) => this.setState({ cpf: text } as State)} />
                  </Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Item floatingLabel>
                    <Label>Data de Nascimento</Label>
                    <Input
                      getRef={ (input) => this.birthDateInput = input }
                      blurOnSubmit={false}
                      onSubmitEditing={() => this.phoneInput._root.focus()}
                      returnKeyType='next'
                      textContentType='none'
                      maxLength={14}
                      onChangeText={(text) => this.setState({ birthDate: new Date(text) } as State)} />
                  </Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Item floatingLabel>
                    <Label>Celular</Label>
                    <Input
                      getRef={ (input) => this.phoneInput = input }
                      value={this.state.phone}
                      blurOnSubmit={true}
                      onSubmitEditing={this.onRegisterPressed}
                      returnKeyType='done'
                      textContentType='none'
                      maxLength={20}
                      onChangeText={(text) => this.setState({ phone: text } as State)} />
                  </Item>
                </Col>
              </Row>
              <Row style={{ alignContent: 'center', alignItems: 'center', marginVertical: 32 }}>
                <Col>
                  <Button disabled={ isLoading } full rounded info onPress={ this.onRegisterPressed }>
                    <Spinner color='white' style={{ display: (isLoading) ? 'flex' : 'none' }} />
                    <Text>Registrar</Text>
                  </Button>
                </Col>
              </Row>
            </Form>
          </Content>
        </Container> 
      </Root>    
    );
  }
}

export default RegisterScreen;