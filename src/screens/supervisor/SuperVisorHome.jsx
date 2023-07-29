import React from 'react';
import { ImageBackground, View, StyleSheet, Image } from 'react-native';
import { Button, Text, Header } from '@rneui/themed';
import Dashboard from './Dashboard';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import SweetAlert from 'react-native-sweet-alert';

const SuperVisorHome = ({ navigation }) => {
  const handleValidatePress = () => {
    navigation.navigate('ValidateInspection');
  };

  const handleHistoryPress = () => {
    navigation.navigate('ValidationHistory'); // Replace 'History' with the actual screen name for the History page
  };

  const handleLogout = async () => {
    // Show a confirmation prompt before logging out
    SweetAlert.showAlertWithOptions({
      title: 'Logout',
      subTitle: 'Apakah kamu yakin ingin keluar?',
      confirmButtonTitle: 'Yes',
      confirmButtonColor: '#DC3545', // Set the color of the confirm button to red
      cancelButtonTitle: 'No',
      style: 'warning',
      cancellable: true,
    }, async (confirmed) => {
      if (confirmed) {
        try {
          // Clear user data from local storage
          await AsyncStorage.removeItem('userData');
          // Navigate to the login screen
          navigation.navigate('Login');
        } catch (error) {
          console.log('Error clearing user data:', error);
          // Handle error if needed
        }
      }
    });
  };

  return (
    <ImageBackground source={require('../../assets/background.jpg')} style={styles.background}>
      <ScrollView style={styles.container}>
        <Header
          centerComponent={<Text style={styles.headerText}>Inspeksi APAR dan P3K</Text>}
          containerStyle={styles.headerContainer}
        />
        <View style={styles.content}>
          <Text style={styles.title}>Selamat Datang Super Visor</Text>
          <Dashboard />
          {/* <Button
            title="Validasi Inspeksi APAR dan P3K"
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.buttonContainerStyle}
            onPress={handleValidatePress}
          /> */}
          <Button
            title="List Inspeksi APAR dan P3K"
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.buttonContainerStyle}
            onPress={handleValidatePress}
          />
           <Button
            title="Logout"
            buttonStyle={styles.logoutButtonStyle}
            containerStyle={styles.buttonContainerStyle}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    borderBottomWidth: 0,
  },
  headerText: {
    fontSize: 21,
    fontWeight: 'bold',
    textAlign: 'center', // Center-align the header text
    color: 'white',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  buttonStyle: {
    borderRadius: 3,
  },
  logoutButtonStyle: {
    backgroundColor: 'red', // Set the background color to red for the logout button
    borderRadius: 3,
  },
  buttonContainerStyle: {
    width: 300,
    marginHorizontal: 50,
    marginVertical: 10,
  },
});

export default SuperVisorHome;
