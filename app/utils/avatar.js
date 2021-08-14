import storage from '@react-native-firebase/storage';

function createRef(uid) {
  return storage().ref('/' + uid + '/avatar');
}

export async function uploadAvatar(uid, file) {
  const avatarRef = createRef(uid);
  return new Promise((resolve, reject) => {
    avatarRef
      .putFile(file)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function getUserAvatar(uid) {
  const avatarRef = createRef(uid);
  return new Promise((resolve, reject) => {
    avatarRef
      .getDownloadURL()
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
