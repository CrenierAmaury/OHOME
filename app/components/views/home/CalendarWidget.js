import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {makeStyles, Card, ListItem} from 'react-native-elements';
import {useSelector} from 'react-redux';
import _ from 'lodash';

const CalendarWidget = props => {
  const styles = useStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);

  const calendarId = useSelector(state => state.household.calendarId);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('calendars')
      .doc(calendarId)
      .collection('events')
      .onSnapshot(
        querySnapshot => {
          const eventsTab = [];
          querySnapshot.docs.forEach(doc => {
            eventsTab.push(doc.data());
          });
          const todayEvents = _.filter(eventsTab, e => {
            const date = new Date();
            return (
              e.date.toDate().getUTCFullYear() === date.getUTCFullYear() &&
              e.date.toDate().getUTCMonth() === date.getUTCMonth() &&
              e.date.toDate().getUTCDate() === date.getUTCDate()
            );
          });
          setEvents(todayEvents);
          setIsLoading(false);
        },
        error => {
          console.log(error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, [calendarId]);

  return (
    <View style={styles.main_container}>
      <Card>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Calendar');
          }}>
          <Card.Title>Agenda</Card.Title>
          <Card.Divider />
          {isLoading ? (
            <ActivityIndicator color="#0000ff" />
          ) : (
            <View>
              {events.length ? (
                events.map((h, i) => (
                  <ListItem key={i}>
                    <ListItem.Content>
                      <ListItem.Title>{h.label}</ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                ))
              ) : (
                <Text>Rien de prévu aujourd'hui</Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      </Card>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default CalendarWidget;
