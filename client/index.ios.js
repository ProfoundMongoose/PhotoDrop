var React = require('react-native');
var Main = require('./App/Components/Main');

var {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  NavigatorIOS,
  View
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111'
  }
});

class ProfoundMongoose extends React.Component {
  render() {
    return (
      <NavigatorIOS 
      style={styles.container}
        initialRoute={{
          title: 'Profound Mongoose',
          component: Main
        }} />
      
    );
  }
}


AppRegistry.registerComponent('ProfoundMongoose', () => ProfoundMongoose);
