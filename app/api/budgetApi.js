import firestore from '@react-native-firebase/firestore';

async function updateBudgetOverview(budgetId, budgetOverview) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('budgets')
      .doc(budgetId)
      .update(budgetOverview)
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function getBalanceIncomeExpense(budgetId) {
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

export async function getExpenses(budgetId) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('budgets')
      .doc(budgetId)
      .collection('expenses')
      .get()
      .then(querySnapshot => {
        let overviews = [];
        querySnapshot.docs.forEach(doc => {
          const expense = doc.data();
          const overview = {
            key: doc.id,
            label: expense.label,
            amount: expense.amount,
            date: expense.date,
          };
          overviews.push(overview);
        });
        resolve(overviews);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function getLastFiveExpenses(budgetId) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('budgets')
      .doc(budgetId)
      .collection('expenses')
      .orderBy('date', 'desc')
      .limit(5)
      .get()
      .then(querySnapshot => {
        let overviews = [];
        querySnapshot.docs.forEach(doc => {
          const expense = doc.data();
          const overview = {
            key: doc.id,
            label: expense.label,
            amount: expense.amount,
            date: expense.date,
          };
          overviews.push(overview);
        });
        resolve(overviews);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function addExpense(budgetId, expense, budgetOverview) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('budgets')
      .doc(budgetId)
      .collection('expenses')
      .add(expense)
      .then(docRef => {
        budgetOverview.balance += expense.amount;
        if (expense.amount < 0) {
          budgetOverview.expense += expense.amount;
        } else {
          budgetOverview.income += expense.amount;
        }
        updateBudgetOverview(budgetId, budgetOverview)
          .then(() => {
            console.log('API: expense added with id: ' + docRef.id);
            console.log('API: new balance: ' + budgetOverview.balance);
            resolve(docRef.id);
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function updateExpense(budgetId, expenseId, expense) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('budgets')
      .doc(budgetId)
      .collection('expenses')
      .doc(expenseId)
      .update(expense)
      .then(() => {
        getBalanceIncomeExpense(budgetId).then(overview => {
          overview.balance += expense.amount;
          if (expense.amount < 0) {
            overview.expense += expense.amount;
          } else {
            overview.income += expense.amount;
          }
          updateBudgetOverview(budgetId, overview)
            .then(() => {
              console.log('API: expense updated');
              console.log('API: new balance: ' + overview.balance);
              resolve();
            })
            .catch(error => {
              reject(error);
            });
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function removeExpense(budgetId, expenseId, amount) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('budgets')
      .doc(budgetId)
      .collection('expenses')
      .doc(expenseId)
      .delete()
      .then(() => {
        getBalanceIncomeExpense(budgetId).then(overview => {
          overview.balance += amount;
          if (amount < 0) {
            overview.expense += amount;
          } else {
            overview.income += amount;
          }
          updateBudgetOverview(budgetId, overview)
            .then(() => {
              console.log('API: expense removed');
              console.log('API: new balance: ' + overview.balance);
              resolve();
            })
            .catch(error => {
              reject(error);
            });
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}
