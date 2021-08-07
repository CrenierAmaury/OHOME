import firestore from '@react-native-firebase/firestore';

export async function addEvent(calendarId, event) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('calendars')
      .doc(calendarId)
      .collection('events')
      .add(event)
      .then(docRef => {
        resolve(docRef.id);
      })
      .catch(error => {
        reject(error);
      });
  });
}
