import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
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

  if (props.isLoading) {
    return (
      <View>
        <ActivityIndicator
          style={{marginTop: 150}}
          size="large"
          color="#0000ff"
        />
      </View>
    );
  }

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
