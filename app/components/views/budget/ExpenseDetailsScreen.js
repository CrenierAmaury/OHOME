import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {Card, makeStyles} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import BudgetHeader from '../../headers/BudgetHeader';
import {renderDate} from '../../../utils/date';
import {renderMemberName} from '../../../utils/members';
import {useSelector} from 'react-redux';

const ExpenseDetailsScreen = ({route, navigation}) => {
  const styles = useStyles();

  const [expense, setExpense] = useState({});

  const members = useSelector(state => state.household.members);

  const headerProps = {
    title: expense.label,
    expense,
    budgetOverview: route.params.budgetOverview,
    navigation,
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('budgets')
      .doc(route.params.budgetId)
      .collection('expenses')
      .doc(route.params.expense.id)
      .onSnapshot(
        documentSnapshot => {
          const {...currentExpense} = documentSnapshot.data();
          currentExpense.id = documentSnapshot.id;
          setExpense(currentExpense);
        },
        error => {
          console.log(error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, [navigation, route.params.budgetId, route.params.expense.id]);

  return (
    <View style={styles.main_container}>
      <BudgetHeader {...headerProps} />
      <Card>
        <Card.Title>Montant</Card.Title>
        <Card.Divider />
        <Text>{expense.amount}</Text>
        <Card.Title>Date</Card.Title>
        <Card.Divider />
        {expense.date ? <Text>{renderDate(expense.date.toDate())}</Text> : null}
        <Card.Title>Catégorie</Card.Title>
        <Card.Divider />
        <Text>{expense.category}</Text>
        <Card.Divider />
        {expense.creation ? (
          <Text>
            créé par {renderMemberName(members, expense.author)} le{' '}
            {renderDate(expense.creation.toDate())}
          </Text>
        ) : null}
        {expense.modified ? (
          <Text>
            modifié par {renderMemberName(members, expense.modified.by)} le{' '}
            {renderDate(expense.modified.when.toDate())}
          </Text>
        ) : null}
      </Card>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default ExpenseDetailsScreen;
