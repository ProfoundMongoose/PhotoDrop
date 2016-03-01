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

class RedPhotoMarker extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.bubble}>
            <TouchableOpacity style={styles.icon}>
              <IconIon name="camera" size={25} color="#ededed"/>
            </TouchableOpacity>
          </View>
          <View style={styles.arrowBorder} />
          <View style={styles.arrow} />
        </View>
    );
  }
}

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
    borderRadius: 30,
    borderColor: '#D23F44',
  },
  icon: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 5,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 15,
    borderColor: 'transparent',
    borderTopColor: '#FF5A5F',
    alignSelf: 'center',
    marginTop: -14.5
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

module.exports = RedPhotoMarker;