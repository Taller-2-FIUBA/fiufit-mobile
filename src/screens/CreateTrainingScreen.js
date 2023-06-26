import {
    Image,
    SafeAreaView, ScrollView,
    Text,
    View
} from 'react-native'
import {
    Button as PapperButton,
    FAB,
} from "react-native-paper";
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, secondaryColor, tertiaryColor} from "../consts/colors";
import Button from "../components/Button";
import TrainingInput from "../components/TrainingInput";
import ExerciseInput from "../components/ExerciseInput";
import {
    getTrainingsTypes, getExercises, createTraining,
    validateForm, trimUserData
} from "../services/TrainingsService";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";



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
        difficulty: 'Easy',
        media: '',
        exercises: [],
    });

    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
    };

    useEffect(() => {
        const fetchTrainingTypes = async () => {
            const response = await getTrainingsTypes();
            setTrainingTypes(response);
        };
    
        fetchTrainingTypes();
    }, []);

    useEffect(() => {
        const fetchExercises = async () => {
            const response = await getExercises();
            console.log(response);
            setTrainingExercises(response);
        };
    
        fetchExercises();
    }, []);

    const handleInputChange = (key, value) => {
        setTraining({...training, [key]: value});
        if (key === 'type' && trainingExercises && trainingExercises.length > 0) {
            setSelectedExercises(trainingExercises.filter(exercise => exercise.type === value));
            setTraining(prevState => ({
              ...prevState,
              exercises: trainingExercises.filter(exercise => exercise.type === value).map(() => ({})),
            }));
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            training.media = result.assets[0].uri;
        }
    };

    const handleExerciseInputChange = (exercise, index, key, value) => {
        const updatedExercises = [...training.exercises];
        updatedExercises[index][key] = parseInt(value);
        updatedExercises[index]['name'] = exercise.name;
        updatedExercises[index]['type'] = exercise.type;
        setTraining(prevState => ({...prevState, exercises: updatedExercises}));
    };

    const handleCreate = () => {
        handleError(null, 'title')
        handleError(null, 'media')

        /* trimUserData(training);
        if (!validateForm(training)) {
            return;
        } */
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
                            <Picker.Item label="Easy" value="Easy" />
                            <Picker.Item label="Medium" value="Medium" />
                            <Picker.Item label="Hard" value="Hard" />
                        </Picker>
                        {training.type && (
                            <View>
                                <Text style={fiufitStyles.detailsText}>
                                    Add Exercises:
                                </Text>
                                {selectedExercises.map((exercise, index) => (
                                    <View key={index}>
                                    <Text style={{color: tertiaryColor}}>{exercise.name} {exercise.unit? `[${exercise.unit}]` : ''}</Text>
                                        <View style={fiufitStyles.exerciseDetails}>
                                            <ExerciseInput
                                                label="Count"
                                                placeholder="Enter count"
                                                value={training.exercises[index].count}
                                                onChangeText={text => handleExerciseInputChange(exercise, index, 'count', text)}
                                            />
                                            <ExerciseInput
                                                label="Series"
                                                placeholder="Enter series"
                                                value={training.exercises[index].series}
                                                onChangeText={text => handleExerciseInputChange(exercise, index, 'series', text)}
                                            />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                        {training.media &&
                            <Image source={{uri: training.media}}
                                    style={{
                                        width: 120,
                                        height: 120,
                                        marginTop: 10,
                                        borderRadius: 5,
                                    }}/>
                        }
                        <View>
                            <Text style={{
                                color: tertiaryColor,
                                marginBottom: -7,
                                marginTop: 10,
                            }}>Image (optional)</Text>
                            <PapperButton onPress={pickImage}
                                    style={fiufitStyles.imagePickerButton}>
                                <Icon name={"camera"} style={{
                                    fontSize: 22,
                                    color: secondaryColor,
                                    marginRight: 10,
                                }}/>
                            </PapperButton>
                        </View>
                        <Button onPress={handleCreate} title="Register"/>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default CreateTrainingScreen