import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {signUp} from '../../../api/authenticationApi';
import {addUser} from '../../../api/userApi';

const SignUpScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [error, setError] = useState('');

  const verifyPassword = () => {
    return password === passwordCheck;
  };

  const createAccount = () => {
    if (verifyPassword()) {
      setIsLoading(true);
      signUp(email, password)
        .then(r => {
          setError('');
          const user = {
            name: name,
            email: email,
            creation: new Date(),
          };
          addUser(r.uid, user)
            .then(() => {
              setIsLoading(false);
            })
            .catch(() => {
              setIsLoading(false);
            });
        })
        .catch(e => {
          setError(e.message);
          setIsLoading(false);
        });
    } else {
      setError("le mot de passe n'est pas identique");
    }
  };

  return (
    <View style={styles.main_container}>
      <Input
        placeholder="nom"
        onChangeText={value => {
          setName(value);
        }}
      />
      <Input
        placeholder="email"
        onChangeText={value => {
          setEmail(value);
        }}
      />
      <Input
        placeholder="mot de passe"
        errorMessage={error}
        onChangeText={value => {
          setPassword(value);
        }}
      />
      <Input
        placeholder="confirmer le mot de passe"
        errorMessage={error}
        onChangeText={value => {
          setPasswordCheck(value);
        }}
      />
      <Button
        title="Inscription"
        type="solid"
        raised={true}
        loading={isLoading}
        onPress={createAccount}
        containerStyle={styles.button_container}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    padding: 10,
    paddingTop: 30,
  },
  button_container: {
    backgroundColor: '#FBFBFB',
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#FCA311',
  },
});

export default SignUpScreen;
