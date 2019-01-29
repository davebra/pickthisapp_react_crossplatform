import React from 'react';
import {StyleSheet, Dimensions, AsyncStorage } from 'react-native';
import { Subtitle, Heading, Image, Button, View, Text } from '@shoutem/ui';

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
            <Heading style={styles.pubTitle}>Thing Published!!</Heading>
            <Subtitle style={styles.pubText}>Thanks {this.state.nickname}! This items has been published and is live! Everybody can see it and, if they need it, pick this up!</Subtitle>
            <View style={styles.skipContainer}>
            <Button styleName="stacked clear" onPress={() => { this.props.navigation.goBack(); }}>
                <Text>Back to add another Thing</Text>
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
    textAlign: 'center'
  },
  pubText: {
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