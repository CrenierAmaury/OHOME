import React, {useState} from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {Button, Input} from 'react-native-elements';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {showSuccessSnackbar} from '../../../utils/snackbar';
import {addMeal} from '../../../api/mealsApi';
import _ from 'lodash';

const NewMealScreen = props => {
  const styles = useStyles();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState('');

  const uid = useSelector(state => state.user.uid);

  const addNewMeal = () => {
    if (
      !_.find(props.meals, e => {
        return (
          e.date.toDate().getUTCFullYear() === date.getUTCFullYear() &&
          e.date.toDate().getUTCMonth() === date.getUTCMonth() &&
          e.date.toDate().getUTCDate() === date.getUTCDate()
        );
      }) &&
      name
    ) {
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
          showSuccessSnackbar('Nouveau repas ajouté avec succès');
        })
        .catch(e => {
          console.log(e);
        });
    } else if (name) {
      setError('Il y a déjà un repas pour cette date');
    } else {
      setError('Veuillez indiquer un nom');
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Input
          label={setLabel('Titre', name)}
          placeholder={setPlaceholder('Titre', name)}
          value={name}
          onChangeText={value => {
            setName(value);
          }}
        />
        <Input
          label={setLabel('Description', description)}
          placeholder={setPlaceholder('Description', description)}
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
            label="Date"
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
          title="Ajouter"
          type="solid"
          raised={true}
          onPress={addNewMeal}
          containerStyle={styles.add_button_container}
          buttonStyle={styles.add_button}
        />
        <Button
          title="Annuler"
          type="solid"
          raised={true}
          onPress={cancelNewMeal}
          containerStyle={styles.cancel_button_container}
          buttonStyle={styles.cancel_button}
          titleStyle={styles.cancel_button_title}
        />
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    marginTop: '5%',
    marginBottom: '5%',
  },
  add_button_container: {
    backgroundColor: theme.colors.white,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '10%',
  },
  add_button: {
    backgroundColor: theme.colors.highlight,
  },
  cancel_button_container: {
    backgroundColor: theme.colors.white,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '10%',
  },
  cancel_button: {
    backgroundColor: theme.colors.white,
  },
  cancel_button_title: {
    color: theme.colors.highlight,
  },
}));

export default NewMealScreen;
