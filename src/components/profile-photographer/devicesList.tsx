import React, { Component } from "react";
import { Text } from 'native-base';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { HomeState } from "../../store/reducers/home";
import DeviceModel from "../../models/firebase/device-model";

interface Props {
    device: DeviceModel,
    qtdDevices: number,
    openRequestPanel: any,
    index: number
}

class DevicesList extends Component<Props> {

    render() {
        const { device } = this.props;
        const marginRight = this.props.index === (this.props.qtdDevices-1) ? 15 : 0;

        if (!device) {
            return(
                <View />
            );
        }

        return(
            <TouchableOpacity onPress={() => this.props.openRequestPanel(device)} key={`dev-${this.props.device.deviceId}`} style={{ width: 300, height: 90, marginLeft: 15, marginRight: marginRight, backgroundColor: 'white', borderWidth: 1, borderColor: '#0A2463', borderRadius: 10, elevation: 5, flexDirection: 'row' }}>
                <View style={{ width: '65%', height: '80%', top: 9, left: 10 }}>
                    <Text style={{ color: '#0A2463', fontSize: 16, fontWeight: 'bold'}}>{device.type}</Text>
                    <Text style={{ color: '#0A2463', fontSize: 14 }}>{device.brand}, {device.model}</Text>
                    
                    <View style={{ position: 'absolute', bottom: -2, flexDirection: 'row' }}>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>R$ {parseInt(device.priceMin.toString()).toFixed(2).replace(".", ",")}/foto</Text>
                        </View>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>Mínimo {device.qtdMin} fotos</Text>
                        </View>
                    </View>
                                                        
                </View>
                <View style={{ width: '30%', height: '80%', top: 9, left: 10, alignItems: 'flex-end' }}>
                    <Text style={{ color: '#ED254E', fontSize: 16 }}>a partir</Text>
                    <Text style={{ color: '#ED254E', fontSize: 18 }}>R$ {(device.priceMin * device.qtdMin).toFixed(2).replace(".", ",")}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    tag: {
        borderColor: '#3E92CC', 
        borderWidth: 1,
        height: 25,
        paddingLeft: 4,
        paddingRight: 4,
        marginRight: 8,
        borderRadius: 5
    },
    tagText: {
        color: '#3E92CC'
    }
})

export default DevicesList;