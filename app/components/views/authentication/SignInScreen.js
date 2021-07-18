import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {signIn} from '../../../api/authenticationApi';

const SignInScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const connect = () => {
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
  };

  return (
    <View style={styles.main_container}>
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
        onPress={connect}
        containerStyle={styles.button_container}
        buttonStyle={styles.button}
      />
      <Button
        title="Inscription"
        type="solid"
        raised={true}
        loading={isLoading}
        onPress={() => {
          navigation.navigate('SignUp');
        }}
        containerStyle={styles.button_container}
        buttonStyle={{
          backgroundColor: '#FBFBFB',
        }}
        titleStyle={{color: '#FCA311'}}
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

export default SignInScreen;
