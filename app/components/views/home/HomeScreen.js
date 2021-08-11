import React from 'react';
import {View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import BudgetWidget from './BudgetWidget';
import MainHeader from '../../headers/MainHeader';
import MealsWidget from './MealsWidget';
import CalendarWidget from './CalendarWidget';

const HomeScreen = ({navigation}) => {
  const styles = useStyles();

  const headerProps = {navigation};

  return (
    <View style={styles.main_container}>
      <MainHeader {...headerProps} />
      <BudgetWidget {...navigation} />
      <MealsWidget {...navigation} />
      <CalendarWidget {...navigation} />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default HomeScreen;
