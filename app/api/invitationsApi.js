import firestore from '@react-native-firebase/firestore';

export async function addInvitation(email, invitation) {
  const checkInscription = await firestore()
    .collection('invitationGroups')
    .doc(email)
    .get();
  return new Promise((resolve, reject) => {
    if (checkInscription.exists) {
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
    } else {
      reject({
        code: 'no user',
        message: 'Aucun utilisateur inscrit avec cet email',
      });
    }
  });
}

export async function removeInvitation(email, invitationId) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('invitationGroups')
      .doc(email)
      .collection('invitations')
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
