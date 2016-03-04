var React = require('react-native');
var MapView = require('react-native-maps');
var Icon = require('react-native-vector-icons/FontAwesome');
var CircleMarker = require('./CircleMarker');
var PhotoView = require('./PhotoView');
var PhotosView = require('./PhotosView');
var api = require('../Utils/api');
var BlackPhotoMarker = require('./BlackPhotoMarker');
var RedPhotoMarker = require('./RedPhotoMarker');

var {
  Navigator,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  StatusBarIOS,
  ActivityIndicatorIOS
} = React;

class Map extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: 'public',
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
          this.onLocationPressed();
          // api.fetchLocations(this.state.latitude, this.state.longitude, this.state.latitudeDelta, this.state.longitudeDelta, (photos) => {
          //   var photosArr = JSON.parse(photos);
          //   this.setState({ photosLocations: photosArr });
          // });
          // api.fetchPhotos(this.state.latitude, this.state.longitude, 50, (photos) => { // need to pass in the radius (in m) from the MapView; hardcoding as 50m for now
          //   var photosArr = JSON.parse(photos);
          //   this.setState({ closeLocations: photosArr });
          // });
        }
      }, 2000)
  }

  showImage(uri) {
    return () => {
      api.incrementViews(uri, (data) => {
        this.props.navigator.push({
          component: PhotoView,
          uri: uri,
          userId: this.props.userId,
          views: JSON.parse(data).views, 
          width: this.state.currentScreenWidth,
          sceneConfig: {
            ...Navigator.SceneConfigs.FloatFromBottom,
            gestures: {
              pop: {
                ...Navigator.SceneConfigs.FloatFromBottom.gestures.pop,
                edgeHitWidth: Dimensions.get('window').height,
              },
            },
          }
        });
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
        userId: this.props.userId,
        sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
        previousComponent: 'map',
        latitude: this.state.latitude,
        longitude: this.state.longitude
      });
  }


  // Update closeLocations and photoLocations based on friend data
  addFriendsFilter() {
    this.setState({filter: 'friends'})
    this.setState({ closeLocations: [], photosLocations: [] });
    api.fetchFriendsPhotos(this.props.userId, (photos) => { // need to pass in the radius (in m) from the MapView; hardcoding as 50m for now
      var photosArr = JSON.parse(photos);
      this.setState({ closeLocations: photosArr });
    });

    api.fetchFriendsLocations(this.state.latitude, this.state.longitude, this.state.latitudeDelta, this.state.longitudeDelta, this.props.userId, (photos) => {
      var photosArr = JSON.parse(photos);
      this.setState({ photosLocations: photosArr });
    });
  }

  // Update closeLocations and photoLocations based on all data
  addPublicFilter() {
    this.setState({filter: 'public'});

    api.fetchPhotos(this.props.params.latitude, this.props.params.longitude, 50, (photos) => { // need to pass in the radius (in m) from the MapView; hardcoding as 50m for now
      var photosArr = JSON.parse(photos);
      this.setState({ closeLocations: photosArr });
    });

    api.fetchLocations(this.state.latitude, this.state.longitude, this.state.latitudeDelta, this.state.longitudeDelta, (photos) => {
      var photosArr = JSON.parse(photos);
      this.setState({ photosLocations: photosArr });
    });
  }
  
  // Update closeLocations and photoLocations based on specific user
  addUserFilter() {
    this.setState({filter: 'user'});
    api.fetchUserPhotos(this.props.userId, (photos) => { // need to pass in the radius (in m) from the MapView; hardcoding as 50m for now
      var photosArr = JSON.parse(photos);
      this.setState({ closeLocations: photosArr });
    });

    api.fetchUserLocations(this.state.latitude, this.state.longitude, this.state.latitudeDelta, this.state.longitudeDelta, this.props.userId, (photos) => {
      var photosArr = JSON.parse(photos);
      this.setState({ photosLocations: photosArr });
    });
  }

  render() {

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
          rotateEnabled={false}
          maxDelta={0.003}
        >

        <MapView.Marker coordinate={this.state}>
          <CircleMarker navigator={this.props.navigator}/>
        </MapView.Marker>
          { this.state.photosLocations.map((photoLocation) => {
              return (
              <MapView.Marker coordinate={{latitude: photoLocation.loc.coordinates[1], longitude: photoLocation.loc.coordinates[0]}}>
                <BlackPhotoMarker navigator={this.props.navigator}/>
              </MapView.Marker>
             )}
            )
          }
          { this.state.closeLocations.map((photoLocation) => {
              return (
               <MapView.Marker coordinate={{latitude: photoLocation.loc.coordinates[1], longitude: photoLocation.loc.coordinates[0]}} onPress={this.showImage(photoLocation.url)}>
                 <RedPhotoMarker navigator={this.props.navigator}/>
               </MapView.Marker>
             )}
            )
          }
        </MapView>

        <TouchableHighlight onPress={this.onLocationPressed.bind(this)} style={styles.arrowButton} underlayColor={'#FF5A5F'}>
          <Icon name="location-arrow" size={25} color="#ededed" style={styles.arrowIcon} />
        </TouchableHighlight>

        <View style={styles.topButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.addPublicFilter.bind(this)}>
            <View style={[styles.bubble, styles.smallButton]}>
              <Text style={styles.openPhotosText}>
                {`Public`}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.addUserFilter.bind(this)}>
            <View style={[styles.bubble, styles.smallButton]}>
              <Text style={styles.openPhotosText}>
                {`User`}
              </Text>
            </View>
          </TouchableOpacity>


          <TouchableOpacity style={styles.button} onPress={this.addFriendsFilter.bind(this)}>
            <View style={[styles.bubble, styles.smallButton]}>
              <Text style={styles.openPhotosText}>
                {`Friends`}
              </Text>
            </View>
          </TouchableOpacity>

        </View>


        <TouchableOpacity style={styles.bottomButtonContainer} onPress={this.openAllPhotos.bind(this)}>
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
      <View style={styles.centering}>
        <ActivityIndicatorIOS size={'large'}/>
        <Text style={styles.noMapText}>Getting your location...</Text>
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
    borderRadius: 4,
    borderColor: '#000000',
    borderWidth: 0.5
  },
  latlng: {
    width: 200,
    alignItems: 'stretch'
  },
  smallButton: {
    width: 90,
    alignItems: 'stretch'
  },
  currentLocation: {
    width: 100,
    alignItems: 'stretch'
  },
  arrowButton:{
    width:50,
    height:50,
    backgroundColor:'#FF5A5F',
    borderRadius:25,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FF5A5F',
    marginLeft: 290,
    marginBottom: 440 // originally 484
  },
  arrowIcon:{
    width:25,
    height:25
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 15,
    borderColor: '#FF5A5F'
  },
  topButtonContainer: {
    flexDirection: 'row',
    bottom: 550,
    height: 40,
    backgroundColor: 'transparent'
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    bottom: 50,
    backgroundColor: 'transparent'
  },
  openPhotosText: {
    textAlign: 'center',
    fontFamily: 'circular',
    color: '#565b5c'
  },
  centering: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noMapText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#656565',
    fontFamily: 'circular'
  },
});

module.exports = Map;