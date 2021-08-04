import React, {useState} from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {Button, Input} from 'react-native-elements';
import {TouchableOpacity, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {showSuccessSnackbar} from '../../../utils/snackbar';
import {addMeal} from '../../../api/mealsApi';
import {renderDate} from '../../../utils/date';

const NewMealScreen = props => {
  const styles = useStyles();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState('');

  const uid = useSelector(state => state.user.uid);

  const addNewMeal = () => {
    if (name) {
      const meal = {
        label: name,
        date: date,
        description: description,
        ingredients: [],
        creation: new Date(),
        author: uid,
        modified: {
          by: uid,
          when: new Date(),
        },
      };
      addMeal(props.mealGroupId, meal)
        .then(docId => {
          console.log('SCREEN: meal added with id: ' + docId);
          props.setIsOverlayVisible(false);
          showSuccessSnackbar('nouveau repas ajouté avec succès');
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      setError('veuillez indiquer un nom');
    }
  };

  const cancelNewMeal = () => {
    setDate(new Date());
    setName('');
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
    <View style={styles.main_container}>
      <Input
        label={setLabel('nom', name)}
        placeholder={setPlaceholder('nom', name)}
        value={name}
        onChangeText={value => {
          setName(value);
        }}
      />
      <Input
        label={setLabel('description', description)}
        placeholder={setPlaceholder('description', description)}
        value={description}
        onChangeText={value => {
          setDescription(value);
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
        onPress={addNewMeal}
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
        onPress={cancelNewMeal}
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

const useStyles = makeStyles(theme => ({
  main_container: {},
}));

export default NewMealScreen;
