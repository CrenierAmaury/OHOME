import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, Alert, ScrollView} from 'react-native';
import {
  Button,
  Card,
  ListItem,
  makeStyles,
  useTheme,
} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import firestore, {firebase} from '@react-native-firebase/firestore';
import Dialog from 'react-native-dialog';
import {removeInvitation} from '../../../api/invitationsApi';
import {updateHousehold} from '../../../api/householdApi';
import {updateUser} from '../../../api/userApi';
import {signOut} from '../../../api/authenticationApi';
import {cleanAllUser} from '../../../store/slices/userSlice';
import {
  cleanAllHousehold,
  updateHouseholdId,
} from '../../../store/slices/householdSlice';

const NoHouseholdScreen = ({navigation}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [invitationVisible, setInvitationVisible] = useState(false);
  const [invitationId, setInvitationId] = useState('');
  const [invitationHousehold, setInvitationHousehold] = useState('');
  const [invitations, setInvitations] = useState([]);

  const uid = useSelector(state => state.user.uid);
  const email = useSelector(state => state.user.email);
  const households = useSelector(state => state.user.households);

  useEffect(() => {
    const unsubscribe = firestore()
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
        error => {
          console.log(error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, [email]);

  const acceptInvitation = () => {
    const householdsTab = [];
    households.forEach(e => {
      householdsTab.push(e.id);
    });
    householdsTab.push(invitationHousehold);
    updateUser(uid, {
      activeHousehold: invitationHousehold,
      households: householdsTab,
    })
      .then(() => {
        removeInvitation(email, invitationId)
          .then(() => {
            updateHousehold(invitationHousehold, {
              members: firebase.firestore.FieldValue.arrayUnion(uid),
            })
              .then(() => {
                setInvitationVisible(false);
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
        setInvitationVisible(false);
        console.log('invitation refused and deleted');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleSignOut = () => {
    signOut()
      .then(() => {
        dispatch(cleanAllHousehold());
        dispatch(cleanAllUser());
      })
      .catch(e => {
        console.log(e);
      });
  };

  const openSignOutAlert = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez vous vraiment vous déconnecter ?',
      [{text: 'ANNULER'}, {text: 'OUI', onPress: handleSignOut}],
      {cancelable: true},
    );
  };

  return (
    <View style={styles.main_container}>
      {isLoading ? (
        <ActivityIndicator
          style={styles.activity_indicator}
          size="large"
          color={theme.colors.activity_indicator}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.welcome_text}>Bienvenue</Text>
          <Text style={styles.info_text}>
            Vous pouvez créer un nouveau ménage ou répondre aux invitations
            reçues.
          </Text>
          <Button
            title="Créer un nouveau ménage"
            type="solid"
            raised={true}
            onPress={() => {
              navigation.navigate('HouseholdCreationScreen');
            }}
            containerStyle={styles.button_container}
            buttonStyle={styles.button}
          />
          <Card containerStyle={styles.invitations_container}>
            <Card.Title>Invitations</Card.Title>
            <Card.Divider />
            {invitations.length > 0 ? (
              invitations.map((h, i) => (
                <ListItem
                  key={i}
                  bottomDivider
                  onPress={() => {
                    setInvitationVisible(true);
                    setInvitationId(h.id);
                    setInvitationHousehold(h.household.id);
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
            title="Déconnexion"
            type="solid"
            raised={true}
            onPress={openSignOutAlert}
            containerStyle={styles.signout_button_container}
            buttonStyle={styles.signout_button}
            titleStyle={styles.signout_button_title}
          />
        </ScrollView>
      )}
      <Dialog.Container visible={invitationVisible}>
        <Dialog.Title>Réponse invitation</Dialog.Title>
        <Dialog.Description>Rejoindre le ménage ?</Dialog.Description>
        <Dialog.Button
          label="Refuser"
          onPress={() => {
            setInvitationVisible(false);
            refuseInvitation();
          }}
        />
        <Dialog.Button label="Accepter" onPress={acceptInvitation} />
        <Dialog.Button
          label="Ignorer"
          onPress={() => {
            setInvitationVisible(false);
          }}
        />
      </Dialog.Container>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
    padding: 10,
    paddingTop: 50,
    alignItems: 'center',
    alignContent: 'center',
  },
  activity_indicator: {
    marginTop: 150,
  },
  welcome_text: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 20,
  },
  info_text: {
    fontSize: 15,
  },
  invitations_container: {
    marginTop: 40,
  },
  button_container: {
    backgroundColor: theme.colors.background,
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: theme.colors.highlight,
  },
  signout_button_container: {
    backgroundColor: theme.colors.white,
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 50,
    marginBottom: 50,
  },
  signout_button: {
    backgroundColor: theme.colors.white,
  },
  signout_button_title: {
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

export default NoHouseholdScreen;
