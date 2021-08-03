import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import {ButtonGroup} from 'react-native-elements';
import {getExpenses} from '../../../api/budgetApi';
import HistoryScreen from './HistoryScreen';
import StatScreen from './StatScreen';
import BudgetHeader from '../../headers/BudgetHeader';

const BudgetDetailsScreen = ({route, navigation}) => {
  const styles = useStyles();

  const [expenses, setExpenses] = useState([]);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(1);

  const childProps = {expenses, navigation};
  const headerProps = {navigation};

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
      <BudgetHeader {...headerProps} />
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

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
  selected_button: {
    backgroundColor: '#FCA311',
  },
}));

export default BudgetDetailsScreen;
