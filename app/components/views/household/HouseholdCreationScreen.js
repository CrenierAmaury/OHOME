import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, Input, makeStyles} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {createHousehold} from '../../../api/householdApi';
import {updateUser} from '../../../api/userApi';

const HouseholdCreationScreen = ({navigation}) => {
  const styles = useStyles();

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const uid = useSelector(state => state.user.uid);
  const households = useSelector(state => state.user.households);

  const createNewHousehold = ({navigation}) => {
    if (name) {
      createHousehold(uid, name)
        .then(newHousehold => {
          updateUser(uid, {
            activeHousehold: newHousehold,
            households: [...households].push(newHousehold),
          })
            .then(() => {
              navigation.navigate('Authenticated');
              console.log('household created');
            })
            .catch(e => {
              setError(e);
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
    <View>
      <Input
        label={setLabel('nom', name)}
        placeholder={setPlaceholder('nom', name)}
        errorMessage={error}
        value={name}
        onChangeText={value => {
          setName(value);
        }}
      />
      <Button
        title="Créer le ménage"
        type="solid"
        raised={true}
        onPress={createNewHousehold}
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
  main_container: {
    flex: 1,
    alignItems: 'center',
  },
}));

export default HouseholdCreationScreen;
