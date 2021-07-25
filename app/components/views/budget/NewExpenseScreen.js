import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {addExpense} from '../../../api/budgetApi';
import {Button, Input} from 'react-native-elements';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {showSuccessSnackbar} from '../../../utils/snackbar';

const NewExpenseScreen = props => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('expense');
  const [error, setError] = useState('');

  const uid = useSelector(state => state.user.uid);

  const addNewExpense = () => {
    if (name && amount) {
      const expense = {
        label: name,
        amount: setAmountSign(Number(amount)),
        date: date,
        creation: new Date(),
        author: uid,
      };
      addExpense(props.budgetId, expense, props.budgetOverview)
        .then(docId => {
          console.log('SCREEN: expense added with id: ' + docId);
          props.setIsOverlayVisible(false);
          showSuccessSnackbar('nouveau montant ajouté avec succès');
        })
        .catch(e => {
          console.log(e);
        });
    } else if (name) {
      setError('veuillez indiquer un montant');
    } else if (amount) {
      setError('veuillez indiquer un nom');
    } else {
      setError('veuillez compléter les champs');
    }
  };

  const setAmountSign = value => {
    if (type === 'expense') {
      return value * -1;
    } else {
      return value;
    }
  };

  const cancelNewExpense = () => {
    setDate(new Date());
    setAmount('');
    setName('');
    setType('');
    setError('');
    props.setIsOverlayVisible(false);
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
    <View>
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
        keyboardType="numeric"
        onChangeText={value => {
          setAmount(value.replace(/[^0-9.]+/g, ''));
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
