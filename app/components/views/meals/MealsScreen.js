import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Card, FAB, ListItem, makeStyles, Overlay} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import MainHeader from '../../headers/MainHeader';
import NewMealScreen from './NewMealScreen';
import {renderDate, renderWeek} from '../../../utils/date';
import _ from "lodash";

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
        },
        error => {
          console.log(error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, [mealGroupId]);

  const renderCards = weekMealsData => {
    return (
      <Card>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MealDetailsScreen');
          }}>
          <Card.Title>Mercredi</Card.Title>
          <Card.Divider />
          <Text>repas</Text>
        </TouchableOpacity>
      </Card>
    );
  };

  const getDayMeal = () => {

  };

  return (
    <View style={styles.main_container}>
      <MainHeader {...headerProps} />
      <View style={styles.week_change_container}>
        <Icon
          name="keyboard-arrow-left"
          color="black"
          size={35}
          onPress={() => {}}
        />
        <Text style={styles.week_change_center}>{renderWeek(new Date())}</Text>
        <Icon
          name="keyboard-arrow-right"
          color="black"
          size={35}
          onPress={() => {}}
        />
      </View>
      <ScrollView>
        <Card>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Budget');
            }}>
            <Card.Title>Lundi</Card.Title>
            <Card.Divider />
            <Text>repas</Text>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Budget');
            }}>
            <Card.Title>Mardi</Card.Title>
            <Card.Divider />
            <Text>repas</Text>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Budget');
            }}>
            <Card.Title>Mercredi</Card.Title>
            <Card.Divider />
            <Text>repas</Text>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Budget');
            }}>
            <Card.Title>Jeudi</Card.Title>
            <Card.Divider />
            <Text>repas</Text>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Budget');
            }}>
            <Card.Title>Vendredi</Card.Title>
            <Card.Divider />
            <Text>repas</Text>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Budget');
            }}>
            <Card.Title>Samedi</Card.Title>
            <Card.Divider />
            <Text>repas</Text>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Budget');
            }}>
            <Card.Title>Dimanche</Card.Title>
            <Card.Divider />
            <Text>repas</Text>
          </TouchableOpacity>
        </Card>
        {meals.map((h, i) => (
          <ListItem
            key={i}
            bottomDivider
            onPress={() => {
              navigation.navigate('MealDetailsScreen', {
                mealGroupId: mealGroupId,
                meal: h,
              });
            }}>
            <ListItem.Content>
              <ListItem.Title>{renderDate(h.date.toDate())}</ListItem.Title>
              <ListItem.Subtitle>{h.label}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
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
