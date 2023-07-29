import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from '@rneui/themed';

const InspectionList = ({ navigation }) => {
  const handleAparPress = () => {
    navigation.navigate('APARInspection'); // Replace 'AparInspection' with the actual screen name for the APAR inspection page
  };

  const handleP3kPress = () => {
    navigation.navigate('P3KInspection'); // Replace 'P3kInspection' with the actual screen name for the P3K inspection page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Silahkan pilih jenis inspeksi yang ingin dilakukan</Text>
      <Button
        title="APAR"
        buttonStyle={styles.buttonStyle}
        containerStyle={styles.buttonContainerStyle}
        onPress={handleAparPress}
      />
      <Button
        title="P3K"
        buttonStyle={styles.buttonStyle}
        containerStyle={styles.buttonContainerStyle}
        onPress={handleP3kPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  buttonStyle: {
    borderRadius: 3,
  },
  buttonContainerStyle: {
    width: 300,
    marginHorizontal: 50,
    marginVertical: 10,
  },
});

export default InspectionList;
