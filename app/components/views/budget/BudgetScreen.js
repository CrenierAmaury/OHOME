import React, {useEffect, useState} from 'react';
import {Text, View, ActivityIndicator, ScrollView} from 'react-native';
import {makeStyles, useTheme} from 'react-native-elements';
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
  const {theme} = useTheme();

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

  return (
    <View style={styles.main_container}>
      <MainHeader {...headerProps} />
      {isLoading ? (
        <ActivityIndicator
          style={styles.activity_indicator}
          size="large"
          color={theme.colors.activity_indicator}
        />
      ) : (
        <View style={styles.main_container}>
          <Card containerStyle={styles.balance}>
            <Card.Title>Equilibre</Card.Title>
            <Text>
              {budgetOverview.balance} {'\u20AC'}
            </Text>
          </Card>
          <View style={styles.income_expense}>
            <Card containerStyle={styles.income}>
              <Card.Title>Revenu</Card.Title>
              <Text>
                {budgetOverview.income} {'\u20AC'}
              </Text>
            </Card>
            <Card containerStyle={styles.expense}>
              <Card.Title>D??pense</Card.Title>
              <Text>
                {budgetOverview.expense * -1} {'\u20AC'}
              </Text>
            </Card>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Card containerStyle={styles.last_five_container}>
              <Card.Title>Dernier ajout</Card.Title>
              <Card.Divider />
              {lastHistory.length > 0 ? (
                lastHistory.map((h, i) => (
                  <ListItem key={i} bottomDivider>
                    <ListItem.Content>
                      <ListItem.Title>
                        {h.label}
                      </ListItem.Title>
                      <ListItem.Subtitle>
                        {h.amount} {'\u20AC'}
                      </ListItem.Subtitle>
                      <ListItem.Subtitle>
                        {h.date.toDate().toLocaleDateString()}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                ))
              ) : (
                <View style={styles.no_data_yet_container}>
                  <Text>Pas encore de donn??es</Text>
                </View>
              )}
            </Card>
            <Button
              title="D??tails"
              type="solid"
              raised={true}
              onPress={() => {
                navigation.navigate('BudgetDetailsScreen', {...navProps});
              }}
              titleStyle={styles.button_title}
              containerStyle={styles.button_container}
              buttonStyle={styles.button}
            />
          </ScrollView>
        </View>
      )}
      <FAB
        color={theme.colors.highlight}
        placement="right"
        icon={<Icon name="add" color={theme.colors.white} />}
        onPress={() => {
          setIsOverlayVisible(true);
        }}
      />
      <Overlay
        isVisible={isOverlayVisible}
        onBackdropPress={() => {
          setIsOverlayVisible(false);
        }}
        overlayStyle={styles.overlay}
        backdropStyle={styles.overlay_back}>
        <NewExpenseScreen {...childProps} />
      </Overlay>
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
  balance: {
    backgroundColor: '#d8e7f4',
    margin: 10,
    borderWidth: 0,
  },
  income_expense: {
    flexDirection: 'row',
  },
  income: {
    backgroundColor: '#cbead1',
    flex: 1,
    margin: 10,
    marginRight: 5,
    borderWidth: 0,
  },
  expense: {
    backgroundColor: '#f2d0d0',
    flex: 1,
    margin: 10,
    marginLeft: 5,
    borderWidth: 0,
  },
  last_five_container: {
    borderWidth: 0,
    margin: 10,
  },
  button_container: {
    width: '100%',
    height: 100,
  },
  button_title: {
    color: theme.colors.highlight,
  },
  button: {
    backgroundColor: theme.colors.white,
  },
  overlay: {
    width: '80%',
  },
  overlay_back: {
    backgroundColor: theme.colors.grey,
    opacity: 0.7,
  },
  no_data_yet_container: {
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default BudgetScreen;
