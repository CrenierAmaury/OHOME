import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Button, ListItem} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import {updateList} from '../../../api/listsApi';
import {showSuccessSnackbar} from '../../../utils/snackbar';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ListDetailsScreen = ({route}) => {
  const [list, setList] = useState({});
  const [elements, setElements] = useState([]);

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

  return (
    <View style={styles.main_container}>
      <Text>{list.label}</Text>
      <Icon
        name="add"
        size={35}
        style={{
          color: '#FCA311',
          marginTop: 0,
        }}
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
              <ListItem.Title>{h.label}</ListItem.Title>
            </ListItem.Content>
            <ListItem.CheckBox
              checked={h.checked}
              onPress={() => {
                changeChecked(i);
              }}
            />
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
});

export default ListDetailsScreen;
