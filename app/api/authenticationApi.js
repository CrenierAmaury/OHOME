import auth, {firebase} from '@react-native-firebase/auth';

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

export async function signUp(email, password, name) {
  return new Promise((resolve, reject) => {
    if (email && password && name) {
      auth()
        .createUserWithEmailAndPassword(email, password)
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
          } else if (code === 'auth/email-already-in-use') {
            reject({
              code: code,
              message: 'cette adresse email est déjà utilisée',
            });
          } else if (code === 'auth/weak-password') {
            reject({
              code: code,
              message: 'le mot de passe doit contenir au moins 6 caractères',
            });
          } else {
            reject(error);
          }
        });
    } else {
      reject({
        code: 'auth/empty-value',
        message: 'veuillez remplir tous les champs',
      });
    }
  });
}

export async function updateAuthEmail(email) {
  return new Promise((resolve, reject) => {
    auth()
      .currentUser.updateEmail(email)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function updateAuthPassword(password) {
  return new Promise((resolve, reject) => {
    auth()
      .currentUser.updatePassword(password)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function deleteAuthAccount() {
  return new Promise((resolve, reject) => {
    auth()
      .currentUser.delete()
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function reauthenticate(email, password) {
  const credentials = firebase.auth.EmailAuthProvider.credential(
    email,
    password,
  );
  return new Promise((resolve, reject) => {
    auth()
      .currentUser.reauthenticateWithCredential(credentials)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
}
