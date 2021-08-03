import React from 'react';
import {Text, View} from 'react-native';
import TitleHeader from '../../headers/TitleHeader';
import {makeStyles} from 'react-native-elements';

const SettingsScreen = ({navigation}) => {
  const styles = useStyles();

  const headerProps = {title: 'Paramètres', navigation};

  return (
    <View style={styles.main_container}>
      <TitleHeader {...headerProps} />
      <Text>SETTINGS</Text>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default SettingsScreen;
