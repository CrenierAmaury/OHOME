import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {Button, Input} from 'react-native-elements';
import {ScrollView, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {addList} from '../../../api/listsApi';

const NewListScreen = props => {
  const styles = useStyles();

  const [name, setName] = useState('');
  const [type, setType] = useState({label: 'other', checkbox: false});
  const [error, setError] = useState('');

  const uid = useSelector(state => state.user.uid);

  const addNewList = () => {
    if (name) {
      const list = {
        label: name,
        type: type,
        elements: [],
        creation: new Date(),
        author: uid,
        modified: {
          by: uid,
          when: new Date(),
        },
      };
      addList(props.listGroupId, list)
        .then(id => {
          setError('');
          props.setIsOverlayVisible(false);
        })
        .catch(e => {
          setError(e.message);
          console.log(e);
        });
    } else {
      setError('Veuillez donner un nom');
    }
  };

  const cancelNewList = () => {
    setName('');
    setType({label: 'shopping', checkbox: true});
    props.setIsOverlayVisible(false);
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
        <Input
          label={setLabel('Nom', name)}
          placeholder={setPlaceholder('Nom', name)}
          value={name}
          errorMessage={error}
          onChangeText={value => {
            setName(value);
          }}
        />
        <Button
          title="Ajouter"
          type="solid"
          raised={true}
          onPress={addNewList}
          containerStyle={styles.add_button_container}
          buttonStyle={styles.add_button}
        />
        <Button
          title="Annuler"
          type="solid"
          raised={true}
          onPress={cancelNewList}
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

export default NewListScreen;
