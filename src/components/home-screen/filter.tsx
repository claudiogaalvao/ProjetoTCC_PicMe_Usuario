import ScreenBase from "../common/screen-base";
import React from "react";
import { View, Text, TouchableHighlight, Dimensions, Switch } from 'react-native';
import { NavigationScreenOptions } from "react-navigation";
import { Icon, Button } from "native-base";
import Item from "../../../native-base-theme/components/Item";
import { ScrollView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get('window')

const CloseButton = (props) => {
    return(
        <TouchableHighlight onPress={() => props.navigation.goBack(null)}>
            <Icon type="FontAwesome5" name='close' />
        </TouchableHighlight>
    ) 
}

interface Props {
}

interface State {
    category: object[],
    sortedBy: string
}

class listBottomFilter extends ScreenBase<Props> {

    static navigationOptions: NavigationScreenOptions = {
        header: null
    };

    state: State = {
        category: [
            { key: 1, name: 'Adventure', selected: false },
            { key: 2, name: 'Celular', selected: false },
            { key: 3, name: 'Drone', selected: false },
            { key: 4, name: 'Câmera Profissional', selected: false },
            { key: 5, name: 'Câmera Semi-profisisonal', selected: false },
        ],
        sortedBy: ''
    }

    cleanFilters() {
        const { category } = this.state;

        category.map(element => {
            if(element.selected)
                element.selected = false
        })

        this.setState({
            category,
            sortedBy: ''
        })
    }

    closeFilterScreen = () => {
        this.navigate('Home')
    }

    sortedToggleSwitch(sortedBy) {
        this.setState({
            sortedBy,
        });
    }

    toggleSwitch(index) {

        const { category } = this.state;
        category[index].selected = !category[index].selected;

        // update state
        this.setState({
            category,
        });

    }

    render() {

        return(

            <View>
                <View style={{ position: 'absolute', width: '100%', height: 50, top: 0, paddingTop: 20, alignItems: 'flex-start', justifyContent: 'center'}}>
                    <TouchableHighlight onPress={() => this.closeFilterScreen() } style={{ left: 25, height: '100%', width: 20 }}>
                        <Icon type='FontAwesome5' name='times' style={{
                            color: '#000', fontSize: 20
                        }} />
                    </TouchableHighlight>
                </View>

                <View style={{ position: 'absolute', width: '100%', height: 50, top: 0, paddingTop: 20, alignItems: 'flex-end', justifyContent: 'center'}}>
                    <TouchableHighlight onPress={() => this.cleanFilters() } style={{ right: 25, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#000', fontSize: 14}}>Limpar</Text>
                    </TouchableHighlight>
                </View>
                
                <View style = {{ height: '100%', top: 60, marginLeft: 20, marginRight: 20 }}>
                    <ScrollView>

                        <View>
                            <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Ordenar por</Text>
                            
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                <Text style={{ color: '#000', fontSize: 18}}>Menor preço total</Text>
                                <Switch onValueChange={ () => this.sortedToggleSwitch('totalPrice') } value={this.state.sortedBy === 'totalPrice' ? true : false} style={{ position: 'absolute', right: 0 }} />
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                <Text style={{ color: '#000', fontSize: 18}}>Menor preço por foto</Text>
                                <Switch onValueChange={ () => this.sortedToggleSwitch('pricePerPhoto') } value={this.state.sortedBy === 'pricePerPhoto' ? true : false} style={{ position: 'absolute', right: 0 }} />
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                <Text style={{ color: '#000', fontSize: 18}}>Menor distância</Text>
                                <Switch onValueChange={ () => this.sortedToggleSwitch('distance') } value={this.state.sortedBy === 'distance' ? true : false} style={{ position: 'absolute', right: 0 }} />
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                <Text style={{ color: '#000', fontSize: 18}}>Maior nota</Text>
                                <Switch onValueChange={ () => this.sortedToggleSwitch('rating') } value={this.state.sortedBy === 'rating' ? true : false} style={{ position: 'absolute', right: 0 }} />
                            </View>

                        </View>
                            
                        <View style={{ borderTopWidth: 1, borderTopColor: '#CED4DA', marginTop: 15, paddingTop: 15 }}>
                            <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Categorias</Text>
                            
                            { this.state.category.map((element, index) => {
                                return(
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                        <Text style={{ color: '#000', fontSize: 18}}>{element.name}</Text>
                                        <Switch onValueChange={ () => this.toggleSwitch(index) } value={element.selected} style={{ position: 'absolute', right: 0 }} />
                                    </View>
                                )
                            })}
                            

                        </View>
                    
                    </ScrollView>

                </View>

                <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 70, borderTopWidth: 1, borderTopColor: '#CED4DA', alignItems: 'center', justifyContent: 'center'}}>
                    <Button style={{ width: '90%', height: '70%', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold'}}>Mostrar 11 fotógrafos</Text></Button>
                </View>
            </View>

        );
    }
}

export default listBottomFilter;