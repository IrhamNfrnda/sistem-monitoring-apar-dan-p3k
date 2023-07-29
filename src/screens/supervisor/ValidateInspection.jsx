import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Text, Header, ListItem } from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';

const ListInspection = () => {
  const [inspectionData, setInspectionData] = useState([]);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetch the inspection data from Firestore
    fetchInspectionData();
  }, []);

  const fetchInspectionData = async () => {
    try {
      // Query inspections from both APARInspections and P3KInspections collections
      const aparSnapshot = await firestore().collection('APAR').get();
      const p3kSnapshot = await firestore().collection('P3K').get();

      // Convert the snapshots data to arrays of inspection objects
      const aparInspections = aparSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), inspectionType: 'APAR' }));
      const p3kInspections = p3kSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), inspectionType: 'P3K' }));

      // Merge the arrays into a single array of all inspections
      const allInspections = [...aparInspections, ...p3kInspections];

      setInspectionData(allInspections);
    } catch (error) {
      console.error('Error fetching inspection data:', error);
    }
  };

  const handleItemClick = (inspection) => {
    setSelectedInspection(inspection);
    setModalVisible(true);
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
      <Header
        centerComponent={<Text style={styles.headerText}>Daftar Inspeksi</Text>}
        containerStyle={styles.headerContainer}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {inspectionData.map((inspection) => (
          <TouchableOpacity
            key={inspection.id}
            style={styles.listItemContainer}
            onPress={() => handleItemClick(inspection)}
          >
            <ListItem bottomDivider>
              <ListItem.Content>
                {inspection.inspectionType === 'APAR' ? (
                  <ListItem.Title>{inspection.aparId ? inspection.aparId : inspection.id_apar}</ListItem.Title>
                ) : (
                  <ListItem.Title>{inspection.id_p3k}</ListItem.Title>
                )}
                <ListItem.Subtitle>{inspection.name ? inspection.name : "Belum Di Inspeksi"}</ListItem.Subtitle>
                <ListItem.Subtitle>{inspection.lokasi}</ListItem.Subtitle>
                <ListItem.Subtitle>
                  {inspection.inspectionType === 'APAR' ? (
                    <>
                      {inspection.tanggal ? formatToIndonesiaDate(inspection.tanggal.toDate()) : 'Belum Di Inspeksi'}
                    </>
                  ) : (
                    <>
                      {inspection.tanggal ? formatToIndonesiaDate(inspection.tanggal.toDate()): 'Belum Di Inspeksi'}
                    </>
                  )}
                </ListItem.Subtitle>

              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </TouchableOpacity>
        ))}

        {/* Add the modal to show detailed inspection information */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            {selectedInspection && (
              <View style={styles.modalContent}>
                {selectedInspection.inspectionType === 'APAR' ? (
                  // Render APAR inspection data
                  <>
                    <Text>ID APAR: {selectedInspection.aparId}</Text>
                    <Text>Lokasi: {selectedInspection.lokasi}</Text>
                    <Text>Pin Segel: {selectedInspection.pinSegel}</Text>
                    <Text>Selang: {selectedInspection.selang}</Text>
                    <Text>Corong: {selectedInspection.corong}</Text>
                    <Text>Tabung: {selectedInspection.tabung}</Text>
                    <Text>Tekanan: {selectedInspection.tekanan}</Text>
                    <Text>Berat Tabung: {selectedInspection.beratTabung}</Text>
                    <Text>Berat Catridge: {selectedInspection.beratCatridge}</Text>
                    {/* Add other APAR inspection details here */}
                  </>
                ) : (
                  // Render P3K inspection data
                  <>
                    <Text>ID P3K: {selectedInspection.id_p3k}</Text>
                    <Text>Lokasi: {selectedInspection.lokasi}</Text>
                    <Text>Perban: {selectedInspection.perban}</Text>
                    <Text>Kasa Steril Terbungkus: {selectedInspection.kasa}</Text>
                    <Text>Plester Cepat: {selectedInspection.plesterCepat}</Text>
                    <Text>Kapas: {selectedInspection.kapas}</Text>
                    <Text>Kain Segitiga: {selectedInspection.kainSegitiga}</Text>
                    <Text>Gunting: {selectedInspection.gunting}</Text>
                    <Text>Peniti: {selectedInspection.peniti}</Text>
                    <Text>Sarung Tangan: {selectedInspection.sarungTangan}</Text>
                    <Text>Masker: {selectedInspection.masker}</Text>
                    <Text>Pinset: {selectedInspection.pinset}</Text>
                    <Text>Lampu Senter: {selectedInspection.lampuSenter}</Text>
                    <Text>Gelas: {selectedInspection.gelas}</Text>
                    <Text>Kantong Plastik: {selectedInspection.kantongPlastik}</Text>
                    <Text>Aquade: {selectedInspection.aquade}</Text>
                    <Text>Betadin: {selectedInspection.betadin}</Text>
                    <Text>Alkohol: {selectedInspection.alkohol}</Text>
                    <Text>Buku Panduan: {selectedInspection.bukuPanduan}</Text>
                    <Text>Buku Catatan: {selectedInspection.bukuCatatan}</Text>
                    <Text>Daftar Isi: {selectedInspection.daftarIsi}</Text>
                    {/* Add other P3K inspection details here */}
                  </>
                )}
              </View>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
  listItemContainer: {
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    backgroundColor: 'lightgray',
    padding: 10,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '50%',
    elevation: 5, // Shadow effect for Android
  },
  separator: {
    height: 1,
    backgroundColor: 'lightgray',
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ListInspection;
