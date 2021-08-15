import React from 'react';
import {ScrollView, View} from 'react-native';
import {Card, makeStyles} from 'react-native-elements';
import BudgetWidget from './BudgetWidget';
import MainHeader from '../../headers/MainHeader';
import MealsWidget from './MealsWidget';
import CalendarWidget from './CalendarWidget';
import {renderDate} from '../../../utils/date';
import {useSelector} from 'react-redux';

const HomeScreen = ({navigation}) => {
  const styles = useStyles();

  const householdName = useSelector(state => state.household.name);

  const headerProps = {navigation};
  const childsProps = {navigation};

  return (
    <View style={styles.main_container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MainHeader {...headerProps} />
        <Card>
          <Card.Title style={styles.household_name}>{householdName}</Card.Title>
          <Card.Title style={styles.household_date}>
            le {renderDate(new Date())}
          </Card.Title>
        </Card>
        <BudgetWidget {...childsProps} />
        <MealsWidget {...childsProps} />
        <CalendarWidget {...childsProps} />
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
  household_name: {
    fontSize: 25,
  },
  household_date: {
    color: theme.colors.grey,
  },
}));

export default HomeScreen;
