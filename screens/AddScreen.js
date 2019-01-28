import React from 'react';
import { StyleSheet, ScrollView, AsyncStorage } from 'react-native';
import { Icon } from 'expo';
import { View, Button, Title, Text, TextInput, Caption } from '@shoutem/ui';
import ImagePicker from 'react-native-image-picker';
import MapView from 'react-native-maps';
import jwtDecode from 'jwt-decode';
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from '../constants/Colors';

export default class AddScreen extends React.Component {
  state = {
    userData: {},
    spinner: false,
    pictures: []
  };

  static navigationOptions = {
    title: 'Add a new Thing',
  };

  // execute immediatly after Add Screen is mounted
  componentDidMount() {

    // check if is the user is already logged in, if not, open Login
    AsyncStorage.getItem('userToken').then( value => {
      if (value == null) {
        this.props.navigation.navigate('Login');
      } else {
        this.setState({ userData: jwtDecode(value) });
        // load user location
        this.getUserLocation();
      }
    });

  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          color={Colors.darkColor}
          textStyle={{color: Colors.darkColor}}
        />

      </ScrollView>
    );
  }

  // function executed when the location of the user has been found by MapView
  getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            this.setState({userLocationFound: true});
            this.refs.map.animateToRegion({
                latitude: position.coords.latitude, 
                longitude: position.coords.longitude, 
                latitudeDelta: 0.1, 
                longitudeDelta: 0.1
            }, 600);
            this.loadNewThings = true;
        },
        error => console.log(error.message),
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
  };

  buttonTakePicture = () => {
    // const options = {
    //   title: 'Take or select Picture'
    // };
    // ImagePicker.showImagePicker(options, (response) => {
    //   if (response.didCancel) {}
    //   else if (response.error) {}
    //   else if (response.customButton) {}
    //   else {
    //     this.props.addPhoto({
    //       fileName: response.fileName,
    //       path: response.path,
    //       type: response.type,
    //       uri: response.uri,
    //       width: response.width,
    //       height: response.height,
    //     });
    //   }
    // });
  }

  // function to open the single Ting screen passing the object content
  thingPublished = () => {
    this.props.navigation.navigate('Published',{
        nickname: this.state.userData.nickname
    });
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconFilter: {
    marginTop: 1,
    marginRight: 5,
    color: Colors.primaryColor
  },
});
