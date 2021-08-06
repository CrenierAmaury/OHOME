import React from 'react';
import {makeStyles, Divider, Card} from 'react-native-elements';
import {Agenda, LocaleConfig} from 'react-native-calendars';
import {Text, TouchableOpacity} from 'react-native';

const AgendaScreen = ({navigation}) => {
  const styles = useStyles;

  LocaleConfig.locales.fr = {
    monthNames: [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ],
    monthNamesShort: [
      'Janv.',
      'Févr.',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juil.',
      'Août',
      'Sept.',
      'Oct.',
      'Nov.',
      'Déc.',
    ],
    dayNames: [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: "Aujourd'hui",
  };
  LocaleConfig.defaultLocale = 'fr';

  return (
    <Agenda
      firstDay={1}
      enableSwipeMonths={true}
      showClosingKnob={true}
      items={{
        '2021-08-06': [{name: 'test'}],
        '2021-08-05': [],
        '2021-08-04': [{name: 'test'}],
        '2021-08-03': [{name: 'test'}],
        '2021-08-07': [],
        '2021-08-08': [],
        '2021-08-09': [{name: 'test'}],
        '2021-08-02': [],
        '2021-08-01': [],
        '2021-08-10': [],
        '2021-08-20': [],
      }}
      renderItem={item => {
        return (
          <Card>
            <Card.Title>Event {item.name}</Card.Title>
            <Card.Divider />
            <Text>event details</Text>
          </Card>
        );
      }}
      renderEmptyDate={() => {
        return (
          <Divider style={{paddingTop: 20}} />
        );
      }}
    />
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default AgendaScreen;
