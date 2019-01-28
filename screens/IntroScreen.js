import React from 'react';
import {StyleSheet, Dimensions, AsyncStorage } from 'react-native';
import { Subtitle, Heading, Image, Button, View, Text } from '@shoutem/ui';
import SwiperFlatList from 'react-native-swiper-flatlist';

export default class IntroScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <SwiperFlatList 
          style={styles.introSlides} 
          paginationStyle={styles.swiperPagination}
          paginationActiveColor={'#444444'}
          paginationDefaultColor={'#dddddd'}
          showPagination>
            <View style={styles.introSlide}>
              <View style={styles.introImageContainer}>
                <Image 
                  style={{width: 150, height: 150}} 
                  resizeMode='contain'
                  source={require('../assets/images/intro1.png')} />
              </View>
              <Heading style={styles.introTitle}>Find things for free!</Heading>
              <Subtitle style={styles.introText}>With PickThisApp you can find free things around you, owned or just found by other Pick-appers.</Subtitle>
              <View style={styles.skipContainer}>
                <Button styleName="stacked clear" onPress={this.closeIntro}>
                  <Text>Skip Intro</Text>
                </Button>
              </View>
            </View>
            <View style={styles.introSlide}>
              <View style={styles.introImageContainer}>
                <Image 
                  style={{width: 180, height: 180}} 
                  resizeMode='contain'
                  source={require('../assets/images/intro2.png')} />
              </View>
              <Heading style={styles.introTitle}>Be the first to pick up!</Heading>
              <Subtitle style={styles.introText}>When you find something interesting and you want to get there, tap "Drive me here" to start your navigator.</Subtitle>
              <View style={styles.skipContainer}>
                <Button styleName="stacked clear" onPress={this.closeIntro}>
                  <Text>Skip Intro</Text>
                </Button>
              </View>
            </View>
            <View style={styles.introSlide}>
              <View style={styles.introImageContainer}>
                <Image 
                  style={{width: 200, height: 200}} 
                  resizeMode='contain'
                  source={require('../assets/images/intro3.png')} />
              </View>
              <Heading style={styles.introTitle}>Want to post free things?</Heading>
              <Subtitle style={styles.introText}>Do you have something you want to give for free or you just found something on nature strip? Post a thing here is super easy! Take a picture, adjust the position, and post!</Subtitle>
              <View style={styles.skipContainer}>
                <Button styleName="stacked clear" onPress={this.closeIntro}>
                  <Text>Skip Intro</Text>
                </Button>
              </View>
            </View>
        </SwiperFlatList>
      </View>
    );
  }

  // function called when the intro modal screen is closed, it just save if the storage alreadyLaunched a value and update the state
  closeIntro = () => {
    // save 'yes' in the storage key 'alreadyLaunched'
    AsyncStorage.setItem('alreadyLaunched', 'yes');
    // back to the Home Screen
    this.props.navigation.goBack();
  };  

}

export const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  introSlides: {
    ...StyleSheet.absoluteFill,
  },
  introSlide: {
    width,
    height,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  introImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  introTitle: {
    marginTop: 24,
    marginLeft: 16,
    marginRight: 16,
    textAlign: 'center'
  },
  introText: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  skipContainer:{
    flexDirection:'row',
    justifyContent:'center'
  },
  swiperPagination:{
    marginBottom: 24
  }
});
