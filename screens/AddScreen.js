import React from 'react';
import { ScrollView } from 'react-native';
import { ExpoConfigView } from '@expo/samples';

export default class AddScreen extends React.Component {
  static navigationOptions = {
    title: 'Add a new Thing',
  };

  render() {
    return (
      <ExpoConfigView />
    );
  }
}

