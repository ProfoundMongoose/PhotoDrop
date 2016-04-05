var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var api = require('../Utils/api');
var IconIon = require('react-native-vector-icons/Ionicons');
var _ = require('lodash');
var GroupsList = require('./GroupsList');

var {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  TouchableHighlight,
  ActivityIndicatorIOS,
  TouchableOpacity,
  Modal,
  ListView,
  SwitchIOS,
  StatusBarIOS
} = React;

class SelectGroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animated: true,
      modalVisible: false,
      transparent: true,
      innerContainerTransparentStyle: null,
      active: false,
      colorStyle: '#000',
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      selectedGroups: []
    };
  }

  _sendImage() {
    api.uploadPhoto(this.props.route.image64, this.props.route.latitude, this.props.route.longitude, this.props.route.userId, this.state.selectedGroups, (res) => {
      this.setState({modalVisible: true});
      setTimeout(()=> {
        this._closeModal();
        this.props.navigator.pop();
      }, 2000);
    });
  }

  _closeModal() {
    this.setState({modalVisible: false});
    this.props.navigator.pop();
  }

  _cancelImage() {
    this.props.navigator.pop();
  }

  componentDidMount() {
    this.loadGroupsData();
  }

  filterOutGroups(allGroups, selectedGroupNames) {
    return allGroups.reduce((aggregate, group) => {
      if (selectedGroupNames.indexOf(group.groupname) === -1) {
        aggregate.push(group);
      }
      return aggregate;
    }, []);
  }

  loadGroupsData() {
    api.getUserGroups(this.props.route.userId, (data) => {
      data.forEach((group, index) => {
        group.groupname = group.groupname;
      });
      filteredGroupData = this.filterOutGroups(data, this.state.selectedGroups);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(filteredGroupData),
        loaded: true,
      });
    });
  }

  addGroupToList(groupname) {
    var currentGroups = this.state.selectedGroups.slice();
    if(currentGroups.indexOf(groupname) === -1){
      currentGroups.push(groupname);
      this.setState({
        selectedGroups: currentGroups
      });
      this.loadGroupsData();
    }
  }

  renderGroup(group) {
    return (
      <TouchableHighlight onPress={this.addGroupToList.bind(this, group.groupname)}>
        <View style={styles.container}>
          <View style={styles.rightContainer}>
            <Text style={styles.potentialGroup}>{group.groupname}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    // because we are sending the captured image in as a string we have to tell react-native how it is encoded
    return (
      <View style={styles.imageContainer}>
        <Modal
          animated={this.state.animated}
          transparent={this.state.transparent}
          visible={this.state.modalVisible}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.innerContainer, this.state.innerContainerTransparentStyle]}>
              <Text style={styles.modal}>Your photo has been uploaded!</Text>
              <IconIon name="ios-checkmark-empty" size={90} color="#036C69" style={styles.yesIcon} />
            </View>
          </View>
        </Modal>
        <NavigationBar title={{title: 'Select Groups to Share', tintColor: '#565b5c'}} tintColor={"white"} statusBar={{hidden: true}}/>

        <View style={{flex: 1, backgroundColor: '#ededed'}}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderGroup.bind(this)}
            style={styles.listView}
          />
        </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={_.once(this._cancelImage.bind(this))} style={styles.noButton}>
              <IconIon name="ios-close-empty" size={60} color="#FC9396" style={styles.noIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={_.once(this._sendImage.bind(this))} style={styles.yesButton}>
              <IconIon name="ios-checkmark-empty" size={60} color="#036C69" style={styles.yesIcon} />
            </TouchableOpacity>
          </View>

      </View>
    );
  }
}

var styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    backgroundColor: '#ededed'
  },
  image: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  yesButton: {
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    margin: 15,
  },
  yesIcon: {
    width: 60,
    height: 60,
    marginLeft: 37
  },
  noButton: {
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    margin: 15,
  },
  noIcon: {
    width: 60,
    height: 60,
    marginLeft: 37
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5fcff',
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
  },
  modal: {
    fontSize: 20,
    fontFamily: 'Circular',
    justifyContent: 'center',
  },
  container: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 4,
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
  modal: {
    fontSize: 20,
    fontFamily: 'Circular',
    justifyContent: 'center',
  },
  potentialGroup: {
    height: 50,
    padding: 13,
    fontSize: 18,
    fontFamily: 'circular',
    color: '#fff',
    alignSelf: 'center'
  },
});

module.exports = SelectGroups;
