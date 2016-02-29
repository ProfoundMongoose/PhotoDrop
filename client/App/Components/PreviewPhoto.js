var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var api = require('../Utils/api');
var IconIon = require('react-native-vector-icons/Ionicons');

var {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  SwitchIOS,
  StatusBarIOS
} = React;

class PreviewPhoto extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      animated: true,
      modalVisible: false,
      transparent: true,
      innerContainerTransparentStyle: null,
      active: false,
      colorStyle: '#000' 
    };
  }

  _sendImage() {
    api.uploadPhoto(this.props.route.image64, this.props.route.latitude, this.props.route.longitude, this.props.route.userId, (res) => {
      this.setState({modalVisible: true});
      setTimeout(()=> {
        this._closeModal();
      }, 1300);
    })
  }

  _closeModal() {
    this.setState({modalVisible: false});
    this.props.navigator.pop();
  }
  

  _cancelImage() {
    this.props.navigator.pop();
  }

  render() {
    // because we are sending the captured image in as a string we have to tell react-native how it is encoded
    return (
      <View style={styles.imageContainer}>
        <Modal
          animated={this.state.animated}
          transparent={this.state.transparent}
          visible={this.state.modalVisible}>
          <View style={[styles.container]}>
            <View style={[styles.innerContainer, this.state.innerContainerTransparentStyle]}>
              <Text style={styles.modal}>Your photo has been uploaded!</Text>
              <IconIon name="ios-checkmark-empty" size={90} color="#036C69" style={styles.yesIcon} />
            </View>
          </View>
        </Modal>
        <NavigationBar title={{title: 'Share this image?', tintColor: '#565b5c'}} tintColor={"white"} statusBar={{hidden: true}}/>
        <Image style={styles.image} source={{uri: 'data:image/bmp;base64,' + this.props.route.image64}}>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this._cancelImage.bind(this)} style={styles.noButton}>
              <IconIon name="ios-close-empty" size={60} color="#FC9396" style={styles.noIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this._sendImage.bind(this)} style={styles.yesButton}>
              <IconIon name="ios-checkmark-empty" size={60} color="#036C69" style={styles.yesIcon} />
            </TouchableOpacity>
          </View>

        </Image>
      </View>
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
    backgroundColor:'transparent',
    alignItems:'flex-end',
    justifyContent: 'center',
  },
  yesButton:{
    width:50,
    height:50,
    backgroundColor:'transparent',
    borderRadius:35,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    margin: 15,
  },
  yesIcon:{
    width:60,
    height:60,
    marginLeft: 37
  },
  noButton:{
    width:50,
    height:50,
    backgroundColor:'transparent',
    borderRadius:35,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    margin: 15,
  },
  noIcon:{
    width:60,
    height:60,
    marginLeft: 37
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5fcff',
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
  },
  modal: {
    fontSize: 20,
    fontFamily: 'Circular',
    justifyContent: 'center',
  }
});

module.exports = PreviewPhoto;
