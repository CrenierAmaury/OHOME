import storage from '@react-native-firebase/storage';

export async function uploadAvatar(uid, file) {
  const avatarRef = storage().ref('/avatars/' + uid + '.avatar');
  avatarRef
    .putFile(file)
    .then(res => {
      return res;
    })
    .catch(error => {
      return error;
    });
}

export async function getUserAvatar(uid) {
  const avatarRef = storage().ref('/avatars/' + uid + '.avatar');
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
