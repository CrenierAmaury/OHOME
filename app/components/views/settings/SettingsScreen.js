import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, View} from 'react-native';
import TitleHeader from '../../headers/TitleHeader';
import {Button, Card, ListItem, makeStyles} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import Dialog from 'react-native-dialog';
import {
  deleteAuthAccount,
  reauthenticate,
  signOut,
} from '../../../api/authenticationApi';
import {useDispatch, useSelector} from 'react-redux';
import {renderHouseholdName} from '../../../utils/households';
import {removeUser} from '../../../api/userApi';
import {updateHousehold} from '../../../api/householdApi';
import {updateUid} from '../../../store/slices/userSlice';
import _ from 'lodash';

const SettingsScreen = ({navigation}) => {
  const styles = useStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [accountDeleteVisible, setAccountDeleteVisible] = useState(false);
  const [user, setUser] = useState(true);

  const dispatch = useDispatch();

  const email = useSelector(state => state.user.email);
  const uid = useSelector(state => state.user.uid);
  const households = useSelector(state => state.user.households);
  const householdId = useSelector(state => state.household.id);
  const members = useSelector(state => state.household.members);

  const headerProps = {title: 'Paramètres', navigation};

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
              removeUser(uid)
                .then(() => {
                  const index = _.findIndex(members, e => {
                    return e.id === uid;
                  });
                  updateHousehold(householdId, {
                    members: [...members].splice(index, 1),
                  })
                    .then(() => {
                      console.log('account deleted');
                      setAccountDeleteVisible(false);
                      dispatch(updateUid(''));
                    })
                    .catch(e => {
                      setError(e.message);
                    });
                })
                .catch(e => {
                  setError(e.message);
                });
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

  if (isLoading) {
    return (
      <View>
        <TitleHeader {...headerProps} />
        <ActivityIndicator
          style={{marginTop: 150}}
          size="large"
          color="#0000ff"
        />
      </View>
    );
  }

  return (
    <View style={styles.main_container}>
      <TitleHeader {...headerProps} />
      <Card>
        <Card.Title>Mes ménages</Card.Title>
        <Card.Divider />
        {user.households.map((h, i) => (
          <ListItem key={i} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>
                {renderHouseholdName(households, h)}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </Card>
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
