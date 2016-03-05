var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var IconIon = require('react-native-vector-icons/Ionicons');
var Keychain = require('react-native-keychain');
var api = require('../Utils/api');
var AddGroups = require('./AddGroups');

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

class GroupsList extends React.Component {
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

  addGroups() {
    this.props.navigator.push({
      component: AddGroups,
      username: this.props.route.username,
      userId: this.props.route.userId,
      usersGroups: this.state.usersGroups
    });
  }

  renderGroup(group) {
    return (
      <View style={styles.container}>
        <View style={styles.rightContainer}>
          <Text style={styles.group} onPress={()=>{
            if (this.props.route.addGroupFilter) {
              this.props.route.addGroupFilter(group, this.props.navigator)
            }
          }}>{group.groupname}</Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.number}>{group.members.length + ' Users'}</Text>
        </View>
      </View>
    );
  }

  componentWillUpdate() {
    this.loadGroupsData();
  }

  componentDidMount() {
    this.loadGroupsData();
  }

  loadGroupsData() {
    api.getUserGroups(this.state.userId, (data) => {
      console.log('Data has arrived!', data);
      data.forEach((group, index) => {
        group.groupname = group.groupname;
      });
      if (this.state.dataSource._cachedRowCount === undefined || this.state.dataSource._cachedRowCount !== data.length) {
        this.setState({
          usersGroups: data.map(data => data.groupname),
          dataSource: this.state.dataSource.cloneWithRows(data),
          loaded: true,
        });
      }
    });
  }

  render() {
    this.loadGroupsData();
    var showErr = (
      this.state.error ? <Text style={styles.err}> {this.state.error} </Text> : <View></View>
    );
    var pageTitle = (
      <Text style={styles.pageTitle}>Groups</Text>
    );
    var backButton = (
      <TouchableHighlight onPress={this._backButton.bind(this)} underlayColor={'white'}>
        <IconIon name='ios-arrow-thin-down' size={30} style={styles.backIcon} color="#FF5A5F"/>
      </TouchableHighlight>
    );

    var addButton = (
      <TouchableHighlight onPress={this.addGroups.bind(this)} underlayColor={'white'}>
        <IconIon name='ios-plus-empty' size={30} style={styles.plusIcon} color="#FF5A5F"/>
      </TouchableHighlight>
    );

    return (
      <View style={{flex: 1, backgroundColor: '#ededed'}}>
        <NavigationBar title={pageTitle} tintColor={"white"} statusBar={{hidden: false}} leftButton={backButton} rightButton={addButton}/>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderGroup.bind(this)}
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
  group: {
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'circular'
  },
  number: {
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center'
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

module.exports = GroupsList;
