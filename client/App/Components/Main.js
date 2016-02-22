var React = require('react-native');
var Swiper = require('react-native-swiper');
// import Swiper from 'react-native-swiper'
var Settings = require('./Settings');
var Camera = require('./Camera');
var MapView = require('./MapView');
var PhotosView = require('./PhotosView');

var {
 AppRegistry,
 StyleSheet,
 Text,
 View,
} = React;

class SwiperView extends React.Component{

 render () {
   return (
     <Swiper style={styles.wrapper} showsButtons={true} loop={false} showsPagination={false} index={1}>
       <Settings navigator={this.props.navigator}/>
       <Camera/>
       <MapView navigator={this.props.navigator}/>
     </Swiper>
   )
 }
}

var styles = StyleSheet.create({
 wrapper: {
 }
})

module.exports = SwiperView;