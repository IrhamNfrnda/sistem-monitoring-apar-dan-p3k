import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { Card } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';

const Dashboard = () => {
  const [aparPieChartData, setAparPieChartData] = useState([
    {
      name: 'Inspeksi Selesai',
      population: 0,
      color: '#3ABF8F',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Belum Di Inspeksi',
      population: 0,
      color: '#FF8C00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ]);

  const [p3kPieChartData, setP3kPieChartData] = useState([
    {
      name: 'Inspeksi Selesai',
      population: 0,
      color: '#3ABF8F',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Belum Di Inspeksi',
      population: 0,
      color: '#FF8C00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ]);

  // Sample data for the line chart
  const lineChartDataAPAR = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [1, 1, 1, 1, 1, 26],
      },
    ],
  };

  const lineChartDataP3K = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [1, 1, 1, 1, 1, 13],
      },
    ],
  };

  useEffect(() => {
    // Fetch data from Firestore
    fetchFirestoreData();
  }, []);

  const fetchFirestoreData = async () => {
    try {
      // Query the 'APARInspections' collection
      const aparSnapshot = await firestore().collection('APARInspections').get();
      // Get the counts of inspections in the 'APARInspections' collection
      const aparCount = aparSnapshot.size;

      // Query the 'P3KInspections' collection
      const p3kSnapshot = await firestore().collection('P3KInspections').get();
      // Get the counts of inspections in the 'P3KInspections' collection
      const p3kCount = p3kSnapshot.size;

      // Calculate the total number of successful APAR and P3K inspections
      const aparSuccessTotal = aparCount;
      const p3kSuccessTotal = p3kCount;

      // Calculate the total number of all APAR and P3K inspections
      const aparTotal = 26;
      const p3kTotal = 13;

      // Calculate the 'Inspeksi Selesai' and 'Belum Di Inspeksi' values for APAR
      const aparInspeksiSelesai = aparTotal - aparSuccessTotal;
      const aparBelumDiInspeksi = aparSuccessTotal;

      // Calculate the 'Inspeksi Selesai' and 'Belum Di Inspeksi' values for P3K
      const p3kInspeksiSelesai = p3kTotal - p3kSuccessTotal;
      const p3kBelumDiInspeksi = p3kSuccessTotal;

      // Update the pieChartData with the dynamic values for APAR
      setAparPieChartData([
        {
          name: 'Inspeksi Selesai',
          population: aparInspeksiSelesai,
          color: '#3ABF8F',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
        {
          name: 'Belum Di Inspeksi',
          population: aparBelumDiInspeksi,
          color: '#FF8C00',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
      ]);

      // Update the pieChartData with the dynamic values for P3K
      setP3kPieChartData([
        {
          name: 'Inspeksi Selesai',
          population: p3kInspeksiSelesai,
          color: '#3ABF8F',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
        {
          name: 'Belum Di Inspeksi',
          population: p3kBelumDiInspeksi,
          color: '#FF8C00',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
      ]);
    } catch (error) {
      console.error('Error fetching Firestore data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title>Riwayat Inspeksi APAR Bulanan</Card.Title>
        <Card.Divider />
        <LineChart
          data={lineChartDataAPAR}
          width={400}
          height={200}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </Card>

      <Card containerStyle={styles.card}>
        <Card.Title>Data Inspeksi APAR Bulan Ini</Card.Title>
        <Card.Divider />
        <PieChart
          data={aparPieChartData}
          width={400}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </Card>

      <Card containerStyle={styles.card}>
        <Card.Title>Riwayat Inspeksi P3K Bulanan</Card.Title>
        <Card.Divider />
        <LineChart
          data={lineChartDataP3K}
          width={400}
          height={200}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </Card>

      <Card containerStyle={styles.card}>
        <Card.Title>Data Inspeksi P3K Bulan Ini</Card.Title>
        <Card.Divider />
        <PieChart
          data={p3kPieChartData}
          width={400}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    marginBottom: 20,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
});

export default Dashboard;
