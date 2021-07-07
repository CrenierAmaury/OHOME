import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {updateEmail} from '../../store/slices/userSlice';
import {readCollection} from '../../utils/database';
import {Button} from 'react-native-elements';

const HomeScreen = () => {
  const [utilisateur, setUtilisateur] = useState({});
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  return (
    <View>
      <Text>HOME</Text>
      <Text>{user.email}</Text>
      <Button
        title="test email"
        type="solid"
        raised={true}
        onPress={() => {
          dispatch(updateEmail('test'));
        }}
      />
      <Button
        title="test db"
        type="solid"
        raised={true}
        onPress={() => {
          readCollection('utilisateur')
            .then(r => {
              console.log(r);
            })
            .catch(e => {
              console.log(e);
            });
        }}
      />
      <Text>utilisateur</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default HomeScreen;
