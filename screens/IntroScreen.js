import React from 'react';
import { ScrollView, StyleSheet, Dimensions, View, Text, Image, Button } from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';

export default class IntroScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View style={styles.container}>
        <SwiperFlatList style={styles.introSlides}>
            <View style={styles.introSlide}>
              <Text style={styles.introTitle}>Find things for free!</Text>
              <Text style={styles.introText}>With PickThisApp you can find free things around you, owned or just found by other Pick-appers.</Text>
            </View>
            <View style={styles.introSlide}>
              <Text style={styles.introTitle}>Be the first to pick up!</Text>
              <Text style={styles.introText}>When you find something interesting and you want to get there, tap "Drive me here" to start your navigator.</Text>
            </View>
            <View style={styles.introSlide}>
              <Text style={styles.introTitle}>Want to give something for free?</Text>
              <Text style={styles.introText}>Do you have something you want to give for free or you just found something on nature strip? Post a thing here is super easy! Take a picture, adjust the position, and post!</Text>
            </View>
        </SwiperFlatList>
      </View>
    );
  }
}

export const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  introTitle: {
    
  },
  introText: {
    
  }
});
