var React = require('react-native');
var _ = require('lodash');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView
} = React;

var {width, height} = Dimensions.get('window');

var IMAGE_URLS = _.flatten(_.times(10, () => {return ['https://trello-avatars.s3.amazonaws.com/bbbdc13fc56dfee5dcf47bfcd0c943d8/original.png', 'https://trello-avatars.s3.amazonaws.com/1556bc519bd314815e4c4a664e31be22/original.png', 'https://trello-avatars.s3.amazonaws.com/e1740bc7efd3c7117cf047c7be4d9b92/original.png']}));
var IMAGES_PER_ROW = 3

class ReactNativeLayouts extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      currentScreenWidth: width,
      currentScreenHeight: height
    };
  }

  handleRotation(event) {
    var layout = event.nativeEvent.layout;
    this.setState({currentScreenWidth: layout.width, currentScreenHeight: layout.height })
  }

  calculatedSize() {
    var size = this.state.currentScreenWidth / IMAGES_PER_ROW;
    return {width: size, height: size};
  }

  renderRow(images) {
    return images.map((uri) => {
      return (
        <Image style={[styles.image, this.calculatedSize()]} source={{uri: uri}} />
      )
    })
  }

  renderImagesInGroupsOf(count) {
     return _.chunk(IMAGE_URLS, IMAGES_PER_ROW).map((imagesForRow) => {
       return (
         <View style={styles.row}>
           {this.renderRow(imagesForRow)}
         </View>
       )
     })
   }

   render() {
     return (
       <ScrollView onLayout={this.handleRotation.bind(this)} contentContainerStyle={styles.scrollView}>
         {this.renderRow(IMAGE_URLS)}
       </ScrollView>
     );
   }
 };

 var styles = StyleSheet.create({

   scrollView: {
     flexDirection: 'row',
     flexWrap: 'wrap'
   },
   row: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'flex-start'
   },

   image: {
     borderWidth: 1,
     borderColor: '#fff'
   }
 });
 
 module.exports = ReactNativeLayouts;