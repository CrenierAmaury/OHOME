import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MealsScreen from '../views/meals/MealsScreen';
import MealDetailsScreen from '../views/meals/MealDetailsScreen';

const Stack = createStackNavigator();

const MealsNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="MealsScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="MealsScreen" component={MealsScreen} />
      <Stack.Screen name="MealDetailsScreen" component={MealDetailsScreen} />
    </Stack.Navigator>
  );
};

export default MealsNav;
