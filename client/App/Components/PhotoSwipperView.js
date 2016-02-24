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

class PhotoSwipperView extends React.Component{
  constructor(props) {
    super(props);
  }

  _onMomentumScrollEnd (e, state, context) {
    if(state.index===1 || state.index===2) {
      StatusBarIOS.setHidden(true, 'fade');
    } else {
      StatusBarIOS.setHidden(false, 'fade');
      StatusBarIOS.setStyle('light-content');
    }
  }

  render() {
    // Still working on getting right element in the center when swipper renders
    var photosUrls = this.props.route.photos;
    photosUrls = photosUrls.slice(this.props.route.index, photosUrls.length).concat(photosUrls.slice(0, this.props.route.index));
    console.log(photosUrls);
    return (
      <Swiper style={styles.wrapper} showsButtons={false} loop={false} showsPagination={false} index={1} onMomentumScrollEnd ={this._onMomentumScrollEnd}>
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

module.exports = PhotoSwipperView;
