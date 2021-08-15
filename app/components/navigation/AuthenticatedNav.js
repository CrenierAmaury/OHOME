import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {getUser} from '../../api/userApi';
import {
  updateAvatar,
  updateEmail,
  updateName,
} from '../../store/slices/userSlice';
import {
  updateBudgetId,
  updateCalendarId,
  updateHouseholdId,
  updateHouseholdName,
  updateListGroupId,
  updateMealGroupId,
  updateMembers,
} from '../../store/slices/householdSlice';
import {getHousehold} from '../../api/householdApi';
import {getUserAvatar} from '../../utils/avatar';
import {useDispatch, useSelector} from 'react-redux';
import ActiveHouseholdNav from './ActiveHouseholdNav';
import NoHouseholdNav from './NoHouseholdNav';
import {ActivityIndicator, View} from 'react-native';

const Stack = createStackNavigator();

const AuthenticatedNav = () => {
  const [isLoading, setIsLoading] = useState(true);

  const uid = useSelector(state => state.user.uid);
  const activeHousehold = useSelector(state => state.household.id);
  const dispatch = useDispatch();

  useEffect(() => {
    getUser(uid)
      .then(res => {
        if (res.activeHousehold) {
          dispatch(updateName(res.name));
          dispatch(updateEmail(res.email));
          dispatch(updateHouseholdId(res.activeHousehold));
          getHousehold(res.activeHousehold).then(household => {
            household.members.forEach(memberId => {
              getUser(memberId)
                .then(member => {
                  dispatch(updateMembers({id: memberId, name: member.name}));
                })
                .catch(e => {
                  console.log(e);
                });
            });
            getUserAvatar(uid)
              .then(r => {
                setIsLoading(false);
                r
                  ? dispatch(updateAvatar(r))
                  : dispatch(updateAvatar('default'));
              })
              .catch(e => {
                console.log(e);
              });
            dispatch(updateHouseholdName(household.name));
            dispatch(updateCalendarId(household.calendar));
            dispatch(updateBudgetId(household.budget));
            dispatch(updateListGroupId(household.listGroup));
            dispatch(updateMealGroupId(household.mealGroup));
          });
        } else {
          console.log('no household yet');
        }
      })
      .catch(e => {
        console.log(e);
      });
  });

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
      initialRouteName="TabNav"
      screenOptions={{
        headerShown: false,
      }}>
      {activeHousehold ? (
        <Stack.Screen
          name="ActiveHouseholdNav"
          component={ActiveHouseholdNav}
        />
      ) : (
        <Stack.Screen name="NoHouseholdNav" component={NoHouseholdNav} />
      )}
    </Stack.Navigator>
  );
};

export default AuthenticatedNav;
