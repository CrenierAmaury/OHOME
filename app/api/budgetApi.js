import firestore from '@react-native-firebase/firestore';

export async function getOverview(budgetId) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('budgets')
      .doc(budgetId)
      .get()
      .then(docSnapshot => {
        const data = docSnapshot.data();
        const overview = {
          balance: data.balance,
          income: data.income,
          expense: data.expense,
        };
        resolve(overview);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function getLastFive(budgetId) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('budgets')
      .doc(budgetId)
      .collection('expenses')
      .orderBy('date', 'desc')
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

export async function addExpense(budgetId, expense) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('budgets')
      .doc(budgetId)
      .collection('expenses')
      .add(expense)
      .then(docRef => {
        resolve(docRef.id);
      })
      .catch(error => {
        reject(error);
      });
  });
}
