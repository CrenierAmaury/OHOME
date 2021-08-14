import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileNav from './ProfileNav';
import SettingsNav from './SettingsNav';
import TabNav from './TabNav';
import NoHouseholdScreen from '../views/household/NoHouseholdScreen';
import HouseholdCreationScreen from '../views/household/HouseholdCreationScreen';

const Stack = createStackNavigator();

const AuthenticatedNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="TabNav"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="TabNav" component={TabNav} />
      <Stack.Screen name="NoHouseholdScreen" component={NoHouseholdScreen} />
      <Stack.Screen name="ProfileNav" component={ProfileNav} />
      <Stack.Screen name="SettingsNav" component={SettingsNav} />
      <Stack.Screen
        name="HouseholdCreationScreen"
        component={HouseholdCreationScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthenticatedNav;
