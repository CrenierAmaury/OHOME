import React, {useEffect, useRef, useState} from 'react';
import {Header, Icon} from 'react-native-elements';
import {useTheme} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {removeList, updateList} from '../../api/listsApi';
import {Alert} from 'react-native';
import Menu, {MenuDivider, MenuItem} from 'react-native-material-menu';

const ListHeader = props => {
  const {theme} = useTheme();

  const [checkboxValidated, setCheckboxValidated] = useState(false);

  const listGroupId = useSelector(state => state.household.listGroupId);

  const menuRef = useRef();

  useEffect(() => {
    props.list.type ? setCheckboxValidated(props.list.type.checkbox) : null;
  }, [props.list]);

  const showMenu = () => {
    menuRef.current.show();
  };

  const hideMenu = () => {
    menuRef.current.hide();
  };

  const handleEdit = () => {
    props.navigation.navigate('ListModifyScreen', {
      list: props.list,
    });
    hideMenu();
  };

  const handleDelete = () => {
    removeList(listGroupId, props.list.id)
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

  const handleCheckbox = () => {
    let check = true;
    if (checkboxValidated) {
      check = false;
    }
    updateList(listGroupId, props.list.id, {
      type: {label: props.list.type.label, checkbox: check},
    })
      .then(() => {
        setCheckboxValidated(check);
        console.log('checkbox changed');
      })
      .catch(e => {
        console.log(e);
      });
    hideMenu();
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
        <MenuDivider />
        <MenuItem onPress={handleCheckbox}>
          checkbox{' '}
          {checkboxValidated ? (
            <Icon name="check" color="green" size={15} />
          ) : null}
        </MenuItem>
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

export default ListHeader;
