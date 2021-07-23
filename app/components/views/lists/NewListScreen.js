import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {Button, Input} from 'react-native-elements';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {addList} from '../../../api/listsApi';

const NewListScreen = props => {
  const [name, setName] = useState('');
  const [type, setType] = useState('shopping');
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
      setError('veuillez donner un nom');
    }
  };

  const cancelNewList = () => {
    setName('');
    setType('shopping');
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
    <View>
      <Picker
        selectedValue={type}
        onValueChange={value => {
          setType(value);
        }}>
        <Picker.Item label="courses" value="shopping" />
        <Picker.Item label="to do" value="todo" />
        <Picker.Item label="autre" value="other" />
      </Picker>
      <Input
        label={setLabel('nom', name)}
        placeholder={setPlaceholder('nom', name)}
        value={name}
        errorMessage={error}
        onChangeText={value => {
          setName(value);
        }}
      />
      <Button
        title="ajouter"
        type="solid"
        raised={true}
        onPress={addNewList}
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
      <Button
        title="annuler"
        type="solid"
        raised={true}
        onPress={cancelNewList}
        containerStyle={{
          backgroundColor: '#FBFBFB',
          width: '90%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 20,
        }}
        buttonStyle={{
          backgroundColor: '#FBFBFB',
        }}
        titleStyle={{color: '#FCA311'}}
      />
    </View>
  );
};

export default NewListScreen;