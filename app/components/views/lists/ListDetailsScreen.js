import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, ScrollView, Keyboard} from 'react-native';
import {Button, Input, ListItem} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import {updateList} from '../../../api/listsApi';
import {showSuccessSnackbar} from '../../../utils/snackbar';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ListDetailsScreen = ({route}) => {
  const [list, setList] = useState({});
  const [elements, setElements] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [title, setTitle] = useState('');
  const [titleEditable, setTitleEditable] = useState(false);

  const title_input = useRef();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('listGroups')
      .doc(route.params.listGroupId)
      .collection('lists')
      .doc(route.params.list.id)
      .onSnapshot(
        documentSnapshot => {
          setList(documentSnapshot.data());
          setElements(documentSnapshot.data().elements);
        },
        error => {
          console.log(error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, [route.params.list, route.params.listGroupId]);

  const deleteElement = index => {
    const newElements = [...elements];
    newElements.splice(index, 1);
    updateList(route.params.listGroupId, route.params.list.id, {
      elements: newElements,
    })
      .then(() => {
        showSuccessSnackbar('élément supprimé avec succès');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const changeChecked = index => {
    const newElements = [...elements];
    newElements[index].checked = !newElements[index].checked;
    updateList(route.params.listGroupId, route.params.list.id, {
      elements: newElements,
    })
      .then(() => {
        console.log('checked state changed');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const addElement = () => {
    Keyboard.dismiss();
    const newElements = [...elements];
    newElements.push({label: newItem, checked: false});
    updateList(route.params.listGroupId, route.params.list.id, {
      elements: newElements,
    })
      .then(() => {
        console.log('checked state changed');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const strikeOutLabel = checked => {
    if (checked) {
      return 'line-through';
    } else {
      return 'none';
    }
  };

  const changeTitle = () => {

  };

  const openModifyTitle = () => {
    setTitleEditable(true);
    title_input.current.focus();
  };

  return (
    <View style={styles.main_container}>
      <Input
        placeholder={list.label}
        editable={titleEditable}
        ref={title_input}
        onChangeText={value => {
          setTitle(value);
        }}
        inputContainerStyle={styles.title}
        rightIcon={
          <Icon
            name="edit"
            size={24}
            onPress={openModifyTitle}
            style={{
              color: '#8b8b8b',
            }}
          />
        }
      />
      <Input
        placeholder="nouvel élement"
        onChangeText={value => {
          setNewItem(value);
        }}
        rightIcon={
          <Icon
            name="add"
            size={30}
            onPress={addElement}
            style={{
              color: '#FCA311',
            }}
          />
        }
      />
      <ScrollView>
        {elements.map((h, i) => (
          <ListItem.Swipeable
            key={i}
            bottomDivider
            leftContent={
              <Button
                title="modifier"
                icon={{name: 'edit', color: 'white'}}
                buttonStyle={{minHeight: '100%'}}
              />
            }
            rightContent={
              <Button
                onPress={() => {
                  deleteElement(i);
                }}
                title="supprimer"
                icon={{name: 'delete', color: 'white'}}
                buttonStyle={{minHeight: '100%', backgroundColor: 'red'}}
              />
            }>
            <ListItem.Content>
              <ListItem.Title
                style={{textDecorationLine: strikeOutLabel(h.checked)}}>
                {h.label}
              </ListItem.Title>
            </ListItem.Content>
            {list.type === 'other' ? null : (
              <ListItem.CheckBox
                checked={h.checked}
                onPress={() => {
                  changeChecked(i);
                }}
              />
            )}
          </ListItem.Swipeable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  title: {
    borderBottomWidth: 0,
  },
});

export default ListDetailsScreen;
