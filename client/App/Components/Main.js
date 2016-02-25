var React = require('react-native');
var Swiper = require('react-native-swiper');
var IconIon = require('react-native-vector-icons/Ionicons');
var Settings = require('./Settings');
var Camera = require('./Camera');
var MapView = require('./MapView');

var {
 StyleSheet,
 Dimensions,
 StatusBarIOS,
 View
} = React;

class SwiperView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      index: 1,
      showButtons: true,
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

  componentDidMount() {
    StatusBarIOS.setHidden(true);
  }

  _onMomentumScrollEnd (e, state, context) {
    if(state.index===0) {
      this.setState({index: 0});
      this.setState({showButtons: false});
      StatusBarIOS.setHidden(false, 'fade');
      StatusBarIOS.setStyle('light-content');
    } else if(state.index===1) {
      this.setState({index: 1});
      this.setState({showButtons: true});
    } else if(state.index===2) {
      this.setState({index: 2});
      this.setState({showButtons: false});
    }
  }

 render () {
  if(this.state.latitude && this.state.longitude){
   return (
   	<Swiper style={styles.wrapper} 
      showsButtons={this.state.showButtons} 
      loop={false} 
      showsPagination={false} 
      index={this.state.index} 
      onMomentumScrollEnd ={this._onMomentumScrollEnd.bind(this)} 
      buttonWrapperStyle={{backgroundColor: 'transparent', flexDirection: 'row', position: 'absolute', top: 0, left: 0, flex: 1, paddingHorizontal: 15, paddingVertical: 30, justifyContent: 'space-between', alignItems: 'flex-end'}} 
      prevButton={<IconIon name="gear-a" size={30} color="#ffffff" style={styles.flashToggleIcon} />}
      nextButton={<IconIon name="map" size={30} color="#ffffff" style={styles.flashToggleIcon} />}
      >
      <Settings navigator={this.props.navigator} />
      <Camera navigator={this.props.navigator} latitude={this.state.latitude} longitude={this.state.longitude} userId={this.props.route.userId}/>
      <MapView navigator={this.props.navigator} params={this.state} showsButtons={false}/>
     </Swiper>
    )} else {
      return <View></View>
    }
  }
}

var styles = StyleSheet.create({ //not used for now
 wrapper: {
 },
})

module.exports = SwiperView;
