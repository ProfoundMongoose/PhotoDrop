var React = require('react-native');
var api = require('../Utils/api');
var Dashboard = require('./Dashboard');
var Camera = require('./Camera');
var Signup = require('./Signup');
var Settings = require('./Settings');
var MapView = require('./MapView');
var PhotosView = require('./PhotosView');
var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS
} = React;

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 30,
    marginTop: 65,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#34495e'
  },
  title: {
    marginTop: 10,
    marginBottom: 25,
    fontSize: 35,
    textAlign: 'center',
    color: '#e74c3c'
  },
  fieldTitle: {
    marginTop: 10,
    marginBottom: 15,
    fontSize: 25,
    textAlign: 'center',
    color: '#fff'
  },
  searchInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    color: 'white'
  },
  buttonText: {
    fontStyle: 'italic',
    fontSize: 20,
    color: '#000',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 30,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  signup: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  err: {
    textAlign: 'center'
  }
});

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isLoading: false,
      error: false
    };
  }

  handleUsernameChange (event) {
    this.setState({
      username: event.nativeEvent.text
    });
  }

  handlePasswordChange (event) {
    this.setState({
      password: event.nativeEvent.text
    });
  }

  handleSubmit(){ 
    this.setState({
      isLoading: true
    });

    api.login(this.state.username, this.state.password)
      .then((res) => {
        if(res.status === 500){
          this.setState({
             error: 'User not found',
             isLoading: false
           });
        } else {
          this.props.navigator.push({
            title: res.name || 'Select an Option',
            component: Dashboard,
            passProps: {userInfo: res}
          });
          this.setState({
            isLoading: false,
            error: false,
            username: '',
            password: ''
          });
          }
        }).catch((err) => {
           this.setState({
             error: 'User not found' + err,
             isLoading: false
           });
        });
    }

  gotoSettings() {
    this.props.navigator.push({
      component: Settings
    });
    this.setState({
      isLoading: false,
      error: false,
      username: ''
    });
  }

  handleRedirect() {
    this.props.navigator.push({
      component: Signup
    });
    this.setState({
      isLoading: false,
      error: false,
      username: ''
    });
  }

  openCamera() {
    this.props.navigator.push({
      component: Camera
    });
    this.setState({
      isLoading: false,
      error: false,
      username: ''
    });
  }

  openMaps() {
    this.props.navigator.push({
      component: MapView
    });
    this.setState({
      isLoading: false,
      error: false,
      username: ''
    });
  }

  openPhotos() {
    this.props.navigator.push({
      component: PhotosView
    });
    this.setState({
      isLoading: false,
      error: false,
      username: ''
    });
  }

  render() {
    var showErr = (
      this.state.error ? <Text style={styles.err}> {this.state.error} </Text> : <View></View>
      );
    return (
      <View style={styles.mainContainer}>
      <Text style={styles.title}> Profound Mongoose </Text>
        <Text style={styles.fieldTitle}> Username </Text>
        <TextInput
          style={styles.searchInput}
          value={this.state.username}
          onChange={this.handleUsernameChange.bind(this)} />
        <Text style={styles.fieldTitle}> Password </Text>
        <TextInput
          style={styles.searchInput}
          value={this.state.password}
          onChange={this.handlePasswordChange.bind(this)} />
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit.bind(this)}
          underlayColor='white'>
          <Text style={styles.buttonText}> Sign in </Text>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={this.handleRedirect.bind(this)}
          underlayColor='#34495e'>
          <Text style={styles.signup}> Dont have an account? Sign Up!  </Text>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={this.gotoSettings.bind(this)}
          underlayColor='#34495e'>
          <Text style={styles.signup}> gotoSettings  </Text>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={this.openCamera.bind(this)}
          underlayColor='#34495e'>
          <Text style={styles.signup}> Link to Camera (will implement Auth Later)  </Text>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={this.openMaps.bind(this)}
          underlayColor='#34495e'>
          <Text style={styles.signup}> Link to MapView </Text>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={this.openPhotos.bind(this)}
          underlayColor='#34495e'>
          <Text style={styles.signup}> Link to PhotosView </Text>
        </TouchableHighlight>

        <ActivityIndicatorIOS
          animating= {this.state.isLoading}
          color='#111'
          size='large' />
        
        {showErr}

      </View>
    )
  }
}

module.exports = Main;
