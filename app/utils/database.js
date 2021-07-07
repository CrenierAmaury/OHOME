import firebase from 'firebase';

const db = firebase.firestore();

export async function addCollection(collection, data) {
  return new Promise((resolve, reject) => {
    db.collection(collection)
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
    db.collection(collection)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(`${doc.id} => ${doc.data().email}`);
        });
        resolve(querySnapshot);
      })
      .catch(error => {
        reject(error);
      });
  });
}
