var React = require('react-native');
var NavigationBar = require('react-native-navbar');

var Login = require('./Login');
var PhotosView = require('./PhotosView');


var {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
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
    this.props.navigator.push({
      component: Login
    });
  }

  render() {
    return (
      <View style={styles.container}> 
        <NavigationBar title={{title: 'Settings'}}/>

        <View style={styles.mainContainer}>
          <TouchableHighlight
            style={styles.button}
            underlayColor='white'
            onPress={this.openPhotos.bind(this)}>
            <Text style={styles.buttonText}> PhotoView </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor='white'
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
    backgroundColor: '#ff9900',
    flex: 1
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 30,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  mainContainer: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#34495e'
  },
  title: {
    marginTop: 5,
    marginBottom: 25,
    fontSize: 25,
    textAlign: 'center',
    color: '#fff'
  }
});

module.exports = Settings;
