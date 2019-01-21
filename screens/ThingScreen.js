import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

export default class ThingScreen extends React.Component {
  static navigationOptions = {
    title: 'Thing',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <ScrollView style={styles.container}>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
