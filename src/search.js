import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Text, View, ScrollView, StyleSheet, Dimensions, SafeAreaView } from 'react-native'
import React, { Component } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion, Animated } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions'


const { width, height } = Dimensions.get('window');

export default class Search extends Component {

    API_KEY = 'AIzaSyDjyTvygnEWDcJvXCkJv6DknRMMX6A4h1g';

    state = {
        initialPosition: {
            latitude: 23.0225,
            longitude: 72.5714,
            latitudeDelta: 0.09,
            longitudeDelta: 0.035,
        },
        origin: { latitude: 0, longitude: 0 },
        destination: { latitude: 0, longitude: 0 },
        distance: 0,
        time: 0,

    }



    render() {
        return (
            <SafeAreaView style={{height: "100%"}}>
            <ScrollView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 0.2 }}>

                    <GooglePlacesAutocomplete
                        placeholder='Origin'
                        onPress={(data, details = null) => {
                            // 'details' is provided when fetchDetails = true
                            console.log(data);
                            console.log(details);
                            this.setState({
                                ...this.state,
                                origin: { latitude: details.geometry.location.lat, longitude: details.geometry.location.lng },
                            })

                        }}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                        styles={toInputBoxStyle}
                        query={{
                            key: this.API_KEY,
                            language: 'en',
                        }}
                        debounce={400}
                        onError={error => console.error(error)}
                    />

                    <GooglePlacesAutocomplete
                        placeholder='Destination'
                        onPress={(data, details = null) => {
                            // 'details' is provided when fetchDetails = true
                            console.log(data);
                            console.log(details);
                            this.setState({
                                ...this.state,
                                destination: { latitude: details.geometry.location.lat, longitude: details.geometry.location.lng },
                            })

                        }}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                        styles={toInputBoxStyle}
                        query={{
                            key: this.API_KEY,
                            language: 'en',
                        }}
                        debounce={400}
                        onFail={error => console.error(error)}
                    />
                </ScrollView>

                <MapView
                    ref={map => this._map = map}
                    provider={PROVIDER_GOOGLE}
                    zoomControlEnabled={true}
                    showsUserLocation={true}
                    initialRegion={
                        this.state.initialPosition
                    }
                    style={{ flex: 0.6, height: 600, margin: 5, }}
                >
                    {(this.state.destination.latitude != 0) && (this.state.origin.latitude != 0) && (<MapViewDirections
                        origin={this.state.origin}
                        destination={this.state.destination}
                        apikey={this.API_KEY}
                        strokeWidth={2}
                        strokeColor='black'
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={result => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)

                            this.setState({
                                distance: result.distance,
                                time: result.duration
                            })
                            this._map.fitToCoordinates(result.coordinates, {
                                edgePadding: {
                                    right: (width / 20),
                                    bottom: (height / 20),
                                    left: (width / 20),
                                    top: (height / 20),
                                }
                            });
                        }}
                        onError={(errorMessage) => {
                            console.log('GOT AN ERROR');
                        }}
                    />)}

                    <Marker
                    coordinate={this.state.origin}
                    />
                    <Marker
                    coordinate={this.state.destination}
                    />

                </MapView>
                {(this.state.distance > 0) && (this.state.time > 0) && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={styles.text}>Distance: {this.state.distance} KM </Text>
                        <Text style={styles.text}>Time: {Math.round(this.state.time / 60)} hrs {Math.round(this.state.time % 60)} min</Text>
                    </View>)}


            </ScrollView>
            </SafeAreaView>
        )
    }
}

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

const styles = StyleSheet.create({
    text: {
        borderWidth: 2,
        width: '35%',
        margin: 5,
        fontSize: 16,
        padding: 6,
        borderRadius: 10,
        flexWrap: 'wrap'

    }
})