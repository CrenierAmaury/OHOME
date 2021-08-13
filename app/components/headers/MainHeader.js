import React from 'react';
import {Header, Icon, Avatar} from 'react-native-elements';
import {useTheme} from 'react-native-elements';
import {useSelector} from 'react-redux';

const MainHeader = props => {
  const {theme} = useTheme();

  const avatar = useSelector(state => state.user.avatar);
  const name = useSelector(state => state.user.name);

  const LeftIcon = () => {
    return avatar !== 'default' ? (
      <Avatar
        rounded
        source={{
          uri: avatar,
        }}
        onPress={() => {
          props.navigation.navigate('ProfileNav');
        }}
        activeOpacity={0.7}
      />
    ) : (
      <Avatar
        rounded
        title={name.length === 1 ? name[0] : name[0] + name[1]}
        containerStyle={{backgroundColor: 'red'}}
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
