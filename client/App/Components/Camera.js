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
  StatusBar
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
    StatusBar.setHidden(true);
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
            <TouchableHighlight onPress={this.flashEnabled.bind(this)} style={styles.flashToggleButton} underlayColor={'#FC9396'}>
              {this.state.cameraFlashToggle===Camera.constants.FlashMode.on ?  <IconIon name="ios-bolt" size={40} color="#FF5A5F" style={styles.flashToggleIcon} /> :  <IconIon name="ios-bolt-outline" size={40} color="#FF5A5F" style={styles.flashToggleIcon} />}
            </TouchableHighlight>
            <TouchableHighlight onPress={this.switchCamera.bind(this)} style={styles.switchButton} underlayColor={'#FC9396'}>
              <Icon name="circle-o-notch" size={25} color="#FF5A5F" style={styles.switchIcon} />
            </TouchableHighlight>
          </View>


          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity onPress={this.props._goToSettings.bind(this)} style={styles.settingsButton}>
              <IconIon name="drag" size={40} color="#ededed"/>
            </TouchableOpacity>
              <TouchableHighlight onPress={this.takePicture.bind(this)} style={styles.snapButton} underlayColor={'#FC9396'}>
                <Icon name="circle" size={55} color="rgba(237,237,237,0.5)" style={styles.snapIcon} />
              </TouchableHighlight>
            <TouchableOpacity onPress={this.props._goToMap.bind(this)} style={styles.mapButton}>
              <IconIon name="map" size={40} color="#ededed" />
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  topButtonContainer: {
    flexDirection:'row',
    alignItems:'flex-start',
    marginTop: 30
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
    marginLeft: 120,
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
    paddingLeft: 7,
    marginRight: 120,
  },
  flashToggleIcon: {
    width: 25,
    height: 38,
    backgroundColor: 'transparent',
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    alignItems:'center',
    marginBottom: 15
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
    paddingLeft: 5
  },
  snapIcon: {
    width: 52.5,
    height: 55,
    backgroundColor: 'transparent'
  },
  settingsButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 100,
    marginTop: 10
  },
  mapButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 100,
    marginTop: 10
  }

});

module.exports = CameraView;