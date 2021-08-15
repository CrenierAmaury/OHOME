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

export async function createHousehold(uid, name) {
  const budget = await (
    await firestore()
      .collection('budgets')
      .add({
        balance: 0,
        expense: 0,
        income: 0,
        categories: [{label: 'aucune', color: 'grey'}],
      })
  )
    .collection('expenses')
    .add({});
  const calendar = await (await firestore().collection('calendars').add({}))
    .collection('events')
    .add({});
  const listGroup = await (await firestore().collection('listGroups').add({}))
    .collection('lists')
    .add({});
  const mealGroup = await (await firestore().collection('mealGroups').add({}))
    .collection('meals')
    .add({});
  return new Promise((resolve, reject) => {
    firestore()
      .collection('households')
      .add({
        author: uid,
        creation: new Date(),
        name: name,
        members: [uid],
        budget: budget.id,
        calendar: calendar.id,
        listGroup: listGroup.id,
        mealGroup: mealGroup.id,
      })
      .then(docRef => {
        resolve(docRef.id);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function updateHousehold(householdId, household) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('households')
      .doc(householdId)
      .update(household)
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}
