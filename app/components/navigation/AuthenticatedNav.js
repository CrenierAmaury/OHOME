import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileNav from './ProfileNav';
import SettingsNav from './SettingsNav';
import TabNav from './TabNav';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createStackNavigator();

const AuthenticatedNav = ({navigation}) => {
  const headerRight = () => {
    return (
      <Icon
        onPress={() => {
          navigation.navigate('SettingsNav');
        }}
        name="settings"
        size={35}
        style={{
          color: '#8b8b8b',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 0,
        }}
      />
    );
  };

  const headerLeft = () => {
    return (
      <Icon
        onPress={() => {
          navigation.navigate('ProfileNav');
        }}
        name="face"
        size={35}
        style={{
          color: '#8b8b8b',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 0,
        }}
      />
    );
  };

  return (
    <Stack.Navigator
      initialRouteName="TabNav"
      screenOptions={{
        title: '',
        headerLeft: headerLeft,
        headerRight: headerRight,
      }}>
      <Stack.Screen name="TabNav" component={TabNav} />
      <Stack.Screen name="ProfileNav" component={ProfileNav} />
      <Stack.Screen name="SettingsNav" component={SettingsNav} />
    </Stack.Navigator>
  );
};

export default AuthenticatedNav;
