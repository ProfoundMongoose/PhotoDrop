var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var IconIon = require('react-native-vector-icons/Ionicons');
var Keychain = require('react-native-keychain');
var api = require('../Utils/api');
var AddFriend = require('./AddFriend');

var MOCKED_FRIENDS_DATA = [
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'shanemcgraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
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
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(MOCKED_FRIENDS_DATA),
      loaded: true,
    });
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

    var addButton = (
      <TouchableHighlight onPress={this.addFriend.bind(this)} underlayColor={'white'}>
        <IconIon name='ios-plus-empty' size={30} style={styles.plusIcon} color="#FF5A5F"/>
      </TouchableHighlight>
    );

    return (
      <View style={{flex: 1, backgroundColor: '#ededed'}}>
        <NavigationBar title={pageTitle} tintColor={"white"} statusBar={{hidden: false}} leftButton={backButton} rightButton={addButton}/>
        <ScrollView contentContainerStyle={styles.changeContainer}>
          <Text style={styles.fieldTitle}> Friends </Text>

          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderFriend}
            style={styles.listView}
          />

          <ActivityIndicatorIOS
            animating= {this.state.isLoading}
            size='large'
            style={styles.loading}
          />

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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  friend: {
    fontSize: 12,
    textAlign: 'center',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});

module.exports = FriendsList;
