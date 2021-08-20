import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ButtonGroup, makeStyles} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import BudgetHistoryScreen from './BudgetHistoryScreen';
import BudgetStatScreen from './BudgetStatScreen';
import TitleHeader from '../../headers/TitleHeader';

const BudgetDetailsScreen = ({route, navigation}) => {
  const styles = useStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(1);

  const childProps = {
    isLoading,
    expenses,
    budgetId: route.params.budgetId,
    budgetOverview: route.params.budgetOverview,
    navigation,
  };
  const headerProps = {title: 'Détails du budget', navigation};

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('budgets')
      .doc(route.params.budgetId)
      .collection('expenses')
      .onSnapshot(
        querySnapshot => {
          const expensesTab = [];
          querySnapshot.docs.forEach(doc => {
            const {...expense} = doc.data();
            expense.id = doc.id;
            expensesTab.push(expense);
          });
          setExpenses(expensesTab);
          setIsLoading(false);
        },
        error => {
          console.log(error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, [route.params.budgetId]);

  return (
    <View style={styles.main_container}>
      <TitleHeader {...headerProps} />
      <ButtonGroup
        onPress={buttonIndex => {
          setSelectedButtonIndex(buttonIndex);
        }}
        selectedIndex={selectedButtonIndex}
        buttons={['Graphiques', 'Historique']}
        selectedButtonStyle={styles.selected_button}
      />
      {selectedButtonIndex === 1 ? (
        <BudgetHistoryScreen {...childProps} />
      ) : (
        <BudgetStatScreen {...childProps} />
      )}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
  selected_button: {
    backgroundColor: theme.colors.highlight,
  },
}));

export default BudgetDetailsScreen;
