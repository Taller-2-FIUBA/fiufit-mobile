import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import goalsService from "../services/goalsService";

const DashboardScreen = () => {
  const [period, setPeriod] = useState('month');

  const changePeriod = (newPeriod) => {
    setPeriod(newPeriod);
    // Actualizar las métricas según el nuevo período seleccionado
  };

  const getMetrics = async () => {
    // Devuelve un objeto con las métricas o null si no hay métricas disponibles
    // Ejemplo: { distancia: 10, tiempo: 120, calorias: 500, hitos: 3, actividad: 'correr' }
    const userId =  await AsyncStorage.getItem('@fiufit_userId');
    try {
      const metricsProgress = await goalsService.getMetricsProgress(userId, metric, days);
    } catch (error) {
        console.error("Error on chaning training rating: ", error);
    }
    return null;
  };

  const renderMetrics = () => {
    const metricas = getMetrics();

    if (metricas) {
      return (
        <View>
          <Text>Distance: {metricas.distancia} km</Text>
          <Text>Time: {metricas.tiempo} minutos</Text>
          <Text>Calories expended: {metricas.calorias} kcal</Text>
          <Text>Number of milestones achieved: {metricas.hitos}</Text>
          <Text>Type of activity: {metricas.actividad}</Text>
        </View>
      );
    } else {
      return <Text>There are no metrics available for the selected period.</Text>;
    }
  };

  return (
    <View>
      <Text>Metrics Dashboard</Text>
      <Button title="Today" onPress={() => changePeriod('today')} />
      <Button title="Week" onPress={() => changePeriod('week')} />
      <Button title="Month" onPress={() => changePeriod('month')} />
      
      {renderMetrics()}
    </View>
  );
};

export default DashboardScreen;