var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var IconIon = require('react-native-vector-icons/Ionicons');
var api = require('../Utils/api');

var {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback
} = React;

class PhotoView extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      touched: false,
      favorited: false,
      uri: this.props.uri || this.props.route.uri
    }
  }

  componentWillUnmount() {
    if(this.props.showStatusBar) {this.props.showStatusBar();}
  }

  _closeImage() {
    this.props.navigator.pop();
    if(this.props.showStatusBar) {this.props.showStatusBar();}
  }

  _favoriteImage() { //for Max to fil out
    console.log('favorited!');
  }

  _shareImage() { 

  }

  _touch() {
    if(this.props.togglePagination) {this.props.togglePagination();}
    if(this.state.touched===false) {
      this.setState({touched:true});
    } else if(this.state.touched===true) {
      this.setState({touched:false});
    }

  }

  render() {
    var uri = this.state.uri;
    if(this.state.touched===false) {
      return (
        <TouchableWithoutFeedback onPress={this._touch.bind(this)} style={styles.imageContainer}>
          <Image style={styles.image} source={{uri: uri}}/>
        </TouchableWithoutFeedback>
      )
    }
    return (
        <TouchableWithoutFeedback onPress={this._touch.bind(this)} style={styles.imageContainer}>
          <Image style={styles.image} source={{uri: uri}} onPress={this._touch.bind(this)}>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this._closeImage.bind(this)} style={styles.closeButton}>
              <IconIon name="ios-close-empty" size={45} color="white" style={styles.closeIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this._shareImage.bind(this)} style={styles.closeButton}>
              <IconIon name="ios-upload-outline" size={25} color="white" style={styles.shareIcon} />
            </TouchableOpacity>
          </View>

          </Image>
        </TouchableWithoutFeedback>
    )
  }
}

var styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    backgroundColor: '#ededed'
  },
  image: {
    flex: 1
  },
  buttonContainer:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:'transparent',
  },
  closeButton:{
    width:50,
    height:50,
    backgroundColor:'rgba(0,0,0,0.3)',
    borderRadius:35,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    margin: 15,
  },
  closeIcon:{
    width:60,
    height:60,
    paddingTop: 7,
    paddingLeft: 21
  },
  shareIcon:{
    width:60,
    height:35,
    paddingTop: 4,
    paddingLeft: 22
  },
});

module.exports = PhotoView;
