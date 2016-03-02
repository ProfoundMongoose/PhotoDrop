var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var IconIon = require('react-native-vector-icons/Ionicons');
var Keychain = require('react-native-keychain');
var api = require('../Utils/api');

var MOCKED_FRIENDS_DATA = [
  {name: 'Shane McGraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'Elliot Plant', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/14936355.jpg'}},
  {name: 'Erick Paepke', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10649202.jpg'}},
  {name: 'Kyle Corbelli', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/13224446.jpg'}},
  {name: 'Shane McGraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'Elliot Plant', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/14936355.jpg'}},
  {name: 'Erick Paepke', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10649202.jpg'}},
  {name: 'Kyle Corbelli', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/13224446.jpg'}},
  {name: 'Shane McGraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'Elliot Plant', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/14936355.jpg'}},
  {name: 'Erick Paepke', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10649202.jpg'}},
  {name: 'Kyle Corbelli', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/13224446.jpg'}},
  {name: 'Shane McGraw', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10692718.jpg'}},
  {name: 'Elliot Plant', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/14936355.jpg'}},
  {name: 'Erick Paepke', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/10649202.jpg'}},
  {name: 'Kyle Corbelli', profile: {thumbnail: 'file:///Users/shanemcgraw/Desktop/13224446.jpg'}},
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
      component: Main,
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
    //eventually do an http request to our server to get the friends data
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
