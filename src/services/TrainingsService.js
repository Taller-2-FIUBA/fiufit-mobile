import axios from "axios";
import {
    validateName, validateTrainingNameLength,
    validateMediaUrl
} from "../utils/validations";
import requests from "../consts/requests";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusCodes} from "http-status-codes";
import {UserService} from "../services/userService";
import {axiosInstance} from "./config/axiosConfig";
import {
    ToastAndroid
} from "react-native";
import { encode } from 'base-64';

const createTraining = async (training) => {
    training.exercises = training.exercises.filter(exercise => Object.keys(exercise).length !== 0);
    let userId = await AsyncStorage.getItem('@fiufit_userId');

    //training['trainer_id'] = "Ju6JXm1S8rVQf7C18mqL418JdgE5";
    training['trainer_id'] = userId;

    const token = await AsyncStorage.getItem('@fiufit_token');

    //training.media = training.media ? encode(training.media) : null;

    console.log(JSON.stringify(training));
      
    try {
        const response = await axios.post(`${requests.BASE_URL}${requests.TRAINING}`, JSON.stringify(training),
        {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });
        ToastAndroid.show("Training created successfully", ToastAndroid.SHORT);
        return response.data;
    } catch (error) {
        console.log(error);
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

const getTrainingsByTrainerId = async (trainer_id) => {
    try {
        const token = await AsyncStorage.getItem('@fiufit_token');
        const response = await axios.get(`${requests.BASE_URL}${requests.TRAINING}?trainer_id=${trainer_id}`,
        {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });        
        return response.data.items;
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

export {createTraining, getTrainingsByUserId, getTrainingsByTrainerId, getTrainingsTypes, getExercises, validateForm, trimUserData, getTrainingByTypeAndDifficulty}
