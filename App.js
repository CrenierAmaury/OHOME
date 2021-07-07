import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import firebase from 'firebase';
import firebaseConfig from './firebaseConfig';
import {StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import store from './app/store/store';
import {Provider} from 'react-redux';
import AuthenticatedNav from './app/components/navigation/AuthenticatedNav';
import UnauthenticatedNav from './app/components/navigation/UnauthenticatedNav';
import {checkIfLoggedIn} from './app/utils/authentication';

//initialization of firebase
firebase.initializeApp(firebaseConfig);

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    checkIfLoggedIn()
      .then(r => {
        setIsSignedIn(true);
        setIsLoading(false);
      })
      .catch(e => {
        setIsSignedIn(false);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <View>
        <Text>LOADING</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          {isSignedIn ? (
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
    </Provider>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default App;
