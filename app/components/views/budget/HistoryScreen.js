import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import {ListItem} from 'react-native-elements';
import _ from 'lodash';

const HistoryScreen = props => {
  const styles = useStyles();

  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [allColor, setAllColor] = useState('#FCA311');
  const [expenseColor, setExpenseColor] = useState('#8b8b8b');
  const [incomeColor, setIncomeColor] = useState('#8b8b8b');

  useEffect(() => {
    setHistory(props.expenses);
    setFilteredHistory(props.expenses);
  }, [props.expenses]);

  const sortLists = filter => {
    if (filter === 'all') {
      setFilteredHistory(history);
    } else if (filter === 'expense') {
      setFilteredHistory(
        _.filter(history, e => {
          return e.amount < 0;
        }),
      );
    } else {
      setFilteredHistory(
        _.filter(history, e => {
          return e.amount >= 0;
        }),
      );
    }
  };

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
          tous
        </Text>
        <Text
          style={[styles.options, {color: expenseColor}]}
          onPress={() => {
            sortLists('expense');
            setAllColor('#8b8b8b');
            setExpenseColor('#FCA311');
            setIncomeColor('#8b8b8b');
          }}>
          dépenses
        </Text>
        <Text
          style={[styles.options, {color: incomeColor}]}
          onPress={() => {
            sortLists('income');
            setAllColor('#8b8b8b');
            setExpenseColor('#8b8b8b');
            setIncomeColor('#FCA311');
          }}>
          rentrées
        </Text>
      </View>
      {filteredHistory.map((e, i) => (
        <ListItem key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{e.label}</ListItem.Title>
            <ListItem.Subtitle>{e.amount}</ListItem.Subtitle>
            <ListItem.Subtitle>
              {e.date.toDate().toLocaleDateString()}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
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

export default HistoryScreen;
