import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';
import {getBalance, getExpensesOverview} from '../../../api/budgetApi';

const BudgetScreen = () => {
  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const budgetId = useSelector(state => state.household.budgetId);

  useEffect(() => {
    getBalance(budgetId)
      .then(res => {
        setBalance(res);
      })
      .catch(e => {
        console.log(e);
      });
    getExpensesOverview(budgetId)
      .then(expenses => {
        let overviews = [];
        expenses.forEach(expense => {
          let overview = {
            key: expense.id,
            name: expense.data().name,
            amount: expense.data().amount,
            creation: expense.data().creation,
          };
          overviews.push(overview);
        });
        setHistory(overviews);
        setIsLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  }, [budgetId]);

  if (isLoading) {
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
    <View>
      <Text>BUDGET</Text>
      <Text>BALANCE: {balance}</Text>
      <FlatList
        data={history}
        renderItem={({item}) => (
          <View
            style={{
              height: 50,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>nom: {item.name}</Text>
            <Text>montant: {item.amount}</Text>
            <Text>date: {item.creation.toDate().toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default BudgetScreen;
