import React from 'react';
import {Text, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import BudgetHeader from '../../headers/BudgetHeader';

const ExpenseDetailsScreen = ({route, navigation}) => {
  const styles = useStyles();

  const headerProps = {navigation};

  return (
    <View style={styles.main_container}>
      <BudgetHeader {...headerProps} />
      <Text>EXPENSE DETAILS</Text>
      <Text>{route.params.expense.label}</Text>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default ExpenseDetailsScreen;
