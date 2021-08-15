import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TabNav from './TabNav';
import ProfileNav from './ProfileNav';
import SettingsNav from './SettingsNav';

const Stack = createStackNavigator();

const ActiveHouseholdNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="TabNav"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="TabNav" component={TabNav} />
      <Stack.Screen name="ProfileNav" component={ProfileNav} />
      <Stack.Screen name="SettingsNav" component={SettingsNav} />
    </Stack.Navigator>
  );
};

export default ActiveHouseholdNav;
