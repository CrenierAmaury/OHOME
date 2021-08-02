import React from 'react';
import {Header} from 'react-native-elements';

const MainHeader = () => {
  return (
    <Header
      leftComponent={{icon: 'face', color: '#fff'}}
      rightComponent={{icon: 'settings', color: '#fff'}}
    />
  );
};

export default MainHeader;
