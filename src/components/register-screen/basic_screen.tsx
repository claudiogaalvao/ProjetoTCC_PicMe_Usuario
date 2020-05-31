import React, { Component } from "react";
import { NavigationScreenOptions } from "react-navigation";
import { View, Text, TextInput, Alert, Picker } from "react-native";
import { TextInputMask } from 'react-native-masked-text';

interface Props {
    firstName: string,
    lastName: string,
    cpf: string,
    birthDate: Date,
    email: string,
    phone: string,
    handleChange: Function
}

interface State {
    birthDate: string,
    inputSelected: string,
}

class BasicScreen extends Component<Props> {
    static navigationOptions: NavigationScreenOptions = {
        title: '',
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: 'white'
    }
    
    state: State = {
        birthDate: '',
        inputSelected: '',
    };

    passwordInput: any;
    password2Input: any;
    firstNameInput: any;
    lastNameInput: any;
    cpfInput: any;
    birthDateInput: any;
    phoneInput: any;

    isEmailAvailable = async () => {
    }

    render() {

        return(
        <View style={{ height: '100%', width: '100%' }}>

            <View style={{ width: '90%', flexDirection: 'row', marginLeft: '5%', paddingTop: '15%' }}>
                <View style={{ width: '48%', marginRight: '4%' }}>
                    {
                        this.props.firstName !== '' ?
                        <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 15, 
                        paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', 
                        top: this.props.firstName !== '' ? -8 : 15, 
                        fontSize: this.props.firstName !== '' ? 12 : 16, 
                        color: this.state.inputSelected === 'firstName' ? '#4563CD' : '#A7A7A7', }}>
                            Primeiro nome
                        </Text>
                        :
                        null
                    }
                    <TextInput                        
                    placeholder='Primeiro nome'
                    onChangeText={ (text) => this.props.handleChange('firstName', text) }
                    value={ this.props.firstName }
                    onFocus={() => this.setState({ inputSelected: 'firstName' })}
                    onBlur={() => this.setState({ inputSelected: '' }) }
                    style={{ width: '100%', height: 50, paddingLeft: 20, marginBottom: 15, borderWidth: 1, borderColor: this.state.inputSelected === 'firstName' ? '#4563CD' : '#C1C1C1', borderRadius: 30, fontSize: 16, zIndex: -1 }}
                    />
                </View>

                <View style={{ width: '48%' }}>
                    {
                        this.props.lastName !== '' ?
                        <Text 
                        style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 15, 
                        paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', 
                        top: this.props.lastName !== '' ? -8 : 15, 
                        fontSize: this.props.lastName !== '' ? 12 : 16, 
                        color: this.state.inputSelected === 'lastName' ? '#4563CD' : '#A7A7A7', }}>
                            Último nome
                        </Text>
                        :
                        null
                    }
                    <TextInput
                    placeholder='Último nome'
                    onChangeText={ (text) => this.props.handleChange('lastName', text) }
                    value={ this.props.lastName }
                    onFocus={() => this.setState({ inputSelected: 'lastName' })}
                    onBlur={() => this.setState({ inputSelected: '' }) }
                    style={{ width: '100%', height: 50, paddingLeft: 20, marginBottom: 15, 
                    borderWidth: 1, borderColor: this.state.inputSelected === 'lastName' ? '#4563CD' : '#C1C1C1', 
                    borderRadius: 30, fontSize: 16, zIndex: -1 }}
                    />
                </View>
            </View>

            <View style={{ width: '90%', flexDirection: 'row', marginLeft: '5%' }}>
                <View style={{ width: '54%', marginRight: '4%' }}>
                    {
                        this.props.cpf !== '' ?
                        <Text style={{ position: 'absolute', alignSelf: 'flex-start', 
                        marginLeft: 15, paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', 
                        top: this.props.cpf !== '' ? -8 : 15, 
                        fontSize: this.props.cpf !== '' ? 12 : 16, 
                        color: this.state.inputSelected === 'cpf' ? '#4563CD' : '#A7A7A7', }}>
                            CPF
                        </Text>
                        :
                        null
                    }
                    <TextInputMask
                    type={'cpf'}
                    maxLength={14}
                    placeholder='Digite seu CPF'
                    onChangeText={ (text) => this.props.handleChange('cpf', text) }
                    value={ this.props.cpf }
                    onFocus={() => this.setState({ inputSelected: 'cpf' })}
                    onBlur={() => this.setState({ inputSelected: '' }) }
                    style={{ width: '100%', height: 50, paddingLeft: 20, marginBottom: 15, 
                    borderWidth: 1, borderColor: this.state.inputSelected === 'cpf' ? '#4563CD' : '#C1C1C1', 
                    borderRadius: 30, fontSize: 16, zIndex: -1 }}
                    />
                </View>

                <View style={{ width: '42%' }}>
                    {
                        <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 15, 
                        paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', 
                        top: -8, 
                        fontSize: 12, 
                        color: this.state.inputSelected === 'birthDate' ? '#4563CD' : '#A7A7A7', }}>
                            Nascimento
                        </Text>
                    }
                    <TextInputMask
                    value={ this.props.birthDate !== undefined && this.props.birthDate !== null ? this.props.birthDate.toString() : this.state.birthDate }
                    type={'datetime'}
                    options={{
                    format: 'DD/MM/YYYY'
                    }}
                    maxLength={10}
                    placeholder='Nascimento'
                    onChangeText={ (text) => {
                        this.setState({
                            birthDate: text
                        })
                        const isDate = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
                        
                        if(isDate.test(text)) {
                            this.props.handleChange('birthDate', text) 
                        }                            
                    }}
                    onFocus={() => {
                        this.props.handleChange('birthDate', undefined)
                        this.setState({ inputSelected: 'birthDate' })
                    }}
                    onBlur={() => this.setState({ inputSelected: '' }) }
                    style={{ width: '100%', height: 50, paddingLeft: 20, marginBottom: 15, 
                    borderWidth: 1, borderColor: this.state.inputSelected === 'birthDate' ? '#4563CD' : '#C1C1C1', 
                    borderRadius: 30, fontSize: 16, zIndex: -1 }}
                    />
                </View>
            </View>

            <View style={{ alignItems: 'center' }}>
                {
                    this.props.email !== '' ?
                    <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 30, 
                    paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', 
                    top: this.props.email !== '' ? -8 : 15, 
                    fontSize: this.props.email !== '' ? 12 : 16, 
                    color: this.state.inputSelected === 'email' ? '#4563CD' : '#A7A7A7', }}>
                        E-mail
                    </Text>
                    :
                    null
                }
                <TextInput
                placeholder='E-mail'
                onChangeText={ (text) => this.props.handleChange('email', text) }
                value={ this.props.email }
                onFocus={() => this.setState({ inputSelected: 'email' })}
                onBlur={() => {
                    this.setState({ inputSelected: '' });
                    this.isEmailAvailable();
                }}
                style={{ width: '90%', height: 50, paddingLeft: 20, marginBottom: 15, 
                borderWidth: 1, borderColor: this.state.inputSelected === 'email' ? '#4563CD' : '#C1C1C1', 
                borderRadius: 30, fontSize: 16, zIndex: -1 }}
                />
            </View>

            <View style={{ alignItems: 'center' }}>
                {
                    this.props.phone !== '' ?
                    <Text style={{ position: 'absolute', alignSelf: 'flex-start', marginLeft: 30, 
                    paddingLeft: 5, paddingRight: 5, backgroundColor: 'white', 
                    top: this.props.phone !== '' ? -8 : 15, 
                    fontSize: this.props.phone !== '' ? 12 : 16, 
                    color: this.state.inputSelected === 'phone' ? '#4563CD' : '#A7A7A7', }}>
                        Celular
                    </Text>
                    :
                    null
                }
                <TextInputMask
                type={'cel-phone'}
                placeholder='Celular'
                value={ this.props.phone }
                onChangeText={ (text) => this.props.handleChange('phone', text) }
                onFocus={() => this.setState({ inputSelected: 'phone' })}
                onBlur={() => this.setState({ inputSelected: '' }) }
                style={{ width: '90%', height: 50, paddingLeft: 20, marginBottom: 15, borderWidth: 1, 
                borderColor: this.state.inputSelected === 'phone' ? '#4563CD' : '#C1C1C1', 
                borderRadius: 30, fontSize: 16, zIndex: -1 }}
                maxLength={15}
                />
            </View>               
            
        </View>
        );
    }
}

export default BasicScreen;