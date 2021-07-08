import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {readCollection} from '../../utils/database';
import {signOut} from '../../utils/authentication';
import {Button} from 'react-native-elements';

const HomeScreen = () => {
  const [utilisateur, setUtilisateur] = useState(99);

  return (
    <View style={{flex: 1, backgroundColor: '#FBFBFB'}}>
      <Text>HOME</Text>
      <Button
        title="test db"
        type="solid"
        raised={true}
        onPress={() => {
          readCollection('users')
            .then(r => {
              console.log(r.docs.length);
              setUtilisateur(r.docs.length);
            })
            .catch(e => {
              console.log(e);
            });
        }}
        containerStyle={{
          backgroundColor: '#FBFBFB',
          width: '50%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 20,
        }}
        buttonStyle={{
          backgroundColor: '#FCA311',
        }}
      />
      <Text>{utilisateur}</Text>
      <Button
        title="sign out"
        type="solid"
        raised={true}
        onPress={() => {
          signOut()
            .then(r => {
              console.log(r);
            })
            .catch(e => {
              console.log(e);
            });
        }}
        containerStyle={{
          backgroundColor: '#FBFBFB',
          width: '50%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 20,
        }}
        buttonStyle={{
          backgroundColor: '#FCA311',
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

export default HomeScreen;
