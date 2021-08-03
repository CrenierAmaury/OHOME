import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import MainHeader from '../../headers/MainHeader';

const MealsScreen = ({navigation}) => {
  const styles = useStyles();

  const [meals, setMeals] = useState([]);

  const mealGroupId = useSelector(state => state.household.mealGroupId);

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
      <MainHeader {...headerProps} />
      <Text>{mealGroupId}</Text>
      <Text>{meals[0].label}</Text>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default MealsScreen;
