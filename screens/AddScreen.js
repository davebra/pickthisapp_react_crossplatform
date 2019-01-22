import React from 'react';
import { StyleSheet, ScrollView, AsyncStorage } from 'react-native';
import ImagePicker from 'react-native-image-picker';

export default class AddScreen extends React.Component {
  state = {
    userData: {},
  };

  static navigationOptions = {
    title: 'Add a new Thing',
  };

  // execute immediatly after Add Screen is mounted
  componentDidMount() {

    // check if is the user is already logged in, if not, open Login
    AsyncStorage.getItem('userToken').then( value => {
      if (value == null) {
        this.props.navigation.navigate('Login');
      } else {
        this.setState({ userData: this.parseJwt(token) });
      }
    });

  }

  render() {
    return (
      <ScrollView style={styles.container}>
      </ScrollView>
    );
  }

  parseJwt = (token) => {
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace('-', '+').replace('_', '/');
		return JSON.parse(window.atob(base64));
  };

  buttonTakePicture = () => {
    // const options = {
    //   title: 'Take or select Picture'
    // };
    // ImagePicker.showImagePicker(options, (response) => {
    //   if (response.didCancel) {}
    //   else if (response.error) {}
    //   else if (response.customButton) {}
    //   else {
    //     this.props.addPhoto({
    //       fileName: response.fileName,
    //       path: response.path,
    //       type: response.type,
    //       uri: response.uri,
    //       width: response.width,
    //       height: response.height,
    //     });
    //   }
    // });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
