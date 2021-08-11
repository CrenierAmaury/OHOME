import React, {useEffect, useState} from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {Button, Input, makeStyles} from 'react-native-elements';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import TitleHeader from '../../headers/TitleHeader';
import {updateExpense} from '../../../api/budgetApi';
import {Picker} from '@react-native-picker/picker';

const ExpenseModifyScreen = ({route, navigation}) => {
  const styles = useStyles();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('expense');
  const [error, setError] = useState('');

  const uid = useSelector(state => state.user.uid);
  const budgetId = useSelector(state => state.household.budgetId);

  const headerProps = {title: 'Modifier la rentrée', navigation};

  useEffect(() => {
    const expense = route.params.expense;
    setName(expense.label);
    if (expense.amount < 0) {
      setAmount((expense.amount * -1).toString());
      setType('expense');
    } else {
      setAmount(expense.amount.toString());
      setType('income');
    }
    setDate(expense.date.toDate());
  }, [route.params.expense]);

  const updateCurrentExpense = () => {
    if (name && amount) {
      updateExpense(
        budgetId,
        route.params.expense.id,
        route.params.expense.amount,
        {
          label: name,
          amount: setAmountSign(Number(amount)),
          date: date,
          modified: {
            by: uid,
            when: new Date(),
          },
        },
        route.params.budgetOverview,
      )
        .then(() => {
          navigation.goBack();
        })
        .catch(e => {
          console.log(e);
        });
    } else if (name) {
      setError('veuillez indiquer un montant');
    } else {
      setError('veuillez indiquer un nom');
    }
  };

  const setAmountSign = value => {
    if (type === 'expense') {
      return value * -1;
    } else {
      return value;
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setDatePickerShow(false);
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

  return (
    <View style={styles.main_container}>
      <TitleHeader {...headerProps} />
      <Picker
        selectedValue={type}
        onValueChange={value => {
          setType(value);
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
      />
      <Input
        label={setLabel('montant', amount)}
        placeholder={setPlaceholder('montant', amount)}
        value={amount}
        onChangeText={value => {
          setAmount(value);
        }}
      />
      <TouchableOpacity
        onPress={() => {
          setDatePickerShow(true);
        }}>
        <Input
          label="date"
          value={date.toLocaleDateString()}
          errorMessage={error}
          editable={false}
        />
      </TouchableOpacity>
      {datePickerShow && (
        <RNDateTimePicker
          value={date}
          mode={'date'}
          display="spinner"
          onChange={onChangeDate}
        />
      )}
      <Button
        title="valider"
        type="solid"
        raised={true}
        onPress={updateCurrentExpense}
        containerStyle={{
          backgroundColor: '#FBFBFB',
          width: '75%',
          marginRight: 'auto',
          marginLeft: 'auto',
        }}
        buttonStyle={{
          backgroundColor: '#FCA311',
        }}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {},
}));

export default ExpenseModifyScreen;
