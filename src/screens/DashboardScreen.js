import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import goalsService from "../services/goalsService";

const DashboardScreen = () => {
  const [period, setPeriod] = useState(7);

  const changePeriod = (newPeriod) => {
    setPeriod(newPeriod);
    // Actualizar las métricas según el nuevo período seleccionado
  };

  const getMetrics = async () => {
    // Devuelve un objeto con las métricas o null si no hay métricas disponibles
    // Ejemplo: { distancia: 10, tiempo: 120, calorias: 500, hitos: 3, actividad: 'correr' }
    const userId =  await AsyncStorage.getItem('@fiufit_userId');
    try {
      const metricsProgress = await goalsService.getMetricsProgress(userId, period);
    } catch (error) {
        console.error("Error on chaning training rating: ", error);
    }
    return null;
  };

  const renderMetrics = () => {
    const metrics = getMetrics();

    if (metrics) {
      return (
        <View>
          <Text style={styles.metricText}>Distance: {metrics.distancia} km</Text>
          <Text style={styles.metricText}>Time: {metrics.tiempo} minutos</Text>
          <Text style={styles.metricText}>Calories expended: {metrics.calorias} kcal</Text>
          <Text style={styles.metricText}>Number of milestones achieved: {metrics.hitos}</Text>
          <Text style={styles.metricText}>Type of activity: {metrics.actividad}</Text>
        </View>
      );
    } else {
      return <Text style={styles.noMetricsText}>There are no metrics available for the selected period.</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Metrics Dashboard</Text>
      <View style={styles.buttonContainer}>
        <Button title="Today" onPress={() => changePeriod(1)} />
        <Button title="Week" onPress={() => changePeriod(7)} />
        <Button title="Month" onPress={() => changePeriod(30)} />
      </View>
      {renderMetrics()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metricText: {
    fontSize: 16,
    marginBottom: 8,
  },
  noMetricsText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default DashboardScreen;