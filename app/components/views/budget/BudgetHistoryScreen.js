import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ButtonGroup} from 'react-native-elements';

const BudgetHistoryScreen = ({route}) => {
  return (
    <View>
      <ButtonGroup buttons={['graphique', 'historique']} />
      <Text>balance: {route.params.budgetOverview.balance}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default BudgetHistoryScreen;
