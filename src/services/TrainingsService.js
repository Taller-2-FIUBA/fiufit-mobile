import axios from "axios";


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