import React from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import { Icon, Google, Facebook } from 'expo';
import { View, Button, Title, Text, TextInput, Caption } from '@shoutem/ui';
import { ANDROID_AUTH_CLIENT_ID, IOS_AUTH_CLIENT_ID, ANDROID_STANDALONE_AUTH_CLIENT_ID, IOS_STANDALONE_AUTH_CLIENT_ID } from 'react-native-dotenv';

export default class LoginScreen extends React.Component {
  state = {
    userInfo: null,
    userLogged: false,
    chooseNickname: false,
    userData: {},
  };

  // execute immediatly after Login Screen is mounted
  componentDidMount() {

    // check if is the user is already logged in
    AsyncStorage.getItem('userToken').then( value => {
      if (value == null) {
        this.setState({ userLogged: false });
      } else {
        this.setState({ userToken: parseJwt(token) });
      }
    });

  }

  render() {
    return (
      <View style={styles.container}>
        
        {!this.state.userLogged ? (
          <View style={styles.loginContainer}>
            <Title style={styles.loginTitle}>Want to post something on PickThisApp?</Title>
            <Button styleName="secondary" style={styles.googleLoginTouchable} onPress={this.googleAuth}>
              <Icon.FontAwesome name="google-plus" style={styles.iconButton} />
              <Text>JOIN WITH GOOGLE</Text>
            </Button>
            <Button styleName="secondary" style={styles.facebookLoginButton} onPress={this.facebookAuth}>
              <Icon.FontAwesome name="facebook" style={styles.iconButton} />
              <Text>JOIN WITH FACEBOOK</Text>
            </Button>
          </View>
        ) : (
          this.state.chooseNickname ? (
            <View style={styles.loginContainer}>
              <Title style={styles.loginTitle}>Choose a nickname</Title>
              <TextInput
                placeholder={'Nickname'}
                //onChangeText={...}
              />
              <Button 
                styleName="secondary" 
                style={styles.confirmNickname} 
                onPress={this.confirmNickname} 
                muted>
              <Icon.Entypo name="check" style={styles.iconButton} />
              <Text>CONFIRM</Text>
            </Button>
            </View>
          ) : (
            <View style={styles.loginContainer}>
              <Title style={styles.loginTitle}>Hey {this.userToken.nickname}!</Title>
              <Button styleName="secondary" style={styles.logoutTouchable} onPress={this.executeLogout}>
                <Icon.SimpleLineIcons name="logout" style={styles.iconButton} />
                <Text>I WANT TO LOGOUT</Text>
              </Button>
            </View>
          )
        )}

        <Caption style={styles.loginBottomText}>We will never spam, you, that's a promise!</Caption>
      </View>
    );
  }

  // function executed when the Google button is clicked
  googleAuth = async () => {
    try {
      const result = await Google.logInAsync({
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
  facebookAuth = async () => {
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync('<APP_ID>', {
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

  parseJwt(token) {
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace('-', '+').replace('_', '/');
		return JSON.parse(window.atob(base64));
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  loginContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 16
  },
  iconButton: {
    fontSize: 22,
    marginRight: 14,
    color: '#fff'
  },
  loginTitle: {
    textAlign: 'center',
    marginBottom: 28
  },
  loginBottomText: {
    textAlign: 'center',
    marginTop: 26
  },
  facebookLoginButton: {
    marginTop: 16,
  },
  confirmNickname: {
    marginTop: 16,
  },
  logoutTouchable: {

  }
});
