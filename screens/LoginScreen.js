import React from 'react';
import { StyleSheet, AsyncStorage, View, ScrollView } from 'react-native';
import { Icon, Button, Text, H2, Item, Label, Input } from 'native-base';
import { loginUser, signupUser } from '../components/RestApi';
import jwtDecode from 'jwt-decode';
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from '../constants/Colors';
import { GOOGLE_AUTH_WEB_CLIENT_ID, GOOGLE_AUTH_IOS_CLIENT_ID } from 'react-native-dotenv';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import Fonts from '../constants/Fonts';

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

  }

  render() {
    this.props.navigation.addListener( 'willFocus', payload => { this.checkLogin() } );
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
            <H2 style={styles.loginTitle}>Do you want to post or update a thing on PickThisApp?</H2>
            <Button iconLeft block style={styles.colorButton} onPress={this.googleAuth}>
              <Icon type='FontAwesome' name="google-plus" style={styles.iconTouchableHighlight} />
              <Text style={styles.buttonText}>Join with Google</Text>
            </Button>
            <Button iconLeft block style={[styles.colorButton, styles.facebookLoginButton]} onPress={this.facebookAuth}>
              <Icon type='FontAwesome' name="facebook" style={styles.iconTouchableHighlight} />
              <Text style={styles.buttonText}>Join with Facebook</Text>
            </Button>
          </View>
        ) : (
          this.state.chooseNickname ? (
            <View style={styles.loginContainer}>
              <Text style={styles.loginTitle}>Choose a nickname</Text>
              <Item floatingLabel>
                <Label>Nickname</Label>
                <Input
                  onChangeText={(nickname) => this.setState({nickname})}
                  value={this.state.nickname}
                  />
              </Item>
              <Button iconLeft block style={[styles.colorButton, styles.confirmNickname]} onPress={this.checkSignupUser}>
              <Icon type='Entypo' name="check" style={styles.iconTouchableHighlight} />
              <Text style={styles.buttonText}>Complete Signup</Text>
            </Button>
            </View>
          ) : (
            <View style={styles.loginContainer}>
              <H2 style={styles.loginTitle}>Hey {this.state.userData.nickname}!</H2>
              <Button iconLeft block light style={styles.logoutButton} onPress={this.executeLogout}>
                <Icon type='SimpleLineIcons' name="logout" style={styles.logoutIconButton} />
                <Text style={[styles.buttonText, {color: Colors.darkColor}]}>I want to logout</Text>
              </Button>
              <Button iconLeft block style={styles.colorButton} onPress={()=>{this.props.navigation.goBack()}}>
                <Icon type='AntDesign' name="back" style={styles.iconTouchableHighlight} />
                <Text style={styles.buttonText}>Go back to your Things</Text>
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

  checkLogin = () => {

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
      this.checkLoginUser('google', userInfo.user);
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
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

  // function executed when the Facebook is clicked
  facebookAuth = () => {
    this.setState({
      errorMessage: '',
      showErrorMessage: false
    });
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then((result) => {
        if (result.isCancelled) {
          console.log(`Facebook Login Canceled`);
        } else {
          this.FBGraphRequest('id, email, name', this.FBLoginCallback);
        }
      },(error) => {
        console.log(`Facebook Login Error: ${error}`);
        this.setState({
          errorMessage: 'Error during login, please try again or choose a different login method.',
          showErrorMessage: true
        });
      }
    );
  }

  // function that retrieve facebook data
  async FBGraphRequest(fields, callback) {
    const accessData = await AccessToken.getCurrentAccessToken();
    // Create a graph request asking for user information
    const infoRequest = new GraphRequest('/me', {
      accessToken: accessData.accessToken,
      parameters: {
        fields: {
          string: fields
        }
      }
    }, callback.bind(this));
    // Execute the graph request created above
    new GraphRequestManager().addRequest(infoRequest).start();
  }

  async FBLoginCallback(error, result) {
    if (error) {
      console.log(error);
    } else {
      this.checkLoginUser('facebook', result);
    }
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
    alignItems: 'center',
    padding: 16,
    textAlign: 'center'
  },
  iconTouchableHighlight: {
    fontSize: 22,
    marginRight: 10,
    color: '#fff'
  },
  loginTitle: {
    textAlign: 'center',
    marginBottom: 28,
    fontFamily: Fonts.fontLight
  },
  loginBottomText: {
    textAlign: 'center',
    marginTop: 26,
    fontFamily: Fonts.fontLight,
  },
  colorButton: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },
  facebookLoginButton: {
    marginTop: 16,
  },
  confirmNickname: {
    marginTop: 16,
  },
  logoutButton: {
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
    marginTop: 20,
    fontFamily: Fonts.fontMedium,
  },
  buttonText:{
    fontFamily: Fonts.fontMedium,
    color: Colors.lightColor,
  }
});
