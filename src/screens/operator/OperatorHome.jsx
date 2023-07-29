import React from 'react';
import { ImageBackground, View, StyleSheet, Image } from 'react-native';
import { Button, Text, Header } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import SweetAlert from 'react-native-sweet-alert';

const MainMenuPage = ({ navigation }) => {
  const [fullname, setFullname] = React.useState('');

  React.useEffect(() => {
    // Retrieve the user data from local storage when the component mounts
    retrieveUserData();
  }, []);

  const retrieveUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString !== null) {
        const userData = JSON.parse(userDataString);
        setFullname(userData.nama_lengkap);
      }
    } catch (error) {
      console.log('Error retrieving user data:', error);
      // Handle error if needed
    }
  };

  const handleInspectionPress = () => {
    navigation.navigate('InspectionList'); // Replace 'InspectionList' with the actual screen name for the Inspection List page
  };

  const handleHistoryPress = () => {
    navigation.navigate('InspectionHistory'); // Replace 'History' with the actual screen name for the History page
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
      <View style={styles.container}>
        <Header
          centerComponent={<Text style={styles.headerText}>Inspeksi APAR dan P3K</Text>}
          containerStyle={styles.headerContainer}
        />
        <View style={styles.content}>
          <Text style={styles.title}>Selamat Datang {fullname}</Text>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Button
            title="Inspeksi APAR dan P3K"
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.buttonContainerStyle}
            onPress={handleInspectionPress}
          />
          <Button
            title="Riwayat Inspeksi"
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.buttonContainerStyle}
            onPress={handleHistoryPress}
          />
          <Button
            title="Logout"
            buttonStyle={styles.logoutButtonStyle}
            containerStyle={styles.buttonContainerStyle}
            onPress={handleLogout}
          />
        </View>
      </View>
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

export default MainMenuPage;
