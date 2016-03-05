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

class AddGroups extends React.Component {
  constructor(props) {
    super(props);
    console.log('users groups:', this.props.route.usersGroups);
    this.state = {
      username: this.props.route.username,
      userId: this.props.route.userId,
      isLoading: false,
      foundGroupNamesData: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      unrequestableGroups: this.props.route.usersGroups
    };
  }

  componentWillUnmount() {
    StatusBarIOS.setHidden(false);
  }

  _backButton() {
    this.props.navigator.pop();
  }

  updateFoundGroups(event) {
    if (event.nativeEvent.text) {
      this.setState({isLoading: true});

      api.searchGroups(event.nativeEvent.text, (groups) => {
        var groupsArr = JSON.parse(groups);
        var groupnames = _.difference(groupsArr.map((groupObj) => {
          return groupObj.groupname;
        }), this.state.unrequestableGroups);
        this.setState({
          foundGroupNamesData: this.state.foundGroupNamesData.cloneWithRows(groupnames),
          isLoading: false
        });
      });
    } else {
      this.setState({
        foundGroupNamesData: this.state.foundGroupNamesData.cloneWithRows([]),
        isLoading: false
      });
    }
  }

  joinGroup(targetGroup, event) {
    api.joinGroup(this.state.userId, targetGroup);
  }

  renderGroup(group) {
    return (
      <TouchableHighlight onPress={this.joinGroup.bind(this, group)}>
        <View style={styles.container}>
          <View style={styles.rightContainer}>
            <Text style={styles.potentialFriend}>{group}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  createGroup(event) {
    if (event.nativeEvent.text) {
      console.log('this is the userId', this.state.userId);
      api.createGroup(this.state.userId, event.nativeEvent.text, 'the description!');
    }
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
      <TouchableHighlight onPress={this.joinGroup.bind(this)} underlayColor={'white'}>
        <IconIon name='ios-plus-empty' size={30} style={styles.plusIcon} color="#FF5A5F"/>
      </TouchableHighlight>
    );
    return (
      <View style={{flex: 1, backgroundColor: '#ededed'}}>
        <NavigationBar title={pageTitle} tintColor={"white"} statusBar={{hidden: false}} leftButton={backButton}/>
        <ScrollView contentContainerStyle={styles.changeContainer}>
          <Text style={styles.fieldTitle}> Find Group </Text>
          <TextInput
            autoCapitalize={'none'}
            autoCorrect={false}
            maxLength={16}
            style={styles.userInput}
            returnKeyType={'go'}
            onChange={this.updateFoundGroups.bind(this)}
            onSubmitEditing={this.createGroup.bind(this)} // make this work
          />
          <ListView
            dataSource={this.state.foundGroupNamesData}
            renderRow={this.renderGroup.bind(this)}
            style={styles.listView}
            rightButton={addButton} // doesn't appear
          />
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

module.exports = AddGroups;
