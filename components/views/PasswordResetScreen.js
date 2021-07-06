import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

class PasswordResetScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text>PASSWORD RESET</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default PasswordResetScreen;
