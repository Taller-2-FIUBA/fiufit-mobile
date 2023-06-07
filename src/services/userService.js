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

    async getUserById(userId) {
        try {
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
}
