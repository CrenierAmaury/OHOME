import React from 'react';
import {Text, View} from 'react-native';
import {makeStyles} from 'react-native-elements';

const ExpenseDetailsScreen = () => {
  const styles = useStyles();

  return (
    <View style={styles.main_container}>
      <Text>EXPENSE DETAILS</Text>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default ExpenseDetailsScreen;
