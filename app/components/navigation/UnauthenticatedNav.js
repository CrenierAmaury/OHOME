import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignInScreen from '../views/authentication/SignInScreen';
import SignUpScreen from '../views/authentication/SignUpScreen';
import PasswordResetScreen from '../views/authentication/PasswordResetScreen';

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
      <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
    </Stack.Navigator>
  );
};

export default UnauthenticatedNav;
