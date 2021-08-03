import React from 'react';
import {Header, Icon} from 'react-native-elements';
import {useTheme} from 'react-native-elements';

const ListHeader = props => {
  const {theme} = useTheme();

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

  return (
    <Header
      leftComponent={<LeftIcon />}
      centerComponent={{text: props.title, style: {color: '#fff'}}}
      rightComponent={<RightIcon />}
    />
  );
};

export default ListHeader;
