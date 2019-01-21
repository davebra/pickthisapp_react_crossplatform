import React from 'react';
import { Image, ScrollView, TouchableOpacity, View, PermissionsAndroid, Platform, Text, Picker, AsyncStorage } from 'react-native';
import { Icon, WebBrowser } from 'expo';
import { Button } from '@shoutem/ui';
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import Popover from 'react-native-popover-view';
import SwiperFlatList from 'react-native-swiper-flatlist';

import { MonoText } from '../components/StyledText';
import styles from './HomeScreen.styles.js';

export default class HomeScreen extends React.Component {

  // set the state values
  state = {
    filtersVisible: false,
    thingsAvailability: 'all',
    mapRegion: {
      latitude: -37.814,
      longitude: 144.96332,
      latitudeDelta: 0.15,
      longitudeDelta: 0.15,
    },
    showSwiper: false,
    thingsMarkers: [
      {
          "location": {
              "coordinates": [
                  144.945056,
                  -37.808671
              ],
              "type": "Point"
          },
          "tags": [
              "bed",
              "bedframe"
          ],
          "images": [
              "test2_1.jpg",
              "test2_2.jpg"
          ],
          "_id": "f76a20c0-08d3-11e9-83b0-3987791c7c1a",
          "timestamp": "2018-12-26T06:03:29.355Z",
          "updates": [
              {
                  "timestamp": "2018-12-26T06:03:29.355Z",
                  "_id": "5c2319b1260bf201daf73fb9",
                  "user": "1e6a8e52-bdca-57eb-accb-d02ee2c18a42",
                  "what": "create"
              }
          ],
          "availability": "full",
          "status": "live",
          "type": "pick",
          "user": "1e6a8e52-bdca-57eb-accb-d02ee2c18a42",
          "__v": 0
      },
      {
          "location": {
              "coordinates": [
                  144.97845,
                  -37.807177
              ],
              "type": "Point"
          },
          "tags": [
              "table",
              "chairs"
          ],
          "images": [
              "test1_1.jpg",
              "test1_2.jpg",
              "test1_3.jpg"
          ],
          "_id": "17d1a470-098b-11e9-965c-0f83ff5f6506",
          "timestamp": "2018-12-27T03:54:21.622Z",
          "updates": [
              {
                  "timestamp": "2018-12-27T03:54:21.622Z",
                  "_id": "5c244ced73820500242640fa",
                  "user": "1e6a8e52-bdca-57eb-accb-d02ee2c18a42",
                  "what": "create"
              },
              {
                  "timestamp": "2018-12-31T03:20:16.557Z",
                  "_id": "5c298af011843300245b23e7",
                  "user": "1e6a8e52-bdca-57eb-accb-d02ee2c18a42",
                  "what": "updated"
              }
          ],
          "availability": "medium",
          "status": "live",
          "type": "pick",
          "user": "1e6a8e52-bdca-57eb-accb-d02ee2c18a42",
          "__v": 1
      },
      {
          "location": {
              "coordinates": [
                  144.98747910505682,
                  -37.80381913512071
              ],
              "type": "Point"
          },
          "tags": [
              "crates milk",
              "crate"
          ],
          "images": [
              "396b92494ec307922b1f28b388b994eb.jpg"
          ],
          "_id": "51b49280-1492-11e9-b763-4b2aca3d0b23",
          "timestamp": "2019-01-10T04:43:48.007Z",
          "updates": [
              {
                  "timestamp": "2019-01-10T04:43:48.011Z",
                  "_id": "5c36cd84af497f0024a76436",
                  "user": "ac386ca1-9743-5aae-8b17-2d5f1cd5a61f",
                  "what": "create"
              }
          ],
          "availability": "full",
          "status": "live",
          "type": "pick",
          "user": "ac386ca1-9743-5aae-8b17-2d5f1cd5a61f",
          "__v": 0
      },
      {
          "location": {
              "coordinates": [
                  144.950379,
                  -37.845283
              ],
              "type": "Point"
          },
          "tags": [
              "bed",
              "bedframe"
          ],
          "images": [
              "test1_3.jpg",
              "test2_2.jpg"
          ],
          "_id": "04e19620-0974-11e9-b6ec-4be1b09a8f2c",
          "timestamp": "2018-12-27T01:09:11.425Z",
          "updates": [
              {
                  "timestamp": "2018-12-27T01:09:11.425Z",
                  "_id": "5c24263762201518e652e69a",
                  "user": "08e5b1b5-9293-5fc1-8c47-44782c476b61",
                  "what": "create"
              },
              {
                  "timestamp": "2019-01-10T06:34:11.522Z",
                  "_id": "5c36e763af497f0024a76437",
                  "user": "ac386ca1-9743-5aae-8b17-2d5f1cd5a61f",
                  "what": "updated status(paused)"
              },
              {
                  "timestamp": "2019-01-10T06:34:15.858Z",
                  "_id": "5c36e767af497f0024a76438",
                  "user": "ac386ca1-9743-5aae-8b17-2d5f1cd5a61f",
                  "what": "updated status(live)"
              }
          ],
          "availability": "low",
          "status": "live",
          "type": "pick",
          "user": "ac386ca1-9743-5aae-8b17-2d5f1cd5a61f",
          "__v": 2
      },
      {
          "location": {
              "coordinates": [
                  144.997901,
                  -37.84895
              ],
              "type": "Point"
          },
          "tags": [
              "table",
              "chairs"
          ],
          "images": [
              "test3.jpg"
          ],
          "_id": "8c97f4e0-0985-11e9-98c5-8f3656c93f54",
          "timestamp": "2018-12-27T03:14:40.558Z",
          "updates": [
              {
                  "timestamp": "2018-12-27T03:14:40.558Z",
                  "_id": "5c2443a06e0a0c2bdb0d8cbf",
                  "user": "1e6a8e52-bdca-57eb-accb-d02ee2c18a42",
                  "what": "create"
              }
          ],
          "availability": "full",
          "status": "live",
          "type": "pick",
          "user": "ac386ca1-9743-5aae-8b17-2d5f1cd5a61f",
          "__v": 0
      }
  ]
  }

  // set the header navigator options, with the filter button
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Home',
      // headerTitle: (
      //   <View style={styles.headerLogo}>
      //     <Image
      //         source={require('./some/image.png')}
      //         style={{width:110, height:18}}
      //     />
      //   </View>
      // ),
      headerRight: <Button onPress={params.openFilters} title='filter'>
                    <Icon.MaterialCommunityIcons 
                    name={'filter'} 
                    size={28} 
                    style={styles.iconFilter} />
                  </Button>
    }
  };

  // default function initialized when Screen is loaded
  componentDidMount() {
    // pass the parameters for the filters
    this.props.navigation.setParams({ openFilters: this.showFilters });
  }
  
  render() {
    return (
      <View style={styles.container}>

        <MapView
          ref={MapView => (this.MapView = MapView)}
          style={styles.map}
          region={this.state.mapRegion}
          loadingEnabled = {true}
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#eeeeee"
          showsUserLocation={true}
          moveOnMarkerPress={true}
          showsPointsOfInterest={false}
          //provider="google"
          //onRegionChange={this.onRegionChange}
          >

          {this.state.thingsMarkers.map( (marker, i) => (
            <Marker
              key={i}
              coordinate={{
                latitude: parseFloat(marker.location.coordinates[1]),
                longitude: parseFloat(marker.location.coordinates[0]),
              }}
              onPress={(e) => {e.stopPropagation(); this.onMarkerPress(i)}}
              //image={require('../assets/pin.png')}
            />
          ))}
          
        </MapView>

        <SwiperFlatList style={this.state.showSwiper ? styles.thingSlides : {display: 'none'}} ref='swiper'>
          {this.state.thingsMarkers.map( (marker, i) => (
            <View key={i} style={styles.thingSlide}>
              <Text onPress={this.goTotThing} style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>
              <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
                <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
              </View>
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
            <Text style={styles.popoverTitle}>I'm the content of this popover!</Text>
            <Picker
            selectedValue={this.state.thingsAvailability}
            style={styles.popoverPicker}
            onValueChange={(itemValue, itemIndex) => this.setState({thingsAvailability: itemValue})}>
            <Picker.Item label="All" value="all" />
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

  // function to get the device coordinates
  deviceCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ mapRegion: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        } });
      },
      error => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  // manage map movement event, fetch and reload markers
  onMarkerPress = (i) => {
    this.setState({showSwiper: true});
    this.refs.swiper._scrollToIndex(i);
  }

  // manage map movement event, fetch and reload markers
  onRegionChange = (mapRegion) => {
    this.setState({ mapRegion });
  }

  // function to open the single Ting screen passing the object content
  goTotThing = () => {
    this.props.navigation.navigate('Thing', {name: 'Jane'});
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

}

