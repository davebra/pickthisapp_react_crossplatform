import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ThingScreen from '../screens/ThingScreen';
import AddScreen from '../screens/AddScreen';
import MyScreen from '../screens/MyScreen';
import IntroScreen from '../screens/IntroScreen';
import LoginScreen from '../screens/LoginScreen';

const HomeThingStack = createStackNavigator({
  Home: HomeScreen,
  Thing: ThingScreen,
});

const HomeStack = createSwitchNavigator(
  {
    HomeStack: HomeThingStack,
    Intro: IntroScreen,
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

const AddAuthStack = createSwitchNavigator(
  {
    Add: AddScreen,
    Login: LoginScreen,
  }
);

AddAuthStack.navigationOptions = {
  tabBarLabel: 'Add Thing',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-camera' : 'md-camera'}
    />
  ),
};

const MyThingStack = createStackNavigator({
  My: MyScreen,
  Thing: ThingScreen,
});

const MyAuthStack = createSwitchNavigator(
  {
    MyStack: MyThingStack,
    Login: LoginScreen,
  }
);

MyAuthStack.navigationOptions = {
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
  AddAuthStack,
  MyAuthStack,
});
