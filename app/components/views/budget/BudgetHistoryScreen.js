import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ButtonGroup} from 'react-native-elements';
import {getExpenses} from '../../../api/budgetApi';
import HistoryScreen from './HistoryScreen';

const BudgetHistoryScreen = ({route}) => {
  const [expenses, setExpenses] = useState([]);

  const childProps = {expenses};

  useEffect(() => {
    getExpenses(route.params.budgetId)
      .then(res => {
        setExpenses(res);
      })
      .catch(e => {
        console.log(e);
      });
  }, [route.params.budgetId]);

  return (
    <View style={styles.main_container}>
      <ButtonGroup buttons={['graphique', 'historique']} />
      <Text>balance: {route.params.budgetOverview.balance}</Text>
      <HistoryScreen {...childProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default BudgetHistoryScreen;
