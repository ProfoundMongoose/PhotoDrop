var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var IconIon = require('react-native-vector-icons/Ionicons');

var {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableHighlight
} = React;

class PhotoView extends React.Component{
  constructor(props) {
    super(props);
  }

  _closeImage() {
    this.props.navigator.pop();
  }

  render() {
    var uri = this.props.uri || this.props.route.uri;
    return (
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{uri: uri}}>

        <View style={styles.buttonContainer}>
          <TouchableHighlight onPress={this._closeImage.bind(this)} style={styles.closeButton} underlayColor={'#FF5A5F'}>
            <IconIon name="close-round" size={38} color="#FC9396" style={styles.closeIcon} />
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
  closeButton:{
    width:65,
    height:65,
    backgroundColor:'transparent',
    borderRadius:35,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: 'white',
    margin: 15,
  },
  closeIcon:{
    width:35,
    height:35
  },
});

module.exports = PhotoView;
