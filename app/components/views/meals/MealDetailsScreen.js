import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import {
  Card,
  Input,
  ListItem,
  Icon,
  makeStyles,
  Button,
  useTheme,
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
  const {theme} = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [meal, setMeal] = useState({});
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
          setIsLoading(false);
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
    if (newIngredient) {
      Keyboard.dismiss();
      const newIngredients = [...meal.ingredients];
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
    }
  };

  const deleteIngredient = index => {
    const newIngredients = [...meal.ingredients];
    newIngredients.splice(index, 1);
    updateMeal(route.params.mealGroupId, route.params.meal.id, {
      ingredients: newIngredients,
    })
      .then(() => {
        showSuccessSnackbar('ingrédient supprimé avec succès');
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <View style={styles.main_container}>
      <MealHeader {...headerProps} />
      {isLoading ? (
        <ActivityIndicator
          style={styles.activity_indicator}
          size="large"
          color={theme.colors.activity_indicator}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card>
            <Card.Title style={styles.title}>Description</Card.Title>
            <Card.Divider />
            <Text>{meal.description}</Text>
            <Card.Title style={styles.title}>Date</Card.Title>
            <Card.Divider />
            {meal.date ? <Text>{renderDate(meal.date.toDate())}</Text> : null}
            <Card.Title style={styles.title}>Ingrédients</Card.Title>
            <Card.Divider />
            {meal.ingredients
              ? meal.ingredients.map((h, i) => (
                  <ListItem.Swipeable
                    key={i}
                    bottomDivider
                    leftStyle={styles.no_swipe}
                    rightContent={
                      <Button
                        onPress={() => {
                          deleteIngredient(i);
                        }}
                        title="Supprimer"
                        icon={{name: 'delete', color: 'white'}}
                        buttonStyle={{
                          minHeight: '100%',
                          backgroundColor: 'red',
                        }}
                      />
                    }>
                    <ListItem.Content>
                      <ListItem.Title>{h}</ListItem.Title>
                    </ListItem.Content>
                  </ListItem.Swipeable>
                ))
              : null}
            <Input
              placeholder="Nouvel ingrédient"
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
                  color={theme.colors.highlight}
                />
              }
            />
            <View style={styles.info_section}>
              {meal.creation ? (
                <Text style={styles.info_section_text}>
                  Créé par{' '}
                  <Text style={styles.member_name}>
                    {renderMemberName(members, meal.author)}
                  </Text>{' '}
                  le {renderDate(meal.creation.toDate())}
                </Text>
              ) : null}
              {meal.modified ? (
                <Text style={styles.info_section_text}>
                  Modifié par{' '}
                  <Text style={styles.member_name}>
                    {renderMemberName(members, meal.modified.by)}
                  </Text>{' '}
                  le {renderDate(meal.modified.when.toDate())}
                </Text>
              ) : null}
            </View>
          </Card>
        </ScrollView>
      )}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
  title: {
    marginTop: 10,
  },
  no_swipe: {
    width: 0,
  },
  activity_indicator: {
    marginTop: 150,
  },
  info_section: {
    marginTop: 25,
    alignItems: 'center',
  },
  info_section_text: {
    margin: 5,
    color: theme.colors.grey,
  },
  member_name: {
    fontWeight: 'bold',
  },
}));

export default MealDetailsScreen;
