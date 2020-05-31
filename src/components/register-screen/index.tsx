import React, { Component } from "react";
import ScreenBase from "../common/screen-base";
import { NavigationScreenOptions } from "react-navigation";
import { View, Alert, TextInput, Text, LayoutAnimation } from "react-native";
import { Toast, Root } from 'native-base';
import StepIndicator from 'react-native-step-indicator';
import firebase, { RNFirebase } from "react-native-firebase";
import BasicScreen from './basic_screen';
import PasswordScreen from './password_screen';
import FinishScreen from './finish_screen';
import ButtonsStep from './buttons_step';
import FirebaseRegisterRequest from "../../models/common/firebase-register-request";
import FirebaseAuthService from "../../services/firebase-auth-service";

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
    generalStep: number;
    passwordOk: boolean;
    disableNextButton: boolean;
}

class RegisterScreen extends ScreenBase<Props> {
    static navigationOptions: NavigationScreenOptions = {
        title: '',
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: 'white'
    }

    private user: RNFirebase.User;
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
        generalStep: 0,
        passwordOk: false,
        disableNextButton: true
    };

    handleChange = (input: string, text: any) => {
        this.setState({
            [input]: text
        })

        switch(this.state.generalStep) {
            case 0:                    
                if(
                this.state.firstName    !== ''  &&
                this.state.lastName     !== ''  &&
                this.state.email        !== ''  &&
                this.state.cpf          !== ''  &&
                this.state.phone        !== ''  &&
                this.state.birthDate    !== null ) {
                    this.changeDisableNextButton(false)
                } else {
                    this.changeDisableNextButton(true)
                }
                break;
            case 1:
                if(this.state.passwordOk) {
                    this.changeDisableNextButton(false)
                }
                break;
            default:
                return;
        }
    }

    changeDisableNextButton = async (value: boolean) => {
        this.setState({
            disableNextButton: value
        })
    }

    sendData = async () => {
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
        try {
            await FirebaseAuthService.registerUser(registerRequest);
        } catch(error) {
            Alert.alert(error.message)
        }
        
    }

    nextGeneralStep = async () => {
        await this.setState({
            generalStep: this.state.generalStep + 1,
            nextButtonActive: true
        })

        if(this.state.generalStep === 2) {
            this.sendData()
        }

        this.changeDisableNextButton(true)
        
    }

    previousGeneralStep = () => {
        this.setState({
            generalStep: this.state.generalStep - 1
        })
        
    }

    onFinishBackPressed = () => {
        //@ts-ignore
        this.props.navigation.navigate("Splash");
    }

    showError = (message: string) => Toast.show({ text: message, type: 'danger', position: 'top', duration: 5000 });

    render() {

        return(
            <Root>
                <View style={{ backgroundColor: '#DADBDF', height: '120%', width: '100%', top: -50 }}>
                    <View style={{ width: '100%', height: '60%', backgroundColor: '#3B5FCD', borderRadius: 30, top: -50 }} />

                    <View style={{ position: 'absolute', top: 20, left: 30, right: 30, width: undefined, height: 30, paddingTop: 10 }}> 
                    <StepIndicator
                        stepCount={3}
                        customStyles={customStyles}
                        currentPosition={this.state.generalStep}
                        labels={["Dados básicos", "Segurança", "Confirmação"]} />
                    </View>
                
                
                    <View style={{ position: 'absolute', width: undefined, height: 350, top: '20%', left: 20, right: 20, borderRadius: 20, backgroundColor: 'white' }}>
                        
                        {
                            this.state.generalStep === 0 ?
                            <BasicScreen
                            firstName={this.state.firstName}
                            lastName={this.state.lastName}
                            cpf={this.state.cpf}
                            birthDate={this.state.birthDate}
                            email={this.state.email}
                            phone={this.state.phone}
                            handleChange={this.handleChange}
                            />
                            :
                            null
                        }

                        {
                            this.state.generalStep === 1 ?
                            <PasswordScreen
                            password={this.state.password}
                            passwordConfirm={this.state.password2}
                            handleChange={this.handleChange} />
                            :
                            null
                        }

                        {
                            this.state.generalStep === 2 ?
                            <FinishScreen
                            onFinishBackPressed={this.onFinishBackPressed} />
                            :
                            null
                        }
                        
                        {
                            this.state.generalStep === 2 ?
                            null
                            :
                            <ButtonsStep 
                            generalStep={this.state.generalStep}
                            disableNextButton={this.state.disableNextButton}
                            nextGeneralStep={ this.nextGeneralStep } 
                            previousGeneralStep={ this.previousGeneralStep } />
                        }
                        
                    
                    </View>
                </View>
            </Root>
        );
    }
}


const customStyles = {
    stepIndicatorSize: 28,
    currentStepIndicatorSize:32,
    separatorStrokeWidth: 1,
    currentStepStrokeWidth: 2,
    stepStrokeCurrentColor: '#FE9000',
    stepStrokeWidth: 2,
    stepStrokeFinishedColor: '#FE9000',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#FE9000',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#FE9000',
    stepIndicatorUnFinishedColor: '#aaaaaa',
    stepIndicatorCurrentColor: '#FE9000',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 16,
    stepIndicatorLabelCurrentColor: 'white',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: 'white',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#FE9000'
  }


export default RegisterScreen;