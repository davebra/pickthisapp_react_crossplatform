import React from 'react';
import Colors from '../constants/Colors';
import { Icon } from 'native-base';

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <Icon
        type={this.props.type}
        name={this.props.name}
        style={{ 
          marginTop: 5, 
          fontSize: 26, 
          color: this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault
        }}
      />
    );
  }
}