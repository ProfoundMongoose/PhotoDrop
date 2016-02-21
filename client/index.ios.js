var React = require('react-native');
var Main = require('./App/Components/Main');

var {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Navigator,
  View
} = React;


var styles = StyleSheet.create({
  messageText: {
    fontSize: 17,
    fontWeight: '500',
    padding: 15,
    marginTop: 50,
    marginLeft: 15,
  },
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'black',
  }
});

class ProfoundMongoose extends React.Component {
  render() {
    return (
      <Navigator 
        style={styles.container}
        initialRoute={{ 
          component: Main
        }}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromBottom;
        }}
        renderScene={(route, navigator) => {
          if (route.component) {
            return React.createElement(route.component, { navigator });
          }
        }} 
      />
      
    );
  }
}


AppRegistry.registerComponent('ProfoundMongoose', () => ProfoundMongoose);
