import firestore from '@react-native-firebase/firestore';

export async function addCollection(collection, data) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(collection)
      .add(data)
      .then(docRef => {
        resolve(docRef);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function readCollection(collection) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(collection)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(`${doc.id} => ${doc.data()}`);
        });
        resolve(querySnapshot);
      })
      .catch(error => {
        reject(error);
      });
  });
}
