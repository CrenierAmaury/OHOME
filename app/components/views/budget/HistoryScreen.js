import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {ListItem} from 'react-native-elements';

const HistoryScreen = props => {
  return (
    <ScrollView>
      {props.expenses.map((e, i) => (
        <ListItem key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{e.name}</ListItem.Title>
            <ListItem.Subtitle>{e.amount}</ListItem.Subtitle>
            <ListItem.Subtitle>
              {e.date.toDate().toLocaleDateString()}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default HistoryScreen;
