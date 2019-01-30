import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, AsyncStorage, Dimensions, TouchableHighlight, Title, Text, TextInput } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import MapView from 'react-native-maps';
import jwtDecode from 'jwt-decode';
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from '../constants/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export default class AddScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      userData: {},
      spinner: false,
      pictures: [],
    };

    this.thingPosition = {
      latitude: -37.8177025,
      longitude: 144.9633281,
    }

  }

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

        <View style={styles.pictures}>

          {this.state.pictures.map( (marker, i) => (
            <View style={styles.pictureCell}>
              <Image 
                style={styles.pictureCellImage} 
                resizeMode='cover'
                source={require('../assets/images/intro3.png')} />
          </View>
          ))}

          <TouchableOpacity 
            style={(this.state.pictures < 5) ? styles.pictureNewCell : { display: 'none' }} 
            onPress={this.TouchableHighlightTakePicture}>
              <EvilIcons name="camera" size={96} style={{color: Colors.primaryColor}} />
          </TouchableOpacity>

        </View>

        <MapView
          ref="addmap"
          style={styles.addmap}
          initialRegion={{
            latitude: this.thingPosition.latitude,
            longitude:this.thingPosition.longitude,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
          loadingEnabled={true}
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#eeeeee"
          showsUserLocation={false}
          showsPointsOfInterest={false}
          onRegionChangeComplete={this.onRegionChangeComplete}
          >
            <MaterialCommunityIcons name="map-marker-outline" size={42} style={{color: Colors.darkColor, marginTop: -21}} />
          </MapView>

      </ScrollView>
    );
  }

  // function executed when the location of the user has been found by MapView
  getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            this.refs.addmap.animateToRegion({
                latitude: position.coords.latitude, 
                longitude: position.coords.longitude, 
                latitudeDelta: 0.002, 
                longitudeDelta: 0.002
            }, 600);
        },
        error => console.log(error.message),
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
  };

  onRegionChangeComplete = (region) => {
    this.thingPosition.latitude =  region.latitude;
    this.thingPosition.longitude =  region.longitude;
  }

  TouchableHighlightTakePicture = () => {
    // const options = {
    //   title: 'Take or select Picture'
    // };
    // ImagePicker.showImagePicker(options, (response) => {
    //   if (response.didCancel) {}
    //   else if (response.error) {}
    //   else if (response.customTouchableHighlight) {}
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

export const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconFilter: {
    marginTop: 1,
    marginRight: 5,
    color: Colors.primaryColor,
  },
  pictures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pictureNewCell: {
    width: width / 2 - 24,
    height: width / 2 - 36,
    marginTop: 16,
    marginLeft: 16,
    backgroundColor: Colors.lightColor,
    shadowColor: Colors.darkColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    borderRadius: 4,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pictureCell: {
    width: width / 2 - 24,
    height: width / 2 - 36,
    marginTop: 16,
    marginLeft: 16,
    backgroundColor: Colors.lightColor,
    shadowColor: Colors.darkColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    borderRadius: 4,
    shadowRadius: 2,
    elevation: 1,
  },
  pictureCellImage: {
    width: width / 2 - 24,
    height: width / 2 - 36,

  },
  addmap: {
    marginTop: 20,
    width: width,
    height: height * 0.3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
  
});
