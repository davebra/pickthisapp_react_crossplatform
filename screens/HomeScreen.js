import React from 'react';
import { TouchableOpacity, Picker, AsyncStorage } from 'react-native';
import { Button, Row, Image, Subtitle, Caption, View, Text } from '@shoutem/ui';
import { Icon } from 'expo';
import MapView, { Marker } from 'react-native-maps';
import Popover from 'react-native-popover-view';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { S3_BUCKET_URL } from 'react-native-dotenv';

import { TagText } from '../components/TagText';
import styles from './HomeScreen.styles.js';
import { getThings } from '../components/RestApi';

export default class HomeScreen extends React.Component {
  state = {
    userLocationFound: false,
    filtersVisible: false,
    thingsAvailability: 'all',
    showSwiper: false,
    thingsMarkers: [],
    selectedMarker: ''
  }

  constructor(props){
    super(props);

    // AsyncStorage.clear();
    
    // property that I need to update the states only when I want
    this.moveTheMap = true;
    this.loadNewThings = true;
    this.downloadedThings = [];
  }

  // set the header navigator options, with the filter button
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Home',
      headerTitle: (
        <View>
          <Image source={require('../assets/images/logotop.png')} />
        </View>
      ),
      headerRight: <Button onPress={params.openFilters} title='filter'>
                    <Icon.MaterialCommunityIcons 
                    name={'filter'} 
                    size={28} 
                    style={styles.iconFilter} />
                  </Button>
    }
  };

  // execute immediatly after Home Screen is mounted
  componentDidMount() {

    // check if is the first time the app is launched
    AsyncStorage.getItem('alreadyLaunched').then( value => {
        if (value == null) {

          this.props.navigation.navigate('Intro');

        } else {

          // pass the parameters for the filters
          this.props.navigation.setParams({ openFilters: this.showFilters });

          // load user location
          this.getUserLocation();

        }
    });
  
  }
  
  render() {
    return (
      <View style={styles.container}>

        <MapView
          ref="map"
          style={styles.map}
          initialRegion={{ // starting map region = melbourne
            latitude: -37.8177025,
            longitude: 144.9633281,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
          loadingEnabled={true}
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#eeeeee"
          showsUserLocation={this.state.userLocationFound}
          showsPointsOfInterest={false}
          onPress={this.onMapPress}
          onRegionChangeComplete={this.onRegionChangeComplete}
          >

          {this.state.thingsMarkers.map( (marker, i) => (
            <Marker
              key={i}
              coordinate={{
                latitude: parseFloat(marker.location.coordinates[1]),
                longitude: parseFloat(marker.location.coordinates[0]),
              }}
              onPress={(e) => {
                  e.stopPropagation(); 
                  this.onMarkerPress(i)
                }}
              centerOffset={{ x: 0, y: -20 }}
              anchor={{ x: 0.5, y: 1 }}
              style={this.showBasedOnAvailability(marker.availability) ?{}: {display: 'none'}}
            >
            <Image
              style={{width: 40, height: 40}}
              source={(this.state.selectedMarker === marker._id) ? require('../assets/images/selected.png') : require('../assets/images/marker.png')}
             />
            </Marker>
          ))}
          
        </MapView>

        <SwiperFlatList 
        style={this.state.showSwiper ? styles.thingSlides : {display: 'none'}} 
        ref='swiper'
        onMomentumScrollEnd={this.onSlideSwiper}>
          {this.state.thingsMarkers.map( (marker, i) => (
            <View key={i} style={this.showBasedOnAvailability(marker.availability) ? styles.thingSlide : {display: 'none'}}>
            <Row styleName="rounded-corners">
            <TouchableOpacity onPress={() => { this.goToThing(i) }}>
              <Image
                styleName="medium rounded-corners"
                source={{uri: `${S3_BUCKET_URL}${marker.images[0]}`, cache: 'only-if-cached'}}
              />
            </TouchableOpacity>
            <View styleName="vertical stretch space-between">
                <Subtitle>Here there are:</Subtitle>
                <View styleName="horizontal flex-start">
                    {marker.tags.map( (tag, j) => (
                    <TagText key={j}>{tag}</TagText>
                    ))}
                </View>
                <Caption>Availability: 
                    {{
                        ['full']: ` Great!`,
                        ['medium']: ` Good`,
                        ['low']: ` Something's left`,
                        ['empty']: ` Gone`,
                    }[marker.availability]}
                </Caption>
            </View>
            </Row>
            </View>
          ))}         
        </SwiperFlatList>

        <View ref={ref => this.touchable = ref} style={styles.popoverAnchor}></View>
        <Popover
          isVisible={this.state.filtersVisible}
          showInModal={true}
          fromView={this.touchable}
          placement="bottom"
          onClose={() => this.closeFilters()}>
          <View style={styles.popoverContainer}>
            <Text style={styles.popoverTitle}>Filter things by availability</Text>
            <Picker
            selectedValue={this.state.thingsAvailability}
            style={styles.popoverPicker}
            onValueChange={(itemValue, itemIndex) => this.setState({thingsAvailability: itemValue})}>
            <Picker.Item label="Show All" value="all" />
            <Picker.Item label="Everything's there" value="full" />
            <Picker.Item label="Most still's there" value="medium" />
            <Picker.Item label="Something's left" value="low" />
            <Picker.Item label="Everything's gone" value="empty" />
          </Picker>
          </View>
        </Popover>

      </View>

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

  // manage marker click, select SwipeSlide and center map to marker
  onMarkerPress = (i) => {
    // do not move the map if marker is clicked
    this.moveTheMap = false; 

    // scroll the Swiper to the right thing
    this.refs.swiper._scrollToIndex(i);

    this.setState({selectedMarker: this.state.thingsMarkers[i]._id});

    // if not visible, show the Swiper
    if(!this.state.showSwiper) this.setState({showSwiper: true});

  }

  // manage SwipeSlide movement, center map to marker
  onSlideSwiper = (i) => {

    // if marker is clicked, this will be false, so don't move the map
    if(this.moveTheMap){
        this.loadNewThings = false;
        this.refs.map.animateToRegion({
            latitude: this.state.thingsMarkers[i.index].location.coordinates[1], 
            longitude: this.state.thingsMarkers[i.index].location.coordinates[0], 
            latitudeDelta: 0.09, 
            longitudeDelta: 0.09
        }, 400);
        this.setState({selectedMarker: this.state.thingsMarkers[i.index]._id});
    } else {
      this.moveTheMap = true;
    }
  }

  // manage map click not on a marker
  onMapPress = () => {
    this.loadNewThings = false;
    if(this.state.showSwiper) this.setState({showSwiper: false, selectedMarker: -1});    
  }

  // manage map movement event, fetch and reload markers
  onRegionChangeComplete = (region) => {
    if(this.loadNewThings){
      getThings(
        region.latitude, 
        region.longitude, 
        this.calculateDistance(
            region.latitude - region.latitudeDelta,
            region.longitude - region.longitudeDelta,
            region.latitude + region.latitudeDelta,
            region.longitude + region.longitudeDelta
        )
        ).then(res => { 
            if( Array.isArray(res) ){
                let newThings = [];
                res.forEach(thing => {
                    if (!this.downloadedThings.includes(thing._id)) {
                        newThings.push(thing);
                        this.downloadedThings.push(thing._id);
                    }
                });

                if(newThings.length > 0){
                    this.setState({
                        thingsMarkers: this.state.thingsMarkers.concat(newThings)
                    });
                }

            }
        }).catch(err => { 
            console.log(err) 
        });
    }
    // set back the loadNewThings to true
    this.loadNewThings = true;
  }

  // function to open the single Ting screen passing the object content
  goToThing = (i) => {
    this.props.navigation.navigate('Thing',{
        thing: this.state.thingsMarkers[i]
    });
  };

  // function to open the filters Popover modal (toggle behaviour)
  showFilters = () => {
    if (this.state.filtersVisible)
      this.setState({filtersVisible: false});
    else 
      this.setState({filtersVisible: true});
  };
 
  // function to close the filter Popover modal
  closeFilters = () => {
    this.setState({filtersVisible: false});
  };

  showBasedOnAvailability(av){
    if(this.state.thingsAvailability === 'all' || this.state.thingsAvailability === av){
      return true
    } else {
      return false
    }
  }

  // function to calculate the distance (meters) from 2 coordinates
  calculateDistance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 90/Math.PI;
      dist = dist * 60 * 1.1515 * 1609.344;
      return Math.ceil(dist);
    }
  }

}

