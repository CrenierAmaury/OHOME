import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

class CalendarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text>CALENDRIER</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default CalendarScreen;
