import 'react-native-gesture-handler';
import React from 'react';
import firebase from 'firebase';
import firebaseConfig from './firebaseConfig';
import {StyleSheet, Text, View} from 'react-native';
import {UserContext} from './contexts/userContext';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import AuthenticatedNav from './components/navigation/AuthenticatedNav';
import UnauthenticatedNav from './components/navigation/UnauthenticatedNav';

//initialization of firebase
firebase.initializeApp(firebaseConfig);

const Stack = createStackNavigator();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isSignedIn: false,
      isSignedOut: false,
      user: {},
    };
  }

  componentDidMount() {
    this._checkIfLoggedIn();
  }

  _checkIfLoggedIn() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          isLoading: false,
          isSignedIn: true,
          user: user,
        });
      } else {
        this.setState({
          isLoading: false,
          isSignedIn: false,
        });
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

    return (
      <UserContext.Provider
        value={{
          isSignedIn: this.state.isSignedIn,
          signOut: this.state.isSignedOut,
          user: this.state.user,
          setIsSignedIn: value => {
            this.setState({isSignedIn: value});
          },
          setIsSignedOut: value => {
            this.setState({isSignedOut: value});
          },
        }}>
        <NavigationContainer>
          <Stack.Navigator>
            {this.state.isSignedIn ? (
              <Stack.Screen
                name="Authenticated"
                component={AuthenticatedNav}
                options={{
                  title: '',
                }}
              />
            ) : (
              <Stack.Screen
                name="Unauthenticated"
                component={UnauthenticatedNav}
                options={{
                  headerShown: false,
                }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </UserContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default App;
