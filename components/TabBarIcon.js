import React from 'react';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <Ionicons
        name={this.props.name}
        size={26}
        style={{ marginTop: 5 }}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}