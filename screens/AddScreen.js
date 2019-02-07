import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, AsyncStorage, Dimensions, Image } from 'react-native';
import { Button, Text, Icon } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import MapView from 'react-native-maps';
import jwtDecode from 'jwt-decode';
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from '../constants/Colors';
import Autocomplete from '../components/Autocomplete';
import { getTags, uploadImage, addThings, addNewTag } from '../components/RestApi';
import { TagText } from '../components/TagText';
import Fonts from '../constants/Fonts';
import Toast, {DURATION} from 'react-native-easy-toast';

export default class AddScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      userData: {},
      spinner: false,
      pictures: [],
      tagsAutocomplete: [],
      tagsAutocompleteAdd: [],
      tags: [],
      publishButtonDisable: true
    };

    this.thingPosition = {
      latitude: -37.8177025,
      longitude: 144.9633281,
    }

    this.picturesData =[];
    this.picturesUploaded =[];

  }

  static navigationOptions = {
    title: 'Add a new Thing',
    headerTitleStyle: {
      fontFamily: Fonts.fontBold
    },
    headerStyle: {
      backgroundColor: Colors.appBackground
    },
    headerTintColor: Colors.primaryColor,
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
      <View style={{flex:1}}>
      <ScrollView style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Publishing...'}
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
            longitude: this.thingPosition.longitude,
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
            <View key={j} style={styles.tagView}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity
                style={styles.tagRemove}
                onPress={() => { this.removeTag(j) }}>
                <Icon type='AntDesign' name="plus" size={12} style={{
                  transform: [{rotate: '45deg'}],
                  color: Colors.lightColor
                  }} />
              </TouchableOpacity>
            </View>
          ))}
          </View>

          <View style={styles.tagsFinder}>
            <Autocomplete
              ref={input => { this.textInput = input }}
              data={this.state.tagsAutocomplete}
              onChangeText={text => { this.searchTags(text) }}
              renderItem={(suggestion, index) => 
                <TouchableOpacity 
                  key={index} 
                  onPress={() => { this.addTag(suggestion.name) }}>
                  <TagText style={styles.tagsSuggestion} content={suggestion.name} />
                </TouchableOpacity>
              }
            />
          </View>

          <Button 
            iconLeft block 
            onPress={this.publishThing} 
            style={[styles.publishButton, (this.state.publishButtonDisable)?styles.publishButtonDisabled:{}]}
            disabled={this.state.publishButtonDisable}
            >
            <Icon type='FontAwesome' name="send" style={styles.iconButton} />
            <Text style={styles.buttonText}>Publish this Thing</Text>
          </Button>
      </ScrollView>
      <Toast 
          ref="toastError"
          style={{backgroundColor: Colors.dangerColor}} 
          position={'bottom'} 
          positionValue={240} 
          opacity={0.85} 
          textStyle={{fontFamily:Fonts.fontMedium, color: Colors.lightColor}} />
      </View>
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

      // add the tag to the server
      addNewTag(addTheTag).then(res => {
        if ( typeof res.name === 'string' ){
          this.addTagToState(res.name);
        } else {
          this.refs.toastError.show('Invalid or blacklisted word', DURATION.LENGTH_LONG);
        }
      }).catch(err => {
        this.refs.toastError.show('Invalid or blacklisted word', DURATION.LENGTH_LONG);
      });

    } else {
      addTheTag = tag;
      this.addTagToState(tag);
    }

  }

  addTagToState = (tagToAdd) => {

    if(this.state.tags.indexOf(tagToAdd) < 0){
      this.setState(prevState => ({
        tags: [...prevState.tags, tagToAdd],
        tagsAutocomplete: []
      }));
      this.textInput.clear();
      this.enablePublishButton();
    }

  }

  removeTag = (index) => {
    this.setState((prevState) => ({
      tags: [...prevState.tags.slice(0,index), ...prevState.tags.slice(index+1)]
    }));
    this.enablePublishButton();
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
    this.thingPosition.latitude = region.latitude;
    this.thingPosition.longitude = region.longitude;
  }

  takePicture = () => {
    const options = {
      title: 'Select a Picture',
      quality: 0.5,
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {}
      else if (response.error) {}
      else {
        this.picturesData.push(response.data);
        this.setState(prevState => ({
          pictures: [...prevState.pictures, response.uri]
        }));
        this.enablePublishButton();
      }
    });
  }

  removePicture = (i) => {
    let newPictures = [...this.state.pictures];
    newPictures.splice(i, 1);
    this.setState({pictures: newPictures});
    this.enablePublishButton();
  }

  enablePublishButton = () => {
    if( this.picturesData.length > 0 && this.state.tags.length > 0 ){
      if (this.state.publishButtonDisable) this.setState({publishButtonDisable: false});
    } else {
      if (!this.state.publishButtonDisable) this.setState({publishButtonDisable: true});
    }
  }

  // function to open the single Thing screen passing the object content
  publishThing = () => {

    // show loading alert
    this.setState({spinner: true});

    // upload pictures before, the server will return the image name
    this.picturesData.forEach((image, index) => {
      uploadImage(image).then(res => {
        if ( typeof res.filename === 'string' ){
          this.picturesUploaded.push(res.filename);
          this.checkImagesUploaded();
        } else {
          console.log(res);
          this.setState({ spinner: false });
          this.refs.toastError.show('Oooops, something wen wrong, please try again later', DURATION.LENGTH_LONG);
        }
      });
    });
    
  };

  // function called each time a picture is uploaded, if so, add the thing to the Rest Api
  checkImagesUploaded = () => {
    
    if( this.picturesUploaded.length == this.picturesData.length ){

      // upload the thing object
      addThings("pickup", 
        this.thingPosition.latitude, 
        this.thingPosition.longitude, 
        this.state.tags,
        this.picturesUploaded).then(res => { 
        if( typeof res._id === "string" ){
          this.thingPublished();
        } else {
          this.setState({spinner: false});
          this.refs.toastError.show('Oooops, something wen wrong, please try again later', DURATION.LENGTH_LONG);
          console.log(res);
        }
      }).catch(err => { 
        this.setState({spinner: false});
        this.refs.toastError.show('Oooops, something wen wrong, please try again later', DURATION.LENGTH_LONG);
        console.log(err);
      });

    }

  };  

  // function to open the single Thing screen passing the object content
  thingPublished = () => {
    
    // empty state and objects
    this.setState({
      spinner: false,
      pictures: [],
      tagsAutocomplete: [],
      tagsAutocompleteAdd: [],
      tags: [],
      publishButtonDisable: true
    });
    this.picturesUploaded = [];

    // go to success page
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
  tagsFinder: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    padding: 16,
  },
  tagView: {
    backgroundColor: Colors.secondaryColor,
    marginRight: 6,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 6,
    paddingTop: 4,
    paddingBottom: 3,
    borderRadius: 5,
  },
  tagText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: Fonts.fontBold
  },
  tagsSuggestion: {
    backgroundColor: Colors.lightColor, 
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 18,
    color: Colors.darkColor
  },
  tagRemove: {
    marginLeft: 4,
  },
  publishButton: {
    marginTop: 24,
    marginBottom: 32,
    marginLeft: 16,
    marginRight: 16,
    height: 52,
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.noticeText,
  },
  publishButtonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: Fonts.fontMedium
  }
});
