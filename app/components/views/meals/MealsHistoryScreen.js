import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Button, makeStyles} from 'react-native-elements';
import {ListItem} from 'react-native-elements';
import _ from 'lodash';
import TitleHeader from '../../headers/TitleHeader';
import {removeMeal} from '../../../api/mealsApi';

const MealsHistoryScreen = ({route, navigation}) => {
  const styles = useStyles();

  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [dateDescColor, setDateDescColor] = useState('#FCA311');
  const [dateAscColor, setDateAscColor] = useState('#8b8b8b');

  const headerProps = {title: 'Historique des repas', navigation};

  useEffect(() => {
    setHistory(route.params.meals);
    setFilteredHistory(
      _.reverse(
        _.sortBy(route.params.meals, e => {
          return e.date;
        }),
      ),
    );
  }, [route.params.meals]);

  const deleteMeal = (mealGroupID, mealID, index) => {
    removeMeal(mealGroupID, mealID)
      .then(() => {
        console.log('meal deleted');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const sortLists = filter => {
    if (filter === 'dateAsc') {
      setFilteredHistory(
        _.sortBy(history, e => {
          return e.date;
        }),
      );
    } else {
      setFilteredHistory(
        _.reverse(
          _.sortBy(history, e => {
            return e.date;
          }),
        ),
      );
    }
  };

  return (
    <View style={styles.main_container}>
      <TitleHeader {...headerProps} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.options_container}>
          <Text
            style={[styles.options, {color: dateDescColor}]}
            onPress={() => {
              sortLists('dateDesc');
              setDateAscColor('#8b8b8b');
              setDateDescColor('#FCA311');
            }}>
            plus récent
          </Text>
          <Text
            style={[styles.options, {color: dateAscColor}]}
            onPress={() => {
              sortLists('dateAsc');
              setDateAscColor('#FCA311');
              setDateDescColor('#8b8b8b');
            }}>
            plus ancien
          </Text>
        </View>
        {filteredHistory.map((e, i) => (
          <ListItem.Swipeable
            key={i}
            bottomDivider
            onPress={() => {
              navigation.navigate('MealDetailsScreen', {
                mealGroupId: route.params.mealGroupId,
                meal: e,
                meals: route.params.meals,
              });
            }}
            leftContent={
              <Button
                title="détails"
                icon={{name: 'info', color: 'white'}}
                buttonStyle={{minHeight: '100%'}}
                onPress={() => {
                  navigation.navigate('MealDetailsScreen', {
                    mealGroupId: route.params.mealGroupId,
                    meal: e,
                    meals: route.params.meals,
                  });
                }}
              />
            }
            rightContent={
              <Button
                onPress={() => {
                  deleteMeal(route.params.mealGroupId, e.id, i);
                }}
                title="supprimer"
                icon={{name: 'delete', color: 'white'}}
                buttonStyle={{minHeight: '100%', backgroundColor: 'red'}}
              />
            }>
            <ListItem.Content>
              <ListItem.Title>{e.label}</ListItem.Title>
              <ListItem.Subtitle>{e.description}</ListItem.Subtitle>
              <ListItem.Subtitle>
                {e.date.toDate().toLocaleDateString()}
              </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem.Swipeable>
        ))}
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
  options_container: {
    margin: 10,
    flexDirection: 'row',
  },
  options: {
    flex: 1,
    padding: 5,
    textAlign: 'center',
    color: '#8b8b8b',
  },
}));

export default MealsHistoryScreen;
