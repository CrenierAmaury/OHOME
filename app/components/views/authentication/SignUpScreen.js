import React, {useState} from 'react';
import {View} from 'react-native';
import {makeStyles, useTheme, Icon} from 'react-native-elements';
import {Input, Button} from 'react-native-elements';
import {signUp} from '../../../api/authenticationApi';
import {addUser} from '../../../api/userApi';

const SignUpScreen = ({navigation}) => {
  const styles = useStyles();
  const {theme} = useTheme();

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
          addUser(r.user.uid, user)
            .then(() => {
              setIsLoading(false);
              navigation.navigate('NoHouseholdScreen');
            })
            .catch(e => {
              console.log(e);
              setError(e.message);
              setIsLoading(false);
            });
        })
        .catch(e => {
          console.log(e);
          setError(e.message);
          setIsLoading(false);
        });
    } else {
      setError("Le mot de passe n'est pas identique");
    }
  };

  return (
    <View style={styles.main_container}>
      <Input
        placeholder="Nom"
        onChangeText={value => {
          setName(value);
        }}
        autoCapitalize="none"
        leftIcon={<Icon name="person" size={24} color={theme.colors.grey} />}
      />
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
        onChangeText={value => {
          setPassword(value);
        }}
        autoCapitalize="none"
        secureTextEntry={true}
        leftIcon={<Icon name="lock" size={24} color={theme.colors.grey} />}
      />
      <Input
        placeholder="Confirmer le mot de passe"
        errorMessage={error}
        onChangeText={value => {
          setPasswordCheck(value);
        }}
        autoCapitalize="none"
        secureTextEntry={true}
        leftIcon={<Icon name="lock" size={24} color={theme.colors.grey} />}
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
}));

export default SignUpScreen;
