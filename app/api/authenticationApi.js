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
          const code = error.code;
          if (code === 'auth/invalid-email') {
            reject({
              code: code,
              message: 'veuillez entrer une adresse email valide',
            });
          } else if (code === 'auth/wrong-password') {
            reject({
              code: code,
              message: 'le mot de passe entré est incorrect',
            });
          } else if (code === 'auth/user-not-found') {
            reject({
              code: code,
              message: 'utilisateur inconnu',
            });
          } else {
            reject(error);
          }
        });
    } else {
      reject({
        code: 'auth/empty-values',
        message: 'veuillez remplir tous les champs',
      });
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

export async function signUp(email, password) {
  return new Promise((resolve, reject) => {
    if (email && password) {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          resolve(userCredential);
        })
        .catch(error => {
          reject(error);
        });
    } else {
      reject({
        code: 'auth/empty-value',
        message: 'veuillez remplir tous les champs',
      });
    }
  });
}
