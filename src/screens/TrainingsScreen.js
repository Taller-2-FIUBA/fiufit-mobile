import axios from "axios";
import {
    SafeAreaView, ScrollView,
    Text,
    TextInput,
    View,
    ToastAndroid,
    TouchableOpacity,
} from 'react-native'
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, secondaryColor, tertiaryColor, redColor, greyColor} from "../consts/colors";
import { FAB, IconButton, List } from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import {
    getTrainingsTypes, getExercises, getTrainingsByTrainerId, validateForm, trimUserData
} from "../services/TrainingsService";
import ExerciseInput from "../components/ExerciseInput";
import AsyncStorage from '@react-native-async-storage/async-storage';
import requests from "../consts/requests";

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
    const navigation = useNavigation();
    const [editable, setEditable] = useState(false);
    const [errors, setErrors] = useState({});
    const [trainingTypes, setTrainingTypes] = useState({});

    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
    };

    const [trainings, setTrainings] = useState([]);

    /* const [trainings, setTrainings] = useState([
        {
            trainer_id: "Ju6JXm1S8rVQf7C18mqL418JdgE2",
            tittle: "Super arms",
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
            tittle: "Super arms 2",
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
            tittle: "Super arms 3",
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

    useEffect(() => {
        const fetchTrainingTypes = async () => {
            console.log("Fetching trainings types...");
            const response = await getTrainingsTypes();
            setTrainingTypes(response);
        };
    
        fetchTrainingTypes();
    }, []);

    useEffect(() => {
        const fetchGetTrainingsByTrainerId = async () => {
            console.log("Fetching trainings...");
            const trainer_id = "Ju6JXm1S8rVQf7C18mqL418JdgE4";
            const response = await getTrainingsByTrainerId(trainer_id);
            console.log("Trainings: ", response);
            setTrainings(response);
        };
    
        fetchGetTrainingsByTrainerId();
    }, []);

    const [expandedList, setExpandedList] = useState(trainings.map(() => false));

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

    const updateTraining = async (index) => {
        const copyTraining = {tittle: trainings[index].tittle, description: trainings[index].description, media: trainings[index].media};
        let userId = await AsyncStorage.getItem('@fiufit_userId');

        console.log('userId:', userId);
        console.log('Training to update:', copyTraining);
    
        const token = await AsyncStorage.getItem('@fiufit_token');
        console.log('token:', token);
        console.log(`${requests.BASE_URL}${requests.TRAINING}/${trainings[index].id}`);
        try {
            const response = await axios.patch(`${requests.BASE_URL}${requests.TRAINING}/${trainings[index].id}`, JSON.stringify(copyTraining),
            {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                }
              });
            console.log('Updated training:', response);
            ToastAndroid.show("Training updated successfully", ToastAndroid.SHORT);
            setEditable(false);
            setTrainings(trainings.push(copyTraining));
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    return (
            <ScrollView contentContainerStyle={fiufitStyles.container}>
            <Text style={{
                        ...fiufitStyles.titleText,
                        alignSelf: 'center',
                        marginTop: 10,
                    }}>
                        Trainings
                    </Text>
                    {trainings.length === 0 && (
                        <Text style={{
                            alignSelf: 'center',
                            marginTop: 10,
                            color: tertiaryColor,
                            fontSize: 20,
                        }}>
                            You have no trainings yet, add one!
                        </Text>
                    )}
    
            {trainings.map((training, index) => (
                <List.Accordion
                key={index}
                style={fiufitStyles.trainingsList}
                left={(props) => <List.Icon {...props} icon="bike" />}
                title={training.tittle}
                titleStyle={{ color: primaryColor }}
                expanded={expandedList[index]}
                onPress={() => handlePress(index)}
                >
                    <TrainingItem
                        value={training.tittle}
                        editable={editable}
                        onChange={(text) => handleInputChange(index, "tittle", text)}
                    />
                    <TrainingItem
                        value={training.description}
                        editable={editable}
                        onChange={(text) => handleInputChange(index, "description", text)}
                    />
                    {/* {editable && 
                        <Picker
                                selectedValue={trainings[index].type}
                                style={fiufitStyles.trainingPickerSelect}
                                onValueChange={(index) => handleInputChange(index, "type", text)}
                            >
                                {trainingTypes && trainingTypes.length > 0 && trainingTypes.map(trainingType => (
                                    <Picker.Item key={trainingType} label={trainingType} value={trainingType} />
                                ))}
                            </Picker>
                    }
                    {!editable && <TrainingItem
                        value={trainings[index].type}
                        editable={editable}
                        onChange={(text) => handleInputChange(index, "type", text)}
                    />
                    } */}
                    <TrainingItem
                        value={trainings[index].type}
                        editable={false}
                    />
                    {editable && 
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
                    {/* <TrainingItem
                        value={trainings[index].media}
                        editable={editable}
                        onChange={(text) => handleInputChange(index, "media", text)}
                    />
                    {errors.media &&
                        <Text style={{color: redColor, fontSize: 14, paddingBottom: 10, textAlign: 'left'}}>{errors.media}</Text>
                    } */}
                    
                    {/* {editable && 
                        <Picker
                            selectedValue={trainings[index].exercises}
                            style={fiufitStyles.trainingPickerSelect}
                            onValueChange={(text) => handleInputChange(index, 'exercise', text)}
                        >
                            {exercises.map(([exercise, measure], index) => {
                                const label = `${exercise} ${measure}`;
                                return (
                                    <Picker.Item key={index} label={label} value={`${exercise},${measure}`}/>
                                );
                            })}
                        </Picker>
                    }
                    {!editable && <TrainingItem
                        value={trainings[index].exercises}
                        editable={editable}
                        onChange={(text) => handleInputChange(index, "exercises", text)}
                    />
                    } */}
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
                    {!editable && 
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
                    {editable && 
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
    
            <FAB
                icon="plus"
                type="contained-tonal"
                style={fiufitStyles.addTrainingButton}
                size={45}
                onPress={handleNext}
                color={tertiaryColor}
            />
        </ScrollView>
    );
  };
  
  export default TrainingsScreen;