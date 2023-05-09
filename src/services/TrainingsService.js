import axios from "axios";
import {
    validateName, validateTrainingNameLength,
    validateMediaUrl
} from "../utils/validations";

const createTraining = async (training) => {
    try {
        const response = await axios.post(baseURL + trainings, JSON.stringify(user));
        if (response.data.error) {
            Alert.alert(data.error);
        }
        ToastAndroid.show("Training created successfully", ToastAndroid.SHORT);
        navigation.navigate('Trainings');
    } catch (error) {
        console.log(error);
        Alert.alert(error.message);
        navigation.navigate('Login');
    }
}


const getTrainingsByUserId = async (userId) => {
    try {
        const response = await axios.get(`${baseURL}${userURI}/${userId}${trainingsURI}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

const getTrainingsTypes = async () => {
    try {
        const response = await axios.get(`${baseURL}${trainings}/types`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

const getExercises = async () => {
    try {
        const response = await axios.get(`${baseURL}${trainings}/exercises`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

const validateForm = (training) => {
    let valid = true;
    const validationData = [
        {value: training.title, validator: validateName, errorMessage: 'Invalid title', field: 'title'},
        {value: training.title, validator: validateTrainingNameLength, errorMessage: 'Title must be at least 3 characters long', field: 'title'},
        {value: training.media, validator: validateMediaUrl, errorMessage: 'Invalid link', field: 'media'},
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

export {createTraining, getTrainingsByUserId, getTrainingsTypes, getExercises, validateForm, trimUserData}
