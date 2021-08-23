import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import {ScrollView, View, Text, ActivityIndicator, Alert} from 'react-native';
import {makeStyles, useTheme} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {FAB, ListItem, Overlay, Button, Icon} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import NewListScreen from './NewListScreen';
import {removeList} from '../../../api/listsApi';
import {showSuccessSnackbar} from '../../../utils/snackbar';
import MainHeader from '../../headers/MainHeader';

const ListsScreen = ({navigation}) => {
  const styles = useStyles();
  const {theme} = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [lists, setLists] = useState([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [filteredLists, setFilteredLists] = useState([]);
  const [allColor, setAllColor] = useState('#FCA311');
  const [shoppingColor, setShoppingColor] = useState('#8b8b8b');
  const [todoColor, setTodoColor] = useState('#8b8b8b');
  const [otherColor, setOtherColor] = useState('#8b8b8b');

  const listGroupId = useSelector(state => state.household.listGroupId);

  const childProps = {listGroupId, setIsOverlayVisible};
  const headerProps = {navigation};

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('listGroups')
      .doc(listGroupId)
      .collection('lists')
      .onSnapshot(
        querySnapshot => {
          const listsTab = [];
          querySnapshot.docs.forEach(doc => {
            const {...list} = doc.data();
            list.id = doc.id;
            listsTab.push(list);
          });
          setLists(listsTab);
          setFilteredLists(listsTab);
          setIsLoading(false);
        },
        error => {
          console.log(error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, [listGroupId]);

  const deleteList = (listGroupID, listID) => {
    removeList(listGroupID, listID)
      .then(() => {
        showSuccessSnackbar('Liste supprimée avec succès');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const openDeleteAlert = listId => {
    Alert.alert(
      '',
      'Confirmer la suppression ?',
      [
        {text: 'ANNULER', onPress: () => {}},
        {
          text: 'OUI',
          onPress: () => {
            deleteList(listGroupId, listId);
          },
        },
      ],
      {cancelable: true},
    );
  };

  const sortLists = filter => {
    if (filter === 'all') {
      setFilteredLists(lists);
    } else {
      setFilteredLists(
        _.filter(lists, e => {
          return e.type.label === filter;
        }),
      );
    }
  };

  if (isLoading) {
    return (
      <View>
        <MainHeader {...headerProps} />
        <ActivityIndicator
          style={{marginTop: 150}}
          size="large"
          color="#0000ff"
        />
      </View>
    );
  }

  return (
    <View style={styles.main_container}>
      <MainHeader {...headerProps} />
      <View style={styles.options_container}>
        <Text
          style={[styles.options, {color: allColor}]}
          onPress={() => {
            sortLists('all');
            setAllColor(theme.colors.highlight);
            setOtherColor(theme.colors.grey);
            setShoppingColor(theme.colors.grey);
            setTodoColor(theme.colors.grey);
          }}>
          Tous
        </Text>
        <Text
          style={[styles.options, {color: shoppingColor}]}
          onPress={() => {
            sortLists('shopping');
            setShoppingColor(theme.colors.highlight);
            setOtherColor(theme.colors.grey);
            setAllColor(theme.colors.grey);
            setTodoColor(theme.colors.grey);
          }}>
          Courses
        </Text>
        <Text
          style={[styles.options, {color: todoColor}]}
          onPress={() => {
            sortLists('todo');
            setTodoColor(theme.colors.highlight);
            setOtherColor(theme.colors.grey);
            setShoppingColor(theme.colors.grey);
            setAllColor(theme.colors.grey);
          }}>
          To do
        </Text>
        <Text
          style={[styles.options, {color: otherColor}]}
          onPress={() => {
            sortLists('other');
            setOtherColor(theme.colors.highlight);
            setAllColor(theme.colors.grey);
            setShoppingColor(theme.colors.grey);
            setTodoColor(theme.colors.grey);
          }}>
          Autres
        </Text>
      </View>
      {isLoading ? (
        <ActivityIndicator
          style={styles.activity_indicator}
          size="large"
          color={theme.colors.activity_indicator}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredLists.map((h, i) => (
            <ListItem.Swipeable
              key={i}
              bottomDivider
              onPress={() => {
                navigation.navigate('ListDetailsScreen', {
                  listGroupId: listGroupId,
                  list: h,
                });
              }}
              leftContent={
                <Button
                  title="détails"
                  icon={{name: 'info', color: 'white'}}
                  buttonStyle={{minHeight: '100%'}}
                  onPress={() => {
                    navigation.navigate('ListDetailsScreen', {
                      listGroupId: listGroupId,
                      list: h,
                    });
                  }}
                />
              }
              rightContent={
                <Button
                  onPress={() => {
                    openDeleteAlert(h.id);
                  }}
                  title="supprimer"
                  icon={{name: 'delete', color: 'white'}}
                  buttonStyle={{minHeight: '100%', backgroundColor: 'red'}}
                />
              }>
              <ListItem.Content>
                <ListItem.Title>{h.label}</ListItem.Title>
                <ListItem.Subtitle>
                  {h.creation.toDate().toLocaleDateString()}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem.Swipeable>
          ))}
        </ScrollView>
      )}
      <FAB
        color={theme.colors.highlight}
        placement="right"
        icon={<Icon name="add" color={theme.colors.white} />}
        onPress={() => {
          setIsOverlayVisible(true);
        }}
      />
      <Overlay
        isVisible={isOverlayVisible}
        onBackdropPress={() => {
          setIsOverlayVisible(false);
        }}
        overlayStyle={styles.overlay}
        backdropStyle={styles.overlay_back}>
        <NewListScreen {...childProps} />
      </Overlay>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
  activity_indicator: {
    marginTop: 150,
  },
  options_container: {
    margin: 10,
    flexDirection: 'row',
  },
  options: {
    flex: 1,
    padding: 5,
    textAlign: 'center',
  },
  overlay: {
    width: '80%',
  },
  overlay_back: {
    backgroundColor: theme.colors.grey,
    opacity: 0.7,
  },
}));

export default ListsScreen;
