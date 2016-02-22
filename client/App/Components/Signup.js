var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var api = require('../Utils/api');
var Login = require('./Login');

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
              this.setState({
                isLoading: false,
                error: false,
                username: '',
                password: ''
              });
              this.props.navigator.pop();
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
      <View style={{flex: 1}}> 
        <NavigationBar title={{title: 'PROFOUND MONGOOSE', tintColor: 'white'}} tintColor={'black'} statusBar={{style: 'light-content', hidden:false}}/>


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
          <Text style={styles.fieldTitle}> Confirm Password </Text>
          <TextInput
            style={styles.searchInput}
            value={this.state.confirmedPassword}
            onChange={this.handleConfirmedPasswordChange.bind(this)} />
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor='white'>
            <Text style={styles.buttonText}> Sign Up </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.handleRedirect.bind(this)}
            underlayColor='#34495e'>
            <Text style={styles.signup}> Dont have an account? Sign in!  </Text>
          </TouchableHighlight>
          <ActivityIndicatorIOS
            animating= {this.state.isLoading}
            color='#111'
            size='large' />
          
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


module.exports = Signup;
