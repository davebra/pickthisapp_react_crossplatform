import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, AsyncStorage, Dimensions, Image } from 'react-native';
import { Button, Text, Icon } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import MapView from 'react-native-maps';
import jwtDecode from 'jwt-decode';
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from '../constants/Colors';
import Autocomplete from '../components/Autocomplete';
import { getTags, uploadImage, addThings } from '../components/RestApi';
import { TagText } from '../components/TagText';

export default class AddScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      userData: {},
      spinner: false,
      pictures: [],
      tagsAutocomplete: [],
      tagsAutocompleteAdd: [],
      tags: []
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

          {this.state.pictures.map( (image, i) => (
            <View key={i} style={styles.pictureCell}>
              <Image 
                style={styles.pictureCellImage} 
                resizeMode='cover'
                source={{ uri: image }} />
              <TouchableOpacity
                style={styles.pictureCellImageRemove}
                onPress={() => { this.removePicture(i) }}>
                <Icon type='MaterialIcons' name="remove-circle" size={32} style={{color: Colors.dangerColor}} />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity onPress={this.takePicture}>
            <View style={(this.state.pictures.length < 5) ? styles.pictureNewCell : { display: 'none' }}>
              <Icon type='EvilIcons' name="camera" size={128} style={{color: Colors.primaryColor}} />
            </View>
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
          onRegionChangeComplete={this.onRegionChangeComplete}>
            <Icon type='FontAwesome' name="map-pin" size={42} style={{color: Colors.darkColor, marginTop: -21}} />
          </MapView>

          <View style={styles.tagsContainer}>
          {this.state.tags.map( (tag, j) => (
            <TagText key={j} style={{fontSize: 18}}>{tag}</TagText>
          ))}
          </View>

          <View style={styles.tagsFinder}>
            <Autocomplete
              autoCapitalize="none"
              autoCorrect={false}
              data={this.state.tagsAutocomplete}
              onChangeText={text => { this.searchTags(text) }}
              renderItem={(item) => (
                <TouchableOpacity 
                  key={item.index} 
                  style={styles.tagsFinderItem}
                  onPress={() => { this.addTag(item.item.name) }}>
                  <Text>{item.item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

      </ScrollView>
    );
  }

  searchTags = (text) => {
    if(text.length > 1){
      getTags(text).then(res => { 
        if( Array.isArray(res) ){
          if( res.length > 0 ){
            this.setState({tagsAutocomplete: res});
          } else {
            this.setState({tagsAutocomplete: [{name: `Add ${text}...`}]});
          }
        }
      }).catch(err => { 
        console.log(err) 
      });
    } else {
      this.setState({tagsAutocomplete: []});
    }
  }

  addTag = (tag) => {
    let addTheTag;
    if(tag.indexOf("Add") > -1 && tag.indexOf("...") > -1){
      addTheTag = tag.substr(4, tag.length - 7);
    } else {
      addTheTag = tag;
    }
    
    if(this.state.tags.indexOf(addTheTag) < 0){
      this.setState(prevState => ({
        tags: [...prevState.tags, addTheTag]
      }));
    }

  }

  removeTag = (tag) => {
    let tagsSelected = this.state.tags;
    tagsSelected.splice(index, 1);
    this.setState({ tags });
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

  takePicture = () => {
    const options = {
      title: 'Select a Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {}
      else if (response.error) {}
      else {
        this.setState(prevState => ({
          pictures: [...prevState.pictures, response.uri]
        }));
        // response.fileName
        // response.path
        // response.type
        // response.uri
        // response.width
        // response.height
      }
    });
  }

  removePicture = (i) => {
    let newPictures = [...this.state.pictures];
    newPictures.splice(i, 1);
    this.setState({pictures: newPictures});
  }

  // function to open the single Thing screen passing the object content
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
    borderRadius: 4,
  },
  pictureCellImageRemove: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 10,
  },
  addmap: {
    marginTop: 20,
    width: width,
    height: height * 0.3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 16,
  },
  tagsFinder: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  tagsFinderItem: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
