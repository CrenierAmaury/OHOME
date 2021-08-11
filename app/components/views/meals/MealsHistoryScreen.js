import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import {ListItem} from 'react-native-elements';
import _ from 'lodash';
import TitleHeader from '../../headers/TitleHeader';

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
          <ListItem
            key={i}
            bottomDivider
            onPress={() => {
              navigation.navigate('MealDetailsScreen', {
                mealGroupId: route.params.mealGroupId,
                meal: e,
                meals: route.params.meals,
              });
            }}>
            <ListItem.Content>
              <ListItem.Title>{e.label}</ListItem.Title>
              <ListItem.Subtitle>{e.description}</ListItem.Subtitle>
              <ListItem.Subtitle>
                {e.date.toDate().toLocaleDateString()}
              </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
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
