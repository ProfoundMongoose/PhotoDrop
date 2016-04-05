var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var api = require('../Utils/api');
var Main = require('./Main');
var Signup = require('./Signup');
var Keychain = require('react-native-keychain');

var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Navigator
} = React;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isLoading: false,
      error: false
    };

  // check for token match in keychain with server, if it is good.. go to camera view
  Keychain
    .getGenericPassword()
    .then((credentials) => {
      console.log('getting from Keychain: ', credentials)
      api.checkJWT(credentials.password, (userData) => {
        console.log('getting decoded keychain back from server:', userData)
        this.props.navigator.push({
          component: Main,
          userId: JSON.parse(userData).userId,
          username: JSON.parse(userData).username,
          sceneConfig: {
            ...Navigator.SceneConfigs.FloatFromBottom,
            gestures: {}
          }
        });
      })
    }).catch((err) => {
      // Keychain not found. User must login
    });
  }

  handleUsernameChange(event) {
    this.setState({
      username: event.nativeEvent.text
    });
  }

  handlePasswordChange(event) {
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
               error: 'Username or password is incorrect',
               isLoading: false
             });
          } else {
            // load the JSON Web token into the keychain (keychain is the storage loction given to us by ios)
            var bodyText = JSON.parse(res._bodyText);
            Keychain.setGenericPassword(null, bodyText.token)
            console.log('Credentials saved successfully!', bodyText.userId, bodyText.token);
            this.props.navigator.push({
              component: Main,
              userId: bodyText.userId,
              username: bodyText.username,
              sceneConfig: {
                ...Navigator.SceneConfigs.FloatFromBottom,
                gestures: {}
              }
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



  handleRedirect() {
    this.props.navigator.push({
      component: Signup,
      sceneConfig: Navigator.SceneConfigs.FloatFromRight
    });
    this.setState({
      isLoading: false,
      error: false,
      username: '',
      password: ''
    });
  }

  render() {
    var showErr = (
      this.state.error ? <Text style={styles.err}> {this.state.error} </Text> : <View></View>
    );
    var pageTitle = (
      <Text style={styles.pageTitle}>PhotoDrop</Text>
    );
    return (
      <View style={{flex: 1, backgroundColor: '#ededed'}}>
        <NavigationBar title={pageTitle} tintColor={"white"} statusBar={{hidden: false}}/>
        <View style={styles.loginContainer}>
          <Text style={styles.fieldTitle}> Username </Text>
          <TextInput
            autoCapitalize={'none'}
            autoCorrect={false}
            maxLength={16}
            style={styles.userInput}
            value={this.state.username}
            returnKeyType={'next'}
            onChange={this.handleUsernameChange.bind(this)}
            onSubmitEditing={(event) => {
              this.refs.SecondInput.focus();
            }}
             />
          <Text style={styles.fieldTitle}> Password </Text>
          <TextInput
            ref='SecondInput'
            autoCapitalize={'none'}
            autoCorrect={false}
            maxLength={16}
            secureTextEntry={true}
            style={styles.userInput}
            value={this.state.password}
            returnKeyType={'go'}
            onChange={this.handlePasswordChange.bind(this)}
            onSubmitEditing={this.handleSubmit.bind(this)}/>
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor='#e66365'>
            <Text style={styles.buttonText}> Sign In </Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={this.handleRedirect.bind(this)}
            underlayColor='#ededed'>
            <Text style={styles.signup}> {"Don't have an account yet? Sign Up!"}  </Text>
          </TouchableHighlight>

            <ActivityIndicatorIOS
              animating= {this.state.isLoading}
              size='large'
              style={styles.loading} />

            {showErr}
          </View>
        </View>
      )
    }
  }

var styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ededed'
  },
  fieldTitle: {
    marginTop: 10,
    marginBottom: 15,
    fontSize: 18,
    fontFamily: 'circular',
    textAlign: 'center',
    color: '#616161'
  },
  userInput: {
    height: 50,
    padding: 4,
    fontSize: 18,
    fontFamily: 'circular',
    borderWidth: 1,
    borderColor: '#616161',
    borderRadius: 4,
    color: '#616161'
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
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    marginTop: 30,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  signup: {
    marginTop: 20,
    fontSize: 14,
    fontFamily: 'circular',
    textAlign: 'center',
    color: '#FF5A5F'
  },
  loading: {
    marginTop: 20
  },
  err: {
    fontSize: 14,
    fontFamily: 'circular',
    textAlign: 'center',
    color: '#616161'
  },
  pageTitle: {
    fontSize: 18,
    fontFamily: 'circular',
    textAlign: 'center',
    color: '#565b5c'
  }
});

module.exports = Login;
