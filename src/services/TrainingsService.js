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
const createTraining = async (training) => {
    training.exercises = training.exercises.filter(exercise => Object.keys(exercise).length !== 0);
    let userId = await AsyncStorage.getItem('@fiufit_userId');
    console.log('userId:', userId);
    console.log('Training to create:', training);

    training['trainer_id'] = "Ju6JXm1S8rVQf7C18mqL418JdgE2";
    const user = UserService.getUser();
    console.log(`${requests.BASE_URL}${requests.TRAINING}`);
    const token = await AsyncStorage.getItem('@fiufit_token');
    console.log('token:', token);

    try {
        //const response = await axiosInstance.post(`${requests.BASE_URL}${requests.TRAINING}`, JSON.stringify(training));
        const response = await axios.post(`${requests.BASE_URL}${requests.TRAINING}`, JSON.stringify(training),
        {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });
        console.log('created training:', response.data);
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
