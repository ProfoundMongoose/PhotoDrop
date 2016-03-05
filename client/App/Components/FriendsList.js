var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var IconIon = require('react-native-vector-icons/Ionicons');
var Keychain = require('react-native-keychain');
var api = require('../Utils/api');
var AddFriend = require('./AddFriend');

var defaultProfilePic = 'http://jennstrends.com/wp-content/uploads/2013/10/bad-profile-pic-2.jpeg';

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
      userId: this.props.route.userId,
      friendsData: this.state.friendsList
    });
  }

  renderFriend(friend) {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: friend.profile}}
          style={styles.thumbnail}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.friend}>{friend.name}</Text>
        </View>
      </View>
    );
  }

  componentWillUpdate() {
    this.loadFriendsData();
  }

  componentDidMount() {
    this.loadFriendsData();
  }

  loadFriendsData() {
    // from the login bug
    //console.log('supposed state username', this.props.route.username);
    api.getAllFriends(this.props.route.username, (data) => {
      data.forEach((friend, index) => {
        friend.name = friend.username;
        friend.profile = friend.profilePhotoUrl || defaultProfilePic;
      });
      if (this.state.dataSource._cachedRowCount === undefined || this.state.dataSource._cachedRowCount !== data.length) {
        this.setState({
          friendsList: data.map(friend => friend.username),
          dataSource: this.state.dataSource.cloneWithRows(data),
          loaded: true,
        });
      }
    });
  }

  render() {
    this.loadFriendsData();
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ededed',
  },
  rightContainer: {
  },
  friend: {
    height: 50,
    padding: 13,
    paddingLeft: 37,
    fontSize: 18,
    fontFamily: 'circular',
    color: '#565b5c',
    alignSelf: 'center'
  },
  thumbnail: {
    marginLeft: 8,
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
