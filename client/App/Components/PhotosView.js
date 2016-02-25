var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var _ = require('lodash');
var api = require('../Utils/api');
var PhotoSwiperView = require('./PhotoSwiperView');

var {
  Navigator,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  ActivityIndicatorIOS,
  StatusBarIOS,
  TouchableHighlight
} = React;

var {width, height} = Dimensions.get('window');

var LATITUDE;
var LONGITUDE;

navigator.geolocation.getCurrentPosition(
  location => {
    LATITUDE = location.coords.latitude;
    LONGITUDE = location.coords.longitude;
  }
);

var IMAGES_PER_ROW = 3

class PhotosView extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      currentScreenWidth: width,
      currentScreenHeight: height,
      imageUrls: undefined
    };
    api.fetchPhotos(LATITUDE, LONGITUDE, 50, (photos) => { // need to pass in the radius (in m) from the MapView; hardcoding as 50m for now
      var photosArr = JSON.parse(photos);
      var photosUrls = photosArr.map((photo) => {
        return photo.url;
      });
      this.setState({imageUrls:photosUrls});
    })
  }

  componentWillUnmount() { //this is just for displaying the statusbar in settings. When the photosview button is removed from settings and is added to the map marker, delete this
    StatusBarIOS.setStyle('light-content');
    StatusBarIOS.setHidden(false);
  }

  handleRotation(event) {
    var layout = event.nativeEvent.layout;
    this.setState({currentScreenWidth: layout.width, currentScreenHeight: layout.height });
  }

  calculatedSize() {
    var size = this.state.currentScreenWidth / IMAGES_PER_ROW;
    return {width: size, height: size};
  }

  // function that returns a function that knows the correct uri to render
  showImageFullscreen(uri, index) {
    return () => {
      console.log(uri);
      console.log(this.state.imageUrls);
      this.props.navigator.push({
        component: PhotoSwiperView,
        index: index,
        photos: this.state.imageUrls,
        uri: uri,
        width: this.state.currentScreenWidth,
        sceneConfig: Navigator.SceneConfigs.FloatFromBottom
      });
    }
  }

  renderRow(images) {
    return images.map((uri, index) => {
      return (
        // Hardcoded key value for each element below to dismiss eror message
        <TouchableHighlight onPress={this.showImageFullscreen(uri, index)}>
          <Image style={[styles.image, this.calculatedSize()]} source={{uri: uri}} />
        </TouchableHighlight>
      )
    })
  }

  renderImagesInGroupsOf(count) {
    return _.chunk(IMAGE_URLS, IMAGES_PER_ROW).map((imagesForRow) => {
      return (
        <View style={styles.row}>
          {this.renderRow(imagesForRow)}
        </View>
      )
    })
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white' }}>
        <NavigationBar title={{title: 'Swipe Down to Dismiss', tintColor: 'white'}} tintColor={"#FF5A5F"} statusBar={{style: 'light-content', hidden: false}}/>
        {this.state.imageUrls ? null : <ActivityIndicatorIOS size={'large'} style={[styles.centering, {height: 550}]} />}
        {this.state.imageUrls && !this.state.imageUrls.length ? <Text style={styles.noPhotosText}>Looks like there are no photos near you...</Text>   : null}
        {this.state.imageUrls && !this.state.imageUrls.length ? <Text style={styles.noPhotosText2}>Be the first one to share a pic!</Text>  : null}
        <ScrollView onLayout={this.handleRotation.bind(this)} contentContainerStyle={styles.scrollView}>
          {this.state.imageUrls ? this.renderRow(this.state.imageUrls) : null}
        </ScrollView>
      </View>
    );
  }

};

var styles = StyleSheet.create({
  centering: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  noPhotosText: {
    marginTop: 65,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  noPhotosText2: {
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  scrollView: {
   flexDirection: 'row',
   flexWrap: 'wrap'
  },
  row: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'flex-start'
  },
  image: {
   borderWidth: 1,
   borderColor: '#fff'
  }
});

module.exports = PhotosView;
