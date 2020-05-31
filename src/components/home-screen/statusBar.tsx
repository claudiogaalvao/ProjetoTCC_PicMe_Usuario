import React, { Component } from "react";
import { View, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Icon } from 'native-base';

interface State {
    expanded: boolean;
    expandedMenu: boolean;
}

class StatusBar extends Component {

    state: State = {
        expanded: false,
        expandedMenu: false
    }

    changeLayout = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ expanded: !this.state.expanded });
    }

    changeLayoutMenu = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ expandedMenu: !this.state.expandedMenu });
    }

    render() {

        return(
            <View style={{ width: '100%', height: undefined, position: 'absolute', bottom: 0 }}>
                <View style={{ width: '100%', height: 70, backgroundColor: 'white', borderTopStartRadius: 10, borderTopEndRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                    
                    <TouchableOpacity onPress={this.changeLayout} style={{ position: 'absolute', width: 30, height: 30, left: 25, alignItems: 'center', justifyContent: 'center' }}>
                    { this.state.expanded ? <Icon type='FontAwesome5' name='angle-down' /> : <Icon type='FontAwesome5' name='angle-up' /> }              
                    </TouchableOpacity>
                    

                    <Text style={{ color: '#000', fontSize: 20, textAlign: 'center' }}>
                    Fotógrafo a caminho
                    </Text>
                    
                </View>

                <View style={{ width: '100%', height: this.state.expanded ? 200 : 0, overflow: 'hidden', backgroundColor: 'white', borderTopWidth: 1, borderColor: '#DEDEDE', alignItems: 'center' }}>

                    <View style={{ width: '100%', height: 90 }}>
                        
                        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', marginTop: 20, width: '100%' }}>
                            <View style={{ width: 55, height: 55, borderRadius: 55/2, backgroundColor: '#FF4170', alignItems: 'center', justifyContent: 'center'}}>
                                <Icon type="FontAwesome5" name="user" style={{ color: 'white', fontSize: 26 }}></Icon>
                            </View>
                        </View>

                        <TouchableOpacity onPress={this.changeLayoutMenu} style={{ width: '100%', height: 90, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <View style={{ position: 'absolute', width: 50, height: 50, top: 20, right: 30, backgroundColor: '#F1EFF1', borderRadius: 50/2, alignItems: 'center', justifyContent: 'center'}}>
                                <Icon type='FontAwesome5' name='ellipsis-v' style={{ fontSize: 20 }}></Icon>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'black', marginBottom: 10 }}>Nome do Fotógrafo • 4,87 ★</Text>
                        <Text style={{ textAlign: 'center', fontSize: 14, color: 'black' }}>800 metros de distância</Text>
                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'black' }}>Nikon EX400 • 20 fotos</Text>
                    </View>

                    
                </View>

                <View style={{ position: 'absolute', bottom: 0, width: '100%', height: this.state.expandedMenu ? 300 : 0, overflow: 'hidden', backgroundColor: 'white', borderTopStartRadius: 10, borderTopEndRadius: 10 }}>
                    
                    <TouchableOpacity onPress={this.changeLayoutMenu} style={{ position: 'absolute', marginLeft: 20, marginTop: 20 }}>
                    <Icon type='FontAwesome5' name='times' style={{ fontSize: 20 }} />
                    </TouchableOpacity>

                    <View style={{ width: '100%', height: 70, marginTop: 60, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 8, color: 'black' }}>Yoshi</Text>
                    <Text style={{ color: 'black' }}>★4,87 • Nikon EX400 • 20 fotos</Text>
                    </View>

                    <View style={{ width: '100%', height: 120, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{ position: 'absolute', right: 80, alignItems: 'center' }}>
                        <View style={{ width: 60, height: 60, marginBottom: 8, backgroundColor: '#F1EFF1', borderRadius: 60/2, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon type='FontAwesome5' name='ban' style={{ fontSize: 32, color: 'red' }}></Icon>
                        </View>
                        <Text style={{ color: '#92969A'}}>Cancelar</Text>
                    </View>

                    <View style={{ position: 'absolute', left: 80, alignItems: 'center' }}>
                        <View style={{ width: 60, height: 60, marginBottom: 8, backgroundColor: '#F1EFF1', borderRadius: 60/2, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon type='FontAwesome5' name='comment-dots' style={{ fontSize: 32 }}></Icon>
                        </View>
                        <Text style={{ color: '#92969A'}}>Contatar</Text>
                    </View>
                    
                    </View>
                        
                </View>
                </View>
        );
    }

}

export default StatusBar;