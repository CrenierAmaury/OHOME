import React, {useEffect, useState} from 'react';
import {Button, Input, makeStyles} from 'react-native-elements';
import Dialog from 'react-native-dialog';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import TitleHeader from '../../headers/TitleHeader';
import {updateUser} from '../../../api/userApi';
import {reauthenticate, updateAuthEmail} from '../../../api/authenticationApi';

const ProfileModifyScreen = ({route, navigation}) => {
  const styles = useStyles();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailModifyVisible, setEmailModifyVisible] = useState(false);

  const uid = useSelector(state => state.user.uid);

  const headerProps = {title: 'Modifier mes informations', navigation};

  useEffect(() => {
    const user = route.params.user;
    setName(user.name);
    setEmail(user.email);
  }, [route.params.user]);

  const updateCurrentUser = () => {
    if (name && email && password) {
      reauthenticate(route.params.user.email, password)
        .then(() => {
          updateAuthEmail(email)
            .then(() => {
              updateUser(uid, {
                name: name,
                email: email,
              })
                .then(() => {
                  setEmailModifyVisible(false);
                  navigation.goBack();
                })
                .catch(e => {
                  setError(e);
                });
            })
            .catch(e => {
              setError(e);
            });
        })
        .catch(e => {
          setError(e);
        });
    } else if (name) {
      updateUser(uid, {
        name: name,
      })
        .then(() => {
          setEmailModifyVisible(false);
          navigation.goBack();
        })
        .catch(e => {
          setError(e);
        });
    } else {
      setError('veuillez donner un nom');
    }
  };

  const handleUserUpdateValidation = () => {
    if (email !== route.params.user.email) {
      setEmailModifyVisible(true);
    } else {
      updateCurrentUser();
    }
  };

  const setPlaceholder = (placeholder, value) => {
    if (!value) {
      return placeholder;
    }
  };

  const setLabel = (label, value) => {
    if (value) {
      return label;
    }
  };

  return (
    <View style={styles.main_container}>
      <TitleHeader {...headerProps} />
      <Input
        label={setLabel('nom', name)}
        placeholder={setPlaceholder('nom', name)}
        value={name}
        onChangeText={value => {
          setName(value);
        }}
      />
      <Input
        label={setLabel('email', email)}
        placeholder={setPlaceholder('email', email)}
        errorMessage={error}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={value => {
          setEmail(value);
        }}
      />
      <Button
        title="valider"
        type="solid"
        raised={true}
        onPress={handleUserUpdateValidation}
        containerStyle={{
          backgroundColor: '#FBFBFB',
          width: '75%',
          marginRight: 'auto',
          marginLeft: 'auto',
        }}
        buttonStyle={{
          backgroundColor: '#FCA311',
        }}
      />
      <Dialog.Container visible={emailModifyVisible}>
        <Dialog.Title>Modification Email</Dialog.Title>
        <Dialog.Description>
          veuillez entrer votre mot de passe pour confirmer.
        </Dialog.Description>
        <Dialog.Input
          placeholder="mot de passe"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={value => {
            setPassword(value);
          }}
        />
        <Dialog.Button
          label="annuler"
          onPress={() => {
            setEmailModifyVisible(false);
            setPassword('');
          }}
        />
        <Dialog.Button label="valider" onPress={updateCurrentUser} />
      </Dialog.Container>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {},
}));

export default ProfileModifyScreen;
