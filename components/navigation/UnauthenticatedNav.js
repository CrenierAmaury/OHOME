import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignInScreen from '../views/SignInScreen';
import SignUpScreen from '../views/SignUpScreen';
import PasswordResetScreen from '../views/PasswordResetScreen';

const Stack = createStackNavigator();

class UnauthenticatedNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
      </Stack.Navigator>
    );
  }
}

export default UnauthenticatedNav;
