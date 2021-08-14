import React from 'react';
import {View, Text} from 'react-native';
import {Button, makeStyles} from 'react-native-elements';
import {useSelector} from 'react-redux';

const NoHouseholdScreen = ({navigation}) => {
  const styles = useStyles();

  const email = useSelector(state => state.user.email);

  return (
    <View style={styles.main_container}>
      <Button
        title="Créer un nouveau ménage"
        type="solid"
        raised={true}
        onPress={() => {
          navigation.navigate('HouseholdCreationScreen');
        }}
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
  main_container: {
    flex: 1,
    padding: 10,
    paddingTop: 100,
    alignItems: 'center',
    alignContent: 'center',
  },
}));

export default NoHouseholdScreen;
