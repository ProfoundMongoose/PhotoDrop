var React = require('react-native');
var MapView = require('react-native-maps');
var Icon = require('react-native-vector-icons/FontAwesome');
var CircleMarker = require('./CircleMarker');
var PhotoView = require('./PhotoView');
var PhotosView = require('./PhotosView');
var api = require('../Utils/api');

var {
  Navigator,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  StatusBarIOS
} = React;

class Map extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      latitude: this.props.params.latitude,
      longitude: this.props.params.longitude,
      latitudeDelta: 0.003,
      longitudeDelta: (this.props.params.width / this.props.params.height) * 0.003, // division is aspect ratio
      photosLocations: undefined,
      closeLocations: undefined
    };
    
    api.fetchPhotos(this.props.params.latitude, this.props.params.longitude, 50, (photos) => { // need to pass in the radius (in m) from the MapView; hardcoding as 50m for now
      var photosArr = JSON.parse(photos);
      this.setState({ closeLocations: photosArr });
    });

    api.fetchLocations(this.state.latitude, this.state.longitude, this.state.latitudeDelta, this.state.longitudeDelta, (photos) => {
      var photosArr = JSON.parse(photos);
      this.setState({ photosLocations: photosArr });
    });
  }

  componentDidMount(){
      setInterval(()=> {
        if(this.props.params.index===2) {
          // console.log('refreshing map');
          this.onLocationPressed();
          api.fetchLocations(this.state.latitude, this.state.longitude, this.state.latitudeDelta, this.state.longitudeDelta, (photos) => {
            var photosArr = JSON.parse(photos);
            this.setState({ photosLocations: photosArr });
          });
          api.fetchPhotos(this.state.latitude, this.state.longitude, 50, (photos) => { // need to pass in the radius (in m) from the MapView; hardcoding as 50m for now
            var photosArr = JSON.parse(photos);
            this.setState({ closeLocations: photosArr });
          });
        }
      }, 500)
  }

  showImage(uri) {
    return () => {
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
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      },
      error => {
        this.setState({
          message: 'There was a problem with obtaining your location: ' + error
        });
      });
  }

  openAllPhotos() {
      this.props.navigator.push({
        component: PhotosView,
        sceneConfig: Navigator.SceneConfigs.FloatFromBottom
      });
  }

  // onRegionChange(region) {
  //   this.setState({
  //     latitude: region.latitude,
  //     longitude: region.longitude
  //   });
  //   api.fetchPhotos(this.props.params.latitude, this.props.params.longitude, 50, (photos) => { // need to pass in the radius (in m) from the MapView; hardcoding as 50m for now
  //     var photosArr = JSON.parse(photos);
  //     this.setState({ closeLocations: photosArr });
  //   });
  //   api.fetchLocations(this.state.latitude, this.state.longitude, this.state.latitudeDelta, this.state.longitudeDelta, (photos) => { // need to pass in the radius (in m) from the MapView; hardcoding as 50m for now
  //     var photosArr = JSON.parse(photos);
  //     this.setState({ photosLocations: photosArr });
  //   });
  // }

  render() {
    StatusBarIOS.setHidden(true);

    if(this.state.photosLocations && this.state.closeLocations){
    return (
      <View style={styles.container}>
        <MapView
          ref="map"
          style={styles.map}
          region={this.state}
          showsUserLocation={true}
          scrollEnabled={false}
          zoomEnabled={false}
          // onRegionChange={this.onRegionChange.bind(this)}
          rotateEnabled={false}
          // followUserLocation={true}
          maxDelta={0.003}
        >

        <MapView.Marker coordinate={this.state}>
          <CircleMarker navigator={this.props.navigator}/>
        </MapView.Marker>

          { this.state.photosLocations.map((photoLocation) => {
              return (
               <MapView.Marker image={require('../Components/assets/grey_pin.png')}
                 coordinate={{latitude: photoLocation.loc.coordinates[1], longitude: photoLocation.loc.coordinates[0]}}
               />
             )}
            )
          }
          { this.state.closeLocations.map((photoLocation) => {
              return (
               <MapView.Marker image={require('../Components/assets/red_pin.png')} onPress={this.showImage(photoLocation.url)}
                 coordinate={{latitude: photoLocation.loc.coordinates[1], longitude: photoLocation.loc.coordinates[0]}}
               />
             )}
            )
          }
        </MapView>

        <View style={styles.arrowContainer}>
          <TouchableHighlight onPress={this.onLocationPressed.bind(this)} style={styles.arrowButton} underlayColor={'#FF5A5F'}>
            <Icon name="location-arrow" size={25} color="#ededed" style={styles.arrowIcon} />
          </TouchableHighlight>
        </View>

        <TouchableOpacity style={styles.buttonContainer} onPress={this.openAllPhotos.bind(this)}>
          <View style={[styles.bubble, styles.latlng]}>
            <Text style={styles.openPhotosText}>
              {`View All Available Photos`}
            </Text>
          </View>
        </TouchableOpacity>

      </View>
    );
  } else {
    return (
      <View>
      </View>
    );
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
    backgroundColor: 'white',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 4
  },
  latlng: {
    width: 200,
    alignItems: 'stretch'
  },
  currentLocation: {
    width: 100,
    alignItems: 'stretch'
  },
  arrowContainer:{
    flex:1,
    marginTop:20,
    width:150,
    height:150,
    marginLeft:240
  },
  arrowButton:{
    width:50,
    height:50,
    backgroundColor:'#FC9396',
    borderRadius:25,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FF5A5F',
    marginLeft: 70,
    marginTop: 10
  },
  arrowIcon:{
    width:25,
    height:25
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
    borderColor: '#FF5A5F'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 30,
    backgroundColor: 'transparent'
  },
  openPhotosText: {
    textAlign: 'center',
    fontFamily: 'circular',
    color: '#565b5c'
  }
});

module.exports = Map;