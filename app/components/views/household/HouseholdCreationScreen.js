import React, {useState} from 'react';
import {View} from 'react-native';
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
  const households = useSelector(state => state.user.households);

  const createNewHousehold = () => {
    setIsLoading(true);
    if (name) {
      console.log('household start: ' + households);
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
                navigation.navigate('Authenticated');
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
        loading={isLoading}
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
