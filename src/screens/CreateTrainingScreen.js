import {
    SafeAreaView, ScrollView,
    Text,
    View
} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from "@react-navigation/native";
import React, {useState} from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, secondaryColor, tertiaryColor} from "../consts/colors";
import Button from "../components/Button";
import TrainingInput from "../components/TrainingInput";
import {
    validateForm, trimUserData
} from "../services/TrainingsService";

const CreateTrainingScreen = () => {
    const navigation = useNavigation();
    const [errors, setErrors] = useState({});

    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
    };

    const trainingTypes = [ "cardio", "arms", "legs", "chest"];
    const exercises = [["walk", "km"], ["walk", "minute"], ["jumping jacks", "repetitions"]];

    const [training, setTraining] = useState({
        title: '',
        description: '',
        type: '',
        difficulty: 'easy',
        media: '',
        exercise: '',
    });

    const handleInputChange = (key, value) => {
        setTraining({...training, [key]: value});
    };

    const handleCreate = () => {
        handleError(null, 'title')
        handleError(null, 'media')

        trimUserData(training);
        if (!validateForm(training)) {
            return;
        }
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

                        <TrainingInput
                            label="Type"
                            placeholder="Enter a training type"
                            value={training.type}
                            onChangeText={text => handleInputChange('type', text)}
                        />
                        <Picker
                            selectedValue={training.type}
                            style={fiufitStyles.trainingPickerSelect}
                            onValueChange={(itemValue) => handleInputChange('type', itemValue)}
                        >
                            {trainingTypes.map(trainingType => (
                                <Picker.Item label={trainingType} value={trainingType} />
                            ))}
                        </Picker>
                        <Picker
                            selectedValue={training.difficulty}
                            style={fiufitStyles.trainingPickerSelect}
                            onValueChange={(itemValue) => handleInputChange('difficulty', itemValue)}
                        >
                            <Picker.Item label="easy" value="easy" />
                            <Picker.Item label="medium" value="medium" />
                            <Picker.Item label="hard" value="hard" />
                        </Picker>
                        <TrainingInput
                            label="Media"
                            placeholder="Enter media link"
                            value={training.media}
                            onChangeText={text => handleInputChange('media', text)}
                        />
                        <Picker
                            selectedValue={training.exercises}
                            style={fiufitStyles.trainingPickerSelect}
                            onValueChange={(itemValue) => handleInputChange('exercise', itemValue)}
                        >
                            {exercises.map(([exercise, measure], index) => {
                                const label = `${exercise} ${measure}`;
                                return (
                                    <Picker.Item key={index} label={label} value={`${exercise},${measure}`}/>
                                );
                            })}
                        </Picker>
                        <Button onPress={handleCreate} title="Register"/>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default CreateTrainingScreen