import React, { useState } from 'react';
import { ImageBackground, View, Text, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';
import SweetAlert from 'react-native-sweet-alert';
import firestore from '@react-native-firebase/firestore';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      // Fetch the 'User' collection from Firestore
      const userSnapshot = await firestore().collection('User').get();

      // Convert the snapshot data to an array of users
      const userAccount = userSnapshot.docs.map((doc) => doc.data());

      // Check if the username and password match any of the user accounts
      const matchedUser = userAccount.find(
        (user) => user.username === username && user.password === password
      );

      if (matchedUser) {
        handleNavigate(matchedUser);
      } else {
        // Invalid credentials, show an alert or error message
        SweetAlert.showAlertWithOptions({
          title: 'Error',
          subTitle: 'Username atau password Salah!',
          confirmButtonTitle: 'OK',
          style: 'error',
          cancellable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error if needed
    }
  };


  const handleNavigate = async (matchedUser) => {
    if (matchedUser.role === 'Operator') {
      // Save user data in local storage
      try {
        await AsyncStorage.setItem('userData', JSON.stringify(matchedUser));
        navigation.navigate('OperatorHome');
        console.log(matchedUser);
      } catch (error) {
        console.log('Error saving user data:', error);
        // Handle error if needed
      }
      
    } else if (matchedUser.role === 'Supervisor') {
      try {
        await AsyncStorage.setItem('userData', JSON.stringify(matchedUser));
        navigation.navigate('SuperVisorHome');
      } catch (error) {
        console.log('Error saving user data:', error);
        // Handle error if needed
      }
    } else {
      // For any other role or if the role is not recognized, you can handle it accordingly
      SweetAlert.showAlertWithOptions({
        title: 'Error',
        subTitle: 'Role not recognized',
        confirmButtonTitle: 'OK',
        style: 'error',
        cancellable: true,
      });
      return;
    }
  };

  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Aplikasi Inspeksi APAR dan P3K</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholderTextColor="black" // Set the placeholder text color to black
          color="black" // Set the text input color to black
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          value={password}
          placeholderTextColor="black" // Set the placeholder text color to black
          color="black" // Set the text input color to black
        />
        <Button
          title="Login"
          buttonStyle={{
            backgroundColor: 'rgba(78, 116, 289, 1)',
            borderRadius: 3,
          }}
          containerStyle={{
            width: 200,
            marginHorizontal: 50,
            marginVertical: 10,
          }}
          onPress={handleLogin}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    paddingHorizontal: 10,
    color: 'black', // Set the default text color to black
  },
});

export default App;
