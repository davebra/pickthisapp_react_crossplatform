import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ThingScreen from '../screens/ThingScreen';
import AddScreen from '../screens/AddScreen';
import MyScreen from '../screens/MyScreen';
import IntroScreen from '../screens/IntroScreen';

const HomeThingStack = createStackNavigator({
  Home: HomeScreen,
  Thing: ThingScreen,
});

const HomeIntroStack = createStackNavigator(
  {
    Home: HomeScreen,
    Intro: IntroScreen,
  },
  {
    mode: 'modal',
  }
);

const HomeStack = createSwitchNavigator(
  {
    Intro: IntroScreen,
    HomeStack: HomeThingStack,
  },
  {
    initialRouteName: 'Intro',
  }
);

HomeStack.navigationOptions = ({navigation})=>{
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {
    tabBarLabel: 'Things Around',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={
          Platform.OS === 'ios'
            ? `ios-pin`
            : 'md-pin'
        }
      />
    ),
  };
  if (routeName === 'Intro') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

const AddStack = createStackNavigator({
  Add: AddScreen,
});

AddStack.navigationOptions = {
  tabBarLabel: 'Add Thing',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-camera' : 'md-camera'}
    />
  ),
};

const MyStack = createStackNavigator({
  My: MyScreen,
});

MyStack.navigationOptions = {
  tabBarLabel: 'My Things',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  AddStack,
  MyStack,
});
