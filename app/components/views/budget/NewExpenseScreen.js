import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {addExpense, updateBudgetOverview} from '../../../api/budgetApi';
import {Button, Input, Overlay} from 'react-native-elements';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {showSuccessSnackbar} from '../../../utils/snackbar';

const NewExpenseScreen = props => {
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

  const uid = useSelector(state => state.user.uid);

  const addNewExpense = () => {
    if (name && amount) {
      const expense = {
        label: name,
        amount: setAmountSign(Number(amount)),
        date: date,
        category: category,
        creation: new Date(),
        author: uid,
        modified: {
          by: uid,
          when: new Date(),
        },
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

  const addNewCategory = () => {
    if (newCategoryName && newCategoryColor) {
      const newCategories = [...props.budgetOverview.categories];
      newCategories.push({label: newCategoryName, color: newCategoryColor});
      updateBudgetOverview(props.budgetId, {
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

  const cancelNewCategory = () => {
    setNewCategoryName('');
    setNewCategoryColor('');
    setNewCategoryError('');
    setIsOverlayVisible(false);
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
        <Picker
          mode="dropdown"
          selectedValue={type}
          onValueChange={value => {
            setType(value);
          }}>
          <Picker.Item label="dépense" value="expense" />
          <Picker.Item label="revenu" value="income" />
        </Picker>
        <Input
          label={setLabel('Nom', name)}
          placeholder={setPlaceholder('Nom', name)}
          value={name}
          onChangeText={value => {
            setName(value);
          }}
        />
        <Input
          label={setLabel('Montant', amount)}
          placeholder={setPlaceholder('Montant', amount)}
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
        <Text style={styles.categories_title}>Catégories</Text>
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
          {props.budgetOverview.categories.map((h, i) => (
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
        <Button
          title="Ajouter"
          type="solid"
          raised={true}
          onPress={addNewExpense}
          containerStyle={styles.add_button_container}
          buttonStyle={styles.add_button}
        />
        <Button
          title="Annuler"
          type="solid"
          raised={true}
          onPress={cancelNewExpense}
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
  categories_title: {
    marginLeft: 10,
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
  colors_overlay: {
    width: '80%',
  },
  colors_overlay_back: {
    backgroundColor: 'grey',
    opacity: 0.9,
  },
}));

export default NewExpenseScreen;
