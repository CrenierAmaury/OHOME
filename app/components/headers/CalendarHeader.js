import React, {useRef} from 'react';
import {Alert} from 'react-native';
import {Header, Icon, useTheme} from 'react-native-elements';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {useSelector} from 'react-redux';
import {removeEvent} from '../../api/calendarApi';

const CalendarHeader = props => {
  const {theme} = useTheme();

  const calendarId = useSelector(state => state.household.calendarId);

  const menuRef = useRef();

  const showMenu = () => {
    menuRef.current.show();
  };

  const hideMenu = () => {
    menuRef.current.hide();
  };

  const handleEdit = () => {
    props.navigation.navigate('EventModifyScreen', {
      event: props.event,
    });
    hideMenu();
  };

  const handleDelete = () => {
    removeEvent(calendarId, props.event.id)
      .then(() => {
        props.navigation.goBack();
      })
      .catch(e => {
        console.log(e);
      });
    hideMenu();
  };

  const openDeleteAlert = () => {
    Alert.alert(
      '',
      'Confirmer la suppression ?',
      [
        {text: 'ANNULER', onPress: hideMenu},
        {text: 'OUI', onPress: handleDelete},
      ],
      {cancelable: true},
    );
  };

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
      <Menu
        ref={menuRef}
        button={<Icon name="more-vert" color="#fff" onPress={showMenu} />}>
        <MenuItem onPress={handleEdit}>modifier</MenuItem>
        <MenuDivider />
        <MenuItem onPress={openDeleteAlert}>supprimer</MenuItem>
      </Menu>
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

export default CalendarHeader;
