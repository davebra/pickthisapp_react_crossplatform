import React from 'react';
import { Image, ScrollView, TouchableOpacity, View, PermissionsAndroid, Platform, Text, Picker } from 'react-native';
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
  state = {
    filtersVisible: false,
    thingsAvailability: 'all'
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Home',
      //header: null,
      headerRight: <Button onPress={params.openFilters} title='filter'>
                    <Icon.MaterialCommunityIcons 
                    name={'filter'} 
                    size={28} 
                    style={styles.iconFilter} />
                  </Button>
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({ openFilters: this.showFilters });
  }
  
  render() {
    return (
      <View style={styles.container}>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />

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

  goTotThing = () => {
    this.props.navigation.navigate('Thing', {name: 'Jane'});
  };

  showFilters = () => {
    if (this.state.filtersVisible)
      this.setState({filtersVisible: false});
    else 
      this.setState({filtersVisible: true});
  };
 
  closeFilters = () => {
    this.setState({filtersVisible: false});
  };




  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

