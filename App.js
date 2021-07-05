import React from 'react';
import firebase from 'firebase';
import {firebaseConfig} from './firebaseConfig';
import {StyleSheet, Text, View} from 'react-native';
//import {createStackNavigator} from '@react-navigation/stack';
//import {NavigationContainer} from '@react-navigation/native';

//initialization of firebase
firebase.initializeApp(firebaseConfig);

//const Stack = createStackNavigator();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isSignedIn: false,
      user: {},
    };
  }

  componentDidMount() {
    this._checkIfLoggedIn();
  }

  _checkIfLoggedIn() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('1');
        this.isLoading = false;
        this.state.isSignedIn = true;
        this.state.user.email = user.email;
      } else {
        console.log('2');
        this.isLoading = false;
        this.state.isSignedIn = false;
      }
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <Text>LOADING</Text>
        </View>
      );
    }

    return this.state.isSignedIn ? (
      <View>
        <Text>{this.state.user.email}</Text>
      </View>
    ) : (
      <View>
        <Text>NON CONNECTE</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default App;
