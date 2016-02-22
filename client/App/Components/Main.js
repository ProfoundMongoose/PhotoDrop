var React = require('react-native');
var Swiper = require('react-native-swiper');
// import Swiper from 'react-native-swiper'
var Settings = require('./Settings');
var Camera = require('./Camera');
var MapView = require('./MapView');
var PhotosView = require('./PhotosView');

var {
 StyleSheet,
 Dimensions
 // Text, // not used
 // View // not used
} = React;

class SwiperView extends React.Component{
  constructor(){
    super();
    this.state = {
      width:  Dimensions.get('window').width,
      height:  Dimensions.get('window').height,
      latitude: 37.78379, //set arbitrary starting value so react can render immediatedly without an error
      longitude: -122.4089 //set arbitrary starting value so react can render immediatedly without an error
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      location => {
        this.setState({
        latitude : location.coords.latitude,
        longitude : location.coords.longitude
      });
    });
  }

 render () {
   return (
     <Swiper style={styles.wrapper} showsButtons={true} loop={false} showsPagination={false} index={1}>
       <Camera latitude={this.state.latitude} longitude={this.state.longitude}/>
       <MapView navigator={this.props.navigator} params={this.state}/>
       <Settings navigator={this.props.navigator}/>
     </Swiper>
   )
 }
}

var styles = StyleSheet.create({
 wrapper: {
 }
})

module.exports = SwiperView;