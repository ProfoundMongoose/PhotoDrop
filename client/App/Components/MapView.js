var React = require('react-native');
var MapView = require('react-native-maps');
var PhotoMarker = require('./PhotoMarker');

var {
  StyleSheet,
  // PropTypes, // not used
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StatusBarIOS
  // Image, // not used
  // TouchableHighlight // not used
  } = React;

class Overlays extends React.Component{

  constructor(props) {
    super(props);
    this.aspect_ratio = this.props.params.width / this.props.params.height;

    this.state = {
      isFirstLoad: true,
      userLocation: { //where the user actually is
        latitude: this.props.params.latitude,
        longitude: this.props.params.longitude
      },
      region: {  //where the center of the map view is (changes as you pan around)
        latitude: this.props.params.latitude,
        longitude: this.props.params.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: this.aspect_ratio * 0.005
      },
      photoCount: 0
    };
  }

  onLocationPressed() {
    navigator.geolocation.getCurrentPosition(
      location => {
        this.setState({
          region: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: this.aspect_ratio * 0.005
          },
          userLocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        });
      },
      error => {
        this.setState({
          message: 'There was a problem with obtaining your location: ' + error
        });
      });
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  render() {

    StatusBarIOS.setHidden(true);

    if(this.state.isFirstLoad) {
      navigator.geolocation.getCurrentPosition(
        location => {
          this.setState({
            isFirstLoad: false,
            region: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            userLocation: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            circle: {
              center: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              },
              radius: 50,
            }
          });
        });
    }

    return (
      <View style={styles.container}>
        <MapView
          ref="map"
          style={styles.map}
          region={this.state.region}
          showsUserLocation={true}
          showsCompass={true}
          scrollEnabled={false}
          zoomEnabled={false}
          onRegionChange={this.onRegionChange.bind(this)}
        >

          <MapView.Marker coordinate={this.state.userLocation}>
            <PhotoMarker amount={this.state.photoCount} navigator={this.props.navigator}/>
          </MapView.Marker>

          <MapView.Circle
            center={this.state.userLocation} //TODO: Needs Fixing
            radius={50} //TODO: calculate how big it should be
            fillColor="rgba(200, 0, 0, 0.5)"
            strokeColor="rgba(0,0,0,0.5)"
          />

        </MapView>

        <View style={styles.buttonContainer}>
          <View style={[styles.bubble, styles.latlng]}>
            <Text style={{ textAlign: 'center'}}>
              {`${this.state.region.latitude.toPrecision(7)}, ${this.state.region.longitude.toPrecision(7)}`}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
              onPress={this.onLocationPressed.bind(this)}>
            <View style={styles.bubble}>
              <Text style={styles.buttonText}>Recenter</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  latlng: {
    width: 200,
    alignItems: 'stretch'
  },
  currentLocation: {
    width: 100,
    alignItems: 'stretch'
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: 'transparent'
  }
});

module.exports = Overlays;