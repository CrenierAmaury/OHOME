import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import store from './app/store/store';
import {Provider} from 'react-redux';
import MainNav from './app/components/navigation/MainNav';
import MyTheme from './app/theme/theme';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer theme={MyTheme}>
        <SafeAreaProvider>
          <MainNav />
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
