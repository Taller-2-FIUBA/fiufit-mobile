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
    validateLocation,
    validateName, validateNameLength,
    validateUsername, validateUsernameLength
} from "../utils/validations";
import Input from "../components/Input";

const CreateTrainingScreen = () => {
    const navigation = useNavigation();
    const [errors, setErrors] = useState({});

    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
    };

    const [training, setTraining] = useState({
        title: '',
        description: '',
        type: '',
        difficulty: 'easy',
        media: '',
        goal: '',
    });

    const handleInputChange = (key, value) => {
        setTraining({...training, [key]: value});
    };

    const validateForm = (user) => {
        let valid = true;
        const validationData = [
            {value: training.title, validator: validateName, errorMessage: 'Invalid title', field: 'title'},
            {value: training.description, validator: validateNameLength, errorMessage: 'Description must be at least 2 characters long', field: 'description'},
            {value: training.type, validator: validateName, errorMessage: 'Invalid type', field: 'type'},
        ];

        for (const {value, validator, errorMessage, field} of validationData) {
            if (!validator(value)) {
                handleError(errorMessage, field);
                valid = false;
            }
        }

        return valid;
    }

    const trimUserData = (training) => {
        for (const key in training) {
            training[key] = training[key].trim();
        }
    }


    const handleCreate = () => {
        handleError(null, 'title')
        handleError(null, 'description')
        handleError(null, 'type')

        trimUserData(training);
        if (!validateForm(training)) {
            return;
        }
        navigation.navigate('Trainings');
    }

    const createTraining = (training) => {
        fetch(baseURL + trainings, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    Alert.alert(data.error);
                }

                ToastAndroid.show("Training created successfully", ToastAndroid.SHORT);
                navigation.navigate('Trainings');
            })
            .catch(error => {
                console.log(error);
                Alert.alert(error.message);
                navigation.navigate('Login');
            });
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
                            error={errors.description}
                            onChangeText={text => handleInputChange('description', text)}
                        />

                        <TrainingInput
                            label="Type"
                            placeholder="Enter a training type"
                            value={training.type}
                            error={errors.type}
                            onChangeText={text => handleInputChange('type', text)}
                        />
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
                        <TrainingInput
                            label="Goals"
                            value={training.media}
                            onChangeText={text => handleInputChange('goal', text)}
                        />
                        <Button onPress={handleCreate} title="Register"/>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default CreateTrainingScreen