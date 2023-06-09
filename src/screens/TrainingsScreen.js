import axios from "axios";
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    View,
    ToastAndroid,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, secondaryColor, tertiaryColor, redColor, greyColor} from "../consts/colors";
import { ActivityIndicator, FAB, IconButton, List, useTheme } from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import {
    getTrainingsTypes, getTrainingsByTrainerId, validateForm, trimUserData
} from "../services/TrainingsService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import requests from "../consts/requests";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {UserService} from "../services/userService";
import {decode} from "base-64";

const TrainingItem = ({value, editable, onChange}) => {
    return (
        <View style={fiufitStyles.trainingItemContainer}>
            <TextInput
                style={editable ? fiufitStyles.trainingInput : fiufitStyles.trainingNotEditableInpunt}
                value={value}
                onChangeText={onChange}
                editable={editable}
            />
        </View>
    )
}

const TrainingsScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [editable, setEditable] = useState(false);
    const [errors, setErrors] = useState({});
    const [trainingTypes, setTrainingTypes] = useState({});
    const [isTrainer, setIsTrainer] = useState(true);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);

    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
    };

    const [trainings, setTrainings] = useState([]);
    const [expandedList, setExpandedList] = useState(trainings && trainings.map(() => false));

    /* const [trainings, setTrainings] = useState([
        {
            trainer_id: "Ju6JXm1S8rVQf7C18mqL418JdgE2",
            title: "Super arms",
            description: "training for arms",
            type: "Arm",
            difficulty: "Easy",
            media: "a_firebase_id",
            exercises: [
                {
                    name: "Arnold press",
                    type: "Arm",
                    count: 1,
                    series: 2
                },
                {
                    name: "Hammer curl",
                    type: "Arm",
                    count: 5,
                    series: 10
                }
            ],
            id: 5,
            rating: 0,
            blocked: false
        },
        {
            trainer_id: "Ju6JXm1S8rVQf7C18mqL418JdgE2",
            title: "Super arms 2",
            description: "training for arms",
            type: "Arm",
            difficulty: "Easy",
            media: "a_firebase_id",
            exercises: [
                {
                    name: "Arnold press",
                    type: "Arm",
                    count: 1,
                    series: 2
                },
                {
                    name: "Hammer curl",
                    type: "Arm",
                    count: 5,
                    series: 10
                }
            ],
            id: 5,
            rating: 0,
            blocked: false
        },
        {
            trainer_id: "Ju6JXm1S8rVQf7C18mqL418JdgE2",
            title: "Super arms 3",
            description: "training for arms",
            type: "Arm",
            difficulty: "Easy",
            media: "a_firebase_id",
            exercises: [
                {
                    name: "Arnold press",
                    type: "Arm",
                    count: 1,
                    series: 2
                },
                {
                    name: "Hammer curl",
                    type: "Arm",
                    count: 5,
                    series: 10
                }
            ],
            id: 5,
            rating: 0,
            blocked: false
        }
    ]); */

    // Hook to fetch training types and user trainings
    useEffect(() => {
        fetchTrainingTypes()
            .catch(error => {
                setLoading(false);
                console.log(error);
                setDialog(false);
            });
        fetchGetTrainingsById()
            .catch(error => {
                setLoading(false);
                console.log(error);
                setDialog(false);
            });
    }, []);
    
    const fetchTrainingTypes = async () => {
        const response = await getTrainingsTypes();
        setTrainingTypes(response);
    };

    const fetchGetTrainingsById = async () => {
        try {
            setLoading(true);
            let userId = await AsyncStorage.getItem('@fiufit_userId');
            let response = null;

            try {
                const profile = await UserService.getUser();
                const isTrainerResult = !profile.is_athlete;
                await AsyncStorage.setItem('@is_trainer', isTrainerResult.toString());
                setIsTrainer(!profile.is_athlete);
            } catch(error) {
                console.log("Something went wrong while fetching user data. Please try again later.");
            }
            if(!isTrainer) {
                response = await UserService.getTrainingsByUserId(userId);
            } else {
                const trainer_id = userId;
                response = await getTrainingsByTrainerId(trainer_id);
            }
            const trainingsWithRating = await getMyRating(response);
            setTrainings(trainingsWithRating);
            setLoading(false)
        } catch (error) {
            console.log('Error while fetching trainings: ', error);
        }
    };


    const handlePress = (index) => {
        const newList = [...expandedList];
        newList[index] = !newList[index];
        setExpandedList(newList);
    }

    const handleInputChange = (index, field, text) => {
        const newTrainings = [...trainings];
        newTrainings[index][field] = text;
        setTrainings(newTrainings);
      };

    const handleEditAction = (index) => {
        setEditable(true);
    }

    const handleSaveAction = (index) => {
        /* handleError(null, 'title')
        handleError(null, 'media')

        trimUserData(trainings[index]);
        if (!validateForm(trainings[index])) {
            return;
        } */
        updateTraining(index);   
        setEditable(false);
    };

    const handleCancelAction = () => {
        setEditable(false);
    };

    const handleNext = () => {
        navigation.navigate('CreateTraining');
    }

    const pickImage = async (index) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            handleInputChange(index, "media", result.assets[0].uri);
        }
    };

    const updateTraining = async (index) => {
        const copyTraining = {title: trainings[index].title, description: trainings[index].description, media: trainings[index].media};
    
        const token = await AsyncStorage.getItem('@fiufit_token');
        try {
            const response = await axios.patch(`${requests.BASE_URL}${requests.TRAINING}/${trainings[index].id}`, JSON.stringify(copyTraining),
            {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                }
              });
            ToastAndroid.show("Training updated successfully", ToastAndroid.SHORT);
            setEditable(false);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    const getMyRating = async (trainingsList) => {
        const newTrainings = [...trainingsList];
        for (let training of newTrainings) {
            const myRating = await UserService.getUserRaiting(training.id);
            training.myRating = myRating;
          }
        return newTrainings;
    };

    const handleStarPress = async (index, starNumber) => {
        const newTrainings = [...trainings];
        const updatedTraining = { ...newTrainings[index] };

        if (updatedTraining.rating === starNumber) {
            updatedTraining.rating = 0;
        } else {
            updatedTraining.rating = starNumber;
        }

        try {
            await UserService.rateTraining(updatedTraining.id, updatedTraining.rating);
        } catch (error) {
            console.log(error);
            updatedTraining.rating = starNumber;
        }

        newTrainings[index] = updatedTraining;
        setTrainings(newTrainings);
    };

    const renderStar = (index, starNumber) => {
        const training = trainings[index];
        const isSelected = training.rating >= starNumber;
        const iconName = isSelected ? 'star' : 'star-outline';
        const color = isSelected ? tertiaryColor : greyColor;
      
        return (
          <TouchableOpacity onPress={() => handleStarPress(index, starNumber)}>
            <Icon name={iconName} size={20} color={color} />
          </TouchableOpacity>
        );
      };

    return (
        <View style={fiufitStyles.container}>
            {loading ? (
                    <ActivityIndicator size="large" color={theme.colors.secondary} style={{flex: 1}}/>
                )
                : <ScrollView contentContainerStyle={{flexGrow: 1}}>
                    <Text style={{...fiufitStyles.titleText,
                        alignSelf: 'center',
                        marginTop: 10,
                    }}>
                        Trainings
                    </Text>
                    {trainings?.length === 0 && (
                        <Text style={{
                            alignSelf: 'center',
                            marginTop: 10,
                            color: tertiaryColor,
                            fontSize: 20,
                        }}>
                            You have no trainings yet, add one!
                        </Text>
                    )}
            
                    {trainings && trainings.map((training, index) => (
                        <List.Accordion
                            key={index}
                            style={fiufitStyles.trainingsList}
                            left={(props) => <List.Icon {...props} icon="bike" />}
                            title={training.title}
                            titleStyle={{ color: primaryColor }}
                            expanded={expandedList[index]}
                            onPress={() => handlePress(index)}
                        >
                            {isTrainer && !editable && 
                                <TouchableOpacity
                                    style={fiufitStyles.editButton}
                                    onPress={handleEditAction}
                                >
                                    <IconButton
                                        icon="pencil"
                                        iconColor={tertiaryColor}
                                        style={{backgroundColor: secondaryColor}}
                                        size={30}
                                    />
                                </TouchableOpacity>
                            }  
                            {training.rating >= 0 ?<Text style={styles.ratingText}>Global training rating: {training.rating}</Text> : null}
                            <View style={fiufitStyles.ratingContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.ratingText}>My rating: </Text> 
                                    {renderStar(index, 1)}
                                    {renderStar(index, 2)}
                                    {renderStar(index, 3)}
                                    {renderStar(index, 4)}
                                    {renderStar(index, 5)}
                                </View>
                            </View>
                            <TrainingItem
                                value={training.title}
                                editable={editable}
                                onChange={(text) => handleInputChange(index, "title", text)}
                                rating={training.rating}
                            />
                            <TrainingItem
                                value={training.description}
                                editable={editable}
                                onChange={(text) => handleInputChange(index, "description", text)}
                            />
                            <TrainingItem
                                value={trainings[index].type}
                                editable={false}
                            />
                            {isTrainer && editable && 
                                <Picker
                                    selectedValue={training.difficulty}
                                    style={fiufitStyles.trainingPickerSelect}
                                    onValueChange={(itemValue) => handleInputChange(index, 'difficulty', itemValue)}
                                >
                                    <Picker.Item label="Easy" value="Easy" />
                                    <Picker.Item label="Medium" value="Medium" />
                                    <Picker.Item label="Hard" value="Hard" />
                                </Picker>
                            }
                            {!editable && <TrainingItem
                                value={trainings[index].difficulty}
                                editable={editable}
                                onChange={(text) => handleInputChange(index, "difficulty", text)}
                            />
                            }
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
                            {isTrainer && editable && training.media &&
                                    <Image source={{uri: training.media}}
                                            style={{
                                                width: 120,
                                                height: 120,
                                                marginTop: 10,
                                                borderRadius: 5,
                                            }}/>
                                }
                            {isTrainer && editable && <View>
                                    <Text style={{
                                        color: tertiaryColor,
                                        marginBottom: -7,
                                        marginTop: 10,
                                    }}>Image (optional)</Text>
                                    <PapperButton onPress={() => pickImage(index)}
                                            style={fiufitStyles.imagePickerButton}>
                                        <Icon name={"camera"} style={{
                                            fontSize: 22,
                                            color: secondaryColor,
                                            marginRight: 10,
                                        }}/>
                                    </PapperButton>
                                </View>
                            } 
                            {isTrainer && editable && 
                                <View style={fiufitStyles.trainingButtonContainer}>
                                    <TouchableOpacity style={{...fiufitStyles.trainingActionButton, marginRight: 5}} onPress={() => handleSaveAction(index)}>
                                        <Text style={fiufitStyles.trainingActionButtonText}>{'Save'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={fiufitStyles.trainingActionButton} onPress={handleCancelAction}>
                                        <Text style={fiufitStyles.trainingActionButtonText}>{'Cancel'}</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </List.Accordion>
                    ))}
            
                    {isTrainer ? <FAB
                        icon="plus"
                        type="contained-tonal"
                        style={fiufitStyles.addTrainingButton}
                        size={45}
                        onPress={handleNext}
                        color={tertiaryColor}
                    />
                    : null
                    }
                    
                </ScrollView>
        }
        </View>
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

  export default TrainingsScreen;