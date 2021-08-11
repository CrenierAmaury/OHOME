import React, {useEffect, useState} from 'react';
import {Text, View, ActivityIndicator, ScrollView} from 'react-native';
import {makeStyles} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {getLastFiveExpenses} from '../../../api/budgetApi';
import {
  Card,
  ListItem,
  FAB,
  Overlay,
  Button,
  Icon,
} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import NewExpenseScreen from './NewExpenseScreen';
import MainHeader from '../../headers/MainHeader';

const BudgetScreen = ({navigation}) => {
  const styles = useStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [lastHistory, setLastHistory] = useState([]);
  const [budgetOverview, setBudgetOverview] = useState(0);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const budgetId = useSelector(state => state.household.budgetId);

  const childProps = {budgetId, budgetOverview, setIsOverlayVisible};
  const navProps = {budgetId, budgetOverview};
  const headerProps = {navigation};

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('budgets')
      .doc(budgetId)
      .onSnapshot(
        documentSnapshot => {
          const {...overview} = documentSnapshot.data();
          setBudgetOverview(overview);
          getLastFiveExpenses(budgetId)
            .then(overviews => {
              setLastHistory(overviews);
              setIsLoading(false);
            })
            .catch(e => {
              console.log(e);
            });
        },
        error => {
          console.log(error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, [budgetId]);

  if (isLoading) {
    return (
      <View>
        <MainHeader {...headerProps} />
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
      <MainHeader {...headerProps} />
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
          <Text>{budgetOverview.expense * -1}</Text>
        </Card>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card containerStyle={styles.last_five}>
          <Card.Title>derniers ajouts</Card.Title>
          <Card.Divider />
          {lastHistory.map((h, i) => (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{h.label}</ListItem.Title>
                <ListItem.Subtitle>{h.amount}</ListItem.Subtitle>
                <ListItem.Subtitle>
                  {h.date.toDate().toLocaleDateString()}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))}
        </Card>
        <Button
          title="détails"
          type="solid"
          raised={true}
          onPress={() => {
            navigation.navigate('BudgetDetailsScreen', {...navProps});
          }}
          titleStyle={{color: '#FCA311'}}
          containerStyle={{
            width: '100%',
            marginTop: 10,
          }}
          buttonStyle={{
            backgroundColor: '#FBFBFB',
          }}
        />
      </ScrollView>
      <FAB
        color="#FCA311"
        placement="right"
        icon={<Icon name="add" color="white" />}
        onPress={() => {
          setIsOverlayVisible(true);
        }}
      />
      <Overlay
        isVisible={isOverlayVisible}
        onBackdropPress={() => {
          setIsOverlayVisible(false);
        }}
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

const useStyles = makeStyles(theme => ({
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
}));

export default BudgetScreen;
