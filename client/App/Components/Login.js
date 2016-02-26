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
          userId: userData.userId
        });
      })
    }).catch((err) => {
      // Keychain not found. User must login
    });
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
             error: 'Username or password is incorrect',
             isLoading: false
           });
        } else {
          console.log('positive signin')
          console.log(res._bodyText)
          // load the JSON Web token into the keychain (keychain is the storage loction given to us by ios)
          var bodyText = JSON.parse(res._bodyText);
          Keychain.setGenericPassword(null, bodyText.token)
          console.log('Credentials saved successfully!', bodyText.userId, bodyText.token);
          this.props.navigator.push({
            component: Main,
            userId: bodyText.userId
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
      component: Signup
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
    return (
      <View style={{flex: 1}}>
        <NavigationBar title={{title: 'PROFOUND MONGOOSE', tintColor: 'white'}} tintColor={"#FF5A5F"} statusBar={{style: 'light-content', hidden: false}}/>
        <View style={styles.loginContainer}>
          <Text style={styles.fieldTitle}> Username </Text>
          <TextInput
            autoCapitalize={'none'}
            autoCorrect={false}
            maxLength={16}
            style={styles.userInput}
            value={this.state.username}
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
            onChange={this.handlePasswordChange.bind(this)} />
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor='#FC9396'>
            <Text style={styles.buttonText}> Sign In </Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={this.handleRedirect.bind(this)}
            underlayColor='white'>
            <Text style={styles.signup}> Dont have an account? Sign Up!  </Text>
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
    backgroundColor: 'white'
  },
  title: {
    marginTop: 10,
    marginBottom: 25,
    fontSize: 18,
    textAlign: 'center',
  },
  fieldTitle: {
    marginTop: 10,
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
    color: 'black'
  },
  userInput: {
    height: 50,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    color: 'black'
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
  loading: {
    marginTop: 20
  },
  err: {
    textAlign: 'center'
  }
});

module.exports = Login;
