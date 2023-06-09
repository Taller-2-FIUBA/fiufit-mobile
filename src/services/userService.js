import {axiosInstance} from "./config/axiosConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import requests from "../consts/requests";
import axios from "axios";

export const UserService = {
    async getUser() {
        try {
            let userId = await AsyncStorage.getItem('@fiufit_userId');
            const response = await axiosInstance.get(`${requests.USER}/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.status.toString());
        }
    },

    async updateUser(user) {
        try {
            let userId = await AsyncStorage.getItem('@fiufit_userId');
            const response = await axiosInstance.patch(`${requests.USER}/${userId}`, user);
            return response.data;
        } catch (error) {
            throw new Error(error.response.status.toString());
        }
    },

    async getUserByUsername(username) {
        try {
            const response = await axiosInstance.get(`${requests.USER}?username=${username}`);
            return response.data;
        } catch (error) {
            return {};
        }
    },

    async getTrainingsByUserId(userId) {
        try {
            const response = await axios.get(`${requests.BASE_URL}${requests.USER}/${userId}${requests.TRAINING}`);
            const trainings = response.data.items;
            if(trainings.length > 0) {
                return trainings;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    },

    async addFavouriteTraining(trainingId) {
        let userId = await AsyncStorage.getItem('@fiufit_userId');
        const body = { 'training_id': trainingId }
    
        const token = await AsyncStorage.getItem('@fiufit_token');
    
        try {
            const response = await axios.post(`${requests.BASE_URL}${requests.USER}/${userId}${requests.TRAINING}`, JSON.stringify(body),
            {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                }
              });
            console.log("Training save in favourites successfully", response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    async getFolloweds(userId) {
        try {
            console.log('Fetching followeds for user: ', userId);
            const response = await axiosInstance.get(`${requests.USER}/${userId}/followed`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.status.toString());
        }
    },

    async getFollowers(userId) {
        try {
            console.log('Fetching followers for user: ', userId);
            const response = await axiosInstance.get(`${requests.USER}/${userId}/followers`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.status.toString());
        }
    },

    async followUser(userId, followedId) {
        try {
            console.log('Follow user with id: ', followedId);
            const response = await axiosInstance.post(`${requests.USER}/${userId}/followed/${followedId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.status.toString());
        }
    },

    async deleteFollowed(userId, followedId) {
        try {
            console.log('Delete follow user with id: ', followedId);
            const response = await axiosInstance.delete(`${requests.USER}/${userId}/followed/${followedId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.status.toString());
        }
    },

    async rateTraining(trainingId, rate) {
        let userId = await AsyncStorage.getItem('@fiufit_userId');
        const body = { 'rate': rate }
    
        const token = await AsyncStorage.getItem('@fiufit_token');
    
        try {
            const response = await axios.put(`${requests.BASE_URL}${requests.USER}/${userId}${requests.TRAINING}/${trainingId}`, JSON.stringify(body),
            {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                }
              });
            console.log("Training rated successfully", response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    async getUserRaiting(trainingId) {
        let userId = await AsyncStorage.getItem('@fiufit_userId');
        try {
            const response = await axios.get(`${requests.BASE_URL}${requests.USER}/${userId}${requests.TRAINING}/${trainingId}/rating`);
            return response.data;
        } catch (error) {
            console.log(error);
            return 0;
        }
    }
}
