var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var Swiper = require('react-native-swiper');
var PhotoView = require('./PhotoView');

var {
  StatusBarIOS,
  View,
  StyleSheet,
  Image,
  ScrollView
} = React;

class PhotoSwiperView extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    StatusBarIOS.setHidden(true, 'fade');
  }

  render() {
    var photosUrls = this.props.route.photos;
    return (
      <Swiper style={styles.wrapper} showsButtons={false} loop={false} showsPagination={false} index={this.props.route.index}>
        {
          photosUrls.map(function(photoUrl, index){
            return <PhotoView key={index} uri={photoUrl}/>
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
