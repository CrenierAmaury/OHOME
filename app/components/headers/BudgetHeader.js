import React from 'react';
import {Header} from 'react-native-elements';

const BudgetHeader = () => {
  return (
    <Header
      leftComponent={{
        icon: 'arrow-back',
        color: '#fff',
        iconStyle: {color: '#fff'},
      }}
      rightComponent={{icon: 'more-vert', color: '#fff'}}
    />
  );
};

export default BudgetHeader;
