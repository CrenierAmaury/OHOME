import React, {useEffect, useState} from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {Button, Input, makeStyles, Overlay} from 'react-native-elements';
import {Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import TitleHeader from '../../headers/TitleHeader';
import {updateBudgetOverview, updateExpense} from '../../../api/budgetApi';
import {Picker} from '@react-native-picker/picker';

const ExpenseModifyScreen = ({route, navigation}) => {
  const styles = useStyles();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('aucune');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('');
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [error, setError] = useState('');
  const [newCategoryError, setNewCategoryError] = useState('');

  const uid = useSelector(state => state.user.uid);
  const budgetId = useSelector(state => state.household.budgetId);

  const headerProps = {title: 'Modifier la rentrée', navigation};

  const categoryColors1 = [
    'red',
    'green',
    'yellow',
    'blue',
    'purple',
    'orange',
  ];
  const categoryColors2 = [
    'pink',
    'salmon',
    'tomato',
    'violet',
    'magenta',
    'grey',
  ];

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
    setCategory(expense.category);
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
          category: category,
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

  const addNewCategory = () => {
    if (newCategoryName && newCategoryColor) {
      const newCategories = [...route.params.budgetOverview.categories];
      newCategories.push({label: newCategoryName, color: newCategoryColor});
      updateBudgetOverview(budgetId, {
        categories: newCategories,
      })
        .then(() => {
          setIsOverlayVisible(false);
          console.log('new category added');
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      setNewCategoryError('veuillez donner un nom et une couleur');
    }
  };

  const cancelNewCategory = () => {
    setNewCategoryName('');
    setNewCategoryColor('');
    setNewCategoryError('');
    setIsOverlayVisible(false);
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
      <Text>Catégories</Text>
      <Picker
        mode="dropdown"
        selectedValue={category}
        onValueChange={value => {
          if (value !== 'ohome_category_add') {
            setCategory(value);
          } else {
            setIsOverlayVisible(true);
          }
        }}>
        {route.params.budgetOverview.categories.map((h, i) => (
          <Picker.Item
            key={i}
            label={h.label}
            value={h.label}
            color={h.color}
          />
        ))}
        <Picker.Item label="+ ajouter" value="ohome_category_add" />
      </Picker>
      <Overlay
        isVisible={isOverlayVisible}
        onBackdropPress={cancelNewCategory}
        overlayStyle={{
          width: '80%',
        }}
        backdropStyle={{
          backgroundColor: 'grey',
          opacity: 0.9,
        }}>
        <Text>Nouvelle catégorie</Text>
        <Input
          label={setLabel('nom', newCategoryName)}
          placeholder={setPlaceholder('nom', newCategoryName)}
          value={newCategoryName}
          errorMessage={newCategoryError}
          onChangeText={value => {
            setNewCategoryName(value);
          }}
        />
        <Text>Couleur</Text>
        <View style={styles.colors_container}>
          {categoryColors1.map((e, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.colors,
                {
                  backgroundColor: e,
                  borderWidth: e === newCategoryColor ? 2 : 0,
                },
              ]}
              onPress={() => {
                setNewCategoryColor(e);
              }}>
              <Text> </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.colors_container}>
          {categoryColors2.map((e, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.colors,
                {
                  backgroundColor: e,
                  borderWidth: e === newCategoryColor ? 2 : 0,
                },
              ]}
              onPress={() => {
                setNewCategoryColor(e);
              }}>
              <Text> </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button
          title="ajouter"
          type="solid"
          raised={true}
          onPress={addNewCategory}
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
      </Overlay>
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
  colors_container: {
    margin: 10,
    flexDirection: 'row',
  },
  colors: {
    flex: 1,
    padding: 5,
    margin: 5,
    textAlign: 'center',
  },
}));

export default ExpenseModifyScreen;
