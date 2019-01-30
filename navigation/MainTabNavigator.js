import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import TabBarLabel from '../components/TabBarLabel';

import HomeScreen from '../screens/HomeScreen';
import ThingScreen from '../screens/ThingScreen';
import AddScreen from '../screens/AddScreen';
import PublishedScreen from '../screens/PublishedScreen';
import MyScreen from '../screens/MyScreen';
import IntroScreen from '../screens/IntroScreen';
import LoginScreen from '../screens/LoginScreen';

const HomeThingStack = createStackNavigator({
  Home: HomeScreen,
  Thing: ThingScreen,
  Login: LoginScreen,
});

const HomeStack = createSwitchNavigator(
  {
    HomeStack: HomeThingStack,
    Intro: IntroScreen,
  },
  {
    backBehavior: 'initialRoute'
  }
);

HomeStack.navigationOptions = ({navigation})=>{
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {
    tabBarLabel: ({ focused }) => (
      <TabBarLabel
        focused={focused}
        title={'Things Around'}
      />
    ),
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        type='Ionicons'
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

const AddScreenStack = createStackNavigator({
  Add: AddScreen,
  Published: PublishedScreen,
});

const AddAuthStack = createSwitchNavigator(
  {
    Add: AddScreenStack,
    Login: LoginScreen,
  },
  {
    backBehavior: 'initialRoute'
  }
);

AddAuthStack.navigationOptions = {
  tabBarLabel: ({ focused }) => (
    <TabBarLabel
      focused={focused}
      title={'Add Things'}
    />
  ),
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      type='Ionicons'
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
  },
  {
    backBehavior: 'initialRoute'
  }
);

MyAuthStack.navigationOptions = {
  tabBarLabel: ({ focused }) => (
    <TabBarLabel
      focused={focused}
      title={'My Things'}
    />
  ),  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      type='Ionicons'
      name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  AddAuthStack,
  MyAuthStack,
},{
  tabBarOptions: {
    style: {
      height: 56,
    },
  }
}
);
