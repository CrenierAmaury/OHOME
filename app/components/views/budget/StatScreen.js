import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const StatScreen = () => {
  return (
    <View>
      <Text
        onPress={() => {
          console.log('hello');
        }}>
        STATISTIQUES
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default StatScreen;
