var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var IconIon = require('react-native-vector-icons/Ionicons');
var Keychain = require('react-native-keychain');
var _ = require('lodash');
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
      userId: this.props.route.userId,
      isLoading: false,
      foundFriendsData: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      pendingFriendRequests: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      friendsData: this.props.route.friendsData,
      unreqestableUsers: [],
    };
  }

  componentWillUnmount() {
    StatusBarIOS.setHidden(false);
  }

  _backButton() {
    this.props.navigator.pop();
  }

  componentDidMount() {
    this.getUnrequestableUsers();
    this.loadFriendRequests();
  }

  getUnrequestableUsers() {
  //   you, your friends, people in your pending friend request list
    var unreqestableUsers = [this.state.username].concat(this.state.friendsData);
    console.log('unrequestable users: ', unreqestableUsers);
    this.setState({
      unreqestableUsers: unreqestableUsers
    });
  }

  updateFoundFriends(event) {
    if (event.nativeEvent.text) {
      this.setState({isLoading: true});

      api.searchUsers(event.nativeEvent.text, (users) => {
        var usersArr = JSON.parse(users);
        var userNames = _.difference(usersArr.map((userObj) => {
          return userObj.username;
        }), this.state.unreqestableUsers);

        this.setState({
          foundFriendsData: this.state.foundFriendsData.cloneWithRows(userNames),
          isLoading: false
        });
      });
    } else {
      this.setState({
        foundFriendsData: this.state.foundFriendsData.cloneWithRows([]),
        isLoading: false
      });
    }
  }

  loadFriendRequests() {
    api.getFriendRequests(this.state.userId, (friendRequests) => {
      console.log('state username: ', this.state.username);
      var usernames = friendRequests.reduce((validRequests, user) => {
        if (user && user.username !== this.state.username) {
          validRequests.push(user);
        }
        return validRequests;
      }, []);
      console.log('friendRequests', friendRequests, friendRequests.length);
      this.setState({
        pendingFriendRequests: this.state.pendingFriendRequests.cloneWithRows(usernames),
        numFriendRequests: usernames.length
      });
    });
  }

  addFriend(friend, event) {
    api.addFriend(this.state.userId, friend);
  }

  // acceptFriendRequest(newFriendUsername, event) {
  acceptFriendRequest(newFriend, event) { // make sure this gets passed the right thing
  // api.acceptFriendRequest(this.state.userId, newFriendUsername);
    api.acceptFriendRequest(this.state.userId, newFriend.username, newFriend._id, () => {
      console.log('callback in accept friend Request got called');
      this.loadFriendRequests();
    });
  }

  renderFriend(friend) {
    return (
      <TouchableHighlight onPress={this.addFriend.bind(this, friend)}>
        <View style={styles.container}>
          <View style={styles.rightContainer}>
            <Text style={styles.potentialFriend}>{friend}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  renderFriendRequests(potentialFriend) {
    return (
      <TouchableHighlight onPress={this.acceptFriendRequest.bind(this, potentialFriend)}>
        <View style={styles.container}>
          <View style={styles.rightContainer}>
            <Text style={styles.potentialFriend}>{potentialFriend.username}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }



  render() {
    var showFriendRequests = (
      this.state.numFriendRequests && this.state.numFriendRequests ?
      <View style={styles.changeContainerTall}>
      <Text style={styles.fieldTitle}> Pending Friend Requests </Text>
      <ListView
        dataSource={this.state.pendingFriendRequests} // need to initialize
        renderRow={this.renderFriendRequests.bind(this)} // todo
        style={styles.listView}
        rightButton={addButton} // doesn't appear
      />
      </View>: <View></View>
    );
    var showErr = (
      this.state.error ? <Text style={styles.err}> {this.state.error} </Text> : <View></View>
    );
    var pageTitle = (
      <Text style={styles.pageTitle}>Friends</Text>
    );
    var backButton = (
      <TouchableHighlight onPress={this._backButton.bind(this)} underlayColor={'white'}>
        <IconIon name='ios-arrow-thin-down' size={30} style={styles.backIcon} color="#FF5A5F"/>
      </TouchableHighlight>
    );
    var addButton = (
      <TouchableHighlight onPress={this.addFriend.bind(this)} underlayColor={'white'}>
        <IconIon name='ios-plus-empty' size={30} style={styles.plusIcon} color="#FF5A5F"/>
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
            returnKeyType={'go'}
            onChange={this.updateFoundFriends.bind(this)}
            onSubmitEditing={this.consoLog}
          />
          <ListView
            dataSource={this.state.foundFriendsData}
            renderRow={this.renderFriend.bind(this)}
            style={styles.listView}
            rightButton={addButton} // doesn't appear
          />
          <ActivityIndicatorIOS
          animating= {this.state.isLoading}
          size='large'
          style={styles.loading} />

          {showFriendRequests}


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
  changeContainerTall: {
    flex: 2,
    padding: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ededed'
  },
  fieldTitle: {
    marginTop: 2,
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
  plusIcon: {
    marginRight: 15,
  },
  container: {
    marginBottom: 3,
    marginLeft: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#ff595b',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ff595b',
  },
  rightContainer: {
    flex: 1,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#ededed',
  },
  rightContainer: {
  },
  potentialFriend: {
    height: 50,
    padding: 13,
    fontSize: 18,
    fontFamily: 'circular',
    color: '#fff',
    alignSelf: 'center'
  }
});

module.exports = AddFriend;
