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
  addExpense,
  getBalanceIncomeExpense,
  getLastFiveExpenses,
} from '../../../api/budgetApi';
import {
  Card,
  ListItem,
  FAB,
  Overlay,
  Input,
  Button,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Picker} from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const BudgetScreen = () => {
  const [history, setHistory] = useState([]);
  const [resume, setResume] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  //Overlay add expense state
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState('');

  const budgetId = useSelector(state => state.household.budgetId);

  useEffect(() => {
    getBudgetOverview(budgetId);
    getExpensesOverview(budgetId);
  }, [budgetId]);

  const getBudgetOverview = id => {
    getBalanceIncomeExpense(id)
      .then(overview => {
        setResume(overview);
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

  const addNewExpense = () => {
    const expense = {
      name: name,
      amount: Number(amount),
    };
    addExpense(budgetId, expense, resume)
      .then(docId => {
        console.log('SCREEN: expense added with id: ' + docId);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const cancelNewExpense = () => {
    setDate(new Date());
    setAmount('');
    setName('');
    setSelectedType('');
    changeOverlayIsVisible();
  };

  const setPlaceholder = (placeholder, value) => {
    if (!value) {
      return placeholder;
    }
  };

  const setLabel = (label, value) => {
    if (value) {
      return label;
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
        <View>
          <Picker
            selectedValue={selectedType}
            onValueChange={value => {
              setSelectedType(value);
            }}>
            <Picker.Item label="dépense" value="expense" />
            <Picker.Item label="rentrée" value="income" />
          </Picker>
          <Input
            label={setLabel('nom', name)}
            placeholder={setPlaceholder('nom', name)}
            value={name}
            onChangeText={value => {
              setName(value);
            }}
            containerStyle={{}}
          />
          <Input
            label={setLabel('montant', amount)}
            placeholder={setPlaceholder('montant', amount)}
            value={amount}
            keyboardType="numeric"
            onChangeText={value => {
              setAmount(value);
            }}
          />
          <Input
            label="date"
            value={date.toLocaleDateString()}
            onFocus={() => {
              setDatePickerShow(true);
            }}
            onBlur={() => {
              setDatePickerShow(false);
            }}
          />
          {datePickerShow && (
            <RNDateTimePicker
              value={new Date()}
              mode={'date'}
              display="spinner"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date;
                setDate(currentDate);
              }}
            />
          )}
          <Button
            title="ajouter"
            type="solid"
            raised={true}
            onPress={addNewExpense}
            containerStyle={{
              backgroundColor: '#FBFBFB',
              width: '90%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 20,
            }}
            buttonStyle={{
              backgroundColor: '#FCA311',
            }}
          />
          <Button
            title="annuler"
            type="solid"
            raised={true}
            onPress={cancelNewExpense}
            containerStyle={{
              backgroundColor: '#FBFBFB',
              width: '90%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 20,
            }}
            buttonStyle={{
              backgroundColor: '#FBFBFB',
            }}
            titleStyle={{color: '#FCA311'}}
          />
        </View>
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
