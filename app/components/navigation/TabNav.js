import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from 'react-native-elements';
import HomeScreen from '../views/home/HomeScreen';
import BudgetNav from './BudgetNav';
import CalendarScreen from '../views/calendar/CalendarScreen';
import ListsNav from './ListsNav';
import MealsNav from './MealsNav';

const Tab = createBottomTabNavigator();

const TabNav = () => {
  const {theme} = useTheme();

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
        component={MealsNav}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="dinner-dining"
              size={35}
              style={{
                color: focused ? theme.colors.highlight : theme.colors.text,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 0,
              }}
            />
          ),
          tabBarLabel: 'Repas',
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
                color: focused ? theme.colors.highlight : theme.colors.text,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 0,
              }}
            />
          ),
          tabBarLabel: 'Budget',
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
                color: focused ? theme.colors.highlight : theme.colors.text,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 0,
              }}
            />
          ),
          tabBarLabel: 'Acceuil',
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
                color: focused ? theme.colors.highlight : theme.colors.text,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 0,
              }}
            />
          ),
          tabBarLabel: 'Calendrier',
        }}
      />
      <Tab.Screen
        name="Lists"
        component={ListsNav}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="format-list-bulleted"
              size={35}
              style={{
                color: focused ? theme.colors.highlight : theme.colors.text,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 0,
              }}
            />
          ),
          tabBarLabel: 'listes',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNav;
