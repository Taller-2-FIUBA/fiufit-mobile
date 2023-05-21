import {axiosInstance} from "./config/axiosConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import requests from "../consts/requests";

const authService = {
    storeSensitiveData: async function (response) {
        const token = response.data.token;
        const userId = response.data.id;
        await AsyncStorage.setItem('@fiufit_token', token);
        await AsyncStorage.setItem('@fiufit_userId', userId);
    },

    async login(user) {
        try {
            const response = await axiosInstance.post(requests.LOGIN, user);
            await this.storeSensitiveData(response);
            return response.data;
        } catch (error) {
            throw new Error(error.response.status.toString());
        }
    },

    async loginWithGoogle(user, googleToken) {
        try {
            axiosInstance.headers.Authorization = `${googleToken}`;
            const response = await axiosInstance.post(requests.GOOGLE_LOGIN, user);
            await this.storeSensitiveData(response);
            return response.data;
        } catch (error) {
            if (error.response.data.message()) {
                throw new Error(error.response.data.message());
            } else {
                throw new Error(StatusCodes[error.response.status] + " " + error.response.status);
            }
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

    async registerWithGoogle(user, googleToken) {
        try {
            axiosInstance.headers.Authorization = `${googleToken}`;
            await axiosInstance.post(requests.GOOGLE_SIGNUP, user);
            await this.loginWithGoogle(user.email, googleToken);
        } catch (error) {
            throw new Error(StatusCodes[error.response.status] + " " + error.response.status);
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
