import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import store from './app/store/store';
import {Provider} from 'react-redux';
import MainNav from './app/components/navigation/MainNav';
import theme from './app/theme/theme';
import {ThemeProvider} from 'react-native-elements';

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <SafeAreaProvider>
            <MainNav />
          </SafeAreaProvider>
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
