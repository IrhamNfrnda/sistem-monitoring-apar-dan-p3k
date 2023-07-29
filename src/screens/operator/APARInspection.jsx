import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Button, TextInput, Image } from 'react-native';
import { Text, Header } from '@rneui/themed';
import { RadioButton } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import firestore from '@react-native-firebase/firestore';
import SweetAlert from 'react-native-sweet-alert';
import RNPickerSelect from 'react-native-picker-select';

const APARInspection = ({ navigation }) => {
  const route = useRoute();
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [aparId, setAparId] = useState('APAR5');
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState('');
  const [pinSegel, setPinSegel] = useState('bagus');
  const [selang, setSelang] = useState('bagus');
  const [corong, setCorong] = useState('bagus');
  const [tabung, setTabung] = useState('bagus');
  const [tekanan, setTekanan] = useState('');
  const [beratTabung, setBeratTabung] = useState('');
  const [beratCatridge, setBeratCatridge] = useState('');
  const [kondisi, setKondisi] = useState('');
  const [keterangan, setKeterangan] = useState('');
  // const [imageUri, setImageUri] = useState(null);

  const handleScanQR = () => {
    navigation.navigate('APARQRCode');
  };

  const scannedData = route.params?.scannedData || '';

  // useEffect to handle the scanned data when the component mounts
  React.useEffect(() => {
    if (scannedData) {
      // Set the scanned data to the aparId state
      setAparId(scannedData);
    }
  }, [scannedData]);

  useEffect(() => {
    // fetchLocations();
    retrieveUserData();
  }, []);

  // const fetchLocations = async () => {
  //   try {
  //     const locationsSnapshot = await firestore().collection('Locations').get();
  //     const locationNames = locationsSnapshot.docs.map((doc) => doc.data().location_name);
  //     setLocations(locationNames);
  //   } catch (error) {
  //     console.error('Error fetching locations:', error);
  //   }
  // };

  const retrieveUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString !== null) {
        const userData = JSON.parse(userDataString); // Add this line to set the user ID state
        setName(userData.nama_lengkap);
      }
    } catch (error) {
      console.log('Error retrieving user data:', error);
    }
  };

  const handleSubmit = () => {
    const currentDate = new Date();
    const timestamp = firestore.Timestamp.fromDate(currentDate);

    // Prepare the data to be written to Firestore
    const inspectionData = {
      name: name,
      inspectionType: 'APAR',
      tanggal: timestamp,
      aparId: aparId,
      pinSegel: pinSegel,
      selang: selang,
      corong: corong,
      tabung: tabung,
      tekanan: tekanan,
      beratTabung: beratTabung,
      beratCatridge: beratCatridge,
      kondisi: kondisi,
      keterangan: keterangan,
    };
    console.log(inspectionData);

    // Write the inspection data to Firestore
    // Find the document with matching id_apar
    firestore()
      .collection('APAR')
      .where('id_apar', '==', aparId)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Update the document with matching id_apar
          const docRef = querySnapshot.docs[0].ref;
          docRef
            .set(inspectionData, { merge: true }) // Use set with merge: true to update specific fields
            .then(() => {
              console.log('APAR data updated in Firestore!');
              // Show a success message using SweetAlert
              SweetAlert.showAlertWithOptions({
                title: 'Success',
                subTitle: 'Data Inspeksi Berhasil Diinput!',
                confirmButtonTitle: 'OK',
                style: 'success',
                cancellable: true,
                onPress: () => {
                  navigation.navigate('OperatorHome');
                },
              });
              navigation.navigate('OperatorHome');
            })
            .catch((error) => {
              console.error('Error updating APAR data:', error);
              // Show an error message using SweetAlert
              SweetAlert.showAlertWithOptions({
                title: 'Error',
                subTitle: 'Data Inspeksi Gagal Diinput!',
                confirmButtonTitle: 'OK',
                style: 'error',
                cancellable: true,
              });
            });
        } else {
          console.log(`APAR data with ${aparId} not found!`);
          // Show an error message using SweetAlert
          SweetAlert.showAlertWithOptions({
            title: 'Error',
            subTitle: `Data APAR dengan ${aparId} tidak ditemukan!`,
            confirmButtonTitle: 'OK',
            style: 'error',
            cancellable: true,
          });
        }
      })
      .catch((error) => {
        console.error('Error finding APAR data:', error);
        // Show an error message using SweetAlert
        SweetAlert.showAlertWithOptions({
          title: 'Error',
          subTitle: 'Terjadi kesalahan saat mencari data APAR!',
          confirmButtonTitle: 'OK',
          style: 'error',
          cancellable: true,
        });
      });
  };


  return (
    <View style={styles.container}>
      <Header
        centerComponent={<Text style={styles.headerText}>Inspeksi APAR</Text>}
        containerStyle={styles.headerContainer}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Kondisi APAR</Text>
        <View style={styles.formContainer}>
          <Text value={aparId}>APAR ID: {aparId}</Text>

          <Button title="Scan QR APAR" style={styles.QRButton} onPress={handleScanQR} />
          {/* <Text>Lokasi:</Text> */}
          {/* <RNPickerSelect
            onValueChange={(value) => setLocation(value)}
            items={locations}
            placeholder={{
              label: 'Select Location',
              value: null,
            }}
            // style={pickerSelectStyles}
            // value={location}
          /> */}

          <Text style={styles.question}>Apakah pin masih tersegel?</Text>
          <View style={styles.radioButtonContainer}>
            <RadioButton
              value="bagus"
              status={pinSegel === 'bagus' ? 'checked' : 'unchecked'}
              onPress={() => setPinSegel('bagus')}
            />
            <Text>Bagus</Text>
            <RadioButton
              value="tidak bagus"
              status={pinSegel === 'tidak bagus' ? 'checked' : 'unchecked'}
              onPress={() => setPinSegel('tidak bagus')}
            />
            <Text>Tidak Bagus</Text>
          </View>

          <Text style={styles.question}>Apakah selang masih dalam kondisi bagus?</Text>
          <View style={styles.radioButtonContainer}>
            <RadioButton
              value="bagus"
              status={selang === 'bagus' ? 'checked' : 'unchecked'}
              onPress={() => setSelang('bagus')}
            />
            <Text>Bagus</Text>
            <RadioButton
              value="tidak bagus"
              status={selang === 'tidak bagus' ? 'checked' : 'unchecked'}
              onPress={() => setSelang('tidak bagus')}
            />
            <Text>Tidak Bagus</Text>
          </View>

          <Text style={styles.question}>Apakah corong masih dalam kondisi bagus?</Text>
          <View style={styles.radioButtonContainer}>
            <RadioButton
              value="bagus"
              status={corong === 'bagus' ? 'checked' : 'unchecked'}
              onPress={() => setCorong('bagus')}
            />
            <Text>Bagus</Text>
            <RadioButton
              value="tidak bagus"
              status={corong === 'tidak bagus' ? 'checked' : 'unchecked'}
              onPress={() => setCorong('tidak bagus')}
            />
            <Text>Tidak Bagus</Text>
          </View>

          <Text style={styles.question}>Apakah tabung masih dalam kondisi bagus?</Text>
          <View style={styles.radioButtonContainer}>
            <RadioButton
              value="bagus"
              status={tabung === 'bagus' ? 'checked' : 'unchecked'}
              onPress={() => setTabung('bagus')}
            />
            <Text>Bagus</Text>
            <RadioButton
              value="tidak bagus"
              status={tabung === 'tidak bagus' ? 'checked' : 'unchecked'}
              onPress={() => setTabung('tidak bagus')}
            />
            <Text>Tidak Bagus</Text>
          </View>

          <Text>Tekanan:</Text>
          <TextInput
            style={styles.input}
            value={tekanan}
            onChangeText={setTekanan}
            placeholder="Masukan Jumlah Tekanan"
            placeholderTextColor="black"
          />

          <Text>Berat Tabung (CO2):</Text>
          <TextInput
            style={styles.input}
            value={beratTabung}
            onChangeText={setBeratTabung}
            placeholder="Masukan Berat Tabung (CO2)"
            placeholderTextColor="black"
          />
          <Text>Berat Cartridge:</Text>
          <TextInput
            style={styles.input}
            value={beratCatridge}
            onChangeText={setBeratCatridge}
            placeholder="Masukan berat Cartridge"
            placeholderTextColor="black"
          />
          <Text>Kondisi:</Text>
          <TextInput
            style={styles.input}
            value={kondisi}
            onChangeText={setKondisi}
            placeholder="Masukan Kondisi"
            placeholderTextColor="black"
          />
          <Text>Keterangan:</Text>
          <TextInput
            style={styles.input}
            value={keterangan}
            onChangeText={setKeterangan}
            placeholderTextColor="black"
            placeholder="Masukan Keterangan"/>
        </View>

        <Button title="Submit" onPress={handleSubmit} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 20,
  },
  QRButton: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  formContainer: {
    marginBottom: 20,
  },
  question: {
    marginTop: 10,
    marginBottom: 5,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'black',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});

// const pickerSelectStyles = StyleSheet.create({
//   inputIOS: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//     color: 'black',
//   },
//   inputAndroid: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//     color: 'black',
//   },
// });


export default APARInspection;