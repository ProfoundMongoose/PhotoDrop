var React = require('react-native');
var {
  Navigator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} = React;

class CircleMarker extends React.Component{
  constructor(props){
    super(props);
  }

  onMarkerPressed() {
    this.props.navigator.push({
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
      component: PhotosView
    });
  }

  render() {
    return (
      <View style={styles.circleContainer}>
        <View style={styles.circle}>
        </View>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 215,
    height: 215,
    backgroundColor: 'rgba(143, 227, 213, 0.5)',
    borderRadius: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#13878f',
  }
});

module.exports = CircleMarker;