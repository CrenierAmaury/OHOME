import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {makeStyles, Card} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {getBalanceIncomeExpense} from '../../../api/budgetApi';

const BudgetWidget = navigation => {
  const styles = useStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [budgetOverview, setBudgetOverview] = useState(0);

  const budgetId = useSelector(state => state.household.budgetId);

  useEffect(() => {
    getBudgetOverview(budgetId);
  }, [budgetId]);

  const getBudgetOverview = id => {
    getBalanceIncomeExpense(id)
      .then(overview => {
        setBudgetOverview(overview);
        setIsLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <View style={styles.main_container}>
      <Card>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Budget');
            }}>
            <Card.Title>Budget</Card.Title>
            <Card.Divider />
            <Text>Equilibre: {budgetOverview.balance} euros</Text>
          </TouchableOpacity>
        )}
      </Card>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default BudgetWidget;
