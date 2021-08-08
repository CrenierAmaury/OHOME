import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {View, Text, TouchableOpacity} from 'react-native';
import {makeStyles, Card} from 'react-native-elements';
import {useSelector} from 'react-redux';
import _ from 'lodash';

const MealsWidget = navigation => {
  const styles = useStyles();

  const [meal, setMeal] = useState({});

  const mealGroupId = useSelector(state => state.household.mealGroupId);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('mealGroups')
      .doc(mealGroupId)
      .collection('meals')
      .onSnapshot(
        querySnapshot => {
          const meals = [];
          querySnapshot.docs.forEach(doc => {
            meals.push(doc.data());
          });
          const todayMeal = _.find(meals, e => {
            const date = new Date();
            return (
              e.date.toDate().getUTCFullYear() === date.getUTCFullYear() &&
              e.date.toDate().getUTCMonth() === date.getUTCMonth() &&
              e.date.toDate().getUTCDate() === date.getUTCDate()
            );
          });
          setMeal(todayMeal);
        },
        error => {
          console.log(error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, [mealGroupId]);

  return (
    <View style={styles.main_container}>
      <Card>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Meals');
          }}>
          <Card.Title>Repas du jour</Card.Title>
          <Card.Divider />
          <Text>{meal.label}</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default MealsWidget;
