import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import MainHeader from '../../headers/mainHeader';

const CalendarScreen = () => {
  return (
    <View>
      <MainHeader />
      <Text>CALENDRIER</Text>
      <Calendar />
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default CalendarScreen;
