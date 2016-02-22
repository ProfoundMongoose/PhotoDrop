var React = require('react-native');
// var Camera = require('react-native-camera'); // Does not work the same way line 16 does
var api = require('../Utils/api');

var {
  Dimensions,
  StyleSheet,
  Text,
  // TouchableHighlight, // not used
  NativeModules,
  StatusBarIOS
} = React;

import Camera from 'react-native-camera';

class CameraView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cameraType: "back",
      }
    }
  
  takePicture() {
    this.camera.capture()
      .then((data) => {
        NativeModules.ReadImageData.readImage(data, (image) => {
          console.log('========image base64 encoded:  ', image);
          api.uploadPhoto(image, this.props.latitude, this.props.longitude);
        })
      })
      .catch(err => console.error('ERROR', err));
  }

  switchCamera() {
    if(this.state.cameraType==="back") {
      this.setState({cameraType:"front"});
    } else if(this.state.cameraType="front") {
      this.setState({cameraType:"back"});
    }
  }

  render() {
    StatusBarIOS.setHidden(true);
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.Fill}
          type={this.state.cameraType}>
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
          <Text style={styles.capture} onPress={this.switchCamera.bind(this)}>[FLIP]</Text>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
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

module.exports = CameraView;
