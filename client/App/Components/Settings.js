var React = require('react-native');

var {
  Text,
  View,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    marginTop: 65,
    flex: 1
  },
  image: {
    height: 350
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 30,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  mainContainer: {
    flex: 1,
    padding: 30,
    marginTop: 65,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#34495e'
  }
});

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Settings';
    }
    render() {
        return (
          <View style={styles.mainContainer}>
            <Text style={styles.title}> Profound Mongoose </Text>
            <Text style={styles.fieldTitle}> Username </Text>
            <TouchableHighlight
              style={styles.button}

              underlayColor='white'>
              <Text style={styles.buttonText}> Sign in </Text>
            </TouchableHighlight>
          </View>
          );
    }
}

module.exports = Settings;
