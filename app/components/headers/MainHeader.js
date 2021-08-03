import React from 'react';
import {Header, Icon} from 'react-native-elements';
import {useTheme} from 'react-native-elements';

const MainHeader = props => {
  const {theme} = useTheme();

  const LeftIcon = () => {
    return (
      <Icon
        name="face"
        color="#fff"
        onPress={() => {
          props.navigation.navigate('ProfileNav');
        }}
      />
    );
  };

  const RightIcon = () => {
    return (
      <Icon
        name="settings"
        color="#fff"
        onPress={() => {
          props.navigation.navigate('SettingsNav');
        }}
      />
    );
  };

  return <Header leftComponent={<LeftIcon />} rightComponent={<RightIcon />} />;
};

export default MainHeader;
