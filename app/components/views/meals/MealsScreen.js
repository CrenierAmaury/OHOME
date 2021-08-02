import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MainHeader from '../../headers/mainHeader';

const MealsScreen = () => {
  return (
    <View>
      <MainHeader />
      <Text>REPAS</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default MealsScreen;
