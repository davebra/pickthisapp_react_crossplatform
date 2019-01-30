import React from 'react';
import { Text } from 'react-native';
import Colors from '../constants/Colors';

export default class TabBarLabel extends React.Component {
  render() {
    return (
        <Text style={{
            color: this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault 
            }}>{this.props.title}</Text>
    );
  }
}