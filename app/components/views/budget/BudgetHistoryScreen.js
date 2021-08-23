import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, Text, View} from 'react-native';
import {Button, makeStyles} from 'react-native-elements';
import {ListItem} from 'react-native-elements';
import _ from 'lodash';
import {removeExpense} from '../../../api/budgetApi';

const BudgetHistoryScreen = props => {
  const styles = useStyles();

  const [filteredHistory, setFilteredHistory] = useState([]);
  const [allColor, setAllColor] = useState('#FCA311');
  const [expenseColor, setExpenseColor] = useState('#8b8b8b');
  const [incomeColor, setIncomeColor] = useState('#8b8b8b');

  useEffect(() => {
    setFilteredHistory(props.expenses);
  }, [props.expenses]);

  const deleteExpense = (budgetID, expenseID, amount, budgetOverview) => {
    removeExpense(budgetID, expenseID, amount, budgetOverview)
      .then(() => {
        console.log('expense deleted');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const sortLists = filter => {
    if (filter === 'all') {
      setFilteredHistory(props.expenses);
    } else if (filter === 'expense') {
      setFilteredHistory(
        _.filter(props.expenses, e => {
          return e.amount < 0;
        }),
      );
    } else {
      setFilteredHistory(
        _.filter(props.expenses, e => {
          return e.amount >= 0;
        }),
      );
    }
  };

  if (props.isLoading) {
    return (
      <View>
        <ActivityIndicator
          style={{marginTop: 150}}
          size="large"
          color="#0000ff"
        />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.options_container}>
        <Text
          style={[styles.options, {color: allColor}]}
          onPress={() => {
            sortLists('all');
            setAllColor('#FCA311');
            setExpenseColor('#8b8b8b');
            setIncomeColor('#8b8b8b');
          }}>
          Tous
        </Text>
        <Text
          style={[styles.options, {color: expenseColor}]}
          onPress={() => {
            sortLists('expense');
            setAllColor('#8b8b8b');
            setExpenseColor('#FCA311');
            setIncomeColor('#8b8b8b');
          }}>
          Dépenses
        </Text>
        <Text
          style={[styles.options, {color: incomeColor}]}
          onPress={() => {
            sortLists('income');
            setAllColor('#8b8b8b');
            setExpenseColor('#8b8b8b');
            setIncomeColor('#FCA311');
          }}>
          Rentrées
        </Text>
      </View>
      {filteredHistory.map((e, i) => (
        <ListItem.Swipeable
          key={i}
          bottomDivider
          onPress={() => {
            props.navigation.navigate('ExpenseDetailsScreen', {
              budgetId: props.budgetId,
              expense: e,
              budgetOverview: props.budgetOverview,
            });
          }}
          leftContent={
            <Button
              title="détails"
              icon={{name: 'info', color: 'white'}}
              buttonStyle={{minHeight: '100%'}}
              onPress={() => {
                props.navigation.navigate('ExpenseDetailsScreen', {
                  budgetId: props.budgetId,
                  expense: e,
                  budgetOverview: props.budgetOverview,
                });
              }}
            />
          }
          rightContent={
            <Button
              onPress={() => {
                deleteExpense(
                  props.budgetId,
                  e.id,
                  e.amount,
                  props.budgetOverview,
                );
              }}
              title="supprimer"
              icon={{name: 'delete', color: 'white'}}
              buttonStyle={{minHeight: '100%', backgroundColor: 'red'}}
            />
          }>
          <ListItem.Content>
            <ListItem.Title>{e.label}</ListItem.Title>
            <ListItem.Subtitle>
              {e.amount} {'\u20AC'}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              {e.date.toDate().toLocaleDateString()}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem.Swipeable>
      ))}
    </ScrollView>
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

export default BudgetHistoryScreen;
