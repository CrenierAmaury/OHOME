import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CalendarScreen from '../views/calendar/CalendarScreen';
import EventDetailsScreen from '../views/calendar/EventDetailsScreen';
import EventModifyScreen from '../views/calendar/EventModifyScreen';

const Stack = createStackNavigator();

const MealsNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="CalendarScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
      <Stack.Screen name="EventDetailsScreen" component={EventDetailsScreen} />
      <Stack.Screen name="EventModifyScreen" component={EventModifyScreen} />
    </Stack.Navigator>
  );
};

export default MealsNav;
