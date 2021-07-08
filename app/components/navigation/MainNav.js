import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import AuthenticatedNav from './AuthenticatedNav';
import UnauthenticatedNav from './UnauthenticatedNav';
import {checkIfLoggedIn} from '../../utils/authentication';

const Stack = createStackNavigator();

const MainNav = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState();

  const onAuthStateChanged = u => {
    setUser(u);
    if (isLoading) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkIfLoggedIn(onAuthStateChanged);
  });

  if (isLoading) {
    return (
      <View>
        <Text>LOADING</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#FBFBFB',
          // shadow
          shadowColor: 'rgba(0,0,0, .7)',
          shadowOffset: {height: 0, width: 0},
          shadowOpacity: 0.5,
          shadowRadius: 4,
          elevation: 4,
        },
      }}>
      {user ? (
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
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default MainNav;
