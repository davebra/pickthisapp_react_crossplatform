import { StyleSheet, Dimensions, Platform } from 'react-native';

export const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  headerLogo: {
    flex:1, 
    flexDirection:'row', 
    justifyContent:'center'
  },
  iconFilter: {
    marginTop: 1,
    marginRight: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  overMap: {
    ...StyleSheet.absoluteFill,
  },
  developmentModeText: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  popoverAnchor: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 46,
    height: 0,
    backgroundColor: 'red'
  },
  popoverContainer: {
    width: width * 0.75,
    height: 240,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  popoverTitle: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  popoverPicker: {
    width: width * 0.75,
    flex: 6,
  },
  thingSlides: {
    position: 'absolute',
    width: width,
    height: height * 0.2,
    top: 16,
    left: 0,
    right: 0,
  },
  thingSlide: {
    width: width - 32,
    height: height * 0.2,
    padding: 16,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
  