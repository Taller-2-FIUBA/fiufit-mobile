import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StatusCodes} from "http-status-codes";

let navigation;

export const setNavigation = (nav) => {
    navigation = nav;
}

export const axiosInstance = axios.create({
    baseURL: 'https://users-ingress-taller2-marianocinalli.cloud.okteto.net',  // TODO: pasar a .env
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
        if (response.status === StatusCodes.UNAUTHORIZED) {
            await AsyncStorage.removeItem('@fiufit_token');
            await AsyncStorage.removeItem('@fiufit_userId');
        }
        return response;
    }
);
