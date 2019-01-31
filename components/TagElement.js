import React from 'react';
import { Text } from 'react-native';
import Colors from '../constants/Colors';

export class TagElement extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { 
      paddingLeft: 5,
      paddingRight: 5,
      paddingTop: 2,
      paddingBottom: 2,
      marginRight: 4,
      backgroundColor: Colors.secondaryColor,
      color: 'white',
      borderRadius: 3,
      overflow: 'hidden'
      }]} />;
  }
}
