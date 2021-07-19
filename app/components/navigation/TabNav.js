import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet} from 'react-native';
import HomeScreen from '../views/home/HomeScreen';
import MealsScreen from '../views/meals/MealsScreen';
import BudgetNav from './BudgetNav';
import CalendarScreen from '../views/calendar/CalendarScreen';
import ListsScreen from '../views/lists/ListsScreen';

const Tab = createBottomTabNavigator();

const TabNav = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#FCA311',
        inactiveTintColor: '#8b8b8b',
        showIcon: true,
        style: {
          borderTopWidth: 0,
          borderRadius: 0,
          backgroundColor: '#FBFBFB',
          // shadow
          shadowColor: 'rgba(0,0,0, .7)',
          shadowOffset: {height: 0, width: 0},
          shadowOpacity: 0.5,
          shadowRadius: 2,
          elevation: 3,
        },
      }}>
      <Tab.Screen
        name="Meals"
        component={MealsScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="dinner-dining"
              size={35}
              style={{
                color: focused ? '#FCA311' : '#8b8b8b',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 0,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetNav}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="account-balance-wallet"
              size={35}
              style={{
                color: focused ? '#FCA311' : '#8b8b8b',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 0,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="home"
              size={35}
              style={{
                color: focused ? '#FCA311' : '#8b8b8b',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 0,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="event"
              size={35}
              style={{
                color: focused ? '#FCA311' : '#8b8b8b',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 0,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Lists"
        component={ListsScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="format-list-bulleted"
              size={35}
              style={{
                color: focused ? '#FCA311' : '#8b8b8b',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 0,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default TabNav;
