import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import MealHeader from '../../headers/MealHeader';
import firestore from '@react-native-firebase/firestore';

const MealDetailsScreen = ({route, navigation}) => {
  const styles = useStyles();

  const [meal, setMeal] = useState({});

  const headerProps = {title: meal.label, navigation};

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('mealGroups')
      .doc(route.params.mealGroupId)
      .collection('meals')
      .doc(route.params.meal.id)
      .onSnapshot(
        documentSnapshot => {
          setMeal(documentSnapshot.data());
        },
        error => {
          console.log(error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, [navigation, route.params.meal.id, route.params.mealGroupId]);

  return (
    <View style={styles.main_container}>
      <MealHeader {...headerProps} />
      <Text>MEAL DETAILS</Text>
      <Text>{meal.label}</Text>
      <Text>{meal.author}</Text>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default MealDetailsScreen;
