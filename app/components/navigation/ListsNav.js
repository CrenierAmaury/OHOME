import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ListsScreen from '../views/lists/ListsScreen';
import ListDetailsScreen from '../views/lists/ListDetailsScreen';
import ListModifyScreen from '../views/lists/ListModifyScreen';

const Stack = createStackNavigator();

const ListsNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="ListsScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="ListsScreen" component={ListsScreen} />
      <Stack.Screen name="ListDetailsScreen" component={ListDetailsScreen} />
      <Stack.Screen name="ListModifyScreen" component={ListModifyScreen} />
    </Stack.Navigator>
  );
};

export default ListsNav;
