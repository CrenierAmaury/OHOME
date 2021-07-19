import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../views/profile/ProfileScreen';

const Stack = createStackNavigator();

const ProfileNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNav;
