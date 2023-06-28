import {axiosInstance} from "./config/axiosConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import requests from "../consts/requests";
import axios from "axios";
import { unregisterToken } from "../utils/notification";
import { Alert } from "react-native";
import {UserService} from "./userService";

const authService = {
    _storeSensitiveData: async function (response) {
        const token = response.data.token;
        const userId = response.data.id;
        await AsyncStorage.setItem('@fiufit_token', token);
        await AsyncStorage.setItem('@fiufit_userId', userId.toString());
        try {
            const user = await UserService.getUser();
            await AsyncStorage.setItem('@fiufit_username', user.username?.toString());
            const isTrainer = !user.is_athlete;
            await AsyncStorage.setItem('@fiufit_is_trainer', isTrainer.toString());
        } catch (error) {
            Alert.alert("Error", "Something went wrong while fetching user data. Please try again later.");
        }
    },

    _handleError: function (error) {
        if (error.response?.data.detail) {
            throw new Error(error.response.data.detail);
        } else if (error.response?.status) {
            throw new Error(error.response.status + " " + error.response.statusText);
        } else {
            throw new Error(error);
        }
    },

    _cleanAsyncStorage: async function () {
        try {
            await AsyncStorage.removeItem('@fiufit_token');
            await AsyncStorage.removeItem('@fiufit_userId');
            await AsyncStorage.removeItem('@fiufit_is_trainer');
        } catch (error) {
            throw new Error("Error deleting sensitive data from device");
        }
    },

    async login(user) {
        try {
            await this._cleanAsyncStorage();
            const response = await axiosInstance.post(requests.LOGIN, user);
            await this._storeSensitiveData(response);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    },

    async register(user) {
        try {
            await this._cleanAsyncStorage();
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
            let google_token = user.google_token;
            delete user.token;
            const response = await axios.post(`${requests.BASE_URL}${requests.GOOGLE_SIGNUP}`,
                user,
                {
                    headers: {Authorization: google_token}
                });
            if (response.data) {
                console.log("Logging in with Google: ", user.email, google_token);
                await this.loginWithGoogle(user.email, google_token)
                    .then(r => {
                        console.log("Logged in with Google: ", r);
                        return r;
                    }
                );
            }
        } catch (error) {
            this._handleError(error);
        }
    },

    async resetPassword(user) {
        try {
            const response = await axiosInstance.post(requests.RESET_PASSWORD, user);
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    },

    async logout() {
        try {
            const userId = await AsyncStorage.getItem('@fiufit_userId');
            await unregisterToken(userId);
            await this._cleanAsyncStorage();
        } catch (error) {
            throw new Error("Error deleting sensitive data from device");
        }
    }
}

export default authService;
