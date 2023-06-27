import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ActivityIndicator, useTheme} from 'react-native-paper';
import {primaryColor, secondaryColor, tertiaryColor} from "../consts/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import goalsService from "../services/goalsService";
import {fiufitStyles} from "../consts/fiufitStyles";

const DashboardScreen = () => {
  const theme = useTheme();
  const [period, setPeriod] = useState(7);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);

  const changePeriod = (newPeriod) => {
    setPeriod(newPeriod);
    // Actualizar las métricas según el nuevo período seleccionado
  };

  useEffect(() => {
    const getMetrics = async () => {
      // Devuelve un objeto con las métricas o null si no hay métricas disponibles
      // Ejemplo: { distancia: 10, tiempo: 120, calorias: 500, hitos: 3, actividad: 'correr' }
      const userId =  await AsyncStorage.getItem('@fiufit_userId');
      try {
        const metricsProgress = await goalsService.getMetricsProgress(userId, period);
        setMetrics(metricsProgress);
      } catch (error) {
          console.error("Error on chaning training rating: ", error);
      }
      return null;
    };

    const getGoals = async () => {
      try {
          setLoading(true);
          const response = await goalsService.get();
          if (response) {
              let aux_goals = [];
              let completedGoals = [];
              response.forEach(goal => {
                  console.log(goal);
                  if (goal.objective <= goal.progress) {
                      completedGoals.push(goal);
                  } else {
                      aux_goals.push(goal);
                  }
              });
              setCompletedGoals(aux_completedGoals);
              setGoals(completedGoals.concat(aux_goals));
              setLoading(false)
          }
      } catch (error) {
          throw new Error(error);
      }
    };

    try {
      setLoading(true);
      getMetrics();
      getGoals();
    } catch(error) {  
        console.log("An error in fetching metrics: ", error);
    }finally {
      setLoading(false);
    }
  }, [period]); 

  return (
    <View style={styles.container}>
        <Text style={{...fiufitStyles.titleText,
                          alignSelf: 'center',
                          marginTop: 10,
                      }}>
                          Your Progress
                      </Text>
        <Text style={styles.periodText}>Choose the period to visualize your progress</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.periodButton} onPress={() => changePeriod(1)}>
            <Text style={styles.buttonText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.periodButton} onPress={() => changePeriod(7)}>
            <Text style={styles.buttonText}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.periodButton} onPress={() => changePeriod(30)}>
            <Text style={styles.buttonText}>Month</Text>
          </TouchableOpacity>
      </View>
      {loading ? (
                    <ActivityIndicator size="large" color={theme.colors.secondary} style={{flex: 1}}/>
                ) :
            <View>
              {metrics &&
                <View>
                  <Text style={styles.metricText}>Time: {metrics.time > 1 ? `${metrics.time} days` : `${metrics.time} day`}</Text>
                  <Text style={styles.metricText}>Distance: {metrics.distance} km</Text>
                  <Text style={styles.metricText}>Lost_weight: {metrics.lost_weight} kcal</Text>
                  <Text style={styles.metricText}>Number of milestones achieved: {metrics.hitos}</Text>
                </View>
              } 
              {!metrics && <Text style={styles.noMetricsText}>There are no metrics available for the selected period.</Text>}
            </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: primaryColor,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: tertiaryColor,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  metricText: {
    fontSize: 16,
    marginBottom: 8,
    color: secondaryColor,
  },
  noMetricsText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: secondaryColor,
  },
  buttonText: {
    fontSize: 16,
    color: tertiaryColor,
    textAlign: 'center',
  },
  periodText: {
    fontSize: 18,
    marginBottom: 8,
    color: secondaryColor,
    textAlign: 'center',
  },
  periodButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: secondaryColor,
    borderRadius: 5,
  },
});

export default DashboardScreen;