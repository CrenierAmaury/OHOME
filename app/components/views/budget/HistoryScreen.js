import React from 'react';
import { StyleSheet, ScrollView, Text, View } from "react-native";
import {ListItem} from 'react-native-elements';

const HistoryScreen = props => {
  return (
    <ScrollView>
      <View style={styles.options_container}>
        <Text style={styles.options}> tous</Text>
        <Text style={styles.options}> dépenses</Text>
        <Text style={styles.options}> rentrées</Text>
      </View>
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

export default HistoryScreen;
