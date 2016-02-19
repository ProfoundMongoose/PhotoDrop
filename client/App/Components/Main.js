var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Settings = require('./Settings');
var MapView = require('./MapView');
var Camera = require('./Camera');

var {
  StyleSheet,
  TabBarIOS,
  Text,
  View,
} = React;

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
});

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'Main';
    this.statics = {
      title: '<TabBarIOS>',
      description: 'Tab-based navigation.'
    };
    this.state = {
      selectedTab: undefined,
      notifCount: 0,
      presses: 0
    }
  }

  gotoSettings() {
    this.setState({
      selectedTab: 'profile'
    });
    this.props.navigator.push({
      component: Settings
    });
  }

  openCamera() {
    this.setState({
      selectedTab: 'camera'
    });
    this.props.navigator.push({
      component: Camera
    });
  }

  openMaps() {
    this.setState({
      selectedTab: 'map',
    });
    this.props.navigator.push({
      component: MapView
    });
  }

  _renderContent(color: string, pageText: string) {
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
        <Text style={styles.tabText}>{pageText}</Text>
      </View>
    );
  }

  render() {
    return (
      <TabBarIOS>
        <Icon.TabBarItem
          title="Map"
          iconName="map"
          selectedIconName="map"
          selected={this.state.selectedTab === 'map'}
          onPress={this.openMaps.bind(this)}>
          {this._renderContent('#414A8C', 'Map')}
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Camera"
          iconName="ios-camera-outline"
          selectedIconName="ios-camera"
          selected={this.state.selectedTab === 'camera'}
          onPress={this.openCamera.bind(this)}>
          {this._renderContent('#414A8C', 'Camera')}
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Profile"
          iconName="ios-person-outline"
          selectedIconName="ios-person"
          selected={this.state.selectedTab === 'profile'}
          onPress={this.gotoSettings.bind(this)} >
          {this._renderContent('#414A8C', 'Profile')}
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  }
}

module.exports = Main;