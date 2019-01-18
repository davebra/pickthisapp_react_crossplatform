import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import OAuthManager from 'react-native-oauth';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Introduction',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <ExpoLinksView />
      </ScrollView>
    );
  }
}

const manager = new OAuthManager('firestackexample');
manager.configure({
    facebook: {
        client_id: 'SOME_CONSUMER_KEY',
        client_secret: 'SOME_CONSUMER_SECRET'
    },
    google: {
        callback_url: `io.fullstack.FirestackExample:/oauth2redirect`,
        client_id: 'YOUR_CLIENT_ID',
        client_secret: 'YOUR_SECRET'
    }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
