import React from 'react';
import { Text } from 'react-native';
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';

export default class TabBarLabel extends React.Component {
  render() {
    return (
        <Text style={{
            fontFamily: Fonts.fontMedium,
            textAlign: 'center',
            color: this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault 
            }}>{this.props.title}</Text>
    );
  }
}