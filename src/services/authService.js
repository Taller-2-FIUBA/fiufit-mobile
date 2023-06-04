import {axiosInstance} from "./config/axiosConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import requests from "../consts/requests";
import axios from "axios";

const authService = {
    _storeSensitiveData: async function (response) {
        const token = response.data.token;
        const userId = response.data.id;
        await AsyncStorage.setItem('@fiufit_token', token);
        await AsyncStorage.setItem('@fiufit_userId', userId);
    },

    _handleError: function (error) {
        if (error.response?.data.detail) {
            throw new Error(error.response.data.detail);
        } else {
            throw new Error(error.response.status + " " + error.response.statusText);
        }
    },

    async login(user) {
        try {
            const response = await axiosInstance.post(requests.LOGIN, user);
            await this._storeSensitiveData(response);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    },

    async register(user) {
        try {
            const response = await axiosInstance.post(requests.SIGNUP, user);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    },

    async loginWithGoogle(userEmail, googleToken) {
        try {
            const response = await axios.post(`${requests.BASE_URL}${requests.GOOGLE_LOGIN}`,
                {email: userEmail},
                {
                    headers: {Authorization: googleToken}
                });
            await this._storeSensitiveData(response);
            return response?.data;
        } catch (error) {
            if (error.response?.data?.detail.message === "No IDP user with such an email") {
                throw new Error("Should register IDP user");
            } else {
                this._handleError(error);
            }
        }
    },

    async registerWithGoogle(user) {
        try {
            console.log(JSON.stringify(user, null, 2))
            let google_token = user.google_token;
            delete user.token;
            const response = await axios.post(`${requests.BASE_URL}${requests.GOOGLE_SIGNUP}`,
                user,
                {
                    headers: {Authorization: google_token}
                });
            await this._storeSensitiveData(response);
            return response?.data;
        } catch (error) {
            this._handleError(error);
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
