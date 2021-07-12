import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {signIn} from '../../../utils/authentication';

const SignInScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      <Button
        title="Connexion"
        type="solid"
        raised={true}
        loading={isLoading}
        onPress={() => {
          setIsLoading(true);
          signIn(email, password)
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

export default SignInScreen;
