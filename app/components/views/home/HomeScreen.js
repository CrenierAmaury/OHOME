import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import BudgetWidget from './BudgetWidget';
import MainHeader from '../../headers/MainHeader';

const HomeScreen = ({navigation}) => {
  const headerProps = {navigation};

  return (
    <View style={styles.main_container}>
      <MainHeader {...headerProps} />
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
