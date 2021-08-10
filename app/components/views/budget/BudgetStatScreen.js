import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import {VictoryPie, VictoryTheme} from 'victory-native';

const BudgetStatScreen = props => {
  const styles = useStyles();

  const [expenses, setExpenses] = useState([]);

  const data = [
    {x: 'Déplacements', y: 30},
    {x: 'Nourriture', y: 20},
    {x: 'Assurances', y: 10},
  ];

  useEffect(() => {
    setExpenses(props.expenses);
  }, [props.expenses]);

  return (
    <View style={styles.main_container}>
      <VictoryPie
        data={data}
        theme={VictoryTheme.material}
        colorScale={['tomato', 'orange', 'gold', 'cyan', 'navy']}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default BudgetStatScreen;
