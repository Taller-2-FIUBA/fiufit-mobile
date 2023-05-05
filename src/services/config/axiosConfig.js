import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StatusCodes} from "http-status-codes";
import requests from "../../consts/requests";

let navigation;

export const setNavigation = (nav) => {
    navigation = nav;
}

export const axiosInstance = axios.create({
    baseURL: requests.BASE_URL,
    responseType: 'json',
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('@fiufit_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error) => {
        if (error.response.status === StatusCodes.UNAUTHORIZED) {
            await AsyncStorage.removeItem('@fiufit_token');
            await AsyncStorage.removeItem('@fiufit_userId');
        }
        return Promise.reject(error);
    }
);
