import React, {useEffect, useState} from 'react';
import {View, ScrollView, Keyboard, Text} from 'react-native';
import {Button, Input, ListItem} from 'react-native-elements';
import {makeStyles} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import {updateList} from '../../../api/listsApi';
import {showSuccessSnackbar} from '../../../utils/snackbar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ListHeader from '../../headers/ListHeader';
import {renderMemberName} from '../../../utils/members';
import {renderDate} from '../../../utils/date';
import {useSelector} from 'react-redux';

const ListDetailsScreen = ({route, navigation}) => {
  const styles = useStyles();

  const [list, setList] = useState({});
  const [newItem, setNewItem] = useState('');

  const members = useSelector(state => state.household.members);

  const headerProps = {title: list.label, list, navigation};

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('listGroups')
      .doc(route.params.listGroupId)
      .collection('lists')
      .doc(route.params.list.id)
      .onSnapshot(
        documentSnapshot => {
          const {...currentList} = documentSnapshot.data();
          currentList.id = documentSnapshot.id;
          setList(currentList);
        },
        error => {
          console.log(error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, [navigation, route.params.list, route.params.listGroupId]);

  const deleteElement = index => {
    const newElements = [...list.elements];
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
    const newElements = [...list.elements];
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
    const newElements = [...list.elements];
    newElements.push({label: newItem, checked: false});
    updateList(route.params.listGroupId, route.params.list.id, {
      elements: newElements,
    })
      .then(() => {
        console.log('new element added');
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

  return (
    <View style={styles.main_container}>
      <ListHeader {...headerProps} />
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
        {list.elements
          ? list.elements.map((h, i) => (
              <ListItem.Swipeable
                key={i}
                bottomDivider
                leftStyle={{width: 0}}
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
                {list.type.checkbox ? (
                  <ListItem.CheckBox
                    checked={h.checked}
                    onPress={() => {
                      changeChecked(i);
                    }}
                  />
                ) : null}
              </ListItem.Swipeable>
            ))
          : null}
        {list.creation ? (
          <Text>
            créé par {renderMemberName(members, list.author)} le{' '}
            {renderDate(list.creation.toDate())}
          </Text>
        ) : null}
        {list.modified ? (
          <Text>
            modifié par {renderMemberName(members, list.modified.by)} le{' '}
            {renderDate(list.modified.when.toDate())}
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
  title: {
    borderBottomWidth: 0,
  },
}));

export default ListDetailsScreen;
