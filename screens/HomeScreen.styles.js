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
  thingSlideImage: {
    width: 50,
    height: 50,    
  },
  thingSlideText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  tagsContainer: {
    marginTop: 15,
    alignItems: 'flex-start',
  },
});
  