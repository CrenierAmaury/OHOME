import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import MainHeader from '../../headers/MainHeader';

const CalendarScreen = ({navigation}) => {
  const headerProps = {navigation};

  return (
    <View>
      <MainHeader {...headerProps} />
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
