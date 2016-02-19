var React = require('react-native');
var api = require('../Utils/api');
var Main = require('./Main');
var Camera = require('./Camera');
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
  }
});

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmedPassword: '',
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

  handleConfirmedPasswordChange (event) {
    this.setState({
      confirmedPassword: event.nativeEvent.text
    });
  }

  handleSubmit(){
    // update our indicator spinner
    // fetch data from server
    // reroute to the next page passing user info
    this.setState({
      isLoading: true
    });

    api.login(this.state.username, this.state.password)
      .then((res) => {
          this.props.navigator.push({
            title: res.name || 'Select an Option',
            component: Main,
            passProps: {userInfo: res}
          });
          this.setState({
            isLoading: false,
            error: false,
            username: ''
          });
        }).catch((err) => {
           this.setState({
             error: 'User not found' + err,
             isLoading: false
           });
        })
    }

  handleRedirect() {
    this.props.navigator.pop();
    this.setState({
      isLoading: false,
      error: false,
      username: ''
    });
  }


  render() {
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
        <Text style={styles.fieldTitle}> Confirm Password </Text>
        <TextInput
          style={styles.searchInput}
          value={this.state.confirmedPassword}
          onChange={this.handleConfirmedPasswordChange.bind(this)} />
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit.bind(this)}
          underlayColor='white'>
          <Text style={styles.buttonText}> Sign in </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.handleRedirect.bind(this)}
          underlayColor='#34495e'>
          <Text style={styles.signup}> Dont have an account? Sign in!  </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

module.exports = Signup;
