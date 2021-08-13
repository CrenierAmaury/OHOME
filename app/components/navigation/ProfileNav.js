import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../views/profile/ProfileScreen';
import ProfileModifyScreen from '../views/profile/ProfileModifyScreen';

const Stack = createStackNavigator();

const ProfileNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen
        name="ProfileModifyScreen"
        component={ProfileModifyScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileNav;
