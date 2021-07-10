import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const BudgetScreen = () => {
  const [test, setTest] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('budgets')
      .doc('RqPMrRfKbAz4PcXdwUTF')
      .onSnapshot(documentSnapshot => {
        const historique = [];
        const depenses = documentSnapshot.data().expenses;
        depenses.forEach(docRef => {
          docRef.get().then(doc => {
            historique.push(doc.data().name);
            if (historique.length === depenses.length) {
              setTest(historique);
              console.log(historique);
            }
          });
        });
      });
    return () => subscriber();
  }, []);

  return (
    <View>
      <Text>BUDGET</Text>
      <Text>Historique: {test}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});

export default BudgetScreen;
