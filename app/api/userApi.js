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
  return new Promise((resolve, reject) => {
    firestore()
      .collection('users')
      .doc(uid)
      .set(user)
      .then(docRef => {
        resolve(docRef);
      })
      .catch(error => {
        reject(error);
      });
  });
}
