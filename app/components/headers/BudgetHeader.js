import React, {useRef} from 'react';
import {Alert} from 'react-native';
import {Header, Icon, useTheme} from 'react-native-elements';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {useSelector} from 'react-redux';
import {removeExpense} from '../../api/budgetApi';

const BudgetHeader = props => {
  const {theme} = useTheme();

  const budgetId = useSelector(state => state.household.budgetId);

  const menuRef = useRef();

  const showMenu = () => {
    menuRef.current.show();
  };

  const hideMenu = () => {
    menuRef.current.hide();
  };

  const handleEdit = () => {
    props.navigation.navigate('ExpenseModifyScreen', {
      expense: props.expense,
      budgetOverview: props.budgetOverview,
    });
    hideMenu();
  };

  const handleDelete = () => {
    console.log(props.expense);
    removeExpense(
      budgetId,
      props.expense.id,
      props.expense.amount,
      props.budgetOverview,
    )
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

export default BudgetHeader;
