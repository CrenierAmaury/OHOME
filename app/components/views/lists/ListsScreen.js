import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import {ScrollView, View, Text} from 'react-native';
import {makeStyles} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {FAB, ListItem, Overlay, Button, Icon} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import NewListScreen from './NewListScreen';
import {removeList} from '../../../api/listsApi';
import {showSuccessSnackbar} from '../../../utils/snackbar';
import MainHeader from '../../headers/MainHeader';

const ListsScreen = ({navigation}) => {
  const styles = useStyles();

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
        showSuccessSnackbar('liste supprimée avec succès');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const sortLists = filter => {
    if (filter === 'all') {
      setFilteredLists(lists);
    } else {
      setFilteredLists(_.filter(lists, {type: filter}));
    }
  };

  return (
    <View style={styles.main_container}>
      <MainHeader {...headerProps} />
      <View style={styles.options_container}>
        <Text
          style={[styles.options, {color: allColor}]}
          onPress={() => {
            sortLists('all');
            setAllColor('#FCA311');
            setOtherColor('#8b8b8b');
            setShoppingColor('#8b8b8b');
            setTodoColor('#8b8b8b');
          }}>
          tous
        </Text>
        <Text
          style={[styles.options, {color: shoppingColor}]}
          onPress={() => {
            sortLists('shopping');
            setShoppingColor('#FCA311');
            setOtherColor('#8b8b8b');
            setAllColor('#8b8b8b');
            setTodoColor('#8b8b8b');
          }}>
          courses
        </Text>
        <Text
          style={[styles.options, {color: todoColor}]}
          onPress={() => {
            sortLists('todo');
            setTodoColor('#FCA311');
            setOtherColor('#8b8b8b');
            setShoppingColor('#8b8b8b');
            setAllColor('#8b8b8b');
          }}>
          to do
        </Text>
        <Text
          style={[styles.options, {color: otherColor}]}
          onPress={() => {
            sortLists('other');
            setOtherColor('#FCA311');
            setAllColor('#8b8b8b');
            setShoppingColor('#8b8b8b');
            setTodoColor('#8b8b8b');
          }}>
          autres
        </Text>
      </View>
      <ScrollView>
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
                  deleteList(listGroupId, h.id);
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
      <FAB
        color="#FCA311"
        placement="right"
        icon={<Icon name="add" color="white" />}
        onPress={() => {
          setIsOverlayVisible(true);
        }}
      />
      <Overlay
        isVisible={isOverlayVisible}
        onBackdropPress={() => {
          setIsOverlayVisible(false);
        }}
        overlayStyle={{
          width: '80%',
        }}
        backdropStyle={{
          backgroundColor: 'grey',
          opacity: 0.7,
        }}>
        <NewListScreen {...childProps} />
      </Overlay>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
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
}));

export default ListsScreen;
