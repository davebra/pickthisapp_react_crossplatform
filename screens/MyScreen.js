import React from 'react';
import { StyleSheet, TouchableHighlight, AsyncStorage, Alert, View } from 'react-native';
import { Icon, Button, Text, ListItem, Left, Thumbnail, Body, Right } from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import jwtDecode from 'jwt-decode';
import Colors from '../constants/Colors';
import { getUserThings, changeThingStatus } from '../components/RestApi';
import Spinner from 'react-native-loading-spinner-overlay';
import { S3_BUCKET_URL } from 'react-native-dotenv';
import Timestamp from 'react-timestamp';

export default class MyScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      userThings: [],
      listViewData: Array(20).fill('').map((_,i) => ({key: `${i}`, text: `item #${i}`})),
      spinner: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
    title: 'My Things',
    headerRight: <TouchableHighlight title='user'
                  onPress={() => { navigation.navigate('Login') }}
                  >
                    <Icon 
                    type='FontAwesome' 
                    name={'user'} 
                    size={28} 
                    style={{
                      marginTop: 2,
                      marginRight: 12,
                      color: Colors.primaryColor
                    }} />
                  </TouchableHighlight>
    };
  }

  // execute immediatly after My Screen is mounted
  componentDidMount() {

    // check if is the user is already logged in, if not, open Login
    AsyncStorage.getItem('userToken').then( value => {
      if (value == null) {
        this.props.navigation.navigate('Login');
      } else {
        this.setState({ userData: jwtDecode(value), spinner: true });
        this.loadMyThings();
      }
    });

  }

  render() {
    return (
      <View style={{...StyleSheet.absoluteFill}}>
      <Spinner
        visible={this.state.spinner}
        textContent={'Loading...'}
        color={Colors.darkColor}
        textStyle={{color: Colors.darkColor}}
      />
      <SwipeListView
        useFlatList
        style={styles.container}
        data={this.state.userThings}
        keyExtractor={(ViewData, index) => {
          return index.toString();
        }}
        renderItem={ (thing, ViewMap) => (
          <ListItem thumbnail style={styles.listItem}>
              <Left>
                <TouchableHighlight onPress={() =>{ this.goToThing(thing.item) }}>
                  <Thumbnail square source={{uri: `${S3_BUCKET_URL}${thing.item.images[0]}`, cache: 'only-if-cached'}} />
                </TouchableHighlight>
              </Left>
              <Body>
                <Text>Thing of <Timestamp time={thing.item.timestamp} format='full' component={Text} /></Text>
                <Text note numberOfLines={1}>Status: 
                  {{
                    ['live']: ` Active`,
                    ['paused']: ` Paused`,
                  }[thing.item.status]}
                </Text>
              </Body>
              <Right>
                <Button transparent onPress={() =>{ this.goToThing(thing.item) }}>
                  <Icon type='Entypo' name="chevron-thin-right" style={{color: '#999'}} size={22} />
                </Button>
              </Right>
            </ListItem>
        )}
        renderHiddenItem={ (thing, ViewMap) => (
            <View style={styles.listItemBack}>
              <View style={styles.backPlayPause}>
                <TouchableHighlight 
                style={styles.backPlayPauseTouch}
                onPress={ () => {
                  ViewMap[thing.index].manuallySwipeRow(0);
                  this.clickPauseThing( thing.item._id, (thing.item.status === 'live' ) ? 'paused' : 'live' )
                }}>
                    {{
                        ['live']: <Icon type='MaterialCommunityIcons' name="pause" size={20} />,
                        ['paused']: <Icon type='MaterialCommunityIcons' name="play" size={20} />,
                    }[thing.item.status]}
                </TouchableHighlight>
              </View>
              <View style={styles.backDelete}>
                <TouchableHighlight 
                style={styles.backDeleteTouch}
                onPress={ () => {
                    ViewMap[thing.index].manuallySwipeRow(0);
                    this.clickDeleteThing( thing.item._id )
                  }}>
                  <Icon type='FontAwesome' name="trash-o" style={{color: Colors.lightColor}} size={20} />
                </TouchableHighlight>
              </View>
            </View>
        )}
        disableRightSwipe={true}
        rightOpenValue={-160}
      />
      </View>
    );
  }

  // function to open the single Thing screen passing the object content
  goToThing = (thing) => {
    this.props.navigation.navigate('Thing',{
        thing: thing
    });
  };

  loadMyThings = () => {
    getUserThings(this.state.userData.id).then(res => { 
        if( Array.isArray(res) ){
          this.setState({
            userThings: res,
            spinner: false
          });
        }
      }).catch(err => { 
        console.log(err) 
    });
  }

  // delete is clicked, update the status on the RestAPI
  clickDeleteThing = (thingid) => {
    changeThingStatus(thingid, 'deleted').then(res => {
      this.showAlert('Thing Deleted', 'Your thing has been succesfully deleted.');
      this.setState({spinner: true});
      this.loadMyThings();
    });
  }

  // pause/resume is clicked, update the status on the RestAPI
  clickPauseThing = (thingid, status) => {
    var statusText = (status === 'live') ? 'resumed' : 'paused';
    changeThingStatus(thingid, status).then(res => {
      this.showAlert( `Thing ${statusText}`, `Your thing has been succesfully ${statusText}.`);
      this.setState({spinner: true});
      this.loadMyThings();
    });
  }

  showAlert = (title, text) => {
    Alert.alert(
      title,
      text,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listItem: {
    backgroundColor: '#fff',
  },
  listItemBack: {
    flex: 1,
  },
  iconFilter: {
    marginTop: 1,
    marginRight: 5,
    color: Colors.primaryColor
  },
  backPlayPause:{
    position: 'absolute', 
    top: 0, 
    bottom: 0,
    right: 80,
    backgroundColor: Colors.tabIconDefault,
    width: 80,
  },
  backDelete:{
    position: 'absolute', 
    top: 0, 
    bottom: 0,
    right: 0,
    backgroundColor: Colors.dangerColor,
    width: 80,
  },
  backPlayPauseTouch:{
    position: 'absolute', 
    top: 0, 
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backDeleteTouch:{
    position: 'absolute', 
    top: 0, 
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
