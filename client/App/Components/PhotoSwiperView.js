var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var Swiper = require('react-native-swiper');
var PhotoView = require('./PhotoView');
var api = require('../Utils/api');

var {
  StatusBar,
  View,
  StyleSheet,
  Image,
  Text,
} = React;

class PhotoSwiperView extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      showsIndex: false,
      index: this.props.route.index,
      userId: this.props.route.userId,
      photos: this.props.route.photos 
    }
  }

  _onMomentumScrollEnd(e, state, context) {
    this.setState({ index: Math.floor(state.index) });
    api.incrementViews(this.state.photos[this.state.index], (data) => {
      console.log('Incremented views on', this.state.photos[this.state.index]);
    });
  }

  renderPagination(index, total, context) {
      return (
        <View style={{
          position: 'absolute',
          bottom: 14,
          right: 14,
        }}>
          <Text style={styles.pageIndex}>{index + 1}/{total}</Text>
        </View>
      )
  }

  togglePagination(){
    if(this.state.showsIndex===false) {
      this.setState({showsIndex:true});
    } else if(this.state.showsIndex===true) {
      this.setState({showsIndex:false});
    }
  };

  render() {
    var photosUrls = this.state.photos;
    var showStatusBar = this.props.route.showStatusBar;
    var navigator=this.props.navigator;
    var togglePagination = this.togglePagination.bind(this);
    var showsIndex = this.state.showsIndex;
    var userId = this.props.route.userId;
    return (
      <Swiper style={styles.wrapper} 
        showsButtons={false} 
        loop={false} 
        showsPagination={this.state.showsIndex}
        renderPagination={this.renderPagination}           
        index={this.state.index}
        onMomentumScrollEnd ={this._onMomentumScrollEnd.bind(this)}>
        {
          photosUrls.map(function(photoUrl, index){
            return <PhotoView 
                    key={index} 
                    uri={photoUrl} 
                    userId={userId} 
                    navigator={navigator} 
                    showStatusBar={showStatusBar.bind(this)} 
                    showsIndex={showsIndex} 
                    togglePagination={togglePagination.bind(this)}/>
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
  pageIndex: {
    fontSize: 16,
    fontFamily: 'circular',
    color: 'white'
  },
  wrapper: {
  }
});

module.exports = PhotoSwiperView;
