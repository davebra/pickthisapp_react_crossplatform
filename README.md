## PickThisApp React Native

PickThisApp React Native, Final Assignment project for the Cross Platform subject, Bachelor of IT @ AIT Melbourne.

### Requirements

* Node.js 8 or greater
* react-native-cli

### Installation

* Clone the project
* enter the folder and install dependencies `npm install`
* clone the file `env.sample` to `.env` and add your env details
* link react native dependencies `react-native link`
* start the project with `react-native run-ios` or `react-native run-android`

### Extensions, Libraries and Components

* react-native
* native-base (ui theme)
* react-native-vector-icons (icons)
* react-native-dotenv (environment management)
* react-navigation (default top and bottom tab navigations)
* react-native-maps (map for Home and Add screens)
* react-navigation-popover (to enable popovers in navigation for Home screen)
* react-native-popover-view (to shows filters in Home screen)
* react-native-swiper-flatlist (to shows the swipe of views in Home screen)
* react-native-swipe-list-view (to have a list with left/right swipe in My screen)
* react-native-image-picker (to have the picker with open album or open camera in Add screen)
* react-native-map-link (open the maps application)
* react-native-actionsheet (actionsheet cross platform)
* react-native-loading-spinner-overlay (loading overlay)
* react-timestamp (format date time)
* react-native-fbsdk (library for allow the FB login)
* react-native-googlesignin (library for allow the Google login)
* react-native-lightbox (library for lightbox effect for the click on images)

#### Extra Infos

* Project started with Expo, but ejected cause some native module was necessaries in order to continue the project (e.g. react-native-image-picker)
* React Native has been reinstalled (from the latest version) cause wrong dependencies links after ejecting Expo
