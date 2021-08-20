import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, ScrollView} from 'react-native';
import {Card, makeStyles, useTheme} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import BudgetHeader from '../../headers/BudgetHeader';
import {renderDate} from '../../../utils/date';
import {renderMemberName} from '../../../utils/members';
import {useSelector} from 'react-redux';

const ExpenseDetailsScreen = ({route, navigation}) => {
  const styles = useStyles();
  const {theme} = useTheme();

  const [isLoading, setIsLoading] = useState(true);
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
          setIsLoading(false);
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
      {isLoading ? (
        <ActivityIndicator
          style={styles.activity_indicator}
          size="large"
          color={theme.colors.activity_indicator}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card>
            <Card.Title style={styles.title}>Montant</Card.Title>
            <Card.Divider />
            <Text>
              {expense.amount} {'\u20AC'}
            </Text>
            <Card.Title style={styles.title}>Date</Card.Title>
            <Card.Divider />
            {expense.date ? (
              <Text>{renderDate(expense.date.toDate())}</Text>
            ) : null}
            <Card.Title style={styles.title}>Catégorie</Card.Title>
            <Card.Divider />
            <Text>{expense.category}</Text>
            <View style={styles.info_section}>
              {expense.creation ? (
                <Text style={styles.info_section_text}>
                  Créé par{' '}
                  <Text style={styles.member_name}>
                    {renderMemberName(members, expense.author)}
                  </Text>{' '}
                  le {renderDate(expense.creation.toDate())}
                </Text>
              ) : null}
              {expense.modified ? (
                <Text style={styles.info_section_text}>
                  Modifié par{' '}
                  <Text style={styles.member_name}>
                    {renderMemberName(members, expense.modified.by)}
                  </Text>{' '}
                  le {renderDate(expense.modified.when.toDate())}
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

export default ExpenseDetailsScreen;
