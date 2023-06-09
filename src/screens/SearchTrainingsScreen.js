import {View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
} from "react-native";
import React, {useEffect, useState} from "react";
/* import { Searchbar } from 'react-native-paper'; */
import {useNavigation} from "@react-navigation/native";
import { getTrainingsTypes, getTrainingByTypeAndDifficulty } from "../services/TrainingsService";
import {Picker} from '@react-native-picker/picker';
import Button from "../components/Button";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, secondaryColor, tertiaryColor, redColor, greyColor} from "../consts/colors";
import { ActivityIndicator, FAB, IconButton, List, useTheme } from 'react-native-paper';
import {UserService} from "../services/userService";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  /* const [searchQuery, setSearchQuery] = React.useState(''); */
  const theme = useTheme();

  const [notFound, setNotFound] = React.useState(false);
  const [trainingTypes, setTrainingTypes] = React.useState({});
  const [trainingType, setTrainingType] = React.useState('');
  const [trainingDifficulty, setTrainingDifficulty] = React.useState('Easy');
  const [trainings, setTrainings] = React.useState([]);
  const [expandedList, setExpandedList] = useState(trainings && trainings.map(() => false));
  const [favourite, setFavourite] = useState(false);
  const [isTrainer, setIsTrainer] = useState(true);
  const [loading, setLoading] = useState(false);

  const handlePress = (index) => {
    const newList = [...expandedList];
    newList[index] = !newList[index];
    setExpandedList(newList);
  }

 /*  const navigation = useNavigation(); */

  /* const onChangeSearch = query => setSearchQuery(query); */

  const handleSearch= async () => {
    console.log('IS TRAINER: ', isTrainer);
    setLoading(true);
    const response = await getTrainingByTypeAndDifficulty(trainingType, trainingDifficulty);
    if (!isTrainer) {
        const trainingsFavourites = await checkFavourites(response.items);
    }
    setTrainings(response);
    setNotFound(response?.items?.length === 0);
    setLoading(false);

  };

  useEffect(() => {
        const fetchTrainingTypes = async () => {
            const response = await getTrainingsTypes();
            setTrainingTypes(response);
    };

    fetchTrainingTypes();
  }, []);

  useEffect(() => {
        const isTrainerCheck = async () => {
            const isTrainer = await AsyncStorage.getItem('@is_trainer');
            setIsTrainer(isTrainer);
        };
    
        isTrainerCheck();
  }, []);

  const checkFavourites = async (trainings) => {
    console.log('trainings: ', trainings);

    let favourites = [];
    try {
        const userId = await AsyncStorage.getItem('@fiufit_userId');
        console.log('userId: ', userId);

        favourites = await UserService.getTrainingsByUserId(userId);
        console.log('favourites: ', favourites);

    } catch (error) {
        console.log('Error while checking favourites training: ', error);
    }
    const newTrainings = trainings.map(training => {
        if (favourites.includes(training.id)) {
            training.favourite = true;
        } else {
            training.favourite = false;
        }
        return newTrainings;
    });
  }

  const handleFavouriteTraining = async (trainingId) => {
    try {
        await UserService.addFavouriteTraining(trainingId);
    } catch (error) {
        console.log('Error while fetching trainings: ', error);
    }
  }

  return (
    <ScrollView style={{backgroundColor: primaryColor}}>
     {/*  <Searchbar
        placeholder="Search"
        onSubmitEditing={handleSearch}
        onChangeText={onChangeSearch}
        value={searchQuery}
      /> */}
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
      <Button onPress={handleSearch} title="Search"/>

      {notFound && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text>There are no results for your search.</Text>
        </View>
      )}
      {/* {trainings && trainings.length > 0 && trainings.map(training => (
        <View key={training.id} style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{padding: 10, backgroundColor: secondaryColor, color: tertiaryColor}}>{
              training.title}
            </Text>
        </View>
      ))
      } */}
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
                    <TrainingItem
                        value={training.title}
                    />
                    <TrainingItem
                        value={training.description}
                    />
                    <TrainingItem
                        value={trainings[index].type}
                    />
                    <TrainingItem
                        value={trainings[index].difficulty}
                    />
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
                            <Image source={{uri: training.media}}
                                    style={{
                                        width: 120,
                                        height: 120,
                                        marginTop: 10,
                                        borderRadius: 5,
                                    }}/>
                        }
                    {!isTrainer && !training.favourite &&
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
                      {!isTrainer && training.favourite &&
                        <TouchableOpacity
                            style={fiufitStyles.editButton}
                            onPress={() => handleUnfavouriteTraining(training.id)}
                        >
                            <IconButton
                            icon="heart"
                            iconColor={redColor}
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