import React, {useEffect, useState} from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {Button, Input, ListItem, makeStyles} from 'react-native-elements';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import TitleHeader from '../../headers/TitleHeader';
import {updateEvent} from '../../../api/calendarApi';
import {renderMemberName} from '../../../utils/members';

const EventModifyScreen = ({route, navigation}) => {
  const styles = useStyles();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [participants, setParticipants] = useState([]);
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState('');

  const uid = useSelector(state => state.user.uid);
  const members = useSelector(state => state.household.members);
  const calendarId = useSelector(state => state.household.calendarId);

  const headerProps = {title: "Modifier l'évènement", navigation};

  useEffect(() => {
    const event = route.params.event;
    setName(event.label);
    setDescription(event.description);
    setAddress(event.address);
    setDate(event.date.toDate());
    setParticipants(event.participants);
  }, [route.params.event]);

  const updateCurrentEvent = () => {
    if (name) {
      updateEvent(calendarId, route.params.event.id, {
        label: name,
        description: description,
        address: address,
        date: date,
        participants: participants,
        modified: {
          by: uid,
          when: new Date(),
        },
      })
        .then(() => {
          navigation.goBack();
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      setError('Veuillez indiquer un nom');
    }
  };

  const handleParticipants = memberId => {
    const membersTab = [...participants];
    if (!checkParticipant(memberId)) {
      membersTab.push(memberId);
    } else {
      membersTab.splice(membersTab.indexOf(memberId), 1);
    }
    setParticipants(membersTab);
  };

  const checkParticipant = memberId => {
    return participants.indexOf(memberId) !== -1;
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setDatePickerShow(false);
  };

  const setPlaceholder = (placeholder, value) => {
    if (!value) {
      return placeholder;
    }
  };

  const setLabel = (label, value) => {
    if (value) {
      return label;
    }
  };

  return (
    <View style={styles.main_container}>
      <TitleHeader {...headerProps} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Input
          label={setLabel('Nom', name)}
          placeholder={setPlaceholder('Nom', name)}
          value={name}
          onChangeText={value => {
            setName(value);
          }}
          containerStyle={styles.input_container}
        />
        <Input
          label={setLabel('Description', description)}
          placeholder={setPlaceholder('Description', description)}
          value={description}
          multiline={true}
          onChangeText={value => {
            setDescription(value);
          }}
          containerStyle={styles.input_container}
        />
        <Input
          label={setLabel('Adresse', address)}
          placeholder={setPlaceholder('Adresse', address)}
          value={address}
          multiline={true}
          onChangeText={value => {
            setAddress(value);
          }}
          containerStyle={styles.input_container}
        />
        <TouchableOpacity
          onPress={() => {
            setDatePickerShow(true);
          }}>
          <Input
            label="Date"
            value={date.toLocaleDateString()}
            errorMessage={error}
            editable={false}
            containerStyle={styles.input_container}
          />
        </TouchableOpacity>
        {datePickerShow && (
          <RNDateTimePicker
            value={date}
            mode={'date'}
            display="spinner"
            onChange={onChangeDate}
          />
        )}
        <Text style={styles.participants_title}>Participants</Text>
        {members.map((h, i) => (
          <ListItem key={i}>
            <ListItem.Content>
              <ListItem.Title>{renderMemberName(members, h.id)}</ListItem.Title>
            </ListItem.Content>
            <ListItem.CheckBox
              checked={checkParticipant(h.id)}
              onPress={() => {
                handleParticipants(h.id);
              }}
            />
          </ListItem>
        ))}
        <Button
          title="Valider"
          type="solid"
          raised={true}
          onPress={updateCurrentEvent}
          containerStyle={styles.button_container}
          buttonStyle={styles.button}
        />
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    flex: 1,
  },
  input_container: {
    marginTop: 5,
  },
  participants_title: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
  },
  button_container: {
    marginTop: 20,
    marginBottom: 50,
    backgroundColor: theme.colors.white,
    width: '75%',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  button: {
    backgroundColor: theme.colors.highlight,
  },
}));

export default EventModifyScreen;
