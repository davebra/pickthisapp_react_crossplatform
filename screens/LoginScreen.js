import React from 'react';
import { StyleSheet, AsyncStorage, View, TextInput } from 'react-native';
import { Icon, Button, Text } from 'native-base';
import { GOOGLE_AUTH_WEB_CLIENT_ID, GOOGLE_AUTH_IOS_CLIENT_ID } from 'react-native-dotenv';
import { loginUser, signupUser } from '../components/RestApi';
import jwtDecode from 'jwt-decode';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from '../constants/Colors';
import { LoginManager } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';

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

    GoogleSignin.configure({
      webClientId: GOOGLE_AUTH_WEB_CLIENT_ID,
      offlineAccess: false,
      forceConsentPrompt: false,
      accountName: '', // [Android] specifies an account name on the device that should be used
      iosClientId: GOOGLE_AUTH_IOS_CLIENT_ID,
    });

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
          TextContent={'Loading...'}
          color={Colors.darkColor}
          TextStyle={{color: Colors.darkColor}}
        />
        
        {!this.state.userLogged ? (
          <View style={styles.loginContainer}>
            <Text style={styles.loginTitle}>Want to post something on PickThisApp?</Text>
            <Button iconLeft style={styles.googleLoginTouchable} onPress={this.googleAuth}>
              <Icon type='FontAwesome' name="google-plus" style={styles.iconTouchableHighlight} />
              <Text>JOIN WITH GOOGLE</Text>
            </Button>
            <Button iconLeft style={styles.facebookLoginTouchableHighlight} onPress={this.facebookAuth}>
              <Icon type='FontAwesome' name="facebook" style={styles.iconTouchableHighlight} />
              <Text>JOIN WITH FACEBOOK</Text>
            </Button>
          </View>
        ) : (
          this.state.chooseNickname ? (
            <View style={styles.loginContainer}>
              <Text style={styles.loginTitle}>Choose a nickname</Text>
              <TextInput
                placeholder={'Nickname'}
                onChangeText={(nickname) => this.setState({nickname})}
                value={this.state.nickname}
              />
              <Button iconLeft style={styles.confirmNickname} onPress={this.checkSignupUser}>
              <Icon type='Entypo' name="check" style={styles.iconTouchableHighlight} />
              <Text>COMPLETE SIGNUP</Text>
            </Button>
            </View>
          ) : (
            <View style={styles.loginContainer}>
              <Text style={styles.loginTitle}>Hey {this.state.userData.nickname}!</Text>
              <Button iconLeft style={styles.logoutTouchable} onPress={this.executeLogout}>
                <Icon type='SimpleLineIcons' name="logout" style={styles.logoutIconTouchableHighlight} />
                <Text>I WANT TO LOGOUT</Text>
              </Button>
              <Button iconLeft styleName="secondary" onPress={()=>{this.props.navigation.goBack()}}>
                <Icon type='AntDesign' name="back" style={styles.iconTouchableHighlight} />
                <Text>BACK TO YOUR THINGS</Text>
              </Button>
            </View>
          )
        )}

        <Text style={
          this.state.showErrorMessage ? (styles.errorMessage) : ({display: 'none'}) }>{this.state.errorMessage}</Text>

        <Text style={styles.loginBottomText}>We will never spam, you, that's a promise!</Text>
      </ScrollView>
    );
  }

  executeLogout = () => {
    AsyncStorage.removeItem('userToken');
    this.setState({
      userLogged: false,
      chooseNickname: false
    });
  }

  // function executed when the Google TouchableHighlight is clicked
  googleAuth = async () => {
    this.setState({
      errorMessage: '',
      showErrorMessage: false
    });
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      //this.checkLoginUser('google', result.user);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log(`Google Login Canceled`);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        this.setState({
          errorMessage: 'Error during login, do you have the Google Play Services installed?',
          showErrorMessage: true
        });
      } else {
        this.setState({
          errorMessage: 'Error during login, please try again or choose a different login method.',
          showErrorMessage: true
        });
      }
    }
  }

  // function executed when the Facebook TouchableHighlight is clicked
  facebookAuth = () => {
    this.setState({
      errorMessage: '',
      showErrorMessage: false
    });
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      function(result) {
        if (result.isCancelled) {
          console.log(`Facebook Login Canceled`);
        } else {
          console.log(result);
          //this.checkLoginUser('facebook', userInfo);
        }
      },
      function(error) {
        console.log(`Facebook Login Error: ${error}`);
        this.setState({
          errorMessage: 'Error during login, please try again or choose a different login method.',
          showErrorMessage: true
        });
      }
    );
  }

  checkLoginUser = (prov, userObj) => {
    this.setState({spinner: true});
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
  iconTouchableHighlight: {
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
  facebookLoginTouchableHighlight: {
    marginTop: 16,
  },
  confirmNickname: {
    marginTop: 16,
  },
  logoutTouchable: {
    marginBottom: 16
  },
  logoutIconTouchableHighlight: {
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
