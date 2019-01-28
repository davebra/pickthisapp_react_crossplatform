import React from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import { Icon, Google, Facebook } from 'expo';
import { View, Button, Title, Text, TextInput, Caption } from '@shoutem/ui';
import { 
  ANDROID_AUTH_CLIENT_ID, 
  IOS_AUTH_CLIENT_ID, 
  ANDROID_STANDALONE_AUTH_CLIENT_ID, 
  IOS_STANDALONE_AUTH_CLIENT_ID, 
  FACEBOOK_APP_ID, 
} from 'react-native-dotenv';
import { loginUser, signupUser } from '../components/RestApi';
import jwtDecode from 'jwt-decode';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from '../constants/Colors';

export default class LoginScreen extends React.Component {
  state = {
    userLogged: false,
    chooseNickname: false,
    errorMessage: '',
    showErrorMessage: false,
    spinner: false
  };

  // execute immediatly after Login Screen is mounted
  componentDidMount() {

    // check if is the user is already logged in
    AsyncStorage.getItem('userToken').then( value => {
      if (value == null) {
        this.setState({ userLogged: false });
      } else {
        this.setState({ 
          userLogged: true, 
          chooseNickname: false,
          showErrorMessage: false,
          userData: jwtDecode(value) });
      }
    });

  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          color={Colors.darkColor}
          textStyle={{color: Colors.darkColor}}
        />
        
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
                onChangeText={(nickname) => this.setState({nickname})}
                value={this.state.nickname}
              />
              <Button 
                styleName="secondary" 
                style={styles.confirmNickname} 
                onPress={this.checkSignupUser} 
                muted>
              <Icon.Entypo name="check" style={styles.iconButton} />
              <Text>COMPLETE SIGNUP</Text>
            </Button>
            </View>
          ) : (
            <View style={styles.loginContainer}>
              <Title style={styles.loginTitle}>Hey {this.state.userData.nickname}!</Title>
              <Button style={styles.logoutTouchable} onPress={this.executeLogout}>
                <Icon.SimpleLineIcons name="logout" style={styles.logoutIconButton} />
                <Text>I WANT TO LOGOUT</Text>
              </Button>
              <Button styleName="secondary" onPress={()=>{this.props.navigation.goBack()}}>
                <Icon.AntDesign name="back" style={styles.iconButton} />
                <Text>BACK TO YOUR THINGS</Text>
              </Button>
            </View>
          )
        )}

        <Text style={
          this.state.showErrorMessage ? (styles.errorMessage) : ({display: 'none'}) }>{this.state.errorMessage}</Text>

        <Caption style={styles.loginBottomText}>We will never spam, you, that's a promise!</Caption>
      </ScrollView>
    );
  }

  // function executed when the Google button is clicked
  googleAuth = async () => {
    this.setState({spinner: true});
    try {
      const result = await Google.logInAsync({
        androidClientId: ANDROID_AUTH_CLIENT_ID,
        androidStandaloneAppClientId: ANDROID_STANDALONE_AUTH_CLIENT_ID,
        iosClientId: IOS_AUTH_CLIENT_ID,
        iosStandaloneAppClientId: IOS_STANDALONE_AUTH_CLIENT_ID,
        scopes: ['profile', 'email'],
      });
      if (result.type === 'success') {
        this.checkLoginUser('google', result.user);
      } else {
        console.log(`Google Login Canceled`);
        this.setState({spinner: false});
      }
    } catch(e) {
      console.log(`Google Login Error: ${e}`);
      this.setState({
        errorMessage: 'Error during login, please try again or choose a different login method.',
        showErrorMessage: true,
        spinner: false
      });
    }
  }

  // function executed when the Facebook button is clicked
  facebookAuth = async () => {
    this.setState({spinner: true});
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
        permissions: ['public_profile', 'email'],
        behavior: 'web'
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const userInfoResponse = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        const userInfo = await userInfoResponse.json();
        this.checkLoginUser('facebook', userInfo);
      } else {
        console.log(`Facebook Login Canceled`);
        this.setState({spinner: false});
      }
    } catch ({ message }) {
      console.log(`Facebook Login Error: ${message}`);
      this.setState({
        errorMessage: 'Error during login, please try again or choose a different login method.',
        showErrorMessage: true,
        spinner: false
      });
    }
  }

  checkLoginUser = (prov, userObj) => {
    this.provider = prov;
    this.providerid = userObj.id;
    this.preloadNickname = userObj.name.replace(/[^a-z0-9]/gi,''); // nickname only alphanumeric
    loginUser(this.provider, this.providerid).then(res => { 
      if( res.message === "User not exists" ){
        this.setState({
          userLogged: true,
          chooseNickname: true,
          nickname: this.preloadNickname,
          spinner: false
        })
      }
      if( res.message === "Authentication successful!" ){
        this.setState({spinner: false});
        // save 'yes' in the storage key 'alreadyLaunched'
        AsyncStorage.setItem('userToken', res.accesstoken);
        // back to the previous Screen
        this.props.navigation.goBack();
      }
    }).catch(err => { 
      console.log(err);
      this.setState({
        errorMessage: 'Error during login, please try again or choose a different login method.',
        showErrorMessage: true,
        spinner: false
      });
    });
  }

  checkSignupUser = () => {
    this.setState({spinner: true});
    if( /^[a-zA-Z0-9-_]+$/.test(this.state.nickname) && this.state.nickname.length > 2 ){
      signupUser(this.provider, this.providerid, this.state.nickname).then(res => { 
        if( res.message === "User already exists" ){
          this.setState({
            errorMessage: 'This nickname is already taken, plase choose a different one.',
            showErrorMessage: true,
            spinner: false
          });
        }
        if( res.message === "Authentication successful!" ){
          this.setState({spinner: false});
          // save 'yes' in the storage key 'alreadyLaunched'
          AsyncStorage.setItem('userToken', res.accesstoken);
          // back to the previous Screen
          this.props.navigation.goBack();
        }
      }).catch(err => { 
        console.log(err);
        this.setState({
          errorMessage: 'Error during login, please try again or choose a different login method.',
          showErrorMessage: true,
          spinner: false
        });
      });
    } else {
      this.setState({
        errorMessage: 'Only letters, digits, dashes and underscores are allowed, minimum 3 characters.',
        showErrorMessage: true,
        spinner: false
      });
    }
  }
  
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    marginBottom: 16
  },
  logoutIconButton: {
    fontSize: 22,
    marginRight: 14,
    color: '#000'
  },
  errorMessage: {
    textAlign: 'center',
    color: '#D84F52',
    marginTop: 20
  }
});
