import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HouseholdCreationScreen from '../views/household/HouseholdCreationScreen';
import NoHouseholdScreen from '../views/household/NoHouseholdScreen';

const Stack = createStackNavigator();

const NoHouseholdNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="NoHouseholdScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="NoHouseholdScreen" component={NoHouseholdScreen} />
      <Stack.Screen
        name="HouseholdCreationScreen"
        component={HouseholdCreationScreen}
      />
    </Stack.Navigator>
  );
};

export default NoHouseholdNav;
