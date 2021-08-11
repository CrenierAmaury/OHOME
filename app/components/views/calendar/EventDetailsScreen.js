import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {Card, ListItem, makeStyles} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import {renderDate} from '../../../utils/date';
import {renderMemberName} from '../../../utils/members';
import {useSelector} from 'react-redux';
import CalendarHeader from '../../headers/CalendarHeader';

const EventDetailsScreen = ({route, navigation}) => {
  const styles = useStyles();

  const [event, setEvent] = useState({});

  const members = useSelector(state => state.household.members);

  const headerProps = {
    title: event.label,
    event,
    navigation,
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('calendars')
      .doc(route.params.calendarId)
      .collection('events')
      .doc(route.params.event.id)
      .onSnapshot(
        documentSnapshot => {
          const {...currentEvent} = documentSnapshot.data();
          currentEvent.id = documentSnapshot.id;
          setEvent(currentEvent);
        },
        error => {
          console.log(error);
        },
      );
    return () => {
      unsubscribe();
    };
  }, [navigation, route.params.calendarId, route.params.event.id]);

  return (
    <View style={styles.main_container}>
      <CalendarHeader {...headerProps} />
      <Card>
        <Card.Title>Description</Card.Title>
        <Card.Divider />
        <Text>{event.description}</Text>
        <Card.Title>Date</Card.Title>
        <Card.Divider />
        {event.date ? <Text>{renderDate(event.date.toDate())}</Text> : null}
        <Card.Title>Adresse</Card.Title>
        <Card.Divider />
        <Text>{event.address}</Text>
        <Card.Title>Participants</Card.Title>
        <Card.Divider />
        {event.participants
          ? event.participants.map((h, i) => (
              <ListItem key={i}>
                <ListItem.Content>
                  <ListItem.Title>
                    {renderMemberName(members, h)}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))
          : null}
        <Card.Divider />
        {event.creation ? (
          <Text>
            créé par {renderMemberName(members, event.author)} le{' '}
            {renderDate(event.creation.toDate())}
          </Text>
        ) : null}
        {event.modified ? (
          <Text>
            modifié par {renderMemberName(members, event.modified.by)} le{' '}
            {renderDate(event.modified.when.toDate())}
          </Text>
        ) : null}
      </Card>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default EventDetailsScreen;
