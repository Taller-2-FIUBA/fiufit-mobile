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

    async getMetricsProgress(userId, days) {
        try {
            const response1 = await axiosInstance.get(`${requests.GOALS}/${userId}/metricsProgress/distance?days=${days}`);
            const response2 = await axiosInstance.get(`${requests.GOALS}/${userId}/metricsProgress/fat?days=${days}`);
            const response3 = await axiosInstance.get(`${requests.GOALS}/${userId}/metricsProgress/muscle?days=${days}`);
            //const response4 = await axiosInstance.get(`${requests.GOALS}/${userId}/metricsProgress/steps?days=${days}`);

            console.log(response1.data);
            console.log(response2.data);
            console.log(response3.data);

            return response1.data;
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
