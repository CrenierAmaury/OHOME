import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {getLists} from '../../../api/listsApi';
import {FAB, ListItem, Overlay, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NewListScreen from './NewListScreen';

const ListsScreen = ({navigation}) => {
  const [lists, setLists] = useState([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const listGroupId = useSelector(state => state.household.listGroupId);

  const childProps = {listGroupId, setIsOverlayVisible};

  useEffect(() => {
    getLists(listGroupId)
      .then(res => {
        console.log(res);
        setLists(res);
      })
      .catch(e => {
        console.log(e);
      });
  }, [listGroupId]);

  return (
    <View style={styles.main_container}>
      <View style={styles.options_container}>
        <Text style={styles.options}>tous</Text>
        <Text style={styles.options}>courses</Text>
        <Text style={styles.options}>to do</Text>
        <Text style={styles.options}>autres</Text>
      </View>
      <ScrollView>
        {lists.map((h, i) => (
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
                title="modifier"
                icon={{name: 'edit', color: 'white'}}
                buttonStyle={{minHeight: '100%'}}
              />
            }
            rightContent={
              <Button
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

const styles = StyleSheet.create({
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
    color: '#8b8b8b',
  },
});

export default ListsScreen;
