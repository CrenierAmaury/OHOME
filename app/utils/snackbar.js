import Snackbar from 'react-native-snackbar';

export function showSuccessSnackbar(message) {
  Snackbar.show({
    text: message,
    textColor: 'green',
    duration: Snackbar.LENGTH_SHORT,
  });
}
