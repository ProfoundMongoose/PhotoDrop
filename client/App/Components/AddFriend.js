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
  StatusBarIOS,
  ListView,
  Image,
} = React;

class AddFriend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.route.username,
      foundFriendsData: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  }

  componentWillUnmount() {
    StatusBarIOS.setHidden(false);
  }

  _backButton() {
    this.props.navigator.pop();
  }

  findUsernameChange(event) {
    this.setState({
      usernameToFind: event.nativeEvent.text
    });
  }

  updateFoundFriends(event) {
    if (event.nativeEvent.text) {
      api.searchUsers(event.nativeEvent.text, (users) => { // users array will look like [????]
        var usersArr = JSON.parse(users);
        var userNames = usersArr.map((userObj) => {
          return userObj.username;
        });
        this.setState({
          foundFriendsData: this.state.foundFriendsData.cloneWithRows(userNames),
          loaded: true
        });
      });
    } else {
      this.setState({
        foundFriendsData: this.state.foundFriendsData.cloneWithRows([]),
        loaded: true,
      });
    }
  }

  consoLog() {
    console.log('something!');
  }

  renderFriend(friend) {
    console.log(friend);
    return (
      <View style={styles.container}>

        <View style={styles.rightContainer}>
          <Text style={styles.friend}>{friend}</Text>
        </View>
      </View>
    );
  }

  render() {
    var showErr = (
      this.state.error ? <Text style={styles.err}> {this.state.error} </Text> : <View></View>
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
          <Text style={styles.fieldTitle}> Add Friend </Text>
          <TextInput
            autoCapitalize={'none'}
            autoCorrect={false}
            maxLength={16}
            style={styles.userInput}
            value={this.state.username}
            returnKeyType={'go'}
            onChange={this.updateFoundFriends.bind(this)}
            onSubmitEditing={this.consoLog} /* update foundFriendsData with a GET*/
          />
          <ListView
            dataSource={this.state.foundFriendsData}
            renderRow={this.renderFriend} /*write this*/
            style={styles.listView} /* write this */
          />
          <Text style={styles.fieldTitle}> A field with text </Text>

            <ActivityIndicatorIOS
              animating= {this.state.isLoading}
              size='large'
              style={styles.loading} />

            {showErr}
          </ScrollView>
        </View>
      );
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
  },
  friend: {
    fontSize: 12,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#ededed',
  },
});

module.exports = AddFriend;
