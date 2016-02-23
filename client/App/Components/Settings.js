var React = require('react-native');
var NavigationBar = require('react-native-navbar');

var Login = require('./Login');
var PhotosView = require('./PhotosView');

var {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image
} = React;


class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'Settings';
  }

  openPhotos() {
    this.props.navigator.push({
      component: PhotosView
    });
  }

  openLeaderboard(){
    this.props.navigator.push({
      component: Leaderboard
    })
  }

  logout() {
    this.props.navigator.push({
      component: Login
    });
  }

  render() {
    return (
      <View style={{ flex: 1}}> 
        <NavigationBar title={{title: 'Settings', tintColor: 'white'}} tintColor={"#FF5A5F"}/>

        <View style={styles.mainContainer}>
          <Image source={require('image!mongoose')} style={styles.image}/>
          <TouchableHighlight
            style={styles.button}
            underlayColor={'#FC9396'}
            onPress={this.openPhotos.bind(this)}>
            <Text style={styles.buttonText}> PhotoView </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor={'#FC9396'}
            onPress={this.logout.bind(this)}>
            <Text style={styles.buttonText}> Logout </Text>
          </TouchableHighlight>
        </View>

      </View>
      );
  }
}
var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: '#FF5A5F',
    borderColor: '#FF5A5F',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 25,
    alignSelf: 'stretch',
    justifyContent: 'center'  
  },
  mainContainer: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    marginTop: 5,
    marginBottom: 25,
    fontSize: 25,
    textAlign: 'center',
  },
  image: {
    width: 348,
    height: 151
  }
});

module.exports = Settings;
