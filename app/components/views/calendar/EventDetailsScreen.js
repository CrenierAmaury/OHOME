import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, ActivityIndicator} from 'react-native';
import {Card, ListItem, makeStyles, useTheme} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import {renderDate} from '../../../utils/date';
import {renderMemberName} from '../../../utils/members';
import {useSelector} from 'react-redux';
import CalendarHeader from '../../headers/CalendarHeader';

const EventDetailsScreen = ({route, navigation}) => {
  const styles = useStyles();
  const {theme} = useTheme();

  const [isLoading, setIsLoading] = useState(true);
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
          setIsLoading(false);
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
      {isLoading ? (
        <ActivityIndicator
          style={styles.activity_indicator}
          size="large"
          color={theme.colors.activity_indicator}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card>
            <Card.Title style={styles.title}>Description</Card.Title>
            <Card.Divider />
            <Text>{event.description}</Text>
            <Card.Title style={styles.title}>Date</Card.Title>
            <Card.Divider />
            {event.date ? <Text>{renderDate(event.date.toDate())}</Text> : null}
            <Card.Title style={styles.title}>Adresse</Card.Title>
            <Card.Divider />
            <Text>{event.address}</Text>
            <Card.Title style={styles.title}>Participants</Card.Title>
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
            <View style={styles.info_section}>
              {event.creation ? (
                <Text style={styles.info_section_text}>
                  Créé par{' '}
                  <Text style={styles.member_name}>
                    {renderMemberName(members, event.author)}
                  </Text>{' '}
                  le {renderDate(event.creation.toDate())}
                </Text>
              ) : null}
              {event.modified ? (
                <Text style={styles.info_section_text}>
                  Modifié par{' '}
                  <Text style={styles.member_name}>
                    {renderMemberName(members, event.modified.by)}
                  </Text>{' '}
                  le {renderDate(event.modified.when.toDate())}
                </Text>
              ) : null}
            </View>
          </Card>
        </ScrollView>
      )}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
  title: {
    marginTop: 10,
  },
  activity_indicator: {
    marginTop: 150,
  },
  info_section: {
    marginTop: 25,
    alignItems: 'center',
  },
  info_section_text: {
    margin: 5,
    color: theme.colors.grey,
  },
  member_name: {
    fontWeight: 'bold',
  },
}));

export default EventDetailsScreen;
