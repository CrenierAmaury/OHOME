import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {makeStyles, useTheme, Icon} from 'react-native-elements';
import {Input, Button} from 'react-native-elements';
import {sendResetPasswordEmail, signIn} from '../../../api/authenticationApi';
import Dialog from 'react-native-dialog';
import {showSuccessSnackbar} from '../../../utils/snackbar';

const SignInScreen = ({navigation}) => {
  const styles = useStyles();
  const {theme} = useTheme();

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
        leftIcon={<Icon name="email" size={24} color={theme.colors.grey} />}
      />
      <Input
        placeholder="Mot de passe"
        errorMessage={error}
        onChangeText={value => {
          setPassword(value);
        }}
        autoCapitalize="none"
        secureTextEntry={true}
        leftIcon={<Icon name="lock" size={24} color={theme.colors.grey} />}
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
        Pas encore de compte? Inscrivez vous!
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
        <Dialog.Description style={styles.forgot_error}>
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
    backgroundColor: theme.colors.white,
    width: '50%',
    marginTop: '10%',
  },
  button: {
    backgroundColor: theme.colors.highlight,
  },
  link_text: {
    color: theme.colors.blue,
    padding: '5%',
  },
  forgot_error: {
    color: 'red',
  },
}));

export default SignInScreen;
