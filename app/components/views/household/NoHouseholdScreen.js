import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {Button, Card, ListItem, makeStyles} from 'react-native-elements';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Dialog from 'react-native-dialog';
import {removeInvitation} from '../../../api/invitationsApi';
import {updateUser} from '../../../api/userApi';

const NoHouseholdScreen = ({navigation}) => {
  const styles = useStyles();

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
      .collection('invitationGroup')
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
    updateUser(uid, {
      activeHousehold: invitationHousehold,
      households: [...households].push(invitationHousehold),
    })
      .then(() => {
        navigation.navigate('Authenticated');
        console.log('household created');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const refuseInvitation = () => {
    removeInvitation(email, invitationId)
      .then(() => {
        console.log('invitation refused and deleted');
      })
      .catch(e => {
        console.log(e);
      });
  };

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator
          style={{marginTop: 300}}
          size="large"
          color="#0000ff"
        />
      </View>
    );
  }

  return (
    <View style={styles.main_container}>
      <Text>
        Vous pouvez créer un nouveau ménage ou répondre aux invitations reçues
      </Text>
      <Button
        title="Créer un nouveau ménage"
        type="solid"
        raised={true}
        onPress={() => {
          navigation.navigate('HouseholdCreationScreen');
        }}
        containerStyle={{
          backgroundColor: '#FBFBFB',
          width: '75%',
          marginRight: 'auto',
          marginLeft: 'auto',
        }}
        buttonStyle={{
          backgroundColor: '#FCA311',
        }}
      />
      <Card containerStyle={styles.invitations_container}>
        <Card.Title>Invitations</Card.Title>
        <Card.Divider />
        {invitations.map((h, i) => (
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
                Invitation à rejoindre le ménage {h.household.name}
              </ListItem.Title>
              <ListItem.Subtitle>de {h.author}</ListItem.Subtitle>
              <ListItem.Subtitle>
                le {h.date.toDate().toLocaleDateString()}
              </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
      </Card>
      <Dialog.Container visible={invitationVisible}>
        <Dialog.Title>Modification Email</Dialog.Title>
        <Dialog.Description>
          veuillez entrer votre mot de passe pour confirmer.
        </Dialog.Description>
        <Dialog.Button
          label="refuser"
          onPress={() => {
            setInvitationVisible(false);
            refuseInvitation();
          }}
        />
        <Dialog.Button label="accepter" onPress={acceptInvitation} />
        <Dialog.Button
          label="ignorer"
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
    paddingTop: 100,
    alignItems: 'center',
    alignContent: 'center',
  },
  invitations_container: {
    margin: 10,
    borderWidth: 0,
  },
}));

export default NoHouseholdScreen;
