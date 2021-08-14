import {Avatar, makeStyles} from 'react-native-elements';
import React from 'react';
import {useSelector} from 'react-redux';

const ProfilAvatar = props => {
  const styles = useStyles();

  const avatar = useSelector(state => state.user.avatar);
  const name = useSelector(state => state.user.name);

  const accessoryProps = {
    name: 'edit',
    size: 40,
    onPress: props.takePhotoAvatar,
  };

  return avatar !== 'default' ? (
    <Avatar
      rounded
      size={props.size}
      source={{
        uri: avatar,
      }}
      containerStyle={styles.avatar_container}>
      <Avatar.Accessory {...accessoryProps} />
    </Avatar>
  ) : (
    <Avatar
      rounded
      size={props.size}
      title={name.length === 1 ? name[0] : name[0] + name[1]}
      containerStyle={styles.avatar_container}>
      <Avatar.Accessory {...accessoryProps} />
    </Avatar>
  );
};

const useStyles = makeStyles(theme => ({
  avatar_container: {
    margin: 25,
    backgroundColor: 'red',
  },
}));

export default ProfilAvatar;
