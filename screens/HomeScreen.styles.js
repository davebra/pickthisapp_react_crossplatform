import { StyleSheet, Dimensions, Platform } from 'react-native';
import Colors from '../constants/Colors';

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
    color: Colors.primaryColor
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
    height: 0
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
    textAlign: 'center',
    marginTop: 24,
  },
  popoverPicker: {
    width: width * 0.75,
  },
  thingSlides: {
    position: 'absolute',
    width: width - 32,
    height: height * 0.2,
    top: 16,
    left: 16,
    borderRadius: 4,
    overflow: 'hidden',
  },
  thingSlide: {
    width: width - 32,
    height: height * 0.2,
    backgroundColor: '#fbfbfb',
    flexDirection: 'row',
  },
  thingSlideImage: {
    width: height * 0.2 - 32,
    height: height * 0.2 - 32,    
  },
  thingSlideRight: {
    flexDirection: 'column'    
  },
  thingSlideText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row'    
  },
});
  