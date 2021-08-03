import React from 'react';
import {Text, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import BudgetWidget from './BudgetWidget';
import MainHeader from '../../headers/MainHeader';

const HomeScreen = ({navigation}) => {
  const styles = useStyles();

  const headerProps = {navigation};

  return (
    <View style={styles.main_container}>
      <MainHeader {...headerProps} />
      <Text>HOME</Text>
      <BudgetWidget {...navigation} />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default HomeScreen;
