import {axiosInstance} from "./config/axiosConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import requests from "../consts/requests";

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
            console.log('response: ', response.data);
            return response.data;
        } catch (error) {
            console.log("NOT_FOUND 404");
            return {};
        }
    }
}
