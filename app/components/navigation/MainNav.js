import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import AuthenticatedNav from './AuthenticatedNav';
import UnauthenticatedNav from './UnauthenticatedNav';
import {checkIfLoggedIn} from '../../api/authenticationApi';
import {useDispatch, useSelector} from 'react-redux';
import {updateUid} from '../../store/slices/userSlice';
import {getUser} from '../../api/userApi';
import {
  updateBudgetId,
  updateHouseholdId,
  updateListGroupId,
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
      dispatch(updateUid(user.uid));
      getUser(user.uid)
        .then(res => {
          dispatch(updateHouseholdId(res.activeHousehold));
          if (res.activeHousehold) {
            getHousehold(res.activeHousehold).then(household => {
              dispatch(updateBudgetId(household.budget));
              dispatch(updateListGroupId(household.listGroup));
              setIsLoading(false);
            });
          }
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
