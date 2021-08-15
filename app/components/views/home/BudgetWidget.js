import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {makeStyles, Card} from 'react-native-elements';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const BudgetWidget = props => {
  const styles = useStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [budgetOverview, setBudgetOverview] = useState(0);

  const budgetId = useSelector(state => state.household.budgetId);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('budgets')
      .doc(budgetId)
      .onSnapshot(
        documentSnapshot => {
          const {...overview} = documentSnapshot.data();
          setBudgetOverview(overview);
          setIsLoading(false);
        },
        error => {
          console.log(error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, [budgetId]);

  return (
    <View style={styles.main_container}>
      <Card>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('Budget');
            }}>
            <Card.Title>Budget</Card.Title>
            <Card.Divider />
            <Text style={styles.balance_title}>Equilibre:</Text>
            <Text
              style={{color: budgetOverview.balance >= 0 ? 'green' : 'red'}}>
              {budgetOverview.balance} {'\u20AC'}
            </Text>
          </TouchableOpacity>
        )}
      </Card>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {},
  balance_title: {
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
}));

export default BudgetWidget;
