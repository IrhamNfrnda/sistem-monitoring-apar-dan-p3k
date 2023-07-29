import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Button, Image, Alert } from 'react-native';
import { Text, Header } from '@rneui/themed';
import { RadioButton } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import firestore from '@react-native-firebase/firestore';
import SweetAlert from 'react-native-sweet-alert';

const P3KInspection = ({ navigation }) => {
  const route = useRoute();
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [p3kId, setP3KId] = useState('P3K2');
  const [location, setLocation] = useState('');
  const [kasa, setKasa] = useState(false);
  const [perban, setPerban] = useState(false);
  const [plesterCepat, setPlesterCepat] = useState(false);
  const [kapas, setKapas] = useState(false);
  const [kainSegitiga, setKainSegitiga] = useState(false);
  const [gunting, setGunting] = useState(false);
  const [peniti, setPeniti] = useState(false);
  const [sarungTangan, setSarungTangan] = useState(false);
  const [masker, setMasker] = useState(false);
  const [pinset, setPinset] = useState(false);
  const [lampuSenter, setLampuSenter] = useState(false);
  const [gelas, setGelas] = useState(false);
  const [kantongPlastik, setKantongPlastik] = useState(false);
  const [aquade, setAquade] = useState(false);
  const [betadin, setBetadin] = useState(false);
  const [alkohol, setAlkohol] = useState(false);
  const [bukuPanduan, setBukuPanduan] = useState(false);
  const [bukuCatatan, setBukuCatatan] = useState(false);
  const [daftarIsi, setDaftarIsi] = useState(false);
  const [kondisi, setKondisi] = useState('');
  const [keterangan, setKeterangan] = useState('');

  const handleScanQR = () => {
    navigation.navigate('P3KQRCode');
  };

  const scannedData = route.params?.scannedData || '';

  React.useEffect(() => {
    if (scannedData) {
      // Set the scanned data to the aparId state
      setP3KId(scannedData);
    }
  }, [scannedData]);

  useEffect(() => {
    retrieveUserData();
  }, []);

  const retrieveUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString !== null) {
        const userData = JSON.parse(userDataString);
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
      tanggal: timestamp,
      perban: perban ? 'ada' : 'tidak ada',
      kasa: kasa ? 'ada' : 'tidak ada',
      plesterCepat: plesterCepat ? 'ada' : 'tidak ada',
      kapas: kapas ? 'ada' : 'tidak ada',
      kainSegitiga: kainSegitiga ? 'ada' : 'tidak ada',
      gunting: gunting ? 'ada' : 'tidak ada',
      peniti: peniti ? 'ada' : 'tidak ada',
      sarungTangan: sarungTangan ? 'ada' : 'tidak ada',
      masker: masker ? 'ada' : 'tidak ada',
      pinset: pinset ? 'ada' : 'tidak ada',
      lampuSenter: lampuSenter ? 'ada' : 'tidak ada',
      gelas: gelas ? 'ada' : 'tidak ada',
      kantongPlastik: kantongPlastik ? 'ada' : 'tidak ada',
      aquade: aquade ? 'ada' : 'tidak ada',
      betadin: betadin ? 'ada' : 'tidak ada',
      alkohol: alkohol ? 'ada' : 'tidak ada',
      bukuPanduan: bukuPanduan ? 'ada' : 'tidak ada',
      bukuCatatan: bukuCatatan ? 'ada' : 'tidak ada',
      daftarIsi: daftarIsi ? 'ada' : 'tidak ada',
      kondisi: kondisi,
      keterangan: keterangan,
    };

    // Find the document with matching id_p3k
    firestore()
      .collection('P3K')
      .where('id_p3k', '==', p3kId)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Update the document with matching id_p3k
          const docRef = querySnapshot.docs[0].ref;
          docRef
            .set(inspectionData, { merge: true }) // Use set with merge: true to update specific fields
            .then(() => {
              console.log('P3K data updated in Firestore!');
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
              console.error('Error updating P3K data:', error);
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
          console.log(`P3K data with ${p3kId} not found!`);
          // Show an error message using SweetAlert
          SweetAlert.showAlertWithOptions({
            title: 'Error',
            subTitle: `Data P3K dengan ${p3kId} tidak ditemukan!`,
            confirmButtonTitle: 'OK',
            style: 'error',
            cancellable: true,
          });
        }
      })
      .catch((error) => {
        console.error('Error finding P3K data:', error);
        // Show an error message using SweetAlert
        SweetAlert.showAlertWithOptions({
          title: 'Error',
          subTitle: 'Terjadi kesalahan saat mencari data P3K!',
          confirmButtonTitle: 'OK',
          style: 'error',
          cancellable: true,
        });
      });
  };


  return (
    <View style={styles.container}>
      <Header
        centerComponent={<Text style={styles.headerText}>Inspeksi P3K</Text>}
        containerStyle={styles.headerContainer}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Silahkan Isi Kelengkapan P3K</Text>

        <Text>ID P3K: {p3kId}</Text>
        <Button title="Scan QR P3K" onPress={handleScanQR} />
        {/* <Text>Lokasi:</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Masukan Lokasi P3K"
          placeholderTextColor="black" 
        /> */}

        <Text>Perban:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={perban ? 'checked' : 'unchecked'}
            onPress={() => setPerban(!perban)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={perban ? 'unchecked' : 'checked'}
            onPress={() => setPerban(!perban)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Kasa steril terbungkus:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={kasa ? 'checked' : 'unchecked'}
            onPress={() => setKasa(!kasa)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={kasa ? 'unchecked' : 'checked'}
            onPress={() => setKasa(!kasa)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Plester Cepat:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={plesterCepat ? 'checked' : 'unchecked'}
            onPress={() => setPlesterCepat(!plesterCepat)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={plesterCepat ? 'unchecked' : 'checked'}
            onPress={() => setPlesterCepat(!plesterCepat)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Kapas:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={kapas ? 'checked' : 'unchecked'}
            onPress={() => setKapas(!kapas)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={kapas ? 'unchecked' : 'checked'}
            onPress={() => setKapas(!kapas)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Kain Segitiga:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={kainSegitiga ? 'checked' : 'unchecked'}
            onPress={() => setKainSegitiga(!kainSegitiga)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={kainSegitiga ? 'unchecked' : 'checked'}
            onPress={() => setKainSegitiga(!kainSegitiga)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Gunting:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={gunting ? 'checked' : 'unchecked'}
            onPress={() => setGunting(!gunting)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={gunting ? 'unchecked' : 'checked'}
            onPress={() => setGunting(!gunting)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Peniti:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={peniti ? 'checked' : 'unchecked'}
            onPress={() => setPeniti(!peniti)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={peniti ? 'unchecked' : 'checked'}
            onPress={() => setPeniti(!peniti)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Sarung Tangan:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={sarungTangan ? 'checked' : 'unchecked'}
            onPress={() => setSarungTangan(!sarungTangan)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={sarungTangan ? 'unchecked' : 'checked'}
            onPress={() => setSarungTangan(!sarungTangan)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Masker:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={masker ? 'checked' : 'unchecked'}
            onPress={() => setMasker(!masker)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={masker ? 'unchecked' : 'checked'}
            onPress={() => setMasker(!masker)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Pinset:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={pinset ? 'checked' : 'unchecked'}
            onPress={() => setPinset(!pinset)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={pinset ? 'unchecked' : 'checked'}
            onPress={() => setPinset(!pinset)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Lampu Senter:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={lampuSenter ? 'checked' : 'unchecked'}
            onPress={() => setLampuSenter(!lampuSenter)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={lampuSenter ? 'unchecked' : 'checked'}
            onPress={() => setLampuSenter(!lampuSenter)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Gelas:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={gelas ? 'checked' : 'unchecked'}
            onPress={() => setGelas(!gelas)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={gelas ? 'unchecked' : 'checked'}
            onPress={() => setGelas(!gelas)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Kantong Plastik:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={kantongPlastik ? 'checked' : 'unchecked'}
            onPress={() => setKantongPlastik(!kantongPlastik)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={kantongPlastik ? 'unchecked' : 'checked'}
            onPress={() => setKantongPlastik(!kantongPlastik)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Aquade:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={aquade ? 'checked' : 'unchecked'}
            onPress={() => setAquade(!aquade)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={aquade ? 'unchecked' : 'checked'}
            onPress={() => setAquade(!aquade)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Betadin:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={betadin ? 'checked' : 'unchecked'}
            onPress={() => setBetadin(!betadin)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={betadin ? 'unchecked' : 'checked'}
            onPress={() => setBetadin(!betadin)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Alkohol:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={alkohol ? 'checked' : 'unchecked'}
            onPress={() => setAlkohol(!alkohol)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={alkohol ? 'unchecked' : 'checked'}
            onPress={() => setAlkohol(!alkohol)}
          />
          <Text>Tidak Ada</Text>
        </View>
        <Text>Buku Panduan:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={bukuPanduan ? 'checked' : 'unchecked'}
            onPress={() => setBukuPanduan(!bukuPanduan)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={bukuPanduan ? 'unchecked' : 'checked'}
            onPress={() => setBukuPanduan(!bukuPanduan)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Buku Catatan:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={bukuCatatan ? 'checked' : 'unchecked'}
            onPress={() => setBukuCatatan(!bukuCatatan)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={bukuCatatan ? 'unchecked' : 'checked'}
            onPress={() => setBukuCatatan(!bukuCatatan)}
          />
          <Text>Tidak Ada</Text>
        </View>

        <Text>Daftar Isi:</Text>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="ada"
            status={daftarIsi ? 'checked' : 'unchecked'}
            onPress={() => setDaftarIsi(!daftarIsi)}
          />
          <Text>Ada</Text>
          <RadioButton
            value="tidak ada"
            status={daftarIsi ? 'unchecked' : 'checked'}
            onPress={() => setDaftarIsi(!daftarIsi)}
          />
          <Text>Tidak Ada</Text>
        </View>
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
          placeholder="Masukan Keterangan" />

        {/* Continue the same pattern for other questions */}
        {/* 
        <Text style={styles.sectionTitle}>Upload Foto P3K</Text>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <Text>Foto belum diupload</Text>
          )}
          <Button title="Upload Foto" onPress={handleImageUpload} />
        </View> */}

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'black',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default P3KInspection;
