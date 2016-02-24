var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var api = require('../Utils/api');

var {
  View,
  StyleSheet,
  Image,
  ScrollView
} = React;

class PreviewPhoto extends React.Component{
  constructor(props) {
    super(props);
    console.log('render PreviewPhoto')
    console.log('props.data:', this.props.route.data)
  }

  sendImage() {
    NativeModules.ReadImageData.readImage(data, (image) => {
      api.uploadPhoto(image, this.props.latitude, this.props.longitude);
    })
  }

  render() {
    return (
      <View style={styles.imageContainer}>
        <NavigationBar title={{title: 'Swipe Down to Dismiss', tintColor: 'white'}} tintColor={"#FF5A5F"} statusBar={{style: 'light-content', hidden: false}}/>
        <Image style={styles.image} source={{uri: 'data:image/bmp;base64,' + this.props.route.image64}} />
        <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
      </View>
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
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 10
  }
});

module.exports = PreviewPhoto;
