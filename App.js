/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Image, Button, Text, View} from 'react-native';
import {createStackNavigator, createAppContainer, createBottomTabNavigator} from 'react-navigation';
import Icon from "react-native-vector-icons/Ionicons";

import MainScreen from './components/MainScreen';
import ListViewScreen from './components/ListViewScreen';
import AddLocationScreen from './components/AddLocationScreen';
import ToiletScreen from './components/ToiletScreen';
import ReviewLocationScreen from './components/ReviewLocationScreen';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

// type Props = {};
export default class App extends Component {
  
  render() {
    return (
      <AppStackContainer />
    );
  }
}

const MainStack = createStackNavigator({
  Main: MainScreen,
  AddLocation: AddLocationScreen,
  Toilet: ToiletScreen,
  Review: ReviewLocationScreen,
});

const ListViewStack = createStackNavigator({
  ListView: ListViewScreen,
  AddLocation: AddLocationScreen,
  Toilet: ToiletScreen,
  Review: ReviewLocationScreen,
});

const AppTabNavigator = createBottomTabNavigator(
  {
    Main: { 
      screen: MainStack,
      navigationOptions: {
        tabBarLabel: 'Map View'
      }
    },
    ListView: { 
      screen: ListViewStack,
      navigationOptions: {
        tabBarLabel: 'List View'
      }
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Main') {
          iconName = `${Platform.OS === "ios" ? "ios-map" : "md-map"}`;
        } else if (routeName === 'ListView') {
          iconName = `${Platform.OS === "ios" ? "ios-list-box" : "md-list-box"}`;
        }

        return <Icon name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#FF4354',
      inactiveTintColor: 'grey'
    }
  }
);

const AppStackContainer = createAppContainer(AppTabNavigator);

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
