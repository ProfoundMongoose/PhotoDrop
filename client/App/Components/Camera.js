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
  View
} from 'react-native';
import Camera from 'react-native-camera';

var LATITUDE;
var LONGITUDE;

navigator.geolocation.getCurrentPosition(
  location => {
    // console.log(location);  <--location returns in this format
    // { coords: 
    //    { speed: -1,
    //      longitude: -1.42,
    //      latitude: 22,
    //      accuracy: 5,
    //      heading: -1,
    //      altitude: 0,
    //      altitudeAccuracy: -1 },
    //   timestamp: 477548452582.683 }
    // var search = location.coords.latitude + ',' + location.coords.longitude;
    LATITUDE = location.coords.latitude;
    LONGITUDE = location.coords.longitude;
  }
);

class CameraView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.Fill}>
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
        </Camera>
      </View>
    );
  }

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
    margin: 40
  }
});

module.exports = CameraView;
