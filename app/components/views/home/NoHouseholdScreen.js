import React from 'react';
import {View, Text} from 'react-native';
import {makeStyles} from 'react-native-elements';

const NoHouseholdScreen = () => {
  const styles = useStyles();

  return (
    <View style={styles.main_container}>
      <Text>NO HOUSEHOLD</Text>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default NoHouseholdScreen;
