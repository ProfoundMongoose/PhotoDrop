var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var IconIon = require('react-native-vector-icons/Ionicons');
var Keychain = require('react-native-keychain');
var api = require('../Utils/api');
var AddFriend = require('./AddFriend');

var MOCKED_FRIENDS_DATA = [
  {name: 'Shane McGraw', profile: {thumbnail: 'http://iconbug.com/data/f8/256/fde579446855b2c35fcb817e46fbed9e.png'}},
  {name: 'Elliot Plant', profile: {thumbnail: 'http://iconbug.com/data/f8/256/fde579446855b2c35fcb817e46fbed9e.png'}},
  {name: 'Erick Paepke', profile: {thumbnail: 'http://iconbug.com/data/f8/256/fde579446855b2c35fcb817e46fbed9e.png'}},
  {name: 'Kyle Corbelli', profile: {thumbnail: 'http://iconbug.com/data/f8/256/fde579446855b2c35fcb817e46fbed9e.png'}},
  {name: 'Shane McGraw', profile: {thumbnail: 'http://iconbug.com/data/f8/256/fde579446855b2c35fcb817e46fbed9e.png'}},
  {name: 'Elliot Plant', profile: {thumbnail: 'http://iconbug.com/data/f8/256/fde579446855b2c35fcb817e46fbed9e.png'}},
  {name: 'Erick Paepke', profile: {thumbnail: 'http://iconbug.com/data/f8/256/fde579446855b2c35fcb817e46fbed9e.png'}},
  {name: 'Kyle Corbelli', profile: {thumbnail: 'http://iconbug.com/data/f8/256/fde579446855b2c35fcb817e46fbed9e.png'}},
  {name: 'Shane McGraw', profile: {thumbnail: 'http://iconbug.com/data/f8/256/fde579446855b2c35fcb817e46fbed9e.png'}},
  {name: 'Elliot Plant', profile: {thumbnail: 'http://iconbug.com/data/f8/256/fde579446855b2c35fcb817e46fbed9e.png'}},
  {name: 'Erick Paepke', profile: {thumbnail: 'http://iconbug.com/data/f8/256/fde579446855b2c35fcb817e46fbed9e.png'}},
  {name: 'Kyle Corbelli', profile: {thumbnail: 'http://iconbug.com/data/f8/256/fde579446855b2c35fcb817e46fbed9e.png'}},
  {name: 'Shane McGraw', profile: {thumbnail: 'http://iconbug.com/data/f8/256/fde579446855b2c35fcb817e46fbed9e.png'}},
  {name: 'Elliot Plant', profile: {thumbnail: 'http://iconbug.com/data/f8/256/fde579446855b2c35fcb817e46fbed9e.png'}},
  {name: 'Erick Paepke', profile: {thumbnail: 'http://iconbug.com/data/f8/256/fde579446855b2c35fcb817e46fbed9e.png'}},
  {name: 'Kyle Corbelli', profile: {thumbnail: 'http://iconbug.com/data/f8/256/fde579446855b2c35fcb817e46fbed9e.png'}},
];

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

class FriendsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      username: this.props.route.username,
      userId: this.props.route.userId,
      error: false,
      passwordError: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      dataLoaded: false,
    };
  }

  componentWillUnmount() {
    StatusBarIOS.setHidden(false);
  }


  _backButton() {
    this.props.navigator.pop();
  }

  addFriend() {
    this.props.navigator.push({
      component: AddFriend,
      username: this.props.route.username,
      userId: this.props.route.userId
    });
  }

  renderFriend(friend) {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: friend.profile.thumbnail}}
          style={styles.thumbnail}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.friend}>{friend.name}</Text>
        </View>
      </View>
    );
  }

  componentDidMount() {
    this.loadFriendsData();
  }

  loadFriendsData() {
    api.getAllFriends(this.state.username, (data) => {
      console.log('Data has arrived!', data);
      data.forEach((friend, index) => {
        // use username instead of name
        friend.name = friend.username;
        // fix this so it gets the profile image from the database
        friend.profile = MOCKED_FRIENDS_DATA[index].profile;
      });
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data),
        loaded: true,
      });
    });
  }

  render() {
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
        <NavigationBar title={pageTitle} tintColor={"white"} statusBar={{hidden: false}} leftButton={backButton} rightButton={addButton}/>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderFriend}
          style={styles.listView}
        />

        {showErr}
      </View>
    );
  }
}

var styles = StyleSheet.create({
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
    marginBottom: 5,
    marginLeft: 5,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ededed',
  },
  rightContainer: {
    flex: 1,
  },
  friend: {
    fontSize: 12,
    textAlign: 'center',
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#ededed',
  },
});

module.exports = FriendsList;
