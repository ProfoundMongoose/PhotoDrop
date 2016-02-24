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
        <NavigationBar title={{title: 'PROFOUND MONGOOSE', tintColor: 'white'}} tintColor={"#FF5A5F"} statusBar={{style: 'light-content', hidden:false}}/>


        <View style={styles.mainContainer}>
          <Text style={styles.fieldTitle}> Username </Text>
          <TextInput
            autoCapitalize={'none'}
            autoCorrect={false}
            maxLength={16}
            style={styles.searchInput}
            value={this.state.username}
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
            style={styles.searchInput}
            value={this.state.password}
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
            style={styles.searchInput}
            value={this.state.confirmedPassword}
            onChange={this.handleConfirmedPasswordChange.bind(this)} />
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor='#FC9396'>
            <Text style={styles.buttonText}> Sign Up </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.handleRedirect.bind(this)}
            underlayColor='white'>
            <Text style={styles.signup}> Dont have an account? Sign in!  </Text>
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
    backgroundColor: 'white'
  },
  fieldTitle: {
    marginTop: 10,
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
  },
  searchInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    color: 'black'
  },
  buttonText: {
    fontSize: 20,
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


module.exports = Signup;
