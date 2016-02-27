var React = require('react-native');
var MapView = require('react-native-maps');
var IconIon = require('react-native-vector-icons/Ionicons');
var PhotosView = require('./PhotosView');

var {
  Navigator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} = React;

class BlackPhotoMarker extends React.Component{
  constructor(props){
    super(props);
  }

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.bubble}>
            <TouchableOpacity style={styles.icon}>
              <IconIon name="camera" size={33} color="#ededed"/>
            </TouchableOpacity>
          </View>
          <View style={styles.arrowBorder} />
          <View style={styles.arrow} />
        </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start'
  },
  bubble: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#FF5A5F',
    borderRadius: 5,
    borderColor: '#D23F44',
  },
  icon: {
    marginLeft: 6,
    marginRight: 6
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 12,
    borderColor: 'transparent',
    borderTopColor: '#FF5A5F',
    alignSelf: 'center',
    marginTop: -9
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#D23F44',
    alignSelf: 'center',
    marginTop: -0.5
  }
});

module.exports = BlackPhotoMarker;