import { Text, View, StyleSheet, Platform, TouchableOpacity, Linking, ScrollView, SafeAreaView, Alert } from 'react-native'
import React, { Component } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default class Map extends Component {

    state = {
        LatLong: { latitude: 23.0225, longitude: 72.5714 },
        title: "Ahmedabad",
        mapType: 'standard',
        markers: [],
    }

    API_KEY = 'AIzaSyDjyTvygnEWDcJvXCkJv6DknRMMX6A4h1g';

    componentDidMount() {
        this.requestLocationPermission();
    }

    requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

            if (response === 'granted') {
                this.locateCurrentPosition();
            }
        } else {
            var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if (response === 'granted') {
                this.locateCurrentPosition();
            }
        }
    }

    locateCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            position => {
                console.log(JSON.stringify(position));

                let initialPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.035,
                }
                this.setState({ initialPosition });
                this.regionAnimate(position.coords.latitude, position.coords.longitude)
            },

            error => Alert.alert(error.message),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
        )
    }


    changeMapType = (type) => {
        if (type == 'standard') {
            this.setState({
                mapType: 'satellite'
            })
        } else {
            this.setState({
                mapType: 'standard'
            })
        }
    }


    onItemChange = (city) => {

        let LAT = 0;
        let LON = 0;
        {
            if (city == 'Ahmedabad') {
                LAT = 23.0225;
                LON = 72.5714;
            } else if (city == 'Mumbai') {
                LAT = 19.0760;
                LON = 72.8777;
            } else if (city == 'Delhi') {
                LAT = 28.7041;
                LON = 77.1025;
            } else if (city == 'Chennai') {
                LAT = 13.0827;
                LON = 80.2707;
            }
        }

        this.setState({
            ...this.state,
            LatLong: { latitude: LAT, longitude: LON },
            title: city,
        })

        this.regionAnimate(LAT, LON)
    }

    regionAnimate = (lat, lon) => {
        this._map.animateToRegion({
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.09,
            longitudeDelta: 0.035
        })
    }
    render() {
        return (

            
            <ScrollView style={styles.mainView} keyboardShouldPersistTaps="always" listViewDisplayed={false}>
                <GooglePlacesAutocomplete
                    placeholder='Where to?'
                    style={toInputBoxStyle}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        console.log("=== Location data======",data);
                        console.log("====Details=====",details);
                        this.setState({
                            ...this.state,
                            LatLong: { latitude: details.geometry.location.lat, longitude: details.geometry.location.lng },
                            title: details.name,
                        },()=>{
                            this.regionAnimate(this.state.LatLong.latitude, this.state.LatLong.longitude)
                        })

                      

                    }}
                    fetchDetails={true}
                    enablePoweredByContainer={false}
                    keyboardShouldPersistTaps={"never"}

                    query={{
                        key: this.API_KEY,
                        language: 'en'
                    }}
                    debounce={400}
                    onFail={error => console.error(error)}
                />
                <MapView
                    ref={map => this._map = map}
                    provider={PROVIDER_GOOGLE}
                    zoomControlEnabled={true}
                    showsUserLocation={true}
                    style={styles.mapView}
                    initialRegion={this.state.initialPosition}
                    mapType={this.state.mapType}
                >
                    <Marker
                        coordinate={this.state.LatLong}
                        title={this.state.title}></Marker>

                </MapView>
                <View style={{ flex: 0.1, flexDirection: 'row', justifyContent: 'center', margin: 10, flexWrap: 'wrap' }}>
                    <TouchableOpacity
                        style={styles.buttonOrange}
                        onPress={() => { this.changeMapType(this.state.mapType) }}>

                        <Text style={styles.buttonText}>Map Type</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonOrange}
                        onPress={() => {
                            Linking.openURL("http://maps.google.com/")
                        }}
                    >
                        <Text style={styles.buttonText}>Go To Maps</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonOrange}
                        onPress={() => {
                            Geolocation.getCurrentPosition(
                                position => {
                                    console.log(JSON.stringify(position));

                                    let initialPosition = {
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude,
                                        latitudeDelta: 0.09,
                                        longitudeDelta: 0.035,
                                    }
                                    this.setState({ initialPosition });
                                    this.regionAnimate(position.coords.latitude, position.coords.longitude)
                                },

                                error => Alert.alert(error.message),
                                { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
                            )
                        }}
                    >
                        <Text style={styles.buttonText}>Current Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonOrange}
                        onPress={() => { this.props.navigation.navigate('Directions') }}
                    >
                        <Text style={styles.buttonText}>Directions</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            

        )
    }
}


const styles = StyleSheet.create({

    mainView: {
        flex: 1,
        backgroundColor: 'white'
    },

    buttonView: {
        // flex: 0.1,
        backgroundColor: '#badee6',
        flexDirection: 'row',
        alignItems: 'center',
    },

    mapView: {
        flex: 0.8,
        height: 650,
    },

    buttonGreen: {
        padding: 10,
        backgroundColor: '#81cc95',
        height: 50,
        margin: 10,
        borderRadius: 15
    },

    buttonOrange: {
        padding: 5,
        margin: 5,
        backgroundColor: 'orange',
        borderRadius: 15,
    },

    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    }

});

const toInputBoxStyle = StyleSheet.create({

    container: {
        backgroundColor: 'white',
        paddingTop: 20,
        flex: 0,
    },
    textInput: {
        backgroundColor: '#DDDDDF',
        borderRadius: 0,
        fontSize: 18,
    },
    textInputContainer: {
        paddingHorizontal: 20,
        paddingBottom: 0,
    },
});