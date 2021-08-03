import React from 'react';
import {Header, Icon} from 'react-native-elements';

const BudgetHeader = props => {
  const LeftIcon = () => {
    return (
      <Icon
        name="arrow-back"
        color="#fff"
        onPress={() => {
          props.navigation.goBack();
        }}
      />
    );
  };

  const RightIcon = () => {
    return (
      <Icon
        name="more-vert"
        color="#fff"
        onPress={() => {
          props.navigation.goBack();
        }}
      />
    );
  };

  return <Header leftComponent={<LeftIcon />} rightComponent={<RightIcon />} />;
};

export default BudgetHeader;
