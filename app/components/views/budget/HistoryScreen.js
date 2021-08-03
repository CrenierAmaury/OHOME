import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import {ListItem} from 'react-native-elements';

const HistoryScreen = props => {
  const styles = useStyles();

  return (
    <ScrollView>
      <View style={styles.options_container}>
        <Text style={styles.options}>tous</Text>
        <Text style={styles.options}>dépenses</Text>
        <Text style={styles.options}>rentrées</Text>
      </View>
      {props.expenses.map((e, i) => (
        <ListItem key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{e.label}</ListItem.Title>
            <ListItem.Subtitle>{e.amount}</ListItem.Subtitle>
            <ListItem.Subtitle>
              {e.date.toDate().toLocaleDateString()}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </ScrollView>
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
    color: '#8b8b8b',
  },
}));

export default HistoryScreen;
