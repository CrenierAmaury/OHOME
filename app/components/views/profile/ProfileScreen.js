import React from 'react';
import {Text, View} from 'react-native';
import {signOut} from '../../../api/authenticationApi';
import {updateUid} from '../../../store/slices/userSlice';
import {Button, makeStyles} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import TitleHeader from '../../headers/TitleHeader';

const ProfileScreen = ({navigation}) => {
  const styles = useStyles();

  const dispatch = useDispatch();

  const headerProps = {title: 'Profil', navigation};

  return (
    <View style={styles.main_container}>
      <TitleHeader {...headerProps} />
      <Text>PROFIL</Text>
      <Button
        title="sign out"
        type="solid"
        raised={true}
        onPress={() => {
          signOut()
            .then(() => {
              dispatch(updateUid(''));
            })
            .catch(e => {
              console.log(e);
            });
        }}
        containerStyle={styles.button_container}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
  button_container: {
    backgroundColor: theme.colors.background,
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
  },
  button: {
    backgroundColor: theme.colors.highlight,
  },
}));

export default ProfileScreen;
