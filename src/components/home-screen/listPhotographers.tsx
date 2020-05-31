import React, { Component } from "react";
import { Text, Icon } from 'native-base';
import { View, FlatList, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ImageBackground } from 'react-native';
import { HomeState } from "../../store/reducers/home";
import { connect } from "react-redux";
import { GeoUtils } from "../../utils/geo.utils";

interface Props {
    navigation: any,
    home: HomeState
}

interface State {
  photographers: object[];
}

class ListBottom extends Component<Props> {

    constructor(props: Props) {
        super(props)
    }

    goToPhotographerProfile = (photographerId: string) => {
        //@ts-ignore
        this.props.navigation.navigate("PhotographerProfile", {
            photographer: photographerId,
            location: this.props.home.nearLocations.filter(x => x.userId === photographerId)[0]
        });
    }

    goToListBottomFilter = () => {
        this.props.navigation.navigate('ListBottomFilter')
    }

    noPhotographersAvailable() {
        return(
            <View style={{ height: '100%' }}>
                <ImageBackground style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} 
                    source={require('./../../../assets/animations/circle_fading.gif')}>
                        
                    <Text style={{ width: 240, fontSize: 18, textAlign: 'center' }}>Não há fotógrafos online perto de você agora</Text>

                </ImageBackground>
            </View>
        )
    }

    listPhotographers() {
        const { nearLocations, currentPosition } = this.props.home;

        return nearLocations.map((photographer, index) => {

            return(
                <TouchableOpacity onPress={() => this.goToPhotographerProfile(photographer.userId)} key={index} style={{ marginBottom: 10, width: '100%', height: 110, padding: 8, paddingRight: 20, paddingLeft: 10, borderColor: '#E0E0E0', borderWidth: 1}}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ width: '15%', height: 55, alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{ width: 50, height: 50, backgroundColor: "#FF4170", borderRadius: (50/2) }}>
                                {
                                    photographer.summaryData.profilePicture !== "" ?
                                    <Image style={{ width: 50, height: 50, borderRadius: (50/2) }} source={{ uri: photographer.summaryData.profilePicture }} />
                                    :
                                    <View style={{ width: 50, height: 50, borderRadius: (50/2) }} />
                                }
                                
                            </View>                        
                            <View style={{ width: 30, height: 18, paddingRight: 3, backgroundColor: "#000", borderRadius: 5, position: 'absolute', bottom: 5, right: -2, alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'row' }}>                            
                                
                                <Text style={{ color: '#fff', fontSize: 13 }}>★</Text>
                                <Text style={{ color: '#fff', fontSize: 11}}>{
                                    photographer.summaryData.ratingAverage
                                }</Text>
                            </View>
                        </View>
                        
                        <View style={{ marginLeft: 10, width: '55%'}}>
                            <Text numberOfLines={1} style={styles.item}>{ photographer.summaryData.name }</Text>
                            <Text style={{ color: "#696969", fontSize: 12, marginTop: -5}}>
                                <Icon type='FontAwesome5' name='map-marker-alt' style={{color: '#696969', fontSize: 14, marginRight: 8 }} /> a { GeoUtils.calculateDistance(photographer.coordinates, currentPosition) } metros
                            </Text>
                            <Text numberOfLines={1}>{ photographer.equipments[0].brand +" "+  photographer.equipments[0].model }</Text>
                        </View>
    
                        <View style={{ width: '30%', alignItems: 'flex-end', marginTop: 5}}>
                            <Text style={{fontSize: 10}}>a partir de:</Text>
                            <Text style={{color: '#4BB543', fontSize: 20}}>
                                R$ {(photographer.equipments[0].priceMin * photographer.equipments[0].qtdMin)
                                    .toFixed(2).replace(".", ",")}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={{flex: 1, flexDirection: 'row', bottom: -23}}>
                        <View style={styles.tag}><Text style={styles.tagText}>{photographer.equipments[0].type}</Text></View>
                        <View style={styles.tag}><Text style={styles.tagText}>{photographer.equipments[0].qtdMin} foto{photographer.equipments[0].qtdMin > 1 ? "s" : ""}</Text></View>
                        <View style={styles.tag}><Text style={styles.tagText}>R$ {(photographer.equipments[0].priceMin).toFixed(2).replace(".", ",")}/foto</Text></View>
                    </View>
                    
                </TouchableOpacity>
               
            )
        })
        
    }

    render() {
        const { nearLocations } = this.props.home;

        return(
            <View style={{ position: 'absolute', bottom: 0, backgroundColor: '#F9F9F9', height: 200, width: '100%' }}>

                {/*<View style={{ position: 'absolute', top: -50, width: '100%', height: 40, justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity onPress={ () => this.goToListBottomFilter() } style={{ width: 100, height: 40, backgroundColor: 'white', borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 5 }}>                        
                        <Text style={{ color: '#000', fontSize: 12, fontWeight: 'bold'}}>FILTROS</Text>
                        <Icon type='FontAwesome5' name='sliders-h' style={{color: '#000', fontSize: 12, marginLeft: 6 }} />
                    </TouchableOpacity>
        </View> */}

                { 
                    nearLocations.length > 0 ? 
                    
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ margin: 8, marginTop: 20, marginBottom: 0 }}
                    >
                        { this.listPhotographers() }
                    </ScrollView>
                    :
                    this.noPhotographersAvailable()

                }                

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     paddingTop: 22
    },
    item: {
        fontSize: 15,
        marginBottom: 3,
        fontWeight: 'bold'
    },
    tag: {
        borderColor: '#339AF0', 
        borderWidth: 1,
        height: 25,
        paddingLeft: 4,
        paddingRight: 4,
        marginRight: 8,
        borderRadius: 5
    },
    tagText: {
        color: '#339AF0'
    }
})

const mapStateToProps = (state) => ({
    home: state.home
});
const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ListBottom);