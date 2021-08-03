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
