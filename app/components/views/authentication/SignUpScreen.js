import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {signUp} from '../../../utils/authentication';

const SignUpScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [error, setError] = useState('');

  return (
    <View>
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
        onPress={() => {
          setIsLoading(true);
          signUp(email, password)
            .then(r => {
              setError('');
              setIsLoading(false);
            })
            .catch(e => {
              setError(e.message);
              setIsLoading(false);
            });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default SignUpScreen;
