import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text>SIGN UP</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default SignUpScreen;
