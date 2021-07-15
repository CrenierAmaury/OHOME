import React, {useState, useEffect} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import AuthenticatedNav from './AuthenticatedNav';
import UnauthenticatedNav from './UnauthenticatedNav';
import {checkIfLoggedIn} from '../../utils/authentication';
import {useDispatch, useSelector} from 'react-redux';
import {updateUid} from '../../store/slices/userSlice';
import {getUser} from '../../api/userApi';
import {
  updateBudgetId,
  updateHouseholdId,
} from '../../store/slices/householdSlice';
import {getHousehold} from '../../api/householdApi';

const Stack = createStackNavigator();

const MainNav = () => {
  const [isLoading, setIsLoading] = useState(true);

  const uid = useSelector(state => state.user.uid);
  const dispatch = useDispatch();

  useEffect(() => {
    checkIfLoggedIn(onAuthStateChanged);
  });

  const onAuthStateChanged = user => {
    if (user) {
      getUser(user.uid)
        .then(res => {
          getHousehold(res.activeHousehold).then(household => {
            dispatch(updateUid(user.uid));
            dispatch(updateHouseholdId(res.activeHousehold));
            dispatch(updateBudgetId(household.budget));
            setIsLoading(false);
          });
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      dispatch(updateUid(''));
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator
          style={{marginTop: 150}}
          size="large"
          color="#0000ff"
        />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
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
        <Stack.Screen
          name="Authenticated"
          component={AuthenticatedNav}
          options={{
            title: '',
          }}
        />
      ) : (
        <Stack.Screen
          name="Unauthenticated"
          component={UnauthenticatedNav}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default MainNav;
