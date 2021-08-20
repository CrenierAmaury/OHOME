import React, {useState} from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {Button, Input, ListItem} from 'react-native-elements';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {makeStyles} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {showSuccessSnackbar} from '../../../utils/snackbar';
import {addEvent} from '../../../api/calendarApi';
import {renderMemberName} from '../../../utils/members';

const NewEventScreen = props => {
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

  const addNewEvent = () => {
    if (name) {
      const event = {
        label: name,
        date: date,
        address: address,
        description: description,
        participants: participants,
        creation: new Date(),
        author: uid,
        modified: {
          by: uid,
          when: new Date(),
        },
      };
      addEvent(props.calendarId, event)
        .then(docId => {
          console.log('SCREEN: event added with id: ' + docId);
          props.setIsOverlayVisible(false);
          showSuccessSnackbar('Nouvel évènement ajouté avec succès');
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      setError('Veuillez indiquer un nom');
    }
  };

  const cancelNewEvent = () => {
    setDate(new Date());
    setName('');
    setDescription('');
    setAddress('');
    setParticipants([]);
    setError('');
    props.setIsOverlayVisible(false);
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Input
          label={setLabel('Nom', name)}
          placeholder={setPlaceholder('Nom', name)}
          value={name}
          onChangeText={value => {
            setName(value);
          }}
        />
        <Input
          label={setLabel('Description', description)}
          placeholder={setPlaceholder('Description', description)}
          value={description}
          multiline={true}
          onChangeText={value => {
            setDescription(value);
          }}
        />
        <Input
          label={setLabel('Adresse', address)}
          placeholder={setPlaceholder('Adresse', address)}
          value={address}
          onChangeText={value => {
            setAddress(value);
          }}
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
          title="Ajouter"
          type="solid"
          raised={true}
          onPress={addNewEvent}
          containerStyle={styles.add_button_container}
          buttonStyle={styles.add_button}
        />
        <Button
          title="Annuler"
          type="solid"
          raised={true}
          onPress={cancelNewEvent}
          containerStyle={styles.cancel_button_container}
          buttonStyle={styles.cancel_button}
          titleStyle={styles.cancel_button_title}
        />
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  main_container: {
    marginTop: '5%',
    marginBottom: '5%',
  },
  participants_title: {
    marginLeft: 10,
  },
  add_button_container: {
    backgroundColor: theme.colors.white,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '10%',
  },
  add_button: {
    backgroundColor: theme.colors.highlight,
  },
  cancel_button_container: {
    backgroundColor: theme.colors.white,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '10%',
  },
  cancel_button: {
    backgroundColor: theme.colors.white,
  },
  cancel_button_title: {
    color: theme.colors.highlight,
  },
}));

export default NewEventScreen;
