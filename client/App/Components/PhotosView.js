var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var _ = require('lodash');
var api = require('../Utils/api');
var PhotoView = require('./PhotoView')

var {
  Navigator,
  StyleSheet,
  View,
  Dimensions,
  Image,
  ScrollView,
  ActivityIndicatorIOS,
  TouchableHighlight,
  StatusBarIOS
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
    console.log('changes reflected')
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

  componentWillUnmount() {
    StatusBarIOS.setHidden(true);
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
  showImageFullscreen(uri) {
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

  renderRow(images) {
    return images.map((uri) => {
      return (
        // Hardcoded key value for each element below to dismiss eror message
        <TouchableHighlight onPress={this.showImageFullscreen(uri)}>
          <Image key={Math.random()} style={[styles.image, this.calculatedSize()]} source={{uri: uri}} />
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
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <NavigationBar title={{title: 'Swipe Down to Dismiss', tintColor: 'white'}} tintColor={'black'} statusBar={{style: 'light-content', hidden: false}}/>
        <ScrollView onLayout={this.handleRotation.bind(this)} contentContainerStyle={styles.scrollView}>
          {this.state.imageUrls ? this.renderRow(this.state.imageUrls) : <ActivityIndicatorIOS size={'large'} style={styles.centering} />}
        </ScrollView>
      </View>
    );
  }

};

var styles = StyleSheet.create({
  centering: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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
