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
      barTintColor='#000'
      titleTextColor='#fff'
      tintColor='#fff'
      style={styles.container}
        initialRoute={{
          title: 'PROFOUND MONGOOSE',
          component: Main
        }} />
      
    );
  }
}


AppRegistry.registerComponent('ProfoundMongoose', () => ProfoundMongoose);
