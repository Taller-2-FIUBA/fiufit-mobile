import {View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image
} from "react-native";
import React, {useEffect, useState} from "react";
import { Searchbar } from 'react-native-paper';
import { getTrainingsTypes, getTrainingByTypeDifficultyAndTitle } from "../services/TrainingsService";
import {Picker} from '@react-native-picker/picker';
import Button from "../components/Button";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, secondaryColor, tertiaryColor, redColor, greyColor} from "../consts/colors";
import { ActivityIndicator, FAB, IconButton, List, useTheme } from 'react-native-paper';
import {UserService} from "../services/userService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode} from "base-64";

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

const SearchTrainingsScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const theme = useTheme();

  const [notFound, setNotFound] = React.useState(false);
  const [trainingTypes, setTrainingTypes] = React.useState({});
  const [trainingType, setTrainingType] = React.useState('');
  const [trainingDifficulty, setTrainingDifficulty] = React.useState('Easy');
  const [trainings, setTrainings] = React.useState([]);
  const [expandedList, setExpandedList] = useState(trainings && trainings.map(() => false));
  const [favourite, setFavourite] = useState(false);
  const [isAthlete, setIsAthlete] = useState(true);
  const [loading, setLoading] = useState(false);

  const handlePress = (index) => {
    const newList = [...expandedList];
    newList[index] = !newList[index];
    setExpandedList(newList);
  }

  const onChangeSearch = query => setSearchQuery(query);

  const handleSearch= async () => {
    console.log('IS Athlete: ', isAthlete);
    setLoading(true);
    const response = await getTrainingByTypeDifficultyAndTitle(trainingType, trainingDifficulty, searchQuery);
    console.log('RESPONSE: ', response);
    if (isAthlete) {
      await checkFavourites(response);
    }
    setTrainings(response);
    setNotFound(response?.length === 0);
    setLoading(false);

  };

  useEffect(() => {
    const fetchTrainingTypes = async () => {
      const response = await getTrainingsTypes();
      setTrainingTypes(response);
    };

    const isTrainerCheck = async () => {
      const isTrainer = await AsyncStorage.getItem('@is_trainer');
      setIsAthlete(isTrainer === 'false');
    };

    fetchTrainingTypes();
    isTrainerCheck();
  }, []);

  const checkFavourites = async (trainings) => {
    console.log('trainings: ', trainings);

    let favouritesTrainings = [];
    try {
        const userId = await AsyncStorage.getItem('@fiufit_userId');
        console.log('userId: ', userId);

        favouritesTrainings = await UserService.getTrainingsByUserId(userId);
        console.log('favourites: ', favouritesTrainings);

    } catch (error) {
      console.log('Error while checking favourites training: ', error);
    }
    const favouritesIds = favouritesTrainings.map(favourite => favourite.id);
    trainings.map(training => {
      training.favourite = favouritesIds.includes(training.id);
      return training;
    });
  }

  const handleFavouriteTraining = async (trainingId) => {
    try {
        await UserService.addFavouriteTraining(trainingId);
    } catch (error) {
        console.log('Error while adding favourites trainings: ', error);
    }
  }

  const handleUnfavouriteTraining = async (trainingId) => {
    try {
        await UserService.deleteFavouriteTraining(trainingId);
    } catch (error) {
        console.log('Error while deleting favourite trainings: ', error);
    }
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

      {notFound && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text>There are no results for your search.</Text>
        </View>
      )}
      {loading ? (
                    <ActivityIndicator size="large" color={theme.colors.secondary} style={{flex: 1}}/>
                )
                : <View>
      {trainings && trainings.map((training, index) => (
                <List.Accordion
                    key={index}
                    style={[fiufitStyles.trainingsList, {alignSelf: 'center'}]}
                    left={(props) => <List.Icon {...props} icon="bike" />}
                    title={training.title}
                    titleStyle={{ color: primaryColor }}
                    expanded={expandedList[index]}
                    onPress={() => handlePress(index)}
                >
                    {training.rating >= 0 ?<Text style={styles.ratingText}>Global training rating: {training.rating}</Text> : null}
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
                            <Image source={{uri: decode(training.media)}}
                                    style={{
                                        width: 120,
                                        height: 120,
                                        marginTop: 10,
                                        borderRadius: 5,
                                    }}/>
                        }
                    {isAthlete === false && !training.favourite &&
                      <TouchableOpacity
                        style={fiufitStyles.editButton}
                        onPress={() => handleFavouriteTraining(training.id)}
                      >
                      <IconButton
                          icon="heart-outline"
                          iconColor={tertiaryColor}
                          style={{backgroundColor: secondaryColor}}
                          size={30}
                      />
                      </TouchableOpacity>
                    }
                    {isAthlete && training.favourite &&
                      <TouchableOpacity
                          style={fiufitStyles.editButton}
                          onPress={() => handleUnfavouriteTraining(training.id)}
                      >
                          <IconButton
                          icon="heart"
                          iconColor={tertiaryColor}
                          style={{backgroundColor: secondaryColor}}
                          size={30}
                          />
                      </TouchableOpacity>
                    }
                </List.Accordion>
            ))}
            </View>
}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    ratingContainer: {
      paddingBottom: 10,
    },
    ratingText: {
      color: greyColor,
      justifyContent: 'flex-start',
      paddingTop: 10,
      paddingBottom: 10
    },
});

export default SearchTrainingsScreen