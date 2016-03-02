var React = require('react-native');
var Swiper = require('react-native-swiper');
var IconIon = require('react-native-vector-icons/Ionicons');
var Settings = require('./Settings');
var Camera = require('./ProfileCamera');

var {
  StyleSheet,
  Dimensions,
  StatusBarIOS,
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicatorIOS
} = React;

class ProfileCameraView extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      index: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      latitude: undefined,
      longitude: undefined
    }
    navigator.geolocation.getCurrentPosition(
      location => {
        this.setState({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      }
    );
  }

  render () {
   return (
    <View 
      ref="scrollView"
      style={styles.wrapper} 
      showsButtons={false} 
      loop={false} 
      showsPagination={false} 
      index={this.state.index}>
      <Camera navigator={this.props.navigator} />
     </View>
   )
  }
}

var styles = StyleSheet.create({ 
  wrapper: {
    //not used for now
  },  
  centering: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 140
  },
  image: {
    width: 100,
    height: 114,
    margin: 40
  },
})

module.exports = ProfileCameraView;