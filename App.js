import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import store from './app/store/store';
import {Provider} from 'react-redux';
import MainNav from './app/components/navigation/MainNav';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNav />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
