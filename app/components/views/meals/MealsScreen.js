import React, { useCallback, useEffect, useState } from "react";
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Card, FAB, makeStyles, Overlay} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import MainHeader from '../../headers/MainHeader';
import NewMealScreen from './NewMealScreen';
import {getWeek, renderDate, renderWeek} from '../../../utils/date';
import _ from 'lodash';

const MealsScreen = ({navigation}) => {
  const styles = useStyles();

  const [meals, setMeals] = useState([]);
  const [weekMeals, setWeekMeals] = useState([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const mealGroupId = useSelector(state => state.household.mealGroupId);

  const childProps = {mealGroupId, setIsOverlayVisible};
  const headerProps = {navigation};

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('mealGroups')
      .doc(mealGroupId)
      .collection('meals')
      .onSnapshot(
        querySnapshot => {
          const mealsTab = [];
          querySnapshot.docs.forEach(doc => {
            const {...meal} = doc.data();
            meal.id = doc.id;
            mealsTab.push(meal);
          });
          setMeals(mealsTab);
          getWeekMeals(new Date(), mealsTab);
        },
        error => {
          console.log(error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, [getWeekMeals, mealGroupId]);

  const getWeekMeals = useCallback((date, mealsTab) => {
    let week = getWeek(date);
    let tempWeekMeals = [];
    let dayNames = [
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
      'Dimanche',
    ];
    for (let day of week) {
      let meal = getDayMeal(mealsTab, day);
      let cardData = {
        day: dayNames[week.indexOf(day)],
        meal: meal,
      };
      tempWeekMeals.push(cardData);
    }
    setWeekMeals(tempWeekMeals);
  }, []);

  const getDayMeal = (mealsTab, date) => {
    return _.find(mealsTab, e => {
      return (
        e.date.toDate().getUTCFullYear() === date.getUTCFullYear() &&
        e.date.toDate().getUTCMonth() === date.getUTCMonth() &&
        e.date.toDate().getUTCDate() === date.getUTCDate()
      );
    });
  };

  return (
    <View style={styles.main_container}>
      <MainHeader {...headerProps} />
      <View style={styles.week_change_container}>
        <Icon
          name="keyboard-arrow-left"
          color="black"
          size={35}
          onPress={() => {
            let date = new Date();
            date.setUTCDate(date.getUTCDate() - 7);
            console.log(date);
            getWeekMeals(date, meals);
          }}
        />
        <Text style={styles.week_change_center}>{renderWeek(new Date())}</Text>
        <Icon
          name="keyboard-arrow-right"
          color="black"
          size={35}
          onPress={() => {
            let date = new Date();
            date.setUTCDate(date.getUTCDate() + 7);
            console.log(date);
            getWeekMeals(date, meals);
          }}
        />
      </View>
      <ScrollView>
        {weekMeals.map((e, i) => (
          <Card key={i}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('MealDetailsScreen', {
                  mealGroupId: mealGroupId,
                  meal: e.meal,
                });
              }}>
              <Card.Title>{e.day}</Card.Title>
              <Card.Divider />
              <Text>
                {e.meal ? e.meal.label : <Text>pas de repas prévu</Text>}
              </Text>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
      <FAB
        color="#FCA311"
        placement="right"
        icon={<Icon name="add" color="white" />}
        onPress={() => {
          setIsOverlayVisible(true);
        }}
      />
      <Overlay
        isVisible={isOverlayVisible}
        onBackdropPress={() => {
          setIsOverlayVisible(false);
        }}
        overlayStyle={{
          width: '80%',
        }}
        backdropStyle={{
          backgroundColor: 'grey',
          opacity: 0.7,
        }}>
        <NewMealScreen {...childProps} />
      </Overlay>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
  week_change_container: {
    margin: 10,
    flexDirection: 'row',
  },
  week_change_center: {
    flex: 1,
    padding: 5,
    textAlign: 'center',
  },
}));

export default MealsScreen;
