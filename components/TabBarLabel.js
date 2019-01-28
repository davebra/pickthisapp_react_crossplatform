import React from 'react';
import { Caption } from '@shoutem/ui';
import Colors from '../constants/Colors';

export default class TabBarLabel extends React.Component {
  render() {
    return (
        <Caption style={{
            color: this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault 
            }}>{this.props.title}</Caption>
    );
  }
}