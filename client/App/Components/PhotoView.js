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
    console.log('render PhotoView')
    console.log('props.uri:', this.props.route.uri);
    console.log('photos', this.props.route.photos);
  }

  render() {
    return (
      <View style={styles.imageContainer}>
        <NavigationBar title={{title: 'Swipe Down to Dismiss', tintColor: 'white'}} tintColor={"#FF5A5F"} statusBar={{style: 'light-content', hidden: false}}/>
        <Image style={styles.image} source={{uri: this.props.route.uri}} />
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
