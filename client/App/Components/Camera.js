var api = require('../Utils/api');

'use strict';
import React, {
  AppRegistry,
  Component,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  NativeModules,
  View,
  StatusBarIOS
} from 'react-native';
import Camera from 'react-native-camera';

var LATITUDE = 37; //set arbitrary starting value so react can render immediatedly without an error
var LONGITUDE = 122; //set arbitrary starting value so react can render immediatedly without an error

StatusBarIOS.setHidden(true);

navigator.geolocation.getCurrentPosition(
  location => {
    LATITUDE = location.coords.latitude;
    LONGITUDE = location.coords.longitude;
  }
);

class CameraView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cameraType: "back"
      }
    };
  

  takePicture() {
    this.camera.capture()
      .then((data) => {
        NativeModules.ReadImageData.readImage(data, (image) => {
          console.log('========image base64 encoded:  ', image);
          api.uploadPhoto(image, LATITUDE, LONGITUDE);
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
