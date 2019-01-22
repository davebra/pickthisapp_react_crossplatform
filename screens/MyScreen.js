import React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

export default class MyScreen extends React.Component {
  state = {
    userData: {},
    userThings: [],
  };

  static navigationOptions = {
    title: 'My Things',
  };

  // execute immediatly after My Screen is mounted
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
      <SwipeListView
        useFlatList
        style={styles.container}
        data={this.state.userThings}
        renderItem={ (thing, rowMap) => (
          <TouchableHighlight onPress={this.goTotThing(thing)}>
            <View>
              <Text>{thing._id}</Text>
            </View>
          </TouchableHighlight>
        )}
        renderHiddenItem={ (thing, rowMap) => (
            <View style={styles.rowBack}>
                <Text>Left</Text>
                <Text>Right</Text>
            </View>
        )}
        leftOpenValue={75}
        rightOpenValue={-75}
      />
    );
  }

  parseJwt = (token) => {
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace('-', '+').replace('_', '/');
		return JSON.parse(window.atob(base64));
  };

  // function to open the single Thing screen passing the object content
  goTotThing = (thing) => {
    this.props.navigation.navigate('Thing', thing);
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  rowBack: {
    backgroundColor: '#ff0'
  }
});
