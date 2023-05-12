import axios from "axios";
import {
    validateName, validateTrainingNameLength,
    validateMediaUrl
} from "../utils/validations";
import requests from "../consts/requests";

const createTraining = async (training) => {
    try {
        const response = await axios.post(baseURL + trainings, JSON.stringify(training));
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
        const response = await axios.get(`${requests.BASE_URL}${userURI}/${userId}${requests.TRAINING}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

const getTrainingsTypes = async () => {
    try {
        const response = await axios.get(`${requests.BASE_URL}${requests.TRAINING}/types/`);
        return response.data.items;
    } catch (error) {
        console.log(error);
    }
}

const getExercises = async () => {
    try {
        const response = await axios.get(`${requests.BASE_URL}${requests.TRAINING}/exercises/`);
        return response.data.items;
    } catch (error) {
        console.log(error);
    }
}

const getTrainingByTypeAndDifficulty = async (type, difficulty) => {
    let url = `${requests.BASE_URL}${requests.TRAINING}`;
    if (type) {
        url += `?training_type=${type}`;
    } 
    if (difficulty) {
        url += type ? `&difficulty=${difficulty}` : `?difficulty=${difficulty}`;
    }
    console.log("Search trainings url: ", url);
    try {
        const response = await axios.get(url);
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

export {createTraining, getTrainingsByUserId, getTrainingsTypes, getExercises, validateForm, trimUserData, getTrainingByTypeAndDifficulty}
