import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import {Button, ListItem} from 'react-native-elements';

const ListDetailsScreen = ({route}) => {
  const [list, setList] = useState({});
  const [elements, setElements] = useState([]);

  useEffect(() => {
    setList(route.params.list);
    setElements(route.params.list.elements);
  }, [route.params.list]);

  return (
    <View style={styles.main_container}>
      <Text>{list.label}</Text>
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
                title="supprimer"
                icon={{name: 'delete', color: 'white'}}
                buttonStyle={{minHeight: '100%', backgroundColor: 'red'}}
              />
            }>
            <ListItem.Content>
              <ListItem.Title>{h}</ListItem.Title>
            </ListItem.Content>
            <ListItem.CheckBox checked={true} />
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
