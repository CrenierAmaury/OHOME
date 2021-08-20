import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Keyboard,
  Text,
  ActivityIndicator,
} from 'react-native';
import {Button, Input, ListItem, useTheme} from 'react-native-elements';
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
  const {theme} = useTheme();

  const [isLoading, setIsLoading] = useState(true);
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
          setIsLoading(false);
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
      {isLoading ? (
        <ActivityIndicator
          style={styles.activity_indicator}
          size="large"
          color={theme.colors.activity_indicator}
        />
      ) : (
        <View style={styles.swipe_content}>
          <Input
            placeholder="Nouvel élement"
            onChangeText={value => {
              setNewItem(value);
            }}
            containerStyle={styles.input_container}
            rightIcon={
              <Icon
                name="add"
                size={30}
                onPress={addElement}
                color={theme.colors.highlight}
              />
            }
          />
          <ScrollView showsVerticalScrollIndicator={false}>
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
                        buttonStyle={{
                          minHeight: '100%',
                          backgroundColor: 'red',
                        }}
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
            <View style={styles.info_section}>
              {list.creation ? (
                <Text style={styles.info_section_text}>
                  Créé par{' '}
                  <Text style={styles.member_name}>
                    {renderMemberName(members, list.author)}
                  </Text>{' '}
                  le {renderDate(list.creation.toDate())}
                </Text>
              ) : null}
              {list.modified ? (
                <Text style={styles.info_section_text}>
                  Modifié par{' '}
                  <Text style={styles.member_name}>
                    {renderMemberName(members, list.modified.by)}
                  </Text>{' '}
                  le {renderDate(list.modified.when.toDate())}
                </Text>
              ) : null}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
  swipe_content: {
    flex: 1,
  },
  input_container: {
    marginTop: 20,
  },
  activity_indicator: {
    marginTop: 150,
  },
  info_section: {
    marginTop: 25,
    alignItems: 'center',
  },
  info_section_text: {
    margin: 5,
    color: theme.colors.grey,
  },
  member_name: {
    fontWeight: 'bold',
  },
}));

export default ListDetailsScreen;
