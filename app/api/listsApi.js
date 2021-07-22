import firestore from '@react-native-firebase/firestore';

export async function getLists(listGroupId) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('listGroups')
      .doc(listGroupId)
      .collection('lists')
      .get()
      .then(querySnapshot => {
        const lists = [];
        querySnapshot.docs.forEach(doc => {
          lists.push(doc.data());
        });
        resolve(lists);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function getListsTEST(listGroupId) {
  firestore()
    .collection('listGroups')
    .doc(listGroupId)
    .collection('lists')
    .onSnapshot(
      querySnapshot => {
        const lists = [];
        querySnapshot.docs.forEach(doc => {
          lists.push(doc.data());
        });
        return lists;
      },
      error => {
        return error;
      },
    );
}

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

export async function updateExpense(listGroupId, listId, list) {
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
