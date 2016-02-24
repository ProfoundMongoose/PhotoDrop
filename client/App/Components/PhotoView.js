var React = require('react-native');
var NavigationBar = require('react-native-navbar');

var {
  View,
  StyleSheet,
  Image,
  ScrollView
} = React;

class PhotoView extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    var uri = this.props.uri || this.props.route.uri;
    return (
      <View style={styles.imageContainer}>
        <NavigationBar title={{title: 'Swipe Down to Dismiss', tintColor: 'white'}} tintColor={"#FF5A5F"} statusBar={{style: 'light-content', hidden: false}}/>
        <Image style={styles.image} source={{uri: uri}} />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    alignItems: 'stretch'
  },
  image: {
    flex: 1
  }
});

module.exports = PhotoView;
