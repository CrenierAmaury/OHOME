import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, Text, View} from 'react-native';
import {Card, makeStyles, useTheme} from 'react-native-elements';
import {VictoryPie, VictoryTheme} from 'victory-native';
import _ from 'lodash';

const BudgetStatScreen = props => {
  const styles = useStyles();
  const {theme} = useTheme();

  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [isInitializingStats, setIsInitializingStats] = useState(true);

  useEffect(() => {
    const dataExpenseTab = [];
    const dataIncomeTab = [];
    props.budgetOverview.categories.forEach(cat => {
      let catExpenseAmount = 0;
      let catIncomeAmount = 0;
      _.filter(props.expenses, e => {
        return e.category === cat.label && e.amount < 0;
      }).forEach(catValue => {
        catExpenseAmount += catValue.amount;
      });
      if (catExpenseAmount) {
        dataExpenseTab.push({
          x: cat.label,
          y: catExpenseAmount * -1,
          fill: cat.color,
        });
      }
      _.filter(props.expenses, e => {
        return e.category === cat.label && e.amount > 0;
      }).forEach(catValue => {
        catIncomeAmount += catValue.amount;
      });
      if (catIncomeAmount) {
        dataIncomeTab.push({
          x: cat.label,
          y: catIncomeAmount,
          fill: cat.color,
        });
      }
    });
    setExpenseData(dataExpenseTab);
    setIncomeData(dataIncomeTab);
    setIsInitializingStats(false);
  }, [props.budgetOverview.categories, props.expenses]);

  const renderExpensePercentage = value => {
    return (
      Math.round((value / props.budgetOverview.expense) * -1 * 100 * 10) / 10
    );
  };

  const renderIncomePercentage = value => {
    return Math.round((value / props.budgetOverview.income) * 100 * 10) / 10;
  };

  return (
    <View style={styles.main_container}>
      {props.isLoading || isInitializingStats ? (
        <ActivityIndicator
          style={styles.activity_indicator}
          size="large"
          color={theme.colors.activity_indicator}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card>
            <Card.Title>Dépenses par catégories</Card.Title>
            <Card.Divider />
            <VictoryPie
              data={expenseData}
              sortKey="x"
              sortOrder="descending"
              width={300}
              labelPlacement="perpendicular"
              padAngle={5}
              theme={VictoryTheme.material}
              style={{
                data: {
                  fill: ({datum}) => datum.fill,
                },
              }}
            />
            {expenseData.map((h, i) => (
              <Text key={i} style={{color: h.fill}}>
                {h.x}: {h.y} {'\u20AC'} ({renderExpensePercentage(h.y)} %)
              </Text>
            ))}
          </Card>
          <Card>
            <Card.Title>Revenus par catégories</Card.Title>
            <Card.Divider />
            <VictoryPie
              data={incomeData}
              sortKey="x"
              sortOrder="descending"
              width={300}
              labelPlacement="perpendicular"
              padAngle={5}
              theme={VictoryTheme.material}
              style={{
                data: {
                  fill: ({datum}) => datum.fill,
                },
              }}
            />
            {incomeData.map((h, i) => (
              <Text key={i} style={{color: h.fill}}>
                {h.x}: {h.y} {'\u20AC'} ({renderIncomePercentage(h.y)} %)
              </Text>
            ))}
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
  activity_indicator: {
    marginTop: 150,
  },
}));

export default BudgetStatScreen;
