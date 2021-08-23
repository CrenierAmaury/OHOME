import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import AuthenticatedNav from './AuthenticatedNav';
import UnauthenticatedNav from './UnauthenticatedNav';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from 'react-native-elements';
import {cleanAllUser, updateUid} from '../../store/slices/userSlice';
import {cleanAllHousehold} from '../../store/slices/householdSlice';

const Stack = createStackNavigator();

const MainNav = () => {
  const {theme} = useTheme();

  const [isLoading, setIsLoading] = useState(true);

  const uid = useSelector(state => state.user.uid);
  const dispatch = useDispatch();

  useEffect(() => {
    return auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(updateUid(user.uid));
        setIsLoading(false);
      } else {
        dispatch(cleanAllHousehold());
        dispatch(cleanAllUser());
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator
          style={{marginTop: 300}}
          size="large"
          color={theme.colors.blue}
        />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#FBFBFB',
          // shadow
          shadowColor: 'rgba(0,0,0, .7)',
          shadowOffset: {height: 0, width: 0},
          shadowOpacity: 0.5,
          shadowRadius: 4,
          elevation: 4,
        },
      }}>
      {uid ? (
        <Stack.Screen name="Authenticated" component={AuthenticatedNav} />
      ) : (
        <Stack.Screen name="Unauthenticated" component={UnauthenticatedNav} />
      )}
    </Stack.Navigator>
  );
};

export default MainNav;
