import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

const QRCodeScreen = ({ navigation }) => {
  const [scanned, setScanned] = useState(false);

  const handleScan = (event) => {
    const scannedData = event.data;
    // Pass the scanned data back to the APARInspection screen
    navigation.navigate('P3KInspection', { scannedData });
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={handleScan}
        cameraStyle={styles.cameraContainer}
        reactivateTimeout={5000}
      />
      {scanned && (
        <View style={styles.scanIndicator}>
          <Text style={styles.scanText}>QR Code scanned!</Text>
          <Text style={styles.scanText}>Scanning result will be displayed above.</Text>
          <TouchableOpacity onPress={() => setScanned(false)} style={styles.rescanButton}>
            <Text style={styles.rescanButtonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scanText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  rescanButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  rescanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QRCodeScreen;
