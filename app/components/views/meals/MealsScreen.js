import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Card,
  FAB,
  makeStyles,
  Overlay,
  Icon,
  Button,
  useTheme,
} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import MainHeader from '../../headers/MainHeader';
import NewMealScreen from './NewMealScreen';
import {getWeek, renderWeek} from '../../../utils/date';
import _ from 'lodash';

const MealsScreen = ({navigation}) => {
  const styles = useStyles();
  const {theme} = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [meals, setMeals] = useState([]);
  const [weekMeals, setWeekMeals] = useState([]);
  const [week, setWeek] = useState('');
  const [previousDisable, setPreviousDisable] = useState(false);
  const [nextDisable, setNextDisable] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const mealGroupId = useSelector(state => state.household.mealGroupId);

  const childProps = {meals, mealGroupId, setIsOverlayVisible};
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
          setIsLoading(false);
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
    let weekTab = getWeek(date);
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
    for (let day of weekTab) {
      let meal = getDayMeal(mealsTab, day);
      let cardData = {
        day: dayNames[weekTab.indexOf(day)],
        meal: meal,
      };
      tempWeekMeals.push(cardData);
    }
    setWeek(renderWeek(date));
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

  const handlePreviousWeek = () => {
    if (nextDisable) {
      getWeekMeals(new Date(), meals);
      setNextDisable(false);
    } else {
      let date = new Date();
      date.setUTCDate(date.getUTCDate() - 7);
      getWeekMeals(date, meals);
      setPreviousDisable(true);
    }
  };

  const handleNextWeek = () => {
    if (previousDisable) {
      getWeekMeals(new Date(), meals);
      setPreviousDisable(false);
    } else {
      let date = new Date();
      date.setUTCDate(date.getUTCDate() + 7);
      getWeekMeals(date, meals);
      setNextDisable(true);
    }
  };

  if (isLoading) {
    return (
      <View>
        <MainHeader {...headerProps} />
        <ActivityIndicator
          style={{marginTop: 150}}
          size="large"
          color="#0000ff"
        />
      </View>
    );
  }

  return (
    <View style={styles.main_container}>
      <MainHeader {...headerProps} />
      <View style={styles.week_change_container}>
        <Icon
          name="keyboard-arrow-left"
          color={theme.colors.highlight}
          size={37}
          onPress={handlePreviousWeek}
          disabled={previousDisable}
        />
        <Text style={styles.week_change_center}>{week}</Text>
        <Icon
          name="keyboard-arrow-right"
          color={theme.colors.highlight}
          size={37}
          onPress={handleNextWeek}
          disabled={nextDisable}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {weekMeals.map((e, i) => (
          <Card key={i}>
            <TouchableOpacity
              onPress={() => {
                if (e.meal) {
                  navigation.navigate('MealDetailsScreen', {
                    mealGroupId: mealGroupId,
                    meal: e.meal,
                    meals: meals,
                  });
                } else {
                  setIsOverlayVisible(true);
                }
              }}>
              <Card.Title>{e.day}</Card.Title>
              <Card.Divider
                color={e.meal ? theme.colors.highlight : theme.colors.grey}
              />
              <Text style={styles.meal_text}>
                {e.meal ? (
                  e.meal.label
                ) : (
                  <View style={styles.no_meal_container}>
                    <Icon name="add" color={theme.colors.grey} />
                    <Text style={styles.no_meal_text}> Ajouter un repas</Text>
                  </View>
                )}
              </Text>
            </TouchableOpacity>
          </Card>
        ))}
        <Button
          title="historique complet"
          type="solid"
          raised={true}
          onPress={() => {
            navigation.navigate('MealsHistoryScreen', {
              mealGroupId: mealGroupId,
              meals: meals,
            });
          }}
          titleStyle={styles.button_title}
          containerStyle={styles.button_container}
          buttonStyle={styles.button}
        />
      </ScrollView>
      <FAB
        color={theme.colors.highlight}
        placement="right"
        icon={<Icon name="add" color={theme.colors.white} />}
        onPress={() => {
          setIsOverlayVisible(true);
        }}
      />
      <Overlay
        isVisible={isOverlayVisible}
        onBackdropPress={() => {
          setIsOverlayVisible(false);
        }}
        overlayStyle={styles.overlay}
        backdropStyle={styles.overlay_back}>
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
    margin: 15,
    flexDirection: 'row',
  },
  meal_text: {
    color: theme.colors.blue,
  },
  no_meal_container: {
    margin: 10,
    flexDirection: 'row',
  },
  no_meal_text: {
    color: theme.colors.grey,
  },
  week_change_center: {
    flex: 1,
    textAlign: 'center',
    fontSize: 19,
  },
  button_container: {
    width: '100%',
    height: 100,
    marginTop: 10,
  },
  button_title: {
    color: theme.colors.highlight,
  },
  button: {
    backgroundColor: theme.colors.white,
  },
  overlay: {
    width: '80%',
  },
  overlay_back: {
    backgroundColor: theme.colors.grey,
    opacity: 0.7,
  },
}));

export default MealsScreen;
