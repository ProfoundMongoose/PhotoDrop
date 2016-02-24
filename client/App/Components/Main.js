var React = require('react-native');
var Swiper = require('react-native-swiper');

var Settings = require('./Settings');
var Camera = require('./Camera');
var MapView = require('./MapView');


var {
 StyleSheet,
 Dimensions,
 StatusBarIOS,
 // Text, // not used
 View
} = React;

class SwiperView extends React.Component{
  constructor(){
    super();
    this.state = {
      width:  Dimensions.get('window').width,
      height:  Dimensions.get('window').height,
      latitude: 37.78379, 
      longitude: -122.4089
    }
    navigator.geolocation.getCurrentPosition(
      location => {
        this.setState({
        latitude : location.coords.latitude,
        longitude : location.coords.longitude
      });
    });
  }


  _onMomentumScrollEnd (e, state, context) {
    if(state.index===1 || state.index===2) {
      StatusBarIOS.setHidden(true, 'fade');
    } else {
      StatusBarIOS.setHidden(false, 'fade');
      StatusBarIOS.setStyle('light-content');
    }
  }

 render () {
  if(this.state.latitude && this.state.longitude){
   return (
   	<Swiper style={styles.wrapper} showsButtons={false} loop={false} showsPagination={false} index={1} onMomentumScrollEnd ={this._onMomentumScrollEnd}>
       <Settings navigator={this.props.navigator}/>
       <Camera navigator={this.props.navigator} latitude={this.state.latitude} longitude={this.state.longitude}/>
       <MapView navigator={this.props.navigator} params={this.state}/>
     </Swiper>
   )
 } else {
  return <View></View>
 }
}
}

var styles = StyleSheet.create({
 wrapper: {
 }
})

module.exports = SwiperView;
