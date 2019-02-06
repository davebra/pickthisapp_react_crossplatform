import React from 'react';
import { Text } from 'react-native';
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';

export class TagText extends React.Component {
  render() {
    return <Text {...this.props} style={[{ 
      paddingLeft: 6,
      paddingRight: 6,
      paddingTop: 3,
      paddingBottom: 3,
      fontFamily: Fonts.fontMedium,
      marginRight: 5,
      backgroundColor: Colors.secondaryColor,
      color: '#fff',
      borderRadius: 3,
      overflow: 'hidden'
      }, this.props.style]} />;
  }
}
