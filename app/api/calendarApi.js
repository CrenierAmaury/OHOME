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

export async function updateEvent(calendarId, eventId, event) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('calendars')
      .doc(calendarId)
      .collection('events')
      .doc(eventId)
      .update(event)
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function removeEvent(calendarId, eventId) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('calendars')
      .doc(calendarId)
      .collection('events')
      .doc(eventId)
      .delete()
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}
