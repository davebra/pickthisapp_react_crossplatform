import React from 'react';
import { StyleSheet, ScrollView, Image, Dimensions, View } from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { S3_BUCKET_URL } from 'react-native-dotenv';

export default class ThingScreen extends React.Component {

  static navigationOptions = {
    title: 'Thing',
  };

  render() {
    const { thing } = this.props.navigation.state.params
    return (
      <ScrollView style={styles.container}>
      <SwiperFlatList showPagination>
      {thing.images.map( (image, i) => (
        <View key={i} style={[styles.galleryContainer]}>
        <Image
          style={styles.galleryImage}
          source={{uri: `${S3_BUCKET_URL}${image}`}}
        />
        </View>
      ))}
      </SwiperFlatList>
      </ScrollView>
    );
  }
}

export const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  galleryContainer: {
    width,
    height: height * 0.5,
    backgroundColor: '#000',
  },
  galleryImage: {
    width,
    height: height * 0.5,
  },
});
