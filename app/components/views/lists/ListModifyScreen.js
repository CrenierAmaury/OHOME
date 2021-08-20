import React, {useEffect, useState} from 'react';
import {Button, Input, makeStyles} from 'react-native-elements';
import {ScrollView, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import TitleHeader from '../../headers/TitleHeader';
import {updateList} from '../../../api/listsApi';
import {Picker} from '@react-native-picker/picker';

const ListModifyScreen = ({route, navigation}) => {
  const styles = useStyles();

  const [name, setName] = useState('');
  const [type, setType] = useState({});
  const [error, setError] = useState('');

  const uid = useSelector(state => state.user.uid);
  const listGroupId = useSelector(state => state.household.listGroupId);

  const headerProps = {title: 'Modifier la liste', navigation};

  useEffect(() => {
    const list = route.params.list;
    setName(list.label);
    setType(list.type);
  }, [route.params.list]);

  const updateCurrentList = () => {
    if (name) {
      updateList(listGroupId, route.params.list.id, {
        label: name,
        type: type,
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
    } else {
      setError('Veuillez indiquer un nom');
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
      <TitleHeader {...headerProps} />
      <ScrollView showsVerticalScrollIndicator={false}>
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
        <Text style={styles.type_title}>Type</Text>
        <Picker
          style={styles.input_container}
          mode="dropdown"
          selectedValue={type.label}
          onValueChange={value => {
            if (value === 'other') {
              setType({label: value, checkbox: false});
            } else {
              setType({label: value, checkbox: true});
            }
          }}>
          <Picker.Item label="courses" value="shopping" />
          <Picker.Item label="to do" value="todo" />
          <Picker.Item label="autre" value="other" />
        </Picker>
        <Button
          title="Valider"
          type="solid"
          raised={true}
          onPress={updateCurrentList}
          containerStyle={styles.button_container}
          buttonStyle={styles.button}
        />
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
  input_container: {
    marginTop: 5,
  },
  type_title: {
    marginTop: 5,
    marginLeft: 10,
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
}));

export default ListModifyScreen;
