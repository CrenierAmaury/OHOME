import React from 'react';
import {Alert, Text, View} from 'react-native';
import TitleHeader from '../../headers/TitleHeader';
import {Button, makeStyles} from 'react-native-elements';
import {signOut} from '../../../api/authenticationApi';
import {updateUid} from '../../../store/slices/userSlice';
import {useDispatch} from 'react-redux';

const SettingsScreen = ({navigation}) => {
  const styles = useStyles();

  const dispatch = useDispatch();

  const headerProps = {title: 'Paramètres', navigation};

  const openSignOutAlert = () => {
    Alert.alert(
      '',
      'Voulez vous vraiment vous déconnecter ?',
      [{text: 'ANNULER'}, {text: 'OUI', onPress: handleSignOut}],
      {cancelable: true},
    );
  };

  const handleSignOut = () => {
    signOut()
      .then(() => {
        dispatch(updateUid(''));
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <View style={styles.main_container}>
      <TitleHeader {...headerProps} />
      <Button
        title="sign out"
        type="solid"
        raised={true}
        onPress={openSignOutAlert}
        containerStyle={styles.button_container}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
    alignItems: 'center',
  },
  button_container: {
    backgroundColor: theme.colors.background,
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
  },
  button: {
    backgroundColor: theme.colors.highlight,
  },
}));

export default SettingsScreen;
