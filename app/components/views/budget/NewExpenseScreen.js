import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Input} from 'react-native-elements';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {addExpense} from '../../../api/budgetApi';

const NewExpenseScreen = ({budgetId}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [descritpion, setDescription] = useState('');
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [date, setDate] = useState(new Date());

  return (
    <View>
      <Input
        label="nom"
        onChangeText={value => {
          setName(value);
        }}
        containerStyle={{}}
        inputContainerStyle={{
          borderWidth: 1,
          borderBottomWidth: 1,
        }}
      />
      <Input
        label="montant"
        keyboardType="numeric"
        onChangeText={value => {
          setAmount(value);
        }}
        inputContainerStyle={{
          borderWidth: 1,
          borderBottomWidth: 1,
        }}
      />
      <Input
        label="date"
        placeholder={date.toLocaleDateString()}
        onFocus={() => {
          setDatePickerShow(true);
        }}
        onBlur={() => {
          setDatePickerShow(false);
        }}
        onChangeText={value => {
          setDescription(value);
          setDatePickerShow(false);
        }}
        inputContainerStyle={{
          borderWidth: 1,
          borderBottomWidth: 1,
        }}
      />
      {datePickerShow && (
        <RNDateTimePicker
          value={new Date()}
          mode={'date'}
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setDate(currentDate);
          }}
        />
      )}
      <Input
        label="description"
        onChangeText={value => {
          setDescription(value);
        }}
        inputContainerStyle={{
          minHeight: '30%',
          borderWidth: 1,
          borderBottomWidth: 1,
        }}
      />
      <Button
        title="ajouter"
        type="solid"
        raised={true}
        onPress={() => {
          const expense = {
            name: name,
            amount: amount,
            descritpion: descritpion,
          };
          addExpense(budgetId, expense)
            .then(docId => {
              console.log(docId);
            })
            .catch(e => {
              console.log(e);
            });
        }}
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
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default NewExpenseScreen;
