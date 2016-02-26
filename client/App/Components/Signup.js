var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var api = require('../Utils/api');
var Login = require('./Login');
var Keychain = require('react-native-keychain');
var Main = require('./Main');

var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS
} = React;

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmedPassword: '',
      isLoading: false,
      error: false,
      passwordError: false
    };
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

  handleConfirmedPasswordChange(event) {
    this.setState({
      confirmedPassword: event.nativeEvent.text
    });
  }

  handleSubmit() {
    if (this.state.password === this.state.confirmedPassword) {
      this.setState({
        isLoading: true,
        passwordError: false
      });

      api.signup(this.state.username, this.state.password)
        .then((res) => {
          this.setState({
            passwordError: false
          });
          if (res.status === 500) {
            this.setState({
              error: 'User already exists',
              isLoading: false
            });
          } else {
            // load the JSON Web token into the keychain (keychain is the storage loction given to us by ios)
            console.log('on client JWT', JSON.parse(res._bodyText))
            Keychain
              .setGenericPassword(null, JSON.parse(res._bodyText).token)
              .then(function() {
                console.log('Credentials saved successfully!');
              });

            this.setState({
              isLoading: false,
              error: false,
              username: '',
              password: ''
            });
            this.props.navigator.push({
              component: Main,
              userId: JSON.parse(res._bodyText).userId
            });
          }
        }).catch((err) => {
          this.setState({
            error: 'User already exists' + err,
            isLoading: false
          });
        });
    } else {
       this.setState({
          error: false,
          passwordError: 'Passwords dont match',
          isLoading: false
        });
    }
  }


  handleRedirect() {
    this.props.navigator.pop();
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
    var showPasswordErr = (
      this.state.passwordError ? <Text style={styles.err}> {this.state.passwordError} </Text> : <View></View>
      );
    return (

      <View style={{flex: 1, backgroundColor: '#ededed'}}>
        <NavigationBar title={{title: 'PROFOUND MONGOOSE', tintColor: '#565b5c'}} tintColor={"white"} statusBar={{hidden: false}}/>
        <View style={styles.mainContainer}>
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
            }} />
          <Text style={styles.fieldTitle}> Password </Text>
          <TextInput
            ref='SecondInput'
            autoCapitalize={'none'}
            autoCorrect={false}
            maxLength={16}
            secureTextEntry={true}
            style={styles.userInput}
            value={this.state.password}
            returnKeyType={'next'}
            onChange={this.handlePasswordChange.bind(this)}
            onSubmitEditing={(event) => {
              this.refs.ThirdInput.focus();
            }} />
          <Text style={styles.fieldTitle}> Confirm Password </Text>
          <TextInput
            ref='ThirdInput'
            autoCapitalize={'none'}
            autoCorrect={false}
            maxLength={16}
            secureTextEntry={true}
            style={styles.userInput}
            value={this.state.confirmedPassword}
            returnKeyType={'go'}
            onSubmitEditing={this.handleSubmit.bind(this)}
            onChange={this.handleConfirmedPasswordChange.bind(this)} />
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor='#FC9396'>
            <Text style={styles.buttonText}> Sign Up </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.handleRedirect.bind(this)}
            underlayColor='#ededed'>
            <Text style={styles.signup}> Already have an account? Sign in!  </Text>
          </TouchableHighlight>
          <ActivityIndicatorIOS
            animating= {this.state.isLoading}
            size='large'
            style={styles.loading}
            />

          {showErr}
          {showPasswordErr}
        </View>

      </View>

    )
  }
}
var styles = StyleSheet.create({
  mainContainer: {
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
    borderColor: '#FF5A5F',
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
    textDecorationLine: 'underline',
    color: '#616161'
  },
  loading: {
    marginTop: 20
  },
  err: {
    fontSize: 14,
    fontFamily: 'circular',
    textAlign: 'center',
    color: '#616161'
  }
});

module.exports = Signup;
