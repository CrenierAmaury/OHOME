import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import {Input, Button} from 'react-native-elements';
import {sendResetPasswordEmail, signIn} from '../../../api/authenticationApi';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Dialog from 'react-native-dialog';
import {showSuccessSnackbar} from '../../../utils/snackbar';

const SignInScreen = ({navigation}) => {
  const styles = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState('');

  const connect = () => {
    setIsLoading(true);
    signIn(email.trim(), password)
      .then(r => {
        setError('');
        setIsLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setIsLoading(false);
      });
  };

  const resetPassword = () => {
    if (forgotPasswordEmail) {
      sendResetPasswordEmail(forgotPasswordEmail)
        .then(() => {
          setForgotPasswordVisible(false);
          setForgotPasswordEmail('');
          setForgotPasswordError('');
          showSuccessSnackbar('Email envoyé');
        })
        .catch(e => {
          setForgotPasswordError(e.message);
        });
    } else {
      setForgotPasswordError('Veuillez entrer une adresse email');
    }
  };

  return (
    <View style={styles.main_container}>
      <Input
        placeholder="Email"
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
        placeholder="Mot de passe"
        errorMessage={error}
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
      <Button
        title="Connexion"
        type="solid"
        raised={true}
        loading={isLoading}
        onPress={connect}
        containerStyle={styles.button_container}
        buttonStyle={styles.button}
      />
      <Text
        style={styles.link_text}
        onPress={() => {
          navigation.navigate('SignUp');
        }}>
        Pas encore de compte? inscrivez vous!
      </Text>
      <Text
        style={styles.link_text}
        onPress={() => {
          setForgotPasswordVisible(true);
          setError('');
        }}>
        Mot de passe oublié?
      </Text>
      <Dialog.Container visible={forgotPasswordVisible}>
        <Dialog.Title>Mot de passe oublié</Dialog.Title>
        <Dialog.Description>
          Envoi d'un email de réinitialisation du mot de passe.
        </Dialog.Description>
        <Dialog.Input
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={value => {
            setForgotPasswordEmail(value);
          }}
        />
        <Dialog.Description style={{color: 'red'}}>
          {forgotPasswordError}
        </Dialog.Description>
        <Dialog.Button
          label="Annuler"
          onPress={() => {
            setForgotPasswordVisible(false);
            setForgotPasswordEmail('');
            setForgotPasswordError('');
          }}
        />
        <Dialog.Button label="Envoyer" onPress={resetPassword} />
      </Dialog.Container>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
    padding: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_container: {
    backgroundColor: '#FBFBFB',
    width: '50%',
    marginTop: '10%',
  },
  button: {
    backgroundColor: '#FCA311',
  },
  link_text: {
    color: theme.colors.blue,
    padding: '5%',
  },
}));

export default SignInScreen;
