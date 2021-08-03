import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MainHeader from '../../headers/MainHeader';

const MealsScreen = ({navigation}) => {
  const headerProps = {navigation};

  return (
    <View>
      <MainHeader {...headerProps} />
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
