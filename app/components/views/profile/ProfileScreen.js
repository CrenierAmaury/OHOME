import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Button, makeStyles, Avatar} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import TitleHeader from '../../headers/TitleHeader';
import {getUserAvatar, uploadAvatar} from '../../../utils/avatar';
import {updateAvatar} from '../../../store/slices/userSlice';
import {
  reauthenticate,
  updateAuthPassword,
} from '../../../api/authenticationApi';
import Dialog from 'react-native-dialog';
import ProfilAvatar from './ProfilAvatar';

const ProfileScreen = ({navigation}) => {
  const styles = useStyles();

  const [user, setUser] = useState({});
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [error, setError] = useState('');
  const [passwordModifyVisible, setPasswordModifyVisible] = useState(false);

  const dispatch = useDispatch();

  const headerProps = {title: 'Profil', navigation};

  const uid = useSelector(state => state.user.uid);
  const name = useSelector(state => state.user.name);
  const email = useSelector(state => state.user.email);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(
        documentSnapshot => {
          setUser(documentSnapshot.data());
        },
        error => {
          console.log(error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, [uid]);

  const takePhotoAvatar = () => {
    launchCamera({}, res => {
      if (res.assets) {
        uploadAvatar(uid, res.assets[res.assets.length - 1].uri)
          .then(() => {
            getUserAvatar(uid)
              .then(link => {
                dispatch(updateAvatar(link));
              })
              .catch(e => {
                console.log(e);
              });
          })
          .catch(e => {
            console.log(e);
          });
      }
    });
  };

  const updatePassword = () => {
    reauthenticate(email, password)
      .then(() => {
        updateAuthPassword(newPassword)
          .then(() => {
            setPasswordModifyVisible(false);
            console.log('password updated');
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handlePasswordModification = () => {
    if (password && newPassword !== newPasswordCheck) {
      setError('Veuillez rentrer deux nouveaux mots de passe identiques');
    } else {
      updatePassword();
    }
  };

  const avatarProps = {size: 'xlarge', takePhotoAvatar};

  return (
    <View style={styles.main_container}>
      <TitleHeader {...headerProps} />
      <ProfilAvatar {...avatarProps} />
      <View style={styles.user_info}>
        <Text>{name}</Text>
        <Text>{email}</Text>
      </View>
      <Button
        title="Modifier les informations"
        type="solid"
        raised={true}
        onPress={() => {
          navigation.navigate('ProfileModifyScreen', {user});
        }}
        containerStyle={styles.button_container}
        buttonStyle={styles.button}
      />
      <Button
        title="Modifier le mot de passe"
        type="solid"
        raised={true}
        onPress={() => {
          setPasswordModifyVisible(true);
        }}
        containerStyle={styles.button_container}
        buttonStyle={styles.button}
      />
      <Dialog.Container visible={passwordModifyVisible}>
        <Dialog.Title>Modification Mot de passe</Dialog.Title>
        <Dialog.Input
          placeholder="mot de passe actuel"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={value => {
            setPassword(value);
          }}
        />
        <Dialog.Input
          placeholder="nouveau mot de passe"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={value => {
            setNewPassword(value);
          }}
        />
        <Dialog.Input
          placeholder="confirmer le nouveau mot de passe"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={value => {
            setNewPasswordCheck(value);
          }}
        />
        <Dialog.Button
          label="annuler"
          onPress={() => {
            setPasswordModifyVisible(false);
            setPassword('');
          }}
        />
        <Dialog.Button label="valider" onPress={handlePasswordModification} />
      </Dialog.Container>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
    alignItems: 'center',
  },
  user_info: {
    margin: 25,
    alignItems: 'center',
  },
  button_container: {
    backgroundColor: theme.colors.background,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 25,
  },
  button: {
    backgroundColor: theme.colors.highlight,
  },
}));

export default ProfileScreen;
