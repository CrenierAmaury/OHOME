import firestore from '@react-native-firebase/firestore';

export async function getBalance(budgetId) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('budgets')
      .doc(budgetId)
      .get()
      .then(docSnapshot => {
        resolve(docSnapshot.data().balance);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function getExpensesOverview(budgetId) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('budgets')
      .doc(budgetId)
      .collection('expenses')
      .orderBy('creation', 'desc')
      .limit(5)
      .get()
      .then(querySnapshot => {
        resolve(querySnapshot.docs);
      })
      .catch(error => {
        reject(error);
      });
  });
}
