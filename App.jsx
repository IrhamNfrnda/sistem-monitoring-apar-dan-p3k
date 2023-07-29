import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/Login';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions'

import SuperVisorHome from './src/screens/supervisor/SuperVisorHome';
import InspectionValidation from './src/screens/supervisor/ValidateInspection';

import OperatorHome from './src/screens/operator/OperatorHome';
import APARInspection from './src/screens/operator/APARInspection';
import P3KInspection from './src/screens/operator/P3KInspection';
import InspectionHistory from './src/screens/operator/InspectionHistory';
import InspectionList from './src/screens/operator/InspectionList';
import P3KQRCodeScreen from './src/screens/operator/P3KQRCodeScreen';
import APARQRCodeScreen from './src/screens/operator/APARQRCodeScreen';


const Stack = createStackNavigator();

const App = () => {
  React.useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      if (result === RESULTS.GRANTED) {
        console.log('Camera permission granted.');
      } else {
        console.log('Camera permission denied.');
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  };

  return (
    <NavigationContainer>
      <ImageBackground source={require('./src/assets/background.jpg')} style={styles.background}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

          {/* Super Visor Screen */}
          <Stack.Screen name="SuperVisorHome" component={SuperVisorHome} options={{ headerShown: false }} />
          <Stack.Screen name="ValidateInspection" component={InspectionValidation} options={{ title: 'Inspeksi' }} />

          {/* Operator Screen */}
          <Stack.Screen name="OperatorHome" component={OperatorHome} options={{ headerShown: false }} />
          <Stack.Screen name="InspectionList" component={InspectionList} options={{ title: 'Inspeksi' }} />
          <Stack.Screen name="APARInspection" component={APARInspection} options={{ title: 'Inspeksi APAR' }} />
          <Stack.Screen name="P3KInspection" component={P3KInspection} options={{ title: 'Inspeksi P3K' }} />
          <Stack.Screen name="InspectionHistory" component={InspectionHistory} options={{ title: 'Riwayat Inspeksi' }} />
          <Stack.Screen name="APARQRCode" component={APARQRCodeScreen}/>
          <Stack.Screen name="P3KQRCode" component={P3KQRCodeScreen}/>
        </Stack.Navigator>
      </ImageBackground>
    </NavigationContainer>
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
});


export default App;
