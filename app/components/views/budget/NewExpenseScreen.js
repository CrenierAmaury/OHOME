import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {addExpense} from '../../../api/budgetApi';
import {Button, Input} from 'react-native-elements';
import {View} from 'react-native';

const NewExpenseScreen = props => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState('');

  const addNewExpense = () => {
    const expense = {
      label: name,
      amount: Number(amount),
    };
    addExpense(props.budgetId, expense, props.budgetOverview)
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
    props.setIsOverlayVisible(false);
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
  );
};

export default NewExpenseScreen;
