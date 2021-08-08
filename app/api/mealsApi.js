import firestore from '@react-native-firebase/firestore';

export async function addMeal(mealGroupId, meal) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('mealGroups')
      .doc(mealGroupId)
      .collection('meals')
      .add(meal)
      .then(docRef => {
        resolve(docRef.id);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function updateMeal(mealGroupId, mealId, meal) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('mealGroups')
      .doc(mealGroupId)
      .collection('meals')
      .doc(mealId)
      .update(meal)
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}
