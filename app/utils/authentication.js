import firebase from 'firebase';

export async function signIn(email, password) {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        resolve(userCredential.user);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function checkIfLoggedIn() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        resolve(user);
      } else {
        reject('no user logged in');
      }
    });
  });
}
