import React from 'react';
import { StyleSheet, ScrollView, AsyncStorage } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import jwtDecode from 'jwt-decode';
import Colors from '../constants/Colors';


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
        this.setState({ userData: jwtDecode(value) });
      }
    });

  }

  render() {
    return (
      <ScrollView style={styles.container}>
      </ScrollView>
    );
  }

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
  iconFilter: {
    marginTop: 1,
    marginRight: 5,
    color: Colors.primaryColor
  },
});
