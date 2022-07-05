import { Text, View, SafeAreaView } from 'react-native'
import React, { Component } from 'react'
import Map from './src/map'
import Search from './src/search'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableLatestRenderer } from 'react-native-maps';

const Stack = createNativeStackNavigator();
enableLatestRenderer();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Map} />
          <Stack.Screen name="Directions" component={Search} />
        </Stack.Navigator> 
      </NavigationContainer>
    );
  }
}



