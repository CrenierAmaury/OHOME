import React from 'react';
import {View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import MainHeader from '../../headers/MainHeader';
import AgendaScreen from './AgendaScreen';

const CalendarScreen = ({navigation}) => {
  const styles = useStyles();

  const headerProps = {navigation};

  return (
    <View style={styles.main_container}>
      <MainHeader {...headerProps} />
      <AgendaScreen />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default CalendarScreen;
