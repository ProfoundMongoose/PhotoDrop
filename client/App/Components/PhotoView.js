var React = require('react-native');

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
    console.log('props.uri:', this.props.route.uri)
  }

  render() {
    return (
      <View style={styles.imageContainer}>
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
