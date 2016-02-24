var React = require('react-native');
var MapView = require('react-native-maps');
var PhotoMarker = require('./PhotoMarker');
var PhotoView = require('./PhotoView');
var api = require('../Utils/api');
var _ = require('lodash');

var {
  Navigator,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StatusBarIOS
  // TouchableHighlight // not used
  } = React;

class Overlays extends React.Component{

  constructor(props) {
    super(props);
    this.aspect_ratio = this.props.params.width / this.props.params.height;

    this.state = {
      isFirstLoad: true,
      region: {
        latitude: this.props.params.latitude,
        longitude: this.props.params.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: this.aspect_ratio * 0.005
      },
      photoCount: 0,
      photosLocations: undefined
    };

    // need to figure out when these api methods are invoked; does not update after a picture was taken
    api.fetchPhotos(this.props.params.latitude, this.props.params.longitude, 50, (photos) => { // need to pass in the radius (in m) from the MapView; hardcoding as 50m for now
      var photosArr = JSON.parse(photos);
      this.setState({photoCount: photosArr.length});
    });

    api.fetchLocations(this.state.region.latitude, this.state.region.longitude, this.state.region.latitudeDelta, this.state.region.longitudeDelta, (photos) => { // need to pass in the radius (in m) from the MapView; hardcoding as 50m for now
      var photosArr = JSON.parse(photos);
      this.setState({photosLocations: photosArr});
    });
  }

  showImage(uri) {
    return () => {
      console.log(uri);
      this.props.navigator.push({
        component: PhotoView,
        uri: uri,
        width: this.state.currentScreenWidth,
        sceneConfig: Navigator.SceneConfigs.FloatFromBottom
      });
    }
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
    StatusBarIOS.setHidden(true, 'fade');

    if(this.state.isFirstLoad) {
      navigator.geolocation.getCurrentPosition(
        location => {
          this.setState({
            isFirstLoad: false,
            region: {
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
    if(this.state.photosLocations){
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
        { this.state.photosLocations.map((photoLocation) => {
            return (
             <MapView.Marker image={require('../Components/assets/rsz_pin.png')} onPress={this.showImage(photoLocation.url)}
               coordinate={{latitude: photoLocation.loc.coordinates[1], longitude: photoLocation.loc.coordinates[0]}}
             />
           )}
          )
        }
        
          <MapView.Circle
            center={this.state.region} //TODO: Needs Fixing
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
  } else {
    return <View></View>
  } 
};
}

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