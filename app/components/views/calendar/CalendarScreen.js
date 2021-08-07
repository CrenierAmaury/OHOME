import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {FAB, Icon, makeStyles, Overlay} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import MainHeader from '../../headers/MainHeader';
import AgendaScreen from './AgendaScreen';
import {useSelector} from 'react-redux';
import NewEventScreen from './NewEventScreen';

const CalendarScreen = ({navigation}) => {
  const styles = useStyles();

  const [events, setEvents] = useState([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const calendarId = useSelector(state => state.household.calendarId);

  const agendaProps = {events};
  const childProps = {calendarId, setIsOverlayVisible};
  const headerProps = {navigation};

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('calendars')
      .doc(calendarId)
      .collection('events')
      .onSnapshot(
        querySnapshot => {
          const eventsTab = [];
          querySnapshot.docs.forEach(doc => {
            const {...event} = doc.data();
            event.id = doc.id;
            eventsTab.push(event);
          });
          setEvents(eventsTab);
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
      <MainHeader {...headerProps} />
      <AgendaScreen {...agendaProps} />
      <FAB
        color="#FCA311"
        placement="right"
        icon={<Icon name="add" color="white" />}
        onPress={() => {
          setIsOverlayVisible(true);
        }}
      />
      <Overlay
        isVisible={isOverlayVisible}
        onBackdropPress={() => {
          setIsOverlayVisible(false);
        }}
        overlayStyle={{
          width: '80%',
        }}
        backdropStyle={{
          backgroundColor: 'grey',
          opacity: 0.7,
        }}>
        <NewEventScreen {...childProps} />
      </Overlay>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
}));

export default CalendarScreen;
