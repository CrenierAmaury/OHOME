import firestore from '@react-native-firebase/firestore';

export async function addList(listGroupId, list) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('listGroups')
      .doc(listGroupId)
      .collection('lists')
      .add(list)
      .then(docRef => {
        resolve(docRef.id);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function updateList(listGroupId, listId, list) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('listGroups')
      .doc(listGroupId)
      .collection('lists')
      .doc(listId)
      .update(list)
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function removeList(listGroupId, listId) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('listGroups')
      .doc(listGroupId)
      .collection('lists')
      .doc(listId)
      .delete()
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}
