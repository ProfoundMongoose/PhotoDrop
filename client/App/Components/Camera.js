var React = require('react-native');
var Camera = require('react-native-camera').default;
var Icon = require('react-native-vector-icons/FontAwesome');
var IconIon = require('react-native-vector-icons/Ionicons');
var PreviewPhoto = require('./PreviewPhoto')
var api = require('../Utils/api');

var {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  NativeModules,
  StatusBarIOS
} = React;

class CameraView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraType: Camera.constants.Type.back,
      cameraFlashToggle: Camera.constants.FlashMode.off,
      handleFocusChanged: () => {},
      latitude: this.props.latitude,
      longitude: this.props.longitude
    }
  }

  componentDidMount() {
    setInterval(()=> {
      if(this.props.params.index===1) {
        navigator.geolocation.getCurrentPosition(
          location => {
            this.setState({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            });
          }
        );
      }
    }, 2000)
  }

  takePicture() {
    this.camera.capture()
      .then((data) => {
        NativeModules.ReadImageData.readImage(data, (image) => {
          this.props.navigator.push({
            component: PreviewPhoto,
            image64: image,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            userId: this.props.userId
          })
        })
      })
      .catch(err => console.error('ERROR', err));
  }

  switchCamera() {
    if (this.state.cameraType === Camera.constants.Type.back) {
      this.setState({ cameraType: Camera.constants.Type.front });
      console.log('back to front');
    } else if (this.state.cameraType = Camera.constants.Type.front) {
      this.setState({ cameraType: Camera.constants.Type.back });
      console.log('front to back');
    }
  }

  flashEnabled() {
    if (this.state.cameraFlashToggle === Camera.constants.FlashMode.on) {
      this.setState({ cameraFlashToggle: Camera.constants.FlashMode.off });
      console.log('flash off!');
    } else if (this.state.cameraFlashToggle === Camera.constants.FlashMode.off) {
      this.setState({ cameraFlashToggle: Camera.constants.FlashMode.on });
      console.log('flash on!');
    }
  }

  render() {
    return (
      <View >
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.Fill}
          type={this.state.cameraType}
          flashMode={this.state.cameraFlashToggle}
          defaultOnFocusComponent={ true } 
          onFocusChanged={ this.state.handleFocusChanged }>

          <View style={styles.topButtonContainer}>
            <TouchableHighlight onPress={this.flashEnabled.bind(this)} style={styles.flashToggleButton} underlayColor={'#FF5A5F'}>
              {this.state.cameraFlashToggle===Camera.constants.FlashMode.on ?  <IconIon name="ios-bolt" size={40} color="#FC9396" style={styles.flashToggleIcon} /> :  <IconIon name="ios-bolt-outline" size={40} color="#FC9396" style={styles.flashToggleIcon} />}
            </TouchableHighlight>
            <TouchableHighlight onPress={this.switchCamera.bind(this)} style={styles.switchButton} underlayColor={'#FF5A5F'}>
              <Icon name="circle-o-notch" size={25} color="#FC9396" style={styles.switchIcon} />
            </TouchableHighlight>
          </View>

          <View style={styles.bottomButtonContainer}>
            <TouchableHighlight onPress={this.props._goToSettings.bind(this)} style={styles.settingsButton}>
              <IconIon name="drag" size={40} color="#ededed"/>
            </TouchableHighlight>
              <TouchableHighlight onPress={this.takePicture.bind(this)} style={styles.snapButton} underlayColor={'#FF5A5F'}>
                <Icon name="circle" size={55} color="#FC9396" style={styles.snapIcon} />
              </TouchableHighlight>
            <TouchableHighlight onPress={this.props._goToMap.bind(this)} style={styles.mapButton}>
              <IconIon name="map" size={40} color="#ededed" />
            </TouchableHighlight>
          </View>

        </Camera>
      </View>
    );
  }
}

var styles = StyleSheet.create({
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
  topButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor:'transparent',
    alignItems:'flex-start',
    justifyContent: 'center',
  },
  switchButton: {
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ededed',
    marginLeft: 110,
    marginTop: 30
  },
  switchIcon: {
    width: 25,
    height: 25
  },
  flashToggleButton: {
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ededed',
    marginRight: 110,
    marginTop: 30,
    paddingLeft: 7
  },
  flashToggleIcon: {
    width: 25,
    height: 38,
    backgroundColor: 'transparent'
  },
  bottomButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor:'transparent',
    alignItems:'flex-end',
    justifyContent: 'center',
  },
  snapButton: {
    width: 70,
    height: 70,
    backgroundColor: 'transparent',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: '#ededed',
    marginBottom: 15,
    paddingLeft: 5
  },
  snapIcon: {
    width: 52.5,
    height: 55,
    backgroundColor: 'transparent'
  },
  settingsButton: {
    marginRight: 100,
    marginBottom: 25,
  },
  mapButton: {
    marginLeft: 100,
    marginBottom: 25,
  }

});

module.exports = CameraView;