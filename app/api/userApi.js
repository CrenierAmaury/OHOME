import firestore from '@react-native-firebase/firestore';

export async function getUser(uid) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(docSnapshot => {
        resolve(docSnapshot.data());
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function addUser(uid, user) {
  const invitations = await firestore()
    .collection('invitationGroups')
    .doc(user.email)
    .collection('invitations')
    .add({});
  return new Promise((resolve, reject) => {
    firestore()
      .collection('users')
      .doc(uid)
      .set(user)
      .then(docRef => {
        resolve(docRef, invitations);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function updateUser(uid, user) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('users')
      .doc(uid)
      .update(user)
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function removeUser(uid, email) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('users')
      .doc(uid)
      .delete()
      .then(() => {
        firestore()
          .collection('invitationGroups')
          .doc(email)
          .delete()
          .then(() => {
            resolve();
          })
          .catch(error => reject(error));
      })
      .catch(error => {
        reject(error);
      });
  });
}
