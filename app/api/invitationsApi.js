import firestore from '@react-native-firebase/firestore';

export async function addInvitation(email, invitation) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('invitationGroups')
      .doc(email)
      .collection('invitations')
      .add(invitation)
      .then(docRef => {
        resolve(docRef.id);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function removeInvitation(email, invitationId) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('invitationGroups')
      .doc(email)
      .collection('meals')
      .doc(invitationId)
      .delete()
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}
