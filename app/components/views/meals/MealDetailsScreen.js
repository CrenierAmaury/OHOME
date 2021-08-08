import React, {useEffect, useState} from 'react';
import {Keyboard, ScrollView, View, Text} from 'react-native';
import {Card, Input, ListItem, makeStyles} from 'react-native-elements';
import MealHeader from '../../headers/MealHeader';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {updateMeal} from '../../../api/mealsApi';
import {renderDate} from '../../../utils/date';
import {useSelector} from 'react-redux';
import { renderMemberName } from "../../../utils/members";

const MealDetailsScreen = ({route, navigation}) => {
  const styles = useStyles();

  const [meal, setMeal] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');

  const members = useSelector(state => state.household.members);

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
          setIngredients(documentSnapshot.data().ingredients);
        },
        error => {
          console.log(error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, [navigation, route.params.meal.id, route.params.mealGroupId]);

  const addIngredient = () => {
    Keyboard.dismiss();
    const newIngredients = [...ingredients];
    newIngredients.push(newIngredient);
    updateMeal(route.params.mealGroupId, route.params.meal.id, {
      ingredients: newIngredients,
    })
      .then(() => {
        console.log('new ingredient added');
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <View style={styles.main_container}>
      <MealHeader {...headerProps} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card>
          <Text>{meal.description}</Text>
        </Card>
        <Card>
          <Card.Title>Ingrédients</Card.Title>
          <Card.Divider />
          <Input
            placeholder="nouvel ingrédient"
            onChangeText={value => {
              setNewIngredient(value);
            }}
            rightIcon={
              <Icon
                name="add"
                size={30}
                onPress={addIngredient}
                style={{
                  color: '#FCA311',
                }}
              />
            }
          />
          {ingredients.map((h, i) => (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{h}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </Card>
        <Card>
          {meal.creation ? (
            <Text>
              créé par {renderMemberName(members, meal.author)} le{' '}
              {renderDate(meal.creation.toDate())}
            </Text>
          ) : (
            <Text>loading</Text>
          )}
          {meal.modified ? (
            <Text>
              modifié par {renderMemberName(members, meal.modified.by)} le{' '}
              {renderDate(meal.modified.when.toDate())}
            </Text>
          ) : (
            <Text>loading</Text>
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default MealDetailsScreen;
