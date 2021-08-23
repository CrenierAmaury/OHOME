import React from 'react';
import {Header, Icon} from 'react-native-elements';
import {useTheme} from 'react-native-elements';

const TitleHeader = props => {
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

  return (
    <Header
      leftComponent={<LeftIcon />}
      centerComponent={{text: props.title, style: {color: '#fff'}}}
    />
  );
};

export default TitleHeader;
