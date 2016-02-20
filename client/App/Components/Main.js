
var Swiper = require('react-native-swiper')
// es6
// import Swiper from 'react-native-swiper'

var React = require('react-native');
var {
 AppRegistry,
 StyleSheet,
 Text,
 View,
} = React;

var Settings = require('./Settings');
var Camera = require('./Camera');
var MapView = require('./MapView');

var PhotosView = require('./PhotosView');

var styles = StyleSheet.create({
 wrapper: {
 }
})

var swiper = React.createClass({


  
 render: function() {
   return (
     <Swiper style={styles.wrapper} showsButtons={true} loop={false} showsPagination={false} index={1}>
       <Settings navigator={this.props.navigator}/>
       <Camera/>
       <MapView navigator={this.props.navigator}/>
     </Swiper>
   )
 }
})

module.exports = swiper;