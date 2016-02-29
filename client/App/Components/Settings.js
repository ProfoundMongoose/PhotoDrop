var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var Keychain = require('react-native-keychain');
var Login = require('./Login');
var PhotosView = require('./PhotosView');
var ChangeView = require('./ChangeView');

var {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  ActionSheetIOS,
} = React;

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'Settings';
  }

  openFavorites() {
    this.props.navigator.push({
      component: PhotosView,
      userId: this.props.userId,
      favorites: true,
      previousComponent: 'settings'
    });
  }

  openMyPhotos() {
    this.props.navigator.push({
      component: PhotosView,
      userId: this.props.userId,
      previousComponent: 'settings'
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

  showActionSheet() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Logout', 'Cancel'],
      cancelButtonIndex: 1,
      tintColor: '#565b5c'
    },
    (buttonIndex) => {
      if(buttonIndex===0) {this.logout();}
    });
  }

  changeInfo() {
    this.props.navigator.push({
      component: ChangeView,
      username: this.props.username
    })
  }

  render() {
    var pageTitle = (
      <Text style={styles.pageTitle}>Settings</Text>
    )
    return (
      <View style={{ flex: 1, backgroundColor: '#ededed'}}>
        <NavigationBar 
          title={pageTitle} 
          tintColor={"white"}/>
        <View style={styles.imageContainer}>
          <Image source={require('./../../images/logoresized.png')} style={styles.image}/>
        </View>
        <View style={styles.mainContainer}>
          <TouchableHighlight
            style={styles.button}
            underlayColor={'#e66365'}
            onPress={this.openFavorites.bind(this)}>
            <Text style={styles.buttonText}>Your Favorites</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor={'#e66365'}
            onPress={this.openMyPhotos.bind(this)}>
            <Text style={styles.buttonText}>Your Photos</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor={'#e66365'}
            onPress={this.changeInfo.bind(this)}>
            <Text style={styles.buttonText}>Change Username/Password</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor={'#e66365'}
            onPress={this.showActionSheet.bind(this)}>
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
    marginBottom: 20,
    marginTop: 0,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  imageContainer: {
    flex: 1,
    paddingRight: 30,
    paddingLeft: 30,
    paddingTop: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    paddingRight: 30,
    paddingLeft: 30,
    flexDirection: 'column',
    justifyContent: 'flex-start',
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
    height: 228,
  },
  pageTitle: {
    fontSize: 18,
    fontFamily: 'circular',
    textAlign: 'center',
    color: '#565b5c'
  }
});

module.exports = Settings;
