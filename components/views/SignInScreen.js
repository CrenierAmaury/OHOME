import React from 'react';
import firebase from 'firebase';
import {StyleSheet, View} from 'react-native';
import {Input, Button} from 'react-native-elements';

class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: '',
      password: '',
      error: '',
    };
  }

  _signIn() {
    this.setState({loading: true});
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(userCredential => {
        this.setState({error: '', loading: false});
      })
      .catch(error => {
        this.setState({error: error.message, loading: false});
      });
  }

  render() {
    return (
      <View>
        <Input
          placeholder="email"
          onChangeText={value => this.setState({email: value})}
        />
        <Input
          placeholder="mot de passe"
          errorMessage={this.state.error}
          onChangeText={value => this.setState({password: value})}
        />
        <Button
          title="Connexion"
          type="solid"
          raised={true}
          loading={this.state.loading}
          onPress={() => this._signIn()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default SignInScreen;
