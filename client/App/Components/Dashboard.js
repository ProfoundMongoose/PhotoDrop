var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

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

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'Dashboard';
    this.statics = {
      title: '<TabBarIOS>',
      description: 'Tab-based navigation.'
    };
    this.state = {
      selectedTab: 'camera',
      notifCount: 0,
      presses: 0
    }
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
          onPress={() => {
            this.setState({
              selectedTab: 'map',
            });
          }}>
          {this._renderContent('#414A8C', 'Map')}
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Camera"
          iconName="ios-camera-outline"
          selectedIconName="ios-camera"
          selected={this.state.selectedTab === 'camera'}
          onPress={() => {
            this.setState({
              selectedTab: 'camera',
            });
          }}>
          {this._renderContent('#414A8C', 'Camera')}
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Profile"
          iconName="ios-person-outline"
          selectedIconName="ios-person"
          selected={this.state.selectedTab === 'profile'}
          onPress={() => {
            this.setState({
              selectedTab: 'profile',
            });
          }}>
          {this._renderContent('#414A8C', 'Profile')}
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  }
}

module.exports = Dashboard;