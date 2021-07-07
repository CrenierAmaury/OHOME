import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {updateName, updateEmail} from '../../store/slices/userSlice';

const HomeScreen = () => {
  return (
    <View>
      <Text>HOME</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default HomeScreen;
