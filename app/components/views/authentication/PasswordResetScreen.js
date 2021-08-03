import React from 'react';
import {Text, View} from 'react-native';
import {makeStyles} from 'react-native-elements';

const PasswordResetScreen = () => {
  const styles = useStyles();

  return (
    <View style={styles.main_container}>
      <Text>PASSWORD RESET</Text>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default PasswordResetScreen;
