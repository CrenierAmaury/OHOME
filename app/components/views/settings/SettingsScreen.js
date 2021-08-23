import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, Text, View} from 'react-native';
import TitleHeader from '../../headers/TitleHeader';
import {
  Button,
  Card,
  ListItem,
  makeStyles,
  useTheme,
} from 'react-native-elements';
import firestore, {firebase} from '@react-native-firebase/firestore';
import Dialog from 'react-native-dialog';
import {
  deleteAuthAccount,
  reauthenticate,
  signOut,
} from '../../../api/authenticationApi';
import {useDispatch, useSelector} from 'react-redux';
import {renderHouseholdName} from '../../../utils/households';
import {removeUser, updateUser} from '../../../api/userApi';
import {updateHousehold} from '../../../api/householdApi';
import {
  cleanAllUser,
  updateHouseholds,
  updateUid,
} from '../../../store/slices/userSlice';
import _ from 'lodash';
import {addInvitation, removeInvitation} from '../../../api/invitationsApi';
import {
  cleanAllHousehold,
  updateHouseholdId,
} from '../../../store/slices/householdSlice';
import {showSuccessSnackbar} from '../../../utils/snackbar';

const SettingsScreen = ({navigation}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [invitationError, setInvitationError] = useState('');
  const [invitationEmail, setInvitationEmail] = useState('');
  const [accountDeleteVisible, setAccountDeleteVisible] = useState(false);
  const [invitationVisible, setInvitationVisible] = useState(false);
  const [invitationReceptionVisible, setInvitationReceptionVisible] =
    useState(false);
  const [invitationId, setInvitationId] = useState('');
  const [invitationHousehold, setInvitationHousehold] = useState('');
  const [invitationHouseholdName, setInvitationHouseholdName] = useState('');
  const [invitations, setInvitations] = useState([]);
  const [user, setUser] = useState(true);

  const email = useSelector(state => state.user.email);
  const name = useSelector(state => state.user.name);
  const uid = useSelector(state => state.user.uid);
  const households = useSelector(state => state.user.households);
  const householdId = useSelector(state => state.household.id);
  const householdName = useSelector(state => state.household.name);
  const members = useSelector(state => state.household.members);

  const headerProps = {title: 'Paramètres', navigation};

  useEffect(() => {
    const unsubscribeU = firestore()
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
    const unsubscribeI = firestore()
      .collection('invitationGroups')
      .doc(email)
      .collection('invitations')
      .onSnapshot(
        querySnapshot => {
          const invitationsTab = [];
          querySnapshot.docs.forEach(doc => {
            const {...invitation} = doc.data();
            invitation.id = doc.id;
            invitationsTab.push(invitation);
          });
          setInvitations(invitationsTab);
          setIsLoading(false);
        },
        e => {
          console.log(e);
        },
      );
    return () => {
      unsubscribeI();
      unsubscribeU();
    };
  }, [email, uid]);

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
                      dispatch(cleanAllUser());
                      dispatch(cleanAllHousehold());
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
      setError('Veuillez entrer votre mot de passe');
    }
  };

  const handleSendInvitation = () => {
    if (invitationEmail) {
      addInvitation(invitationEmail, {
        author: name,
        date: new Date(),
        household: {id: householdId, name: householdName},
      })
        .then(() => {
          setInvitationError('');
          setInvitationEmail('');
          setInvitationVisible(false);
          showSuccessSnackbar('Invitation envoyée');
        })
        .catch(e => {
          setInvitationError(e.message);
        });
    } else {
      setInvitationError('Veuilez indiquer une adresse email');
    }
  };

  const acceptInvitation = () => {
    const householdsTab = [];
    households.forEach(e => {
      householdsTab.push(e.id);
    });
    householdsTab.push(invitationHousehold);
    updateUser(uid, {
      households: householdsTab,
    })
      .then(() => {
        removeInvitation(email, invitationId)
          .then(() => {
            updateHousehold(invitationHousehold, {
              members: firebase.firestore.FieldValue.arrayUnion(uid),
            })
              .then(() => {
                updateHouseholds({
                  id: invitationHousehold,
                  name: invitationHouseholdName,
                });
                setInvitationReceptionVisible(false);
                dispatch(updateHouseholdId(invitationHousehold));
              })
              .catch(e => {
                console.log(e);
              });
          })
          .catch(e => {
            console.log(e);
          });
        console.log('household joined');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const refuseInvitation = () => {
    removeInvitation(email, invitationId)
      .then(() => {
        setInvitationReceptionVisible(false);
        console.log('invitation refused and deleted');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const changeHousehold = newActiveHousehold => {
    updateUser(uid, {
      activeHousehold: newActiveHousehold,
    })
      .then(() => {
        dispatch(updateHouseholdId(newActiveHousehold));
      })
      .catch(e => {
        console.log(e);
      });
  };

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
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card containerStyle={styles.households_container}>
            <Card.Title>Mes ménages</Card.Title>
            <Card.Divider />
            {user && user.households
              ? user.households.map((h, i) => (
                  <ListItem
                    key={i}
                    bottomDivider
                    containerStyle={{
                      backgroundColor:
                        h === householdId
                          ? theme.colors.highlight
                          : theme.colors.white,
                    }}
                    onPress={() => {
                      changeHousehold(h);
                    }}>
                    <ListItem.Content>
                      <ListItem.Title>
                        {renderHouseholdName(households, h)}
                      </ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                ))
              : null}
          </Card>
          <Card>
            <Card.Title>Mes invitations</Card.Title>
            <Card.Divider />
            {invitations.length > 0 ? (
              invitations.map((h, i) => (
                <ListItem
                  key={i}
                  bottomDivider
                  onPress={() => {
                    setInvitationReceptionVisible(true);
                    setInvitationId(h.id);
                    setInvitationHousehold(h.household.id);
                    setInvitationHouseholdName(h.household.name);
                  }}>
                  <ListItem.Content>
                    <ListItem.Title>
                      Invitation à rejoindre le ménage{' '}
                      <Text style={styles.household_name}>
                        {h.household.name}
                      </Text>
                    </ListItem.Title>
                    <ListItem.Subtitle>de {h.author}</ListItem.Subtitle>
                    <ListItem.Subtitle>
                      le {h.date.toDate().toLocaleDateString()}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              ))
            ) : (
              <View style={styles.no_invitations_container}>
                <Text>Aucune invitation reçue</Text>
              </View>
            )}
          </Card>
          <Button
            title="Envoyer une invitation"
            type="solid"
            raised={true}
            onPress={() => {
              setInvitationVisible(true);
            }}
            containerStyle={styles.highlight_button_container}
            buttonStyle={styles.highlight_button}
          />
          <Button
            title="Déconnexion"
            type="solid"
            raised={true}
            onPress={openSignOutAlert}
            containerStyle={styles.button_container}
            buttonStyle={styles.button}
            titleStyle={styles.button_title}
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
            titleStyle={styles.button_title}
          />
        </ScrollView>
      )}
      <Dialog.Container visible={accountDeleteVisible}>
        <Dialog.Title>Suppression du compte</Dialog.Title>
        <Dialog.Description>
          Veuillez entrer votre mot de passe pour confirmer la suppression.
        </Dialog.Description>
        <Dialog.Description style={{color: 'red'}}>
          Attention votre compte sera définitivement supprimé et vous ne serez
          plus lié aux données précédemment enregistrées dans vos ménages.
        </Dialog.Description>
        <Dialog.Input
          placeholder="Mot de passe"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={value => {
            setPassword(value);
          }}
        />
        <Dialog.Description style={{color: 'red'}}>{error}</Dialog.Description>
        <Dialog.Button
          label="Annuler"
          onPress={() => {
            setAccountDeleteVisible(false);
            setPassword('');
            setError('');
          }}
        />
        <Dialog.Button
          label="Valider"
          onPress={() => {
            handleDeleteAccount();
          }}
        />
      </Dialog.Container>
      <Dialog.Container visible={invitationVisible}>
        <Dialog.Title>Invitation</Dialog.Title>
        <Dialog.Description>
          Veuillez entrer l'email de la personne que vous désirez inviter à
          rejoindre le ménage
        </Dialog.Description>
        <Dialog.Input
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={value => {
            setInvitationEmail(value);
          }}
        />
        <Dialog.Description style={{color: 'red'}}>
          {invitationError}
        </Dialog.Description>
        <Dialog.Button
          label="Annuler"
          onPress={() => {
            setInvitationVisible(false);
            setInvitationEmail('');
            setInvitationError('');
          }}
        />
        <Dialog.Button
          label="Envoyer"
          onPress={() => {
            handleSendInvitation();
          }}
        />
      </Dialog.Container>
      <Dialog.Container visible={invitationReceptionVisible}>
        <Dialog.Title>Réponse invitation</Dialog.Title>
        <Dialog.Description>Rejoindre le ménage ?</Dialog.Description>
        <Dialog.Button
          label="Refuser"
          onPress={() => {
            setInvitationReceptionVisible(false);
            refuseInvitation();
          }}
        />
        <Dialog.Button label="Accepter" onPress={acceptInvitation} />
        <Dialog.Button
          label="Ignorer"
          onPress={() => {
            setInvitationReceptionVisible(false);
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
  activity_indicator: {
    marginTop: 150,
  },
  households_container: {
    marginTop: 30,
    marginBottom: 15,
  },
  highlight_button_container: {
    backgroundColor: theme.colors.white,
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 25,
    marginBottom: 10,
  },
  highlight_button: {
    backgroundColor: theme.colors.highlight,
  },
  button_container: {
    backgroundColor: theme.colors.white,
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 25,
    marginBottom: 10,
  },
  button: {
    backgroundColor: theme.colors.white,
  },
  button_title: {
    color: theme.colors.highlight,
  },
  no_invitations_container: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  household_name: {
    fontWeight: 'bold',
  },
}));

export default SettingsScreen;
