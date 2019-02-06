import React from 'react';
import { StyleSheet, ScrollView, Dimensions, Image, AsyncStorage, View } from 'react-native';
import { Button, Text, H2, H3, Icon } from 'native-base';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { S3_BUCKET_URL } from 'react-native-dotenv';
import { TagText } from '../components/TagText';
import { showLocation } from 'react-native-map-link';
import ActionSheet from 'react-native-actionsheet';
import Lightbox from 'react-native-lightbox';
import Toast, {DURATION} from 'react-native-easy-toast';

import { changeThingAvailability, changeThingStatus } from '../components/RestApi';
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';

export default class ThingScreen extends React.Component {
  static navigationOptions = {
    title: 'There\'s something here',
    headerTitleStyle: {
      fontFamily: Fonts.fontBold
    },
    headerStyle: {
      backgroundColor: Colors.appBackground
    },
    headerTintColor: Colors.primaryColor,
  };

  constructor(props) {
    super(props);
    this.state = {
      thing: props.navigation.state.params.thing
    }
  }

  render() {
    const { width, height } = Dimensions.get('window');
    return (
      <View style={{flex: 1}}>
      <ScrollView style={styles.container}>
      <SwiperFlatList 
      style={{ width, height: height * 0.5, backgroundColor: '#000' }} 
      showPagination
      paginationStyle={styles.swiperPagination}>
      {this.state.thing.images.map( (image, i) => (
        <View key={i} style={{ width, height: height * 0.5 }}>
          <Lightbox>
            <Image
              style={{ height: width, height: height * 0.5 }}
              source={{uri: `${S3_BUCKET_URL}${image}`}}
            />
          </Lightbox>
        </View>
      ))}
      </SwiperFlatList>
      <H2 style={styles.thingTitle}>What's in here:</H2>
      <View style={styles.tagsContainer}>
          {this.state.thing.tags.map( (tag, j) => (
          <TagText key={j} style={{fontSize: 18}}>{tag}</TagText>
          ))}
      </View>
      <H3 style={styles.thingAvailability}>Availability: {{
            ['full']: ` Everything's there!`,
            ['medium']: ` Most things still there`,
            ['low']: ` Something's left`,
            ['empty']: ` Everything's gone`,
        }[this.state.thing.availability]}</H3>
      <Button 
        iconLeft block
        onPress={() => { this.driveMeHere(this.state.thing.location.coordinates[1], this.state.thing.location.coordinates[0]) }} 
        style={styles.oneButton}
        >
        <Icon type='MaterialCommunityIcons' name="car-pickup" style={styles.iconButton} />
        <Text style={styles.buttonText}>Drive me here</Text>
      </Button>
      <Button 
        iconLeft block 
        onPress={this.showAvailabilityActionSheet} 
        style={styles.oneButton}
        >
        <Icon type='Entypo' name="select-arrows" style={styles.iconButton} />
        <Text style={styles.buttonText}>Update availability</Text>
      </Button>
      <Button 
        iconLeft block 
        onPress={this.showInappropriateActionSheet} 
        style={styles.buttonReport}
        >
        <Icon type='MaterialIcons' name="report" style={styles.iconButton} />
        <Text style={styles.buttonText}>Report inappropriate</Text>
      </Button>
      </ScrollView>
      <ActionSheet
          ref={o => this.AvailabilityActionSheet = o}
          title={'What is the availability of this thing?'}
          options={['Everything\'s there', 'Most still there', 'Something\'s left', 'Everything\'s gone', 'cancel']}
          cancelTouchableHighlightIndex={4}
          onPress={(index) => { this.updateAvailability(index) }}
        />
      <ActionSheet
          ref={o => this.InappropriateActionSheet = o}
          title={'What do you want to report?'}
          options={['Spam', 'Inappropriate', 'Duplicate', 'cancel']}
          cancelTouchableHighlightIndex={3}
          onPress={(index) => { this.updateStatus(index) }}
        />
        <Toast ref="toastSuccess" 
          style={{backgroundColor:Colors.secondaryColor}}
          position={'bottom'} 
          positionValue={240} 
          opacity={0.85} 
          textStyle={{fontFamily:Fonts.fontMedium, color: Colors.lightColor}} />
        <Toast 
          ref="toastError" 
          position={'bottom'} 
          positionValue={240} 
          opacity={0.85} 
          textStyle={{fontFamily:Fonts.fontMedium, color: Colors.lightColor}} />
      </View>
    );
  }

  driveMeHere = (latitude, longitude) => {
    showLocation({
      latitude: latitude,
      longitude: longitude,
      title: 'Pick this up!',
      googleForceLatLon: true,
  })
  }

  showAvailabilityActionSheet = () => {
    // check if is the user is already logged in, if not, open Login
    AsyncStorage.getItem('userToken').then( value => {
      if (value == null) {
        this.props.navigation.navigate('Login');
      } else {
        this.AvailabilityActionSheet.show()
      }
    });
  }

  updateAvailability = (i) => {
    var av;
    switch (i){
      case 0:
        av = 'full';
      break;
      case 1:
        av = 'medium';
      break;
      case 2:
        av = 'low';
      break;
      case 3:
        av = 'empty';
      break;
      default:
      return;
    }
    changeThingAvailability(this.state.thing._id, av).then(res => { 
      this.refs.toastSuccess.show('Availability Updated!', DURATION.LENGTH_LONG);
      this.setState(prevState => ({
        thing: {
            ...prevState.thing,
            availability: av
        }
      }));

    }).catch(err => { 
      this.refs.toastError.show('Something wrong during the update, please try again later.', DURATION.LENGTH_LONG);
      console.log(err) ;
    });
  }

  showInappropriateActionSheet = () => {
    // check if is the user is already logged in, if not, open Login
    AsyncStorage.getItem('userToken').then( value => {
      if (value == null) {
        this.props.navigation.navigate('Login');
      } else {
        this.InappropriateActionSheet.show()
      }
    });
  }

  updateStatus = (i) => {
    var status;
    switch (i){
      case 0:
      status = 'spam';
      break;
      case 1:
      status = 'inappropriate';
      break;
      case 2:
      status = 'dulicate';
      break;
      default:
      return;
    }
    changeThingStatus(this.state.thing._id, status).then(res => { 
      this.refs.toastSuccess.show('Status Updated!', DURATION.LENGTH_LONG);
    }).catch(err => { 
      this.refs.toastError.show('Something wrong during the update, please try again later.', DURATION.LENGTH_LONG);
      console.log(err) 
    });
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
    marginRight: 16,
    height: 52,
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.noticeText,
  },
  buttonReport: {
    marginBottom: 26,
    marginLeft: 16,
    marginRight: 16,
    height: 52,
    backgroundColor: Colors.dangerColor,
    borderColor: Colors.noticeText,
  },
  buttonText: {
    color: '#fff',
    fontFamily: Fonts.fontMedium
  },
  iconButton: {
    fontSize: 22,
    marginRight: 10,
    color: '#fff'
  },
  tagsContainer:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 12,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 24,
  },
  thingTitle:{
    marginTop: 22,
    paddingLeft: 16,
    paddingRight: 16,
    fontFamily: Fonts.fontLight,
  },
  thingAvailability: {
    marginBottom: 24,
    paddingLeft: 16,
    paddingRight: 16,
    fontFamily: Fonts.fontRegular,
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
    bottom: height * 0.5 + 10
  }

});
