import React from 'react';
import { Image, ScrollView, TouchableOpacity, View, PermissionsAndroid, Platform, Text, Picker, AsyncStorage, Modal } from 'react-native';
import { Icon, WebBrowser } from 'expo';
import { Button } from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import Popover from 'react-native-popover-view';
import SwiperFlatList from 'react-native-swiper-flatlist';

import { MonoText } from '../components/StyledText';
import { IntroScreen } from '../screens/IntroScreen';
import styles from './HomeScreen.styles.js';

export default class HomeScreen extends React.Component {

  // set the state values
  state = {
    filtersVisible: false,
    thingsAvailability: 'all',
    firstLaunch: false,
    mapRegion: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    thingsMarkers: []
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
    
    // check if is the first time the app is launched (value saved in device storage)
    AsyncStorage.getItem('alreadyLaunched').then( value => {
      if (value == null) {
        this.setState({firstLaunch: true});
      } else {
        this.setState({firstLaunch: false});
      }
    });
  }
  
  render() {
    return (
      <View style={styles.container}>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.firstLaunch}
          onRequestClose={() => {
            this.introScreenClosed();
          }}>
          <InfoScreen />
        </Modal>

        <MapView
          style={styles.map}
          region={this.state.mapRegion}
          onRegionChange={this.onRegionChange}>

          {this.state.thingsMarkers.map(marker => (
            <Marker
              coordinate={marker.latlng}
              //onPress={(e) => {e.stopPropagation(); this.onMarkerPress(i)}}
              //image={require('../assets/pin.png')}
            />
          ))}
          
        </MapView>

        <View style={styles.overMap}>

          <SwiperFlatList style={styles.thingSlides}>
            <View style={styles.thingSlide}>
              <Text onPress={this.goTotThing} style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>
              <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
                <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
              </View>
            </View>
            <View style={styles.thingSlide}>
              <Text onPress={this.goTotThing} style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>
              <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
                <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
              </View>
            </View>
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
  onRegionChange(region) {
    this.setState({ region });
  }

  // function called when the intro modal screen is closed, it just save if the storage alreadyLaunched a value and update the state
  introScreenClosed = () => {
    AsyncStorage.setItem('alreadyLaunched', 1);
    this.setState({firstLaunch: false});
  };  

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

