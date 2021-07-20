import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

const ListsScreen = () => {
  const listGroupId = useSelector(state => state.household.listGroupId);

  return (
    <View>
      <Text>LISTES</Text>
      <Text>{listGroupId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default ListsScreen;
