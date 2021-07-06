import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {UserContext} from '../../contexts/userContext';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <UserContext.Consumer>
        {({setIsSignedIn, user}) => (
          <View>
            <Text>HOME: {user.email}</Text>
            <Button
              title="test context"
              onPress={() => {
                setIsSignedIn(false);
              }}
            />
          </View>
        )}
      </UserContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default HomeScreen;
