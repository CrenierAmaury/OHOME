import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignInScreen from '../views/authentication/SignInScreen';
import SignUpScreen from '../views/authentication/SignUpScreen';

const Stack = createStackNavigator();

const UnauthenticatedNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default UnauthenticatedNav;
