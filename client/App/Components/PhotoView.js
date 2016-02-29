var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var Icon = require('react-native-vector-icons/FontAwesome');
var IconIon = require('react-native-vector-icons/Ionicons');
var api = require('../Utils/api');

var {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActionSheetIOS
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

  _favoriteImage() { //for Max to fill out
    console.log('favorited!');
    this.state.favorited ? this.setState({favorited:false}) : this.setState({favorited:true})
  }

  _shareImage() {
    ActionSheetIOS.showShareActionSheetWithOptions({
      url: this.state.uri,
      message: 'Checkout this photo I saw I PhotoDrop:'
    },
    (error) => alert(error),
    (success, method) => {
      var text;
      if (success) {
        text = `Shared via ${method}`;
      } else {
        text = 'You didn\'t share';
      }
      this.setState({text});
    }); 
  }

  _touch() {
    if(this.state.touched===false) {
      this.setState({touched:true});
    } else if(this.state.touched===true) {
      this.setState({touched:false});
    }
    if(this.props.togglePagination) {this.props.togglePagination();}
  }

  render() {
    var uri = this.state.uri;
    if(this.props.togglePagination) {
      if(this.props.showsIndex===false) {
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
              <View style={styles.leftContainer}>
                <TouchableOpacity onPress={this._closeImage.bind(this)} style={styles.closeButton}>
                  <IconIon name="ios-close-empty" size={45} color="white" style={styles.closeIcon} />
                </TouchableOpacity>
              </View>

              <View style={styles.rightContainer}>
                <TouchableOpacity onPress={this._favoriteImage.bind(this)} style={styles.favoriteButton}>
                  {this.state.favorited ? <Icon name="heart" size={20} color="white" style={styles.favoriteIcon} /> : <Icon name="heart-o" size={20} color="white" style={styles.favoriteIcon} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={this._shareImage.bind(this)} style={styles.shareButton}>
                  <IconIon name="ios-upload-outline" size={25} color="white" style={styles.shareIcon} />
                </TouchableOpacity>
              </View>
            </View>

            </Image>
          </TouchableWithoutFeedback>
      )
    } else {
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
              <View style={styles.leftContainer}>
                <TouchableOpacity onPress={this._closeImage.bind(this)} style={styles.closeButton}>
                  <IconIon name="ios-close-empty" size={45} color="white" style={styles.closeIcon} />
                </TouchableOpacity>
              </View>

              <View style={styles.rightContainer}>
                <TouchableOpacity onPress={this._favoriteImage.bind(this)} style={styles.favoriteButton}>
                  {this.state.favorited ? <Icon name="heart" size={20} color="white" style={styles.favoriteIcon} /> : <Icon name="heart-o" size={20} color="white" style={styles.favoriteIcon} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={this._shareImage.bind(this)} style={styles.shareButton}>
                  <IconIon name="ios-upload-outline" size={25} color="white" style={styles.shareIcon} />
                </TouchableOpacity>
              </View>
            </View>

            </Image>
          </TouchableWithoutFeedback>
      )
    }
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
  leftContainer: {
    flex: 1,
  },
  rightContainer:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  shareButton:{
    width:50,
    height:50,
    backgroundColor:'rgba(0,0,0,0.3)',
    borderRadius:35,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 15,
    marginTop: 15
  },
  favoriteButton:{
    width:50,
    height:50,
    backgroundColor:'rgba(0,0,0,0.3)',
    borderRadius:35,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    marginTop: 15,
    marginRight: 5,
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
  favoriteIcon:{
    width:35,
    height:35,
    paddingTop: 7.5,
    paddingLeft: 7.5
  },
});

module.exports = PhotoView;
