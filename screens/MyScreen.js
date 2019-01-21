import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

export default class MyScreen extends React.Component {
  static navigationOptions = {
    title: 'My Things',
  };

  render() {
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
