import React, {useEffect, useState} from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {Button, Input, makeStyles} from 'react-native-elements';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {updateMeal} from '../../../api/mealsApi';
import _ from 'lodash';
import TitleHeader from '../../headers/TitleHeader';

const MealModifyScreen = ({route, navigation}) => {
  const styles = useStyles();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [initialDate, setInitialDate] = useState(new Date());
  const [error, setError] = useState('');

  const uid = useSelector(state => state.user.uid);
  const mealGroupId = useSelector(state => state.household.mealGroupId);

  const headerProps = {title: 'Modifier le repas', navigation};

  useEffect(() => {
    const meal = route.params.meal;
    setName(meal.label);
    setDescription(meal.description);
    setDate(meal.date.toDate());
    setInitialDate(meal.date.toDate());
  }, [route.params.meal]);

  const updateCurrentMeal = () => {
    if (
      initialDate.getUTCFullYear() === date.getUTCFullYear() &&
      initialDate.getUTCMonth() === date.getUTCMonth() &&
      initialDate.getUTCDate() === date.getUTCDate() &&
      name
    ) {
      updateMeal(mealGroupId, route.params.meal.id, {
        label: name,
        description: description,
        modified: {
          by: uid,
          when: new Date(),
        },
      })
        .then(() => {
          navigation.goBack();
        })
        .catch(e => {
          console.log(e);
        });
    } else if (
      !_.find(route.params.meals, e => {
        return (
          e.date.toDate().getUTCFullYear() === date.getUTCFullYear() &&
          e.date.toDate().getUTCMonth() === date.getUTCMonth() &&
          e.date.toDate().getUTCDate() === date.getUTCDate()
        );
      }) &&
      name
    ) {
      updateMeal(mealGroupId, route.params.meal.id, {
        label: name,
        date: date,
        description: description,
        modified: {
          by: uid,
          when: new Date(),
        },
      })
        .then(() => {
          navigation.goBack();
        })
        .catch(e => {
          console.log(e);
        });
    } else if (name) {
      setError('il y a déjà un repas pour cette date');
    } else {
      setError('veuillez indiquer un nom');
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
        multiline={true}
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
        title="valider"
        type="solid"
        raised={true}
        onPress={updateCurrentMeal}
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

export default MealModifyScreen;
