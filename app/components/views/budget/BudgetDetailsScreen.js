import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ButtonGroup} from 'react-native-elements';
import {getExpenses} from '../../../api/budgetApi';
import HistoryScreen from './HistoryScreen';
import StatScreen from './StatScreen';
import BudgetHeader from '../../headers/BudgetHeader';

const BudgetDetailsScreen = ({route}) => {
  const [expenses, setExpenses] = useState([]);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(1);

  const childProps = {expenses};

  useEffect(() => {
    getExpenses(route.params.budgetId)
      .then(res => {
        setExpenses(res);
      })
      .catch(e => {
        console.log(e);
      });
  }, [route.params.budgetId]);

  return (
    <View style={styles.main_container}>
      <BudgetHeader />
      <ButtonGroup
        onPress={buttonIndex => {
          setSelectedButtonIndex(buttonIndex);
        }}
        selectedIndex={selectedButtonIndex}
        buttons={['graphique', 'historique']}
        selectedButtonStyle={styles.selected_button}
      />
      {selectedButtonIndex === 1 ? (
        <HistoryScreen {...childProps} />
      ) : (
        <StatScreen {...childProps} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  selected_button: {
    backgroundColor: '#FCA311',
  },
});

export default BudgetDetailsScreen;
