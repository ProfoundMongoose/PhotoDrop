var React = require('react-native');
var MapView = require('react-native-maps');
var PhotosView = require('./PhotosView');

var {
  Navigator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} = React;

var LATITUDE; 
var LONGITUDE;
//get the initial position
navigator.geolocation.getCurrentPosition(
  location => {
    LATITUDE = location.coords.latitude;
    LONGITUDE = location.coords.longitude;
  }
);

class MainPhotosMarker extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      userLocation: { //where the user is
        latitude: LATITUDE,
        longitude: LONGITUDE
      }
    };
  }

  onMarkerPressed() {
    this.props.navigator.push({
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
      component: PhotosView
    });
  }

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.bubble}>
            <TouchableOpacity onPress={this.onMarkerPressed.bind(this)}>
              <Text style={[styles.amount, { fontSize: this.props.fontSize }]}>{this.props.amount}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.arrowBorder} />
          <View style={styles.arrow} />
          <MapView.Circle
            center={this.state.userLocation} //TODO: Needs Fixing
            radius={50} //TODO: calculate how big it should be
            fillColor="rgba(200, 0, 0, 0.5)"
            strokeColor="rgba(0,0,0,0.5)"
          />
        </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start'
  },
  bubble: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#FF5A5F',
    padding: 2,
    borderRadius: 3,
    borderColor: '#D23F44',
    borderWidth: 0.5
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 13
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#FF5A5F',
    alignSelf: 'center',
    marginTop: -9
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#D23F44',
    alignSelf: 'center',
    marginTop: -0.5
  }
});

module.exports = MainPhotosMarker;