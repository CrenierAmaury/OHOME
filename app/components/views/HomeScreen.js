import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {signOut} from '../../utils/authentication';
import {Button} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {updateUid} from '../../store/slices/userSlice';

const HomeScreen = () => {
  const dispatch = useDispatch();

  return (
    <View style={{flex: 1, backgroundColor: '#FBFBFB'}}>
      <Text>HOME</Text>
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
