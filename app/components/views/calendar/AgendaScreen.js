import React, {useState} from 'react';
import {Card, Divider, useTheme} from 'react-native-elements';
import {Agenda, LocaleConfig} from 'react-native-calendars';
import {Text, TouchableOpacity} from 'react-native';
import _ from 'lodash';

const AgendaScreen = props => {
  const {theme} = useTheme();

  const [items, setItems] = useState({});

  const loadItems = day => {
    const newItems = {};
    for (let i = -15; i < 85; i++) {
      const date = new Date(day);
      date.setUTCDate(date.getUTCDate() + i);
      const dateString = date.toISOString().split('T')[0];
      newItems[dateString] = _.filter(props.events, e => {
        return e.date.toDate().toISOString().split('T')[0] === dateString;
      });
    }
    setItems(newItems);
  };

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
      items={items}
      loadItemsForMonth={day => {
        loadItems(day.timestamp);
      }}
      renderItem={item => {
        return (
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('EventDetailsScreen', {
                calendarId: props.calendarId,
                event: item,
              });
            }}>
            <Card>
              <Card.Title>{item.label}</Card.Title>
              <Card.Divider />
              <Text>
                {_.truncate(item.description, {
                  length: 50,
                  separator: ' ',
                })}
              </Text>
              <Text style={{textDecorationLine: 'underline'}}>Lieu:</Text>
              <Text>{item.address}</Text>
            </Card>
          </TouchableOpacity>
        );
      }}
      renderEmptyDate={() => {
        return <Divider style={{paddingTop: 55}} />;
      }}
    />
  );
};

export default AgendaScreen;
