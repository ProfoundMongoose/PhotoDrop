var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var api = require('../Utils/api');
var IconIon = require('react-native-vector-icons/Ionicons');

var {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableHighlight
} = React;

class PreviewPhoto extends React.Component{
  constructor(props) {
    super(props);
  }

  sendImage() {
    api.uploadPhoto(this.props.route.image64, this.props.route.latitude, this.props.route.longitude, this.props.route.userId);
    this.props.navigator.pop();
  }

  cancelImage() {
    this.props.navigator.pop();
  }

  render() {
    // because we are sending the captured image in as a string we have to tell react-native how it is encoded
    return (
      <View style={styles.imageContainer}>
        <NavigationBar title={{title: 'Share this image?', tintColor: 'white'}} tintColor={"#FF5A5F"} statusBar={{style: 'light-content', hidden: false}}/>
        <Image style={styles.image} source={{uri: 'data:image/bmp;base64,' + this.props.route.image64}}> 

          <View style={styles.buttonContainer}>
            <TouchableHighlight onPress={this.sendImage.bind(this)} style={styles.yesButton} underlayColor={'#00A5A0'}>
              <IconIon name="checkmark-round" size={65} color="#036C69" style={styles.yesIcon} />
            </TouchableHighlight>
            <TouchableHighlight onPress={this.cancelImage.bind(this)} style={styles.noButton} underlayColor={'#FF5A5F'}>
              <IconIon name="close-round" size={65} color="#FC9396" style={styles.noIcon} />
            </TouchableHighlight>
          </View>

        </Image>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1
  },
  buttonContainer:{
    flex: 1,
    flexDirection: 'row',
    backgroundColor:'transparent',
    alignItems:'flex-end',
    justifyContent: 'center',
  },
  yesButton:{
    width:95,
    height:95,
    backgroundColor:'transparent',
    borderRadius:50,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: 'white',
    margin: 15,
  },
  yesIcon:{
    width:60,
    height:60
  },
  noButton:{
    width:95,
    height:95,
    backgroundColor:'transparent',
    borderRadius:50,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: 'white',
    margin: 15,
  },
  noIcon:{
    width:50,
    height:60
  },

});

module.exports = PreviewPhoto;
