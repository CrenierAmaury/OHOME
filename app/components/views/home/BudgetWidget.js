import React from 'react';
import {View, Text} from 'react-native';
import {makeStyles} from 'react-native-elements';

const BudgetWidget = () => {
  const styles = useStyles();

  return (
    <View style={styles.main_container}>
      <Text>BUDGET WIDGET</Text>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default BudgetWidget;
