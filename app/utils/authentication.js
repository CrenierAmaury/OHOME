import auth from '@react-native-firebase/auth';

export async function signIn(email, password) {
  return new Promise((resolve, reject) => {
    if (email && password) {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          resolve(userCredential);
        })
        .catch(error => {
          reject(error);
        });
    } else {
      reject({code: 'auth/empty-values', message: 'champs vides'});
    }
  });
}

export function checkIfLoggedIn(callback) {
  return auth().onAuthStateChanged(callback);
}

export async function signOut() {
  return new Promise((resolve, reject) => {
    auth()
      .signOut()
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
}
