import {
    SafeAreaView, ScrollView,
    Text,
    View
} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor} from "../consts/colors";
import Button from "../components/Button";
import TrainingInput from "../components/TrainingInput";
import {
    getTrainingsTypes, getExercises,
    validateForm, trimUserData
} from "../services/TrainingsService";

const CreateTrainingScreen = () => {
    const navigation = useNavigation();
    const [errors, setErrors] = useState({});
    const [trainingTypes, setTrainingTypes] = useState({});
    const [trainingExercises, setTrainingExercises] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [training, setTraining] = useState({
        title: '',
        description: '',
        type: '',
        difficulty: 'easy',
        media: '',
        exercises: [],
    });

    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
    };

    useEffect(() => {
        const fetchTrainingTypes = async () => {
            console.log("Fetching trainings types...");
            const response = await getTrainingsTypes();
            setTrainingTypes(response);
        };
    
        fetchTrainingTypes();
    }, []);

    useEffect(() => {
        const fetchExercises = async () => {
            console.log("Fetching exercises...");
            const response = await getExercises();
            console.log(response);
            setTrainingExercises(response);
        };
    
        fetchExercises();
    }, []);

    const handleInputChange = (key, value) => {
        setTraining({...training, [key]: value});
        console.log('setSelectedExercises');

        if (key === 'type' && trainingExercises && trainingExercises.length > 0) {
            console.log('setSelectedExercises');
            console.log(trainingExercises.filter(exercise => exercise.type === value));
            setSelectedExercises(trainingExercises.filter(exercise => exercise.type === value));
            setTraining(prevState => ({
              ...prevState,
              exercises: trainingExercises.filter(exercise => exercise.type === value).map(() => ({})),
            }));
        }
    };

    const handleExerciseInputChange = (index, key, value) => {
        const updatedExercises = [...training.exercises];
        updatedExercises[index][key] = value;
        setTraining(prevState => ({...prevState, exercises: updatedExercises}));
    };

    const addExercise = (exercise) => {
        setTraining(prevState => ({
            ...prevState,
            exercises: [...prevState.exercises, exercise],
        }));
    };

    const removeExercise = (index) => {
        setTraining(prevState => ({
            ...prevState,
            exercises: prevState.exercises.filter((_, i) => i !== index),
        }));
    };

    const handleCreate = () => {
        handleError(null, 'title')
        handleError(null, 'media')

        trimUserData(training);
        if (!validateForm(training)) {
            return;
        }
        createTraining(training);
        navigation.navigate('Trainings');
    }

    return (
        <View style={fiufitStyles.container}>
            <SafeAreaView style={{
            backgroundColor: primaryColor,
            flex: 1,
        }}>
                <ScrollView contentContainerStyle={{
                    paddingTop: 40, paddingHorizontal: 20,
                }}>
                    <Text style={[fiufitStyles.titleText, {marginTop: -25}]}>
                        Training
                    </Text>
                    <Text style={fiufitStyles.detailsText}>
                        Enter your details to register a training
                    </Text>
                    <View>
                        <TrainingInput
                            label="Title"
                            placeholder="Enter a title"
                            value={training.title}
                            error={errors.title}
                            onChangeText={text => handleInputChange('title', text)}
                        />
                        <TrainingInput
                            label="Description"
                            placeholder="Enter a description"
                            value={training.description}
                            onChangeText={text => handleInputChange('description', text)}
                        />
                        <Picker
                            label="Type"
                            selectedValue={training.type}
                            style={fiufitStyles.trainingPickerSelect}
                            onValueChange={(itemValue) => handleInputChange('type', itemValue)}
                        >
                            {trainingTypes && trainingTypes.length > 0 && trainingTypes.map(trainingType => (
                                <Picker.Item key={trainingType} label={trainingType} value={trainingType} />
                            ))}
                        </Picker>
                        <Picker
                            label="difficulty"
                            selectedValue={training.difficulty}
                            style={fiufitStyles.trainingPickerSelect}
                            onValueChange={(itemValue) => handleInputChange('difficulty', itemValue)}
                        >
                            <Picker.Item label="easy" value="easy" />
                            <Picker.Item label="medium" value="medium" />
                            <Picker.Item label="hard" value="hard" />
                        </Picker>
                        {<TrainingInput
                            label="Media"
                            placeholder="Enter media link"
                            value={training.media}
                            onChangeText={text => handleInputChange('media', text)}
                        />}
                        {training.type && (
                            <View>
                                <Text style={fiufitStyles.detailsText}>
                                    Add Exercises:
                                </Text>
                                {selectedExercises.map((exercise, index) => (
                                    <View key={index}>
                                    <Text>{exercise.name} {exercise.unit? `[${exercise.unit}]` : ''}</Text>
                                        <View style={fiufitStyles.inlineBlock}>
                                            <TrainingInput
                                                label="Count"
                                                placeholder="Enter count"
                                                value={training.exercises[index].count}
                                                onChangeText={text => handleExerciseInputChange(index, 'count', text)}
                                            />
                                            <TrainingInput
                                                label="Series"
                                                placeholder="Enter series"
                                                value={training.exercises[index].series}
                                                onChangeText={text => handleExerciseInputChange(index, 'series', text)}
                                            />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                        <Button onPress={handleCreate} title="Register"/>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default CreateTrainingScreen