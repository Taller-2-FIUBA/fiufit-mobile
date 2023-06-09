import {View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image
} from "react-native";
import React, {useEffect, useState} from "react";
import { Searchbar } from 'react-native-paper';
import { getTrainingsTypes, getTrainingByTrainerTypeDifficultyAndTitle } from "../services/TrainingsService";
import {Picker} from '@react-native-picker/picker';
import Button from "../components/Button";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, secondaryColor, tertiaryColor, redColor, greyColor} from "../consts/colors";
import { ActivityIndicator, IconButton, List, useTheme } from 'react-native-paper';
import {UserService} from "../services/userService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showImage} from "../services/imageService";
import FastImage from "react-native-fast-image";

const SearchTrainingsScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const theme = useTheme();

  const [notFound, setNotFound] = React.useState(false);
  const [trainingTypes, setTrainingTypes] = React.useState({});
  const [trainingType, setTrainingType] = React.useState('');
  const [trainingDifficulty, setTrainingDifficulty] = React.useState('Easy');
  const [trainings, setTrainings] = React.useState([]);
  const [expandedList, setExpandedList] = useState(trainings && trainings.map(() => false));
  const [isAthlete, setIsAthlete] = useState(true);
  const [loading, setLoading] = useState(false);

  const toogleExpanded = (index) => {
    const newList = [...expandedList];
    newList[index] = !newList[index];
    setExpandedList(newList);
  }

  const onChangeSearch = query => setSearchQuery(query);

  const handleSearch= async () => {
    setLoading(true);
    const response = await getTrainingByTrainerTypeDifficultyAndTitle(trainingType, trainingDifficulty, searchQuery);
    await transformTrainings(response);
    setNotFound(response?.length === 0);
    setLoading(false);
  };

  const transformTrainings = async (trainings) => {
    let trainingsWithFavourite = trainings;
    if (isAthlete) {
      trainingsWithFavourite = await checkFavourites(trainings);
    }
    setTrainings(trainingsWithFavourite);
  }

  useEffect(() => {
    const fetchTrainingTypes = async () => {
      const response = await getTrainingsTypes();
      setTrainingTypes(response);
    };

    const isTrainerCheck = async () => {
      const isTrainer = await AsyncStorage.getItem('@fiufit_is_trainer');
      setIsAthlete(isTrainer === 'false');
    };

    fetchTrainingTypes();
    isTrainerCheck();
  }, []);

  const checkFavourites = async (trainings) => {
    let favouritesTrainings = [];
    try {
        const userId = await AsyncStorage.getItem('@fiufit_userId');
        favouritesTrainings = await UserService.getTrainingsByUserId(userId);
    } catch (error) {
      console.error('Error while checking favourites training: ', error);
    }
    const favouritesIds = favouritesTrainings.map(favourite => favourite.id);
    const newTrainings = trainings.map(training => {
      training.favourite = favouritesIds.includes(training.id);
      return training;
    });
    return newTrainings;
  }

  const toggleFavourite = async (trainingId, index) => {
    for (let i = 0; i < trainings.length; i++) {
      if (trainings[i].id === trainingId) {
          trainings[i].favourite = !trainings[i].favourite;
          break;
      }
    }
    setTrainings([...trainings]);
  }

  const handleFavouriteTraining = async (trainingId, index) => {
    try {
        await UserService.addFavouriteTraining(trainingId);
        toggleFavourite(trainingId, index);
    } catch (error) {
        console.error('Error while adding favourites trainings: ', error);
    }
  }

  const handleUnfavouriteTraining = async (trainingId, index) => {
    try {
        await UserService.deleteFavouriteTraining(trainingId);
        toggleFavourite(trainingId, index);
    } catch (error) {
        console.error('Error while deleting favourite trainings: ', error);
    }
  }

  const TrainingItem = ({value}) => {
    return (
      <View style={fiufitStyles.trainingItemContainer}>
          <TextInput
            style={fiufitStyles.trainingNotEditableInpunt}
            value={value}
            editable={false}
          />
      </View>
    )
  }

  const FavouriteIcon = ({training, index}) => {
    const isFavourite = training.favourite;
    return (
      <TouchableOpacity
        onPress={() => isFavourite
          ? handleUnfavouriteTraining(training.id, index) 
          : handleFavouriteTraining(training.id, index)}
      >
        <IconButton
          icon= {isFavourite ? "heart" : "heart-outline"}  
          iconColor={tertiaryColor}
          style={{backgroundColor: secondaryColor}}
          size={20}
        />
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView style={{backgroundColor: primaryColor}}>
      <Searchbar
        placeholder="Search"
        onSubmitEditing={handleSearch}
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={{backgroundColor: tertiaryColor, marginTop: 5}}
      />
      <View style={{flex: 1, justifyContent: 'space-evenly', flexDirection: 'row',  paddingTop: 10}}>
        <Picker
            label="Type"
            selectedValue={trainingType}
            style={fiufitStyles.trainingPickerSelect}
            onValueChange={(itemValue) => setTrainingType(itemValue)}
        >
            {trainingTypes && trainingTypes.length > 0 && trainingTypes.map(trainingType => (
                <Picker.Item key={trainingType} label={trainingType} value={trainingType} />
            ))}
        </Picker>
        <Picker
            label="difficulty"
            selectedValue={trainingDifficulty}
            style={fiufitStyles.trainingPickerSelect}
            onValueChange={(itemValue) => setTrainingDifficulty(itemValue)}
        >
            <Picker.Item label="Easy" value="Easy" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Hard" value="Hard" />
        </Picker>
      </View>
      <Button onPress={handleSearch} title="Search"/>

      {notFound && !loading && (
        <Text style={{ 
          alignSelf: 'center',
          marginTop: 10,
          color: tertiaryColor,
          fontSize: 20 }}>
            There are no results for your search.
        </Text>
      )}
      {loading 
        ? <ActivityIndicator size="large" color={theme.colors.secondary} style={{flex: 1}}/>
        : <View>
          {trainings && trainings.map((training, index) => (
            <List.Accordion
              key={index}
              style={[fiufitStyles.trainingsList, {alignSelf: 'center'}]}
              left={(props) => <List.Icon {...props} icon="bike" />}
              title={training.title}
              titleStyle={{ color: primaryColor }}
              expanded={expandedList[index]}
              onPress={() => toogleExpanded(index)}
            >
              <View style={styles.ratingAndFavContainer}>
                {training.rating >= 0 ?<Text style={styles.ratingText}>Global training rating: {training.rating}</Text> : null}
                {isAthlete && 
                  <FavouriteIcon training={training} index={index}/>
                }
              </View>
                  
              <TrainingItem value={training.title}/>
              <TrainingItem value={training.description}/>
              <TrainingItem value={trainings[index].type}/>
              <TrainingItem value={trainings[index].difficulty}/>
              <View key={training.id}>
                  <Text style={{color: greyColor,
                      fontSize: 18,
                      marginVertical: 10,
                      marginRight: 1,
                  }}>
                      Exercises:
                  </Text>
                  {training.exercises.map((exercise, index) => (
                  <View key={index} style={{paddingBottom: 10}}>
                      <Text style={{ color: greyColor }}>{exercise.name} {exercise.unit ? `[${exercise.unit}]` : ''}</Text>
                      <View style={fiufitStyles.exerciseDetails}>
                          <Text style={{ color: greyColor }}>{`Count: ${exercise.count}`}</Text>
                          <Text style={{ color: greyColor }}>{`Series: ${exercise.series}`}</Text>
                      </View>
                  </View>
                  ))}
              </View>
              {training.media &&
                <FastImage 
                  source={{
                    uri: showImage(training.media),
                    priority: FastImage.priority.normal
                  }}
                  style={{
                      width: 120,
                      height: 120,
                      marginTop: 10,
                      borderRadius: 5,
                  }}
                />
                }
            </List.Accordion>
          ))}
        </View>
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    ratingAndFavContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: 320,
      minHeight: 60,
    },
    ratingText: {
      color: greyColor,
      justifyContent: 'flex-start',
      paddingTop: 10,
      paddingBottom: 10
    },
});

export default SearchTrainingsScreen