import firestore from '@react-native-firebase/firestore';

export async function getHousehold(householdId) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('households')
      .doc(householdId)
      .get()
      .then(docSnapshot => {
        resolve(docSnapshot.data());
      })
      .catch(error => {
        reject(error);
      });
  });
}
