import React from 'react';
import { StyleSheet, ScrollView, Dimensions, Image, Platform } from 'react-native';
import { Icon } from 'expo';
import { Button, Lightbox, Title, Text, View } from '@shoutem/ui';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { S3_BUCKET_URL } from 'react-native-dotenv';
import { TagText } from '../components/TagText';
import { showLocation } from 'react-native-map-link';
import ActionSheet from 'react-native-actionsheet'

export default class ThingScreen extends React.Component {

  static navigationOptions = {
    title: 'Thing',
  };

  render() {
    const { width, height } = Dimensions.get('window');
    const { thing } = this.props.navigation.state.params;
    return (
      <ScrollView style={styles.container}>
      <SwiperFlatList 
      style={{ width, height: height * 0.5, backgroundColor: '#000' }} 
      showPagination
      paginationStyle={styles.swiperPagination}>
      {thing.images.map( (image, i) => (
        <View key={i} style={{ width, height: height * 0.5 }}>
          <Lightbox renderContent={() => { return this.renderLightboxImage(image); }}>
            <Image
              style={{ height: width, height: height * 0.5 }}
              source={{uri: `${S3_BUCKET_URL}${image}`}}
            />
          </Lightbox>
        </View>
      ))}
      </SwiperFlatList>
      <Title style={styles.thingTitle}>What's in here:</Title>
      <View styleName="horizontal h-start" style={styles.tagsContainer}>
          {thing.tags.map( (tag, j) => (
          <TagText key={j}>{tag}</TagText>
          ))}
      </View>
      <Button 
        styleName="secondary" 
        onPress={() => { this.driveMeHere(thing.location.coordinates[1], thing.location.coordinates[0]) }} 
        style={styles.oneButton}
        >
        <Icon.MaterialCommunityIcons name="car-pickup" style={styles.iconButton} />
        <Text>PICK THIS THING UP</Text>
      </Button>
      <Button 
        styleName="secondary" 
        onPress={this.showAvailabilityActionSheet} 
        style={styles.oneButton}
        >
        <Icon.Entypo name="select-arrows" style={styles.iconButton} />
        <Text>UPDATE AVAILABILITY</Text>
      </Button>
      <ActionSheet
          ref={o => this.AvailabilityActionSheet = o}
          title={'What is the availability of this thing?'}
          options={['Everything\'s there', 'Most still there', 'Something\'s left', 'Everything\'s gone', 'cancel']}
          cancelButtonIndex={4}
          onPress={(index) => { /* do something */ }}
        />
      <Button 
        styleName="secondary" 
        onPress={this.showInappropriateActionSheet} 
        style={styles.buttonReport}
        >
        <Icon.MaterialIcons name="report" style={styles.iconButton} />
        <Text>REPORT INAPPROPRIATE</Text>
      </Button>
      <ActionSheet
          ref={o => this.InappropriateActionSheet = o}
          title={'What do you want to report?'}
          options={['Spam', 'Inappropriate', 'Duplicate', 'cancel']}
          cancelButtonIndex={3}
          onPress={(index) => { /* do something */ }}
        />
      </ScrollView>
    );
  }

  renderLightboxImage = (image) => (
    <View style={styles.lightboxView}>
      <Image
        style={styles.lightboxImage}
        resizeMode="contain"
        source={{ uri: `${S3_BUCKET_URL}${image}` }}
      />
    </View>
  )

  driveMeHere = (latitude, longitude) => {
    showLocation({
      latitude: latitude,
      longitude: longitude,
      title: 'Pick this up!',
      googleForceLatLon: true,
  })
  }

  showAvailabilityActionSheet = () => {
    this.AvailabilityActionSheet.show()
  }

  showInappropriateActionSheet = () => {
    this.InappropriateActionSheet.show()
  }

}

export const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  oneButton: {
    marginBottom: 18,
    marginLeft: 16,
    marginRight: 16
  },
  buttonReport: {
    marginBottom: 26,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: 'red',
    borderColor: 'red',
    color: '#fff'
  },
  iconButton: {
    fontSize: 22,
    marginRight: 14,
    color: '#fff'
  },
  tagsContainer:{
    marginTop: 10,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 20,
  },
  thingTitle:{
    marginTop: 16,
    paddingLeft: 16,
    paddingRight: 16
  },
  lightboxView: {
    width,
    height
  },
  lightboxImage: {
    width,
    height
  },
  swiperGallery: {
    width,
    height: height * 0.5,
    backgroundColor: '#000'
  },
  swiperPagination: {
    ...Platform.select({
      ios: {
        bottom: height * 0.5 - 50
      },
      android: {
        bottom: height * 0.5 + 10
      },
    }),
  }

});
