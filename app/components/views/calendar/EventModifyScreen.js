import React, {useEffect, useState} from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {Button, Input, ListItem, makeStyles} from 'react-native-elements';
import {Text, TouchableOpacity, View} from 'react-native';
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
      setError('veuillez indiquer un nom');
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
      <Input
        label={setLabel('nom', name)}
        placeholder={setPlaceholder('nom', name)}
        value={name}
        onChangeText={value => {
          setName(value);
        }}
      />
      <Input
        label={setLabel('description', description)}
        placeholder={setPlaceholder('description', description)}
        value={description}
        multiline={true}
        onChangeText={value => {
          setDescription(value);
        }}
      />
      <Input
        label={setLabel('adresse', address)}
        placeholder={setPlaceholder('adresse', address)}
        value={address}
        multiline={true}
        onChangeText={value => {
          setAddress(value);
        }}
      />
      <TouchableOpacity
        onPress={() => {
          setDatePickerShow(true);
        }}>
        <Input
          label="date"
          value={date.toLocaleDateString()}
          errorMessage={error}
          editable={false}
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
      <Text>Participants</Text>
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
        title="valider"
        type="solid"
        raised={true}
        onPress={updateCurrentEvent}
        containerStyle={{
          backgroundColor: '#FBFBFB',
          width: '75%',
          marginRight: 'auto',
          marginLeft: 'auto',
        }}
        buttonStyle={{
          backgroundColor: '#FCA311',
        }}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {},
}));

export default EventModifyScreen;
