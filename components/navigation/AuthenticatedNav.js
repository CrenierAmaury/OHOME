import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../views/HomeScreen';
import MealsScreen from '../views/MealsScreen';
import BudgetScreen from '../views/BudgetScreen';
import CalendarScreen from '../views/CalendarScreen';
import ListsScreen from '../views/ListsScreen';

const Tab = createBottomTabNavigator();

class AuthenticatedNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          showIcon: true,
        }}>
        <Tab.Screen
          name="Repas"
          component={MealsScreen}
          options={{
            tabBarIcon: tabInfo => (
              <Icon
                name="dinner-dining"
                size={35}
                style={{
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
          component={BudgetScreen}
          options={{
            tabBarIcon: tabInfo => (
              <Icon
                name="account-balance-wallet"
                size={35}
                style={{
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
            tabBarIcon: tabInfo => (
              <Icon
                name="home"
                size={35}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 0,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Calendrier"
          component={CalendarScreen}
          options={{
            tabBarIcon: tabInfo => (
              <Icon
                name="event"
                size={35}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 0,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Listes"
          component={ListsScreen}
          options={{
            tabBarIcon: tabInfo => (
              <Icon
                name="format-list-bulleted"
                size={35}
                style={{
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
  }
}

export default AuthenticatedNav;
