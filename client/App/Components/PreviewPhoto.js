var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var api = require('../Utils/api');
var IconIon = require('react-native-vector-icons/Ionicons');

var {
  View,
  StyleSheet,
  Image,
  Text,
  Modal,
  SwitchIOS,
  TouchableHighlight
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

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _sendImage() {
    api.uploadPhoto(this.props.route.image64, this.props.route.latitude, this.props.route.longitude, this.props.route.userId);
    this._setModalVisible(true);
  }

  _closeModal() {
    this._setModalVisible(false);
    this.props.navigator.pop();
  }

  _cancelImage() {
    this.props.navigator.pop();
  }

  _onHighlight() {
    this.setState({active: true, colorStyle: '#fff'});
  }

  _onUnhighlight() {
    this.setState({active: false, colorStyle: '#000'});
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
              <Text>Your photo has been uploaded!</Text>
              <TouchableHighlight
                onHideUnderlay={this._onUnhighlight.bind(this)}
                onPress={this._closeModal.bind(this)}
                onShowUnderlay={this._onHighlight.bind(this)}
                style={[styles.button, styles.modalButton]}
                underlayColor="#a9d9d4">
                <Text style={[styles.buttonText, this.state.colorStyle]}>Close</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <NavigationBar title={{title: 'Share this image?', tintColor: 'white'}} tintColor={"#FF5A5F"} statusBar={{style: 'light-content', hidden: false}}/>
        <Image style={styles.image} source={{uri: 'data:image/bmp;base64,' + this.props.route.image64}}> 
          <View style={styles.buttonContainer}>
            <TouchableHighlight onPress={this._sendImage.bind(this)} style={styles.yesButton} underlayColor={'#00A5A0'}>
              <IconIon name="checkmark-round" size={65} color="#036C69" style={styles.yesIcon} />
            </TouchableHighlight>
            <TouchableHighlight onPress={this._cancelImage.bind(this)} style={styles.noButton} underlayColor={'#FF5A5F'}>
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
  button: {
    borderRadius: 5,
    flex: 1,
    height: 44,
    alignSelf: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 10,
  }
});

module.exports = PreviewPhoto;
