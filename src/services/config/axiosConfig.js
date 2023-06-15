import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StatusCodes} from "http-status-codes";
import requests from "../../consts/requests";
import Utils from "../../utils/Utils";

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
        console.log(`Intercepted: ${error.response.status} ${StatusCodes[error.response.status]}`);
        if (error.response.status === StatusCodes.UNAUTHORIZED) {
            await Utils.handleUnauthorized(navigation);
            return;
        }
        return Promise.reject(error);
    }
);
