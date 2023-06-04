import {axiosInstance} from "./config/axiosConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import requests from "../consts/requests";
import axios from "axios";

const authService = {
    async login(user) {
        try {
            //const response = await axiosInstance.post(requests.LOGIN, user);
            const response = await axios.post(requests.BASE_URL+requests.LOGIN, user);
            const token = response.data.token;
            const userId = response.data.id.toString();

            await AsyncStorage.setItem('@fiufit_token', token);
            await AsyncStorage.setItem('@fiufit_userId', userId);
            return response.data;
        } catch (error) {
            throw new Error(error.response.status.toString());
        }
    },

    async register(user) {
        try {
            const response = await axiosInstance.post(requests.SIGNUP, user);
            return response.data;
        } catch (error) {
            throw new Error(error.response.status.toString());
        }
    },

    async logout() {
        try {
            await AsyncStorage.removeItem('@fiufit_token');
            await AsyncStorage.removeItem('@fiufit_userId');
        } catch (error) {
            throw new Error("Error deleting sensitive data from device");
        }
    }
}

export default authService;
