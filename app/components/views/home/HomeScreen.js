import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import BudgetWidget from './BudgetWidget';

const HomeScreen = () => {
  return (
    <View style={styles.main_container}>
      <Text>HOME</Text>
      <BudgetWidget />
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default HomeScreen;
