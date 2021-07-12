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
