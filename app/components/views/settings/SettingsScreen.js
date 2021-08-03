import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TitleHeader from '../../headers/TitleHeader';

const SettingsScreen = ({navigation}) => {
  const headerProps = {title: 'Paramètres', navigation};

  return (
    <View style={styles.main_container}>
      <TitleHeader {...headerProps} />
      <Text>SETTINGS</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default SettingsScreen;
