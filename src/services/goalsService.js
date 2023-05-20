import {axiosInstance} from "./config/axiosConfig";
import utils from "../utils/Utils";
import requests from "../consts/requests";

const goalsService = {
    async create(goal) {
        try {
            let userId = await utils.getUserId();
            const response = await axiosInstance.post(`${requests.GOALS}/${userId}`, goal);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    async get() {
        try {
            let userId = await utils.getUserId();
            const response = await axiosInstance.get(`${requests.GOALS}/${userId}`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    async getMetrics() {
        try {
            const response = await axiosInstance.get(`${requests.METRICS}`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    async update(goal) {
        try {
            const response = await axiosInstance.patch(`${requests.GOALS}/${goal.id}`, goal);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    async delete(goalId) {
        try {
            const response = await axiosInstance.delete(`${requests.GOALS}/${goalId}`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
}

export default goalsService;
