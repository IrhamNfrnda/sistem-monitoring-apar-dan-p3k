import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Text } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const InspectionHistoryScreen = () => {
  const [inspectionData, setInspectionData] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Call an async function to fetch user data and inspection data
    async function fetchData() {
      // Wait for retrieveUserData() to complete
      const nama = await retrieveUserData();
      // Now, userId should be available
      // You can use it to fetch inspection data
      fetchInspectionData(nama);
    }

    // Call the async function to fetch the data
    fetchData();
  }, []);

  const retrieveUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      console.log('userDataString:', userDataString);

      if (userDataString !== null) {
        const userData = JSON.parse(userDataString);
        console.log('userData:', userData);
        setUserId(userData.userId);
        return userData.nama_lengkap;
      }
    } catch (error) {
      console.log('Error retrieving user data:', error);
      // Handle error if needed
      return null;
    }
  };

  const fetchInspectionData = async (nama) => {
    try {
      // Fetch APAR inspections data from Firestore
      const aparInspectionsSnapshot = await firestore()
        .collection('APAR')
        .where('name', '==', nama)
        .get();

      // Fetch P3K inspections data from Firestore
      const p3kInspectionsSnapshot = await firestore()
        .collection('P3K')
        .where('name', '==', nama)
        .get();

      // Convert Firestore timestamp to a readable format
      const combinedInspectionData = [];
      aparInspectionsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.tanggal) {
          // Convert timestamp to a Date object
          data.timestamp = data.tanggal.toDate();
        }
        combinedInspectionData.push({ id: doc.id, ...data });
      });
      p3kInspectionsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.tanggal) {
          // Convert timestamp to a Date object
          data.timestamp = data.tanggal.toDate();
        }
        combinedInspectionData.push({ id: doc.id, ...data });
      });
      // Sort the combined data based on timestamp (if you have the timestamp field)
      combinedInspectionData.sort((a, b) => a.timestamp - b.timestamp);

      // Set the inspection data state
      setInspectionData(combinedInspectionData);
    } catch (error) {
      console.log('Error fetching inspection data:', error);
    }
  };

  const formatToIndonesiaDate = (utcDateString) => {
    // Convert UTC string to JavaScript Date object
    const date = new Date(utcDateString);

    // Options for Indonesian date format
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    // Convert date to Indonesian format
    return date.toLocaleString('id-ID', options);
  };


  return (
    <View style={styles.container}>
      <FlatList
        data={inspectionData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.inspectionItem}>
            {/* Display the inspection details here */}
            <Text>{item.aparId || item.id_p3k}</Text>
            <Text>Tanggal: {item.timestamp ? formatToIndonesiaDate(item.timestamp.toISOString()) : 'N/A'}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inspectionItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 4,
  },
});

export default InspectionHistoryScreen;
