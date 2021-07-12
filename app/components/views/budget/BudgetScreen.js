import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {getOverview, getLastFive} from '../../../api/budgetApi';
import {Card, ListItem, FAB, Overlay} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NewExpenseScreen from './NewExpenseScreen';

const BudgetScreen = () => {
  const [history, setHistory] = useState([]);
  const [resume, setResume] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const budgetId = useSelector(state => state.household.budgetId);

  useEffect(() => {
    getOverview(budgetId)
      .then(res => {
        setResume(res);
      })
      .catch(e => {
        console.log(e);
      });
    getLastFive(budgetId)
      .then(expenses => {
        let overviews = [];
        expenses.forEach(expense => {
          let overview = {
            key: expense.id,
            name: expense.data().name,
            amount: expense.data().amount,
            date: expense.data().date,
          };
          overviews.push(overview);
        });
        setHistory(overviews);
        setIsLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  }, [budgetId]);

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
        <Text>{resume.balance}</Text>
      </Card>
      <View style={styles.income_expense}>
        <Card containerStyle={styles.income}>
          <Card.Title>Revenu</Card.Title>
          <Text>{resume.income}</Text>
        </Card>
        <Card containerStyle={styles.expense}>
          <Card.Title>Dépense</Card.Title>
          <Text>{resume.expense}</Text>
        </Card>
      </View>
      <ScrollView>
        <Card containerStyle={styles.last_five}>
          <Card.Title>Dernières entrées</Card.Title>
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
        color="grey"
        placement="right"
        icon={<Icon name="add" />}
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
        <NewExpenseScreen budgetId={budgetId} />
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  balance: {
    margin: 10,
  },
  income_expense: {
    flexDirection: 'row',
  },
  income: {
    width: '45.8%',
    margin: 10,
    marginRight: 5,
  },
  expense: {
    width: '45.8%',
    margin: 10,
    marginLeft: 5,
  },
  last_five: {
    margin: 10,
  },
});

export default BudgetScreen;
