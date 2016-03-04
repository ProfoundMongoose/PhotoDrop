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
  View,
  ScrollView,
  Image,
  ActivityIndicatorIOS
} = React;

class SwiperView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      latitude: undefined,
      longitude: undefined
    };
    navigator.geolocation.getCurrentPosition(
      location => {
        this.setState({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      }
    );
  }

  _onMomentumScrollEnd(e, state, context) {
    if (state.index === 0) {
      this.setState({ index: 0 });
      StatusBarIOS.setHidden(false);
    } else if (state.index === 1) {
      this.setState({ index: 1 });
      StatusBarIOS.setHidden(true);
    } else if (state.index === 2) {
      this.setState({ index: 2 });
      StatusBarIOS.setHidden(true);
    }
  }

  _goToMap() {
    this.refs.scrollView.scrollTo(1);
  }

  _goToSettings() {
    this.refs.scrollView.scrollTo(-1);
  }

  render () {
    if(this.state.latitude && this.state.longitude) {
      return (
      <Swiper
        ref="scrollView"
        style={styles.wrapper}
        showsButtons={false}
        loop={false}
        showsPagination={false}
        index={this.state.index}
        onMomentumScrollEnd ={this._onMomentumScrollEnd.bind(this)}>

        <Settings navigator={this.props.navigator}
        userId={this.props.route.userId}
        username={this.props.route.username}/>

        <Camera navigator={this.props.navigator}
          latitude={this.state.latitude}
          longitude={this.state.longitude}
          params={this.state}
          userId={this.props.route.userId}
          _goToSettings={this._goToSettings.bind(this)}
          _goToMap={this._goToMap.bind(this)}/>
        <MapView navigator={this.props.navigator} params={this.state} showsButtons={false} username = {this.props.route.username} userId={this.props.route.userId}/>
       </Swiper>
     );
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: '#ededed'}}>
          <View style={styles.centering}>
            <Image source={require('./../../images/logoresized.png')} style={styles.image}/>
            <ActivityIndicatorIOS size={'large'}/>
          </View>
        </View>
      );
    }
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
});

module.exports = SwiperView;
