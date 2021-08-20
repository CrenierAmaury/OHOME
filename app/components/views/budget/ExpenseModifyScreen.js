import React, {useEffect, useState} from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {Button, Input, makeStyles, Overlay} from 'react-native-elements';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Picker
          style={styles.input_container}
          selectedValue={type}
          onValueChange={value => {
            setType(value);
          }}>
          <Picker.Item label="dépense" value="expense" />
          <Picker.Item label="rentrée" value="income" />
        </Picker>
        <Input
          label={setLabel('Nom', name)}
          placeholder={setPlaceholder('Nom', name)}
          value={name}
          onChangeText={value => {
            setName(value);
          }}
          containerStyle={styles.input_container}
        />
        <Input
          label={setLabel('Montant', amount)}
          placeholder={setPlaceholder('Montant', amount)}
          value={amount}
          onChangeText={value => {
            setAmount(value);
          }}
          containerStyle={styles.input_container}
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
            containerStyle={styles.input_container}
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
        <Text style={styles.categories_title}>Catégories</Text>
        <Picker
          style={styles.input_container}
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
        <Button
          title="Valider"
          type="solid"
          raised={true}
          onPress={updateCurrentExpense}
          containerStyle={styles.button_container}
          buttonStyle={styles.button}
        />
      </ScrollView>
      <Overlay
        isVisible={isOverlayVisible}
        onBackdropPress={cancelNewCategory}
        overlayStyle={styles.colors_overlay}
        backdropStyle={styles.colors_overlay_back}>
        <Text style={styles.categories_title}>Nouvelle catégorie</Text>
        <Input
          label={setLabel('Nom', newCategoryName)}
          placeholder={setPlaceholder('Nom', newCategoryName)}
          value={newCategoryName}
          errorMessage={newCategoryError}
          onChangeText={value => {
            setNewCategoryName(value);
          }}
          containerStyle={styles.input_container}
        />
        <Text style={styles.categories_title}>Couleur</Text>
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
          title="Ajouter"
          type="solid"
          raised={true}
          onPress={addNewCategory}
          containerStyle={styles.add_button_container}
          buttonStyle={styles.add_button}
        />
      </Overlay>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
  categories_title: {
    marginLeft: 10,
  },
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
  input_container: {
    marginTop: 5,
  },
  colors_overlay: {
    width: '80%',
  },
  colors_overlay_back: {
    backgroundColor: 'grey',
    opacity: 0.9,
  },
  button_container: {
    marginTop: 20,
    marginBottom: 50,
    backgroundColor: theme.colors.white,
    width: '75%',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  button: {
    backgroundColor: theme.colors.highlight,
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
}));

export default ExpenseModifyScreen;
