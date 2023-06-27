import axios from "axios";
import {
    validateTrainingName, validateTrainingNameLength,
    validateDescriptionLength
} from "../utils/validations";
import requests from "../consts/requests";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {axiosInstance} from "./config/axiosConfig";
import {
    ToastAndroid
} from "react-native";
import {encodeImage} from "./imageService";

const createTraining = async (training) => {
    training.exercises = training.exercises.filter(exercise => Object.keys(exercise).length !== 0);
    let userId = await AsyncStorage.getItem('@fiufit_userId');

    training['trainer_id'] = userId;

    const token = await AsyncStorage.getItem('@fiufit_token');
    training.media = await encodeImage(training.media);
    console.log('TRAINING: ', training);
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

const getTrainingById = async (trainingId) => {
    try {
        const response = await axiosInstance.get(`${requests.BASE_URL}${requests.TRAINING}/${trainingId}`);
        return response.data;
    } catch (error) {
        console.error("Error in getTrainingById: ", error);
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
        return response.data.items.filter(training => !training.blocked);
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

const getTrainingByTypeDifficultyAndTitle = async (type, difficulty, title) => {
    let url = `${requests.BASE_URL}${requests.TRAINING}`;
    if (title) {
        title = title.trim();
        url += `?title=${title}`;
    } else {
        if (type) {
            url += `?training_type=${type}`;
        } 
        if (difficulty) {
            url += type ? `&difficulty=${difficulty}` : `?difficulty=${difficulty}`;
        }
    }
    try {
        const response = await axios.get(url);
        const trainings = response.data.items.filter(training => !training.blocked);
        if(trainings.length > 0) {
            return trainings;
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
    }
}

const updateTraining = async (training, id) => {
    const token = await AsyncStorage.getItem('@fiufit_token');
    training.media = await encodeImage(training.media);
    try {
        const response = await axios.patch(`${requests.BASE_URL}${requests.TRAINING}/${id}`, JSON.stringify(training),
        {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });
        console.log("Training updated successfully");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

const getValidationData = (training) => {
    const validationData = [
        {value: training.title, validator: validateTrainingName, errorMessage: 'Invalid title', field: 'title'},
        {value: training.title, validator: validateTrainingNameLength, errorMessage: 'Title must be at least 3 characters long', field: 'title'},
        {value: training.description, validator: validateTrainingName, errorMessage: 'Invalid description', field: 'description'},
        {value: training.description, validator: validateDescriptionLength, errorMessage: 'Description must be at least 3 characters long', field: 'description'},
    ];
    return validationData;
}

const trimUserData = (training) => {
    let trimableFields = ['title', 'description'];
    for (const key in trimableFields) {
        if(training[key] !== "" && training[key] !== undefined) {
            training[key] = training[key].trim();
        }
    }
}

export {createTraining, updateTraining, getTrainingsByTrainerId, getTrainingsTypes, getExercises, trimUserData, getTrainingByTypeDifficultyAndTitle, getTrainingById, getValidationData}
