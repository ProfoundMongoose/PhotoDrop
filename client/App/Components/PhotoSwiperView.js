var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var Swiper = require('react-native-swiper');
var PhotoView = require('./PhotoView');

var {
  StatusBarIOS,
  View,
  StyleSheet,
  Image,
} = React;

class PhotoSwiperView extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    var photosUrls = this.props.route.photos;
    var showStatusBar = this.props.route.showStatusBar;
    var navigator=this.props.navigator;
    return (
      <Swiper style={styles.wrapper} showsButtons={false} loop={false} showsPagination={false} index={this.props.route.index}>
        {
          photosUrls.map(function(photoUrl, index){
            return <PhotoView key={index} uri={photoUrl} navigator={navigator} showStatusBar={showStatusBar.bind(this)}/>
          })
        }
      </Swiper>
    )
  }
}

var styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    alignItems: 'stretch'
  },
  image: {
    flex: 1
  },
  wrapper: {
  }
});

module.exports = PhotoSwiperView;
