import React from 'react';
import {Text, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import {Calendar} from 'react-native-calendars';
import MainHeader from '../../headers/MainHeader';

const CalendarScreen = ({navigation}) => {
  const styles = useStyles();

  const headerProps = {navigation};

  return (
    <View style={styles.main_container}>
      <MainHeader {...headerProps} />
      <Text>CALENDRIER</Text>
      <Calendar />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default CalendarScreen;
