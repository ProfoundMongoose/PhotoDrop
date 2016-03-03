var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var IconIon = require('react-native-vector-icons/Ionicons');
var Keychain = require('react-native-keychain');
var api = require('../Utils/api');

var {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableHighlight,
  ActivityIndicatorIOS,
  StatusBarIOS
} = React;

class ChangeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.route.username,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      isLoading: false,
      error: false,
      passwordError: false
    };
  }

  componentWillUnmount() {
    StatusBarIOS.setHidden(false);
  }

  handleUsernameChange(event) {
    this.setState({
      username: event.nativeEvent.text
    });
  }

  handleCurrentPasswordChange(event) {
    this.setState({
      currentPassword: event.nativeEvent.text
    });
  }

  handleNewPasswordChange(event) {
    this.setState({
      newPassword: event.nativeEvent.text
    });
  }

  handleConfirmPasswordChange(event) {
    this.setState({
      confirmNewPassword: event.nativeEvent.text
    });
  }

  _backButton() {
    this.props.navigator.pop();
  }

  changeUsername() {
    this.setState({
      isLoading: true
    });
    api.changeUsername(this.props.route.username, this.state.username)
      .then((res) => {
        this.setState({
          isLoading: false,
          error: false
        });
        console.log('Username Changed');
        this.props.route.username = this.state.username;
        Keychain
          .resetGenericPassword()
          .then(function() {
            console.log('Credentials successfully deleted');
          });
        this.props.navigator.popToTop();
      }).catch((err) => {
        this.setState({
          error: 'Could not change username' + err,
          isLoading: false
        });
      });
  }

  changePassword() {
    if (this.state.newPassword === this.state.confirmNewPassword) {
      this.setState({
        isLoading: true,
        passwordError: false
      });

      api.changePassword(this.state.username, this.state.currentPassword, this.state.newPassword)
        .then((res) => {
          this.setState({
            passwordError: false
          });
          if (res.status === 500) {
            this.setState({
              error: 'User does not exists',
              isLoading: false
            });
          } else {

            this.setState({
              isLoading: false,
              error: false,
              username: '',
              password: '',
              newPassword: '',
              confirmNewPassword: ''
            });
            console.log('Password Changed');
            Keychain
              .resetGenericPassword()
              .then(function() {
                console.log('Credentials successfully deleted');
              });
            this.props.navigator.pop();
          }
        }).catch((err) => {
          this.setState({
            error: 'User does not exists' + err,
            isLoading: false
          });
        });
    } else {
       this.setState({
          error: false,
          passwordError: 'New passwords dont match',
          isLoading: false
        });
    }
  }

  render() {
    var showErr = (
      this.state.error ? <Text style={styles.err}> {this.state.error} </Text> : <View></View>
    );
    var showPasswordErr = (
      this.state.passwordError ? <Text style={styles.err}> {this.state.passwordError} </Text> : <View></View>
    );
    var pageTitle = (
      <Text style={styles.pageTitle}>PhotoDrop</Text>
    );
    var backButton = (
      <TouchableHighlight onPress={this._backButton.bind(this)} underlayColor={'white'}>
        <IconIon name='ios-arrow-thin-down' size={30} style={styles.backIcon} color="#FF5A5F"/>
      </TouchableHighlight>
    );

    return (
      <View style={{flex: 1, backgroundColor: '#ededed'}}> 
        <NavigationBar title={pageTitle} tintColor={"white"} statusBar={{hidden: false}} leftButton={backButton}/>
        <ScrollView contentContainerStyle={styles.changeContainer}>
          <Text style={styles.fieldTitle}> Username </Text>
          <TextInput
            autoCapitalize={'none'}
            autoCorrect={false}
            maxLength={16}
            style={styles.userInput}
            value={this.state.username}
            returnKeyType={'go'}
            onChange={this.handleUsernameChange.bind(this)}
            onSubmitEditing={this.changeUsername.bind(this)}
          />
          <TouchableHighlight
            style={styles.button}
            onPress={this.changeUsername.bind(this)}
            underlayColor='#e66365'>
            <Text style={styles.buttonText}> Change Username </Text>
          </TouchableHighlight>
          <Text style={styles.fieldTitle}> Current Password </Text>
          <TextInput
            ref='SecondInput'
            autoCapitalize={'none'}
            autoCorrect={false}
            maxLength={16}
            secureTextEntry={true}
            style={styles.userInput}
            value={this.state.currentPassword}
            returnKeyType={'next'}
            onChange={this.handleCurrentPasswordChange.bind(this)} 
            onSubmitEditing={(event) => { 
              this.refs.ThirdInput.focus(); 
            }}
          />
          <Text style={styles.fieldTitle}> New Password </Text>
          <TextInput
            ref='ThirdInput'
            autoCapitalize={'none'}
            autoCorrect={false}
            maxLength={16}
            secureTextEntry={true}
            style={styles.userInput}
            value={this.state.newPassword}
            returnKeyType={'next'}
            onChange={this.handleNewPasswordChange.bind(this)} 
            onSubmitEditing={(event) => { 
              this.refs.FourthInput.focus(); 
            }}
          />
          <Text style={styles.fieldTitle}> Confirm New Password </Text>
          <TextInput
            ref='FourthInput'
            autoCapitalize={'none'}
            autoCorrect={false}
            maxLength={16}
            secureTextEntry={true}
            style={styles.userInput}
            value={this.state.password}
            returnKeyType={'go'}
            onChange={this.handleConfirmPasswordChange.bind(this)} 
            onSubmitEditing={this.changePassword.bind(this)}
          />
          <TouchableHighlight
            style={styles.button}
            onPress={this.changePassword.bind(this)}
            underlayColor='#e66365'>
            <Text style={styles.buttonText}> Change Password </Text>
          </TouchableHighlight>

            <ActivityIndicatorIOS
              animating= {this.state.isLoading}
              size='large' 
              style={styles.loading} />
            
            {showErr}
            {showPasswordErr}
          </ScrollView>
        </View>
      )
    }
}

var styles = StyleSheet.create({
  changeContainer: {
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
  },
  backIcon: {
    marginLeft: 15,
  }
});

module.exports = ChangeView;
