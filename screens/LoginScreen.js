import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight, Icon } from 'react-native';
import Expo from 'expo';
import { ANDROID_AUTH_CLIENT_ID, IOS_AUTH_CLIENT_ID, ANDROID_STANDALONE_AUTH_CLIENT_ID, IOS_STANDALONE_AUTH_CLIENT_ID } from 'react-native-dotenv';

export default class LoginScreen extends React.Component {
  state = {
    userInfo: null,
    userLogged: false,
    chooseNickname: false,
    userNickname: null,
  };

  static navigationOptions = {
    title: 'Join PickThisApp',
  };

  // default function initialized when Screen is loaded
  componentDidMount() {
    // check if is the first time the app is launched (value saved in device storage)
    AsyncStorage.getItem('userNickname').then( value => {
      if (value == null) {
        this.setState({userLogged: false});
      } else {
        this.setState({userNickname: value});
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        
        {!this.state.userLogged ? (
          <View>
            <Text style={styles.loginTitle}>Want to post something on PickThisApp?</Text>
            <TouchableHighlight style={styles.googleLoginTouchable} onPress={this.googleAuth}>
              <Text style={styles.googleLoginTitle}>Join with Google</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.facebookLoginTouchable} onPress={this.facebookAuth}>
              <Text style={styles.facebookLoginTitle}>Join with Facebook</Text>
            </TouchableHighlight>
          </View>
        ) : (
          this.state.chooseNickname ? (
            <View>
              <Text style={styles.loginTitle}>Choose a nickname</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.loginTitle}>Hey {this.userNickname}!</Text>
              <TouchableHighlight style={styles.logoutTouchable} onPress={this.executeLogout}>
                <Text style={styles.logoutTitle}>Want to Logout?</Text>
              </TouchableHighlight>
            </View>
          )
        )}

        <Text style={styles.loginBottomText}>We will never spam, you, that's a promise!</Text>
      </View>
    );
  }

  // function executed when the Google button is clicked
  googleAuth = () => {
    try {
      const result = await Expo.Google.logInAsync({
        androidClientId: ANDROID_AUTH_CLIENT_ID,
        androidStandaloneAppClientId: ANDROID_STANDALONE_AUTH_CLIENT_ID,
        iosClientId: IOS_AUTH_CLIENT_ID,
        iosStandaloneAppClientId: IOS_STANDALONE_AUTH_CLIENT_ID,
        scopes: ['profile', 'email'],
      });
      if (result.type === 'success') {
        console.log(result);
      } else {
        console.log(`Google Login Canceled`);
      }
    } catch(e) {
      console.log(`Google Login Error: ${e}`);
    }
  }

  // function executed when the Facebook button is clicked
  facebookAuth = () => {
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Expo.Facebook.logInWithReadPermissionsAsync('<APP_ID>', {
        permissions: ['public_profile', 'email'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const userInfoResponse = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        const userInfo = await userInfoResponse.json();
        this.setState({ userInfo });
        console.log(userInfo);
      } else {
        console.log(`Facebook Login Canceled`);
      }
    } catch ({ message }) {
      console.log(`Facebook Login Error: ${message}`);
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loginTitle: {

  },
  loginBottomText: {

  },
  googleLoginTouchable: {

  },
  googleLoginTitle: {

  },
  facebookLoginTouchable: {

  },
  facebookLoginTitle: {
    
  },
  logoutTouchable: {

  },
  logoutTitle: {

  }
});
