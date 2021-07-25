import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {signUp} from '../../../api/authenticationApi';
import {addUser} from '../../../api/userApi';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
      signUp(email.trim(), password, name.trim())
        .then(r => {
          setError('');
          const user = {
            name: name.trim(),
            email: email.trim(),
            creation: new Date(),
            activeHousehold: '',
            households: [],
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
        autoCapitalize="none"
        leftIcon={
          <Icon
            name="person"
            size={24}
            style={{
              color: '#8b8b8b',
            }}
          />
        }
      />
      <Input
        placeholder="email"
        onChangeText={value => {
          setEmail(value);
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        leftIcon={
          <Icon
            name="email"
            size={24}
            style={{
              color: '#8b8b8b',
            }}
          />
        }
      />
      <Input
        placeholder="mot de passe"
        onChangeText={value => {
          setPassword(value);
        }}
        autoCapitalize="none"
        secureTextEntry={true}
        leftIcon={
          <Icon
            name="lock"
            size={24}
            style={{
              color: '#8b8b8b',
            }}
          />
        }
      />
      <Input
        placeholder="confirmer le mot de passe"
        errorMessage={error}
        onChangeText={value => {
          setPasswordCheck(value);
        }}
        autoCapitalize="none"
        secureTextEntry={true}
        leftIcon={
          <Icon
            name="lock"
            size={24}
            style={{
              color: '#8b8b8b',
            }}
          />
        }
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
