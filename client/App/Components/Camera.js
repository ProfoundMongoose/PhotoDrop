var React = require('react-native');
var Camera = require('react-native-camera').default;
var Icon = require('react-native-vector-icons/FontAwesome');
var IconIon = require('react-native-vector-icons/Ionicons');

var api = require('../Utils/api');
var PreviewPhoto = require('./PreviewPhoto')

var {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeModules,
  StatusBarIOS
} = React;

class CameraView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cameraType: Camera.constants.Type.back,
      cameraFlashToggle: Camera.constants.FlashMode.off,
      handleFocusChanged: () => {}
      }
    }

  takePicture() {
    this.camera.capture()
      .then((data) => {
        NativeModules.ReadImageData.readImage(data, (image) => {
          this.props.navigator.push({
            component: PreviewPhoto,
            image64: image,
            latitude: this.props.latitude,
            longitude: this.props.longitude
          })
        })
      })
      .catch(err => console.error('ERROR', err));
  }

  switchCamera() {
    if(this.state.cameraType===Camera.constants.Type.back) {
      this.setState({cameraType:Camera.constants.Type.front});
      console.log('back to front');
    } else if(this.state.cameraType=Camera.constants.Type.front) {
      this.setState({cameraType:Camera.constants.Type.back});
      console.log('front to back');
    }
  }

  flashEnabled(){
    if(this.state.cameraFlashToggle===Camera.constants.FlashMode.on) {
      this.setState({cameraFlashToggle: Camera.constants.FlashMode.off});
      console.log('flash off!');
    } else if(this.state.cameraFlashToggle===Camera.constants.FlashMode.off) {
      this.setState({cameraFlashToggle: Camera.constants.FlashMode.on});
       console.log('flash on!');
    }
  }

  render() {
    StatusBarIOS.setHidden(true);
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

          <View style={styles.buttonContainer}>
            <TouchableHighlight onPress={this.switchCamera.bind(this)} style={styles.switchButton}>
              <Icon name="circle-o-notch" size={15} color="#ffffff" style={styles.switchIcon} />
            </TouchableHighlight>
            <TouchableHighlight onPress={this.flashEnabled.bind(this)} style={styles.flashToggleButton}>
              {this.state.cameraFlashToggle===Camera.constants.FlashMode.on ?  <IconIon name="ios-bolt" size={22} color="#ffffff" style={styles.flashToggleIcon} /> :  <IconIon name="ios-bolt-outline" size={22} color="#ffffff" style={styles.flashToggleIcon} />}
            </TouchableHighlight>
          </View>

          <View>
            <TouchableHighlight onPress={this.takePicture.bind(this)} style={styles.snapButton}>
              <Icon name="circle" size={55} color="white" style={styles.snapIcon} />
            </TouchableHighlight>
          </View>
            

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
  },
  buttonContainer:{
    flex:1,
    marginTop:20,
    width:150,
    height:150,
    marginLeft:280
  },
  snapButton:{
    width:70,
    height:70,
    backgroundColor:'transparent',
    borderRadius:50,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: 'white',
    marginBottom: 15,
    paddingLeft:5
  },
  snapIcon:{
    width:52.5,
    height:55,
    backgroundColor:'transparent'
  },
  switchButton:{
    width:30,
    height:30,
    backgroundColor:'transparent',
    borderRadius:15,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    marginLeft: 70,
    marginTop: 10
  },
  switchIcon:{
    width:15,
    height:15
  },
  flashToggleButton:{
    width:30,
    height:30,
    backgroundColor:'transparent',
    borderRadius:15,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    marginLeft: -230,
    marginTop: -30,
    paddingLeft:7
  },
  flashToggleIcon:{
    width:18,
    height:23,
    backgroundColor:'transparent'
  }
});

module.exports = CameraView;
