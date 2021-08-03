import React from 'react';
import {Text, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import MainHeader from '../../headers/MainHeader';

const MealsScreen = ({navigation}) => {
  const styles = useStyles();

  const headerProps = {navigation};

  return (
    <View style={styles.main_container}>
      <MainHeader {...headerProps} />
      <Text>REPAS</Text>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default MealsScreen;
