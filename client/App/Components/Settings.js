var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var Keychain = require('react-native-keychain');
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

  logout() {
    Keychain
      .resetGenericPassword()
      .then(function() {
        console.log('Credentials successfully deleted');
      });
    this.props.navigator.popToTop();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ededed'}}>
        <NavigationBar title={{title: 'Settings', tintColor: '#565b5c'}} tintColor={"white"}/>

        <View style={styles.mainContainer}>
          <Image source={require('./../../images/Logo.png')} style={styles.image}/>
          <TouchableHighlight
            style={styles.button}
            underlayColor={'#FC9396'}
            onPress={this.openPhotos.bind(this)}>
            <Text style={styles.buttonText}> PhotosView </Text>
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
    fontFamily: 'circular',
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: '#FF5A5F',
    borderColor: '#FF5A5F',
    borderWidth: 1,
    borderRadius: 4,
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
    alignItems: 'center',
  },
  title: {
    marginTop: 5,
    marginBottom: 25,
    fontSize: 25,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
  }
});

module.exports = Settings;
