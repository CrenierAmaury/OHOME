import React, {useState} from 'react';
import {Alert, Text, View} from 'react-native';
import TitleHeader from '../../headers/TitleHeader';
import {Button, makeStyles} from 'react-native-elements';
import Dialog from 'react-native-dialog';
import {
  deleteAuthAccount,
  reauthenticate,
  signOut,
} from '../../../api/authenticationApi';
import {updateUid} from '../../../store/slices/userSlice';
import {useDispatch, useSelector} from 'react-redux';

const SettingsScreen = ({navigation}) => {
  const styles = useStyles();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [accountDeleteVisible, setAccountDeleteVisible] = useState(false);

  const dispatch = useDispatch();

  const email = useSelector(state => state.user.email);

  const headerProps = {title: 'Paramètres', navigation};

  const openSignOutAlert = () => {
    Alert.alert(
      'Déconnexion',
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

  const handleDeleteAccount = () => {
    if (password) {
      reauthenticate(email, password)
        .then(() => {
          deleteAuthAccount()
            .then(() => {
              setAccountDeleteVisible(false);
              dispatch(updateUid(''));
              setError('');
              console.log('account deleted');
            })
            .catch(e => {
              setError(e.message);
            });
        })
        .catch(e => {
          setError(e.message);
        });
    } else {
      setError('veuillez entrer votre mot de passe');
    }
  };

  return (
    <View style={styles.main_container}>
      <TitleHeader {...headerProps} />
      <Button
        title="Déconnexion"
        type="solid"
        raised={true}
        onPress={openSignOutAlert}
        containerStyle={styles.button_container}
        buttonStyle={styles.button}
      />
      <Button
        title="Suppression du compte"
        type="solid"
        raised={true}
        onPress={() => {
          setAccountDeleteVisible(true);
        }}
        containerStyle={styles.button_container}
        buttonStyle={styles.button}
      />
      <Dialog.Container visible={accountDeleteVisible}>
        <Dialog.Title>Suppression du compte</Dialog.Title>
        <Dialog.Description>
          Veuillez entrer votre mot de passe pour confirmer la suppression.
        </Dialog.Description>
        <Dialog.Description style={{color: 'red'}}>
          Attention vous ne serez plus lié aux données précdemment enregistrées
          dans vos ménages.
        </Dialog.Description>
        <Dialog.Input
          placeholder="mot de passe"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={value => {
            setPassword(value);
          }}
        />
        <Dialog.Description>{error}</Dialog.Description>
        <Dialog.Button
          label="annuler"
          onPress={() => {
            setAccountDeleteVisible(false);
            setPassword('');
            setError('');
          }}
        />
        <Dialog.Button
          label="valider"
          onPress={() => {
            handleDeleteAccount();
          }}
        />
      </Dialog.Container>
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
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
  },
  button: {
    backgroundColor: theme.colors.highlight,
  },
}));

export default SettingsScreen;
