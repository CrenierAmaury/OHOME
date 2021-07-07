import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignInScreen from '../views/SignInScreen';
import SignUpScreen from '../views/SignUpScreen';
import PasswordResetScreen from '../views/PasswordResetScreen';

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
