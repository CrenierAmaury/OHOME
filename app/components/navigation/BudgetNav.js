import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BudgetScreen from '../views/budget/BudgetScreen';
import BudgetDetailsScreen from '../views/budget/BudgetDetailsScreen';
import ExpenseDetailsScreen from '../views/budget/ExpenseDetailsScreen';

const Stack = createStackNavigator();

const BudgetNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="BudgetScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="BudgetScreen" component={BudgetScreen} />
      <Stack.Screen
        name="BudgetDetailsScreen"
        component={BudgetDetailsScreen}
      />
      <Stack.Screen
        name="ExpenseDetailsScreen"
        component={ExpenseDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default BudgetNav;
