import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {Button, Input, makeStyles} from 'react-native-elements';
import {firebase} from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {createHousehold, getHousehold} from '../../../api/householdApi';
import {updateUser} from '../../../api/userApi';
import {updateHouseholdId} from '../../../store/slices/householdSlice';

const HouseholdCreationScreen = ({navigation}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const uid = useSelector(state => state.user.uid);

  const createNewHousehold = () => {
    setIsLoading(true);
    if (name) {
      createHousehold(uid, name)
        .then(newHousehold => {
          getHousehold(newHousehold).then(res => {
            updateUser(uid, {
              activeHousehold: newHousehold,
              households:
                firebase.firestore.FieldValue.arrayUnion(newHousehold),
            })
              .then(() => {
                setIsLoading(false);
                dispatch(updateHouseholdId(newHousehold));
                console.log('household created');
              })
              .catch(e => {
                setError(e);
              })
              .catch(e => {
                setError(e);
              });
          });
        })
        .catch(e => {
          setError(e);
        });
    } else {
      setError('veuillez indiquer un nom');
    }
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
      <Text style={styles.top_text}>Donnez un nom au nouveau ménage</Text>
      <Input
        label={setLabel('Nom', name)}
        placeholder={setPlaceholder('Nom', name)}
        errorMessage={error}
        value={name}
        onChangeText={value => {
          setName(value);
        }}
        containerStyle={styles.input_container}
      />
      <Button
        title="Créer le ménage"
        type="solid"
        raised={true}
        loading={isLoading}
        onPress={createNewHousehold}
        containerStyle={styles.button_container}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },
  top_text: {
    fontSize: 20,
    margin: 25,
    justifyContent: 'center',
  },
  input_container: {
    marginTop: 5,
    width: '75%',
  },
  button_container: {
    backgroundColor: theme.colors.background,
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: theme.colors.highlight,
  },
}));

export default HouseholdCreationScreen;
