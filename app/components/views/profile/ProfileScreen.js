import React, {useEffect, useState} from 'react';
import {ScrollView, ActivityIndicator, Text, View} from 'react-native';
import {Button, makeStyles, useTheme} from 'react-native-elements';
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
  const {theme} = useTheme();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [error, setError] = useState('');
  const [passwordModifyVisible, setPasswordModifyVisible] = useState(false);

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
          setIsLoading(false);
        },
        e => {
          console.log(e);
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
      {isLoading ? (
        <ActivityIndicator
          style={styles.activity_indicator}
          size="large"
          color={theme.colors.activity_indicator}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content_container}
          showsVerticalScrollIndicator={false}>
          <ProfilAvatar {...avatarProps} />
          <View style={styles.user_info}>
            <Text style={styles.info_name}>{name}</Text>
            <Text style={styles.info_email}>{email}</Text>
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
        </ScrollView>
      )}
      <Dialog.Container visible={passwordModifyVisible}>
        <Dialog.Title>Modification du mot de passe</Dialog.Title>
        <Dialog.Input
          placeholder="Mot de passe actuel"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={value => {
            setPassword(value);
          }}
        />
        <Dialog.Input
          placeholder="Nouveau mot de passe"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={value => {
            setNewPassword(value);
          }}
        />
        <Dialog.Input
          placeholder="Confirmer le nouveau mot de passe"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={value => {
            setNewPasswordCheck(value);
          }}
        />
        <Dialog.Button
          label="Annuler"
          onPress={() => {
            setPasswordModifyVisible(false);
            setPassword('');
          }}
        />
        <Dialog.Button label="Valider" onPress={handlePasswordModification} />
      </Dialog.Container>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
  content_container: {
    alignItems: 'center',
  },
  activity_indicator: {
    marginTop: 150,
  },
  info_name: {
    fontSize: 20,
  },
  info_email: {
    marginTop: 5,
    fontSize: 15,
  },
  user_info: {
    margin: 25,
    alignItems: 'center',
  },
  button_container: {
    backgroundColor: theme.colors.background,
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 25,
    marginBottom: 10,
  },
  button: {
    backgroundColor: theme.colors.highlight,
  },
}));

export default ProfileScreen;
