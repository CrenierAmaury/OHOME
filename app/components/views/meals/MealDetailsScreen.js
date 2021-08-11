import React, {useEffect, useState} from 'react';
import {Keyboard, ScrollView, View, Text} from 'react-native';
import {
  Card,
  Input,
  ListItem,
  Icon,
  makeStyles,
  Button,
} from 'react-native-elements';
import MealHeader from '../../headers/MealHeader';
import firestore from '@react-native-firebase/firestore';
import {updateMeal} from '../../../api/mealsApi';
import {renderDate} from '../../../utils/date';
import {useSelector} from 'react-redux';
import {renderMemberName} from '../../../utils/members';
import {showSuccessSnackbar} from '../../../utils/snackbar';

const MealDetailsScreen = ({route, navigation}) => {
  const styles = useStyles();

  const [meal, setMeal] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');

  const members = useSelector(state => state.household.members);

  const headerProps = {
    title: meal.label,
    navigation,
    meal,
    meals: route.params.meals,
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('mealGroups')
      .doc(route.params.mealGroupId)
      .collection('meals')
      .doc(route.params.meal.id)
      .onSnapshot(
        documentSnapshot => {
          const {...currentMeal} = documentSnapshot.data();
          currentMeal.id = documentSnapshot.id;
          setMeal(currentMeal);
          setIngredients(currentMeal.ingredients);
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
        setNewIngredient('');
        console.log('new ingredient added');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteIngredient = index => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    updateMeal(route.params.mealGroupId, route.params.meal.id, {
      ingredients: newIngredients,
    })
      .then(() => {
        showSuccessSnackbar('élément supprimé avec succès');
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
          <Card.Title>Description</Card.Title>
          <Card.Divider />
          <Text>{meal.description}</Text>
          <Card.Title>Ingrédients</Card.Title>
          <Card.Divider />
          <Input
            placeholder="nouvel ingrédient"
            onChangeText={value => {
              setNewIngredient(value);
            }}
            onSubmitEditing={addIngredient}
            value={newIngredient}
            rightIcon={
              <Icon
                name="add"
                size={30}
                onPress={addIngredient}
                color="#FCA311"
              />
            }
          />
          {meal.ingredients
            ? ingredients.map((h, i) => (
                <ListItem.Swipeable
                  key={i}
                  bottomDivider
                  leftStyle={{width: 0}}
                  rightContent={
                    <Button
                      onPress={() => {
                        deleteIngredient(i);
                      }}
                      title="supprimer"
                      icon={{name: 'delete', color: 'white'}}
                      buttonStyle={{minHeight: '100%', backgroundColor: 'red'}}
                    />
                  }>
                  <ListItem.Content>
                    <ListItem.Title>{h}</ListItem.Title>
                  </ListItem.Content>
                </ListItem.Swipeable>
              ))
            : null}
          {meal.creation ? (
            <Text>
              créé par {renderMemberName(members, meal.author)} le{' '}
              {renderDate(meal.creation.toDate())}
            </Text>
          ) : null}
          {meal.modified ? (
            <Text>
              modifié par {renderMemberName(members, meal.modified.by)} le{' '}
              {renderDate(meal.modified.when.toDate())}
            </Text>
          ) : null}
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
