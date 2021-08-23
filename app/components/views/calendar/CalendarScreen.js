import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {FAB, Icon, makeStyles, Overlay, useTheme} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import MainHeader from '../../headers/MainHeader';
import AgendaScreen from './AgendaScreen';
import {useSelector} from 'react-redux';
import NewEventScreen from './NewEventScreen';

const CalendarScreen = ({navigation}) => {
  const styles = useStyles();
  const {theme} = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const calendarId = useSelector(state => state.household.calendarId);

  const agendaProps = {events, calendarId, navigation};
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
      <MainHeader {...headerProps} />
      {isLoading ? (
        <ActivityIndicator
          style={styles.activity_indicator}
          size="large"
          color={theme.colors.activity_indicator}
        />
      ) : (
        <AgendaScreen {...agendaProps} />
      )}
      <FAB
        color={theme.colors.highlight}
        placement="right"
        icon={<Icon name="add" color={theme.colors.white} />}
        onPress={() => {
          setIsOverlayVisible(true);
        }}
      />
      <Overlay
        isVisible={isOverlayVisible}
        onBackdropPress={() => {
          setIsOverlayVisible(false);
        }}
        overlayStyle={styles.overlay}
        backdropStyle={styles.overlay_back}>
        <NewEventScreen {...childProps} />
      </Overlay>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
  activity_indicator: {
    marginTop: 150,
  },
  overlay: {
    width: '80%',
  },
  overlay_back: {
    backgroundColor: theme.colors.grey,
    opacity: 0.7,
  },
}));

export default CalendarScreen;
