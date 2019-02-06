import React from 'react';
import {StyleSheet, Dimensions, Image, View } from 'react-native';
import { Button, Text, H2 } from 'native-base';
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';

export default class PublishedScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            nickname: props.navigation.state.params.nickname
        }
    }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.pubSlide}>
            <View style={styles.pubImageContainer}>
            <Image 
                style={{width: 200, height: 200}} 
                resizeMode='contain'
                source={require('../assets/images/intro3.png')} />
            </View>
            <H2 style={styles.pubTitle}>Thing Published!!</H2>
            <Text style={styles.pubText}>Thanks {this.state.nickname}! This items has been published and is live! Everybody can see it and, if they need it, pick this up!</Text>
            <View style={styles.skipContainer}>
            <Button transparent dark onPress={() => { this.props.navigation.goBack(); }}>
                <Text style={styles.buttonGoBack}>Go back and add something else!</Text>
            </Button>
            </View>
        </View>
      </View>
    );
  }

}

export const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  pubImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  pubTitle: {
    marginTop: 24,
    marginLeft: 16,
    marginRight: 16,
    textAlign: 'center',
    fontFamily: Fonts.fontLight,
  },
  pubText: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: Fonts.fontRegular,
  },
  skipContainer:{
    marginTop: 18,
    flexDirection:'row',
    justifyContent:'center'
  },
  buttonGoBack: {
    color: Colors.darkColor,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Fonts.fontMedium,
  }
});
