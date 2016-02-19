var React = require('react-native');
var MapView = require('react-native-maps');
var PhotoMarker = require('./PhotoMarker');

var {
  StyleSheet,
  PropTypes,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  TouchableHighlight
  } = React;


var { width, height } = Dimensions.get('window');


var ASPECT_RATIO = width / height;
var LATITUDE;
var LONGITUDE;
var LATITUDE_DELTA = 0.005;
var LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

navigator.geolocation.getCurrentPosition(
  location => {
    // console.log(location);  <--location returns in this format
    // { coords: 
    //    { speed: -1,
    //      longitude: -1.42,
    //      latitude: 22,
    //      accuracy: 5,
    //      heading: -1,
    //      altitude: 0,
    //      altitudeAccuracy: -1 },
    //   timestamp: 477548452582.683 }
    // var search = location.coords.latitude + ',' + location.coords.longitude;
    LATITUDE = location.coords.latitude;
    LONGITUDE = location.coords.longitude;
  }
);

class Overlays extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      userLocation: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      circle: {
        center: {
          latitude: LATITUDE,
          longitude: LONGITUDE
        },
        radius: 50, // TODO: Figure this out: how big?
      }
    };
  }

  onLocationPressed() {
    navigator.geolocation.getCurrentPosition(
      location => {
        this.setState({
          region: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          },
          userLocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          },
          circle: {
            center: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            },
            radius: 50, // TODO: Figure this out: how big?
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
    var { region, circle} = this.state;
    return (
      <View style={styles.container}>
        <MapView
          ref="map"
          style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange.bind(this)}
        >
          <MapView.Circle
            center={circle.center}
            radius={circle.radius}
            fillColor="rgba(200, 0, 0, 0.5)"
            strokeColor="rgba(0,0,0,0.5)"
          />

          <MapView.Marker
            coordinate={this.state.userLocation}
          >
            <PhotoMarker amount={99} />
            <MapView.Callout
              style={styles.callout}
            >
              <View>
                <Text>I got 99 pics</Text>
              </View>
            </MapView.Callout>
          </MapView.Marker>

        </MapView>
        <View style={styles.buttonContainer}>


          <View style={[styles.bubble, styles.latlng]}>
            <Text style={{ textAlign: 'center'}}>
              {`${this.state.region.latitude.toPrecision(7)}, ${this.state.region.longitude.toPrecision(7)}`}
            </Text>
          </View>

          <TouchableHighlight style={styles.button}
              onPress={this.onLocationPressed.bind(this)}>
            <Text style={styles.buttonText}>Get Current Location</Text>
          </TouchableHighlight>


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
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

module.exports = Overlays;