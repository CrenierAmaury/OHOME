import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  getBalanceIncomeExpense,
  getLastFiveExpenses,
} from '../../../api/budgetApi';
import {Card, ListItem, FAB, Overlay, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NewExpenseScreen from './NewExpenseScreen';

const BudgetScreen = ({navigation}) => {
  const [history, setHistory] = useState([]);
  const [budgetOverview, setBudgetOverview] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const budgetId = useSelector(state => state.household.budgetId);

  const childProps = {budgetId, budgetOverview, setIsOverlayVisible};

  useEffect(() => {
    getBudgetOverview(budgetId);
    getExpensesOverview(budgetId);
  }, [budgetId]);

  const getBudgetOverview = id => {
    getBalanceIncomeExpense(id)
      .then(overview => {
        setBudgetOverview(overview);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getExpensesOverview = id => {
    getLastFiveExpenses(id)
      .then(overviews => {
        setHistory(overviews);
        setIsLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const changeOverlayIsVisible = () => {
    if (isOverlayVisible) {
      setIsOverlayVisible(false);
    } else {
      setIsOverlayVisible(true);
    }
  };

  if (isLoading) {
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
      <Card containerStyle={styles.balance}>
        <Card.Title>Equilibre</Card.Title>
        <Text>{budgetOverview.balance}</Text>
      </Card>
      <View style={styles.income_expense}>
        <Card containerStyle={styles.income}>
          <Card.Title>Revenu</Card.Title>
          <Text>{budgetOverview.income}</Text>
        </Card>
        <Card containerStyle={styles.expense}>
          <Card.Title>Dépense</Card.Title>
          <Text>{budgetOverview.expense}</Text>
        </Card>
      </View>
      <ScrollView>
        <Card containerStyle={styles.last_five}>
          <Card.Title>
            <Button
              title="détails"
              type="solid"
              raised={true}
              onPress={() => {
                navigation.navigate('BudgetHistoryScreen', {...childProps});
              }}
              containerStyle={{
                backgroundColor: '#FBFBFB',
              }}
              buttonStyle={{
                backgroundColor: '#FCA311',
              }}
            />
          </Card.Title>
          <Card.Divider />
          {history.map((h, i) => (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{h.name}</ListItem.Title>
                <ListItem.Subtitle>{h.amount}</ListItem.Subtitle>
                <ListItem.Subtitle>
                  {h.date.toDate().toLocaleDateString()}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))}
        </Card>
      </ScrollView>
      <FAB
        color="#FCA311"
        placement="right"
        icon={<Icon name="add" color="white" />}
        onPress={changeOverlayIsVisible}
      />
      <Overlay
        isVisible={isOverlayVisible}
        onBackdropPress={changeOverlayIsVisible}
        overlayStyle={{
          width: '80%',
        }}
        backdropStyle={{
          backgroundColor: 'grey',
          opacity: 0.7,
        }}>
        <NewExpenseScreen {...childProps} />
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#FBFBFB',
    flex: 1,
  },
  balance: {
    margin: 10,
    borderWidth: 0,
  },
  income_expense: {
    flexDirection: 'row',
  },
  income: {
    width: '45.8%',
    margin: 10,
    marginRight: 5,
    borderWidth: 0,
  },
  expense: {
    width: '45.8%',
    margin: 10,
    marginLeft: 5,
    borderWidth: 0,
  },
  last_five: {
    margin: 10,
    borderWidth: 0,
  },
});

export default BudgetScreen;
