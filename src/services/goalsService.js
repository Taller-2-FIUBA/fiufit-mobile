import {axiosInstance} from "./config/axiosConfig";
import utils from "../utils/Utils";

const goalsService = {
    async create(goal) {
        try {
            let userId = await utils.getUserId();
            const response = await axiosInstance.post(`/goals/${userId}`, goal);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    async get() {
        try {
            let userId = await utils.getUserId();
            const response = await axiosInstance.get(`/goals/${userId}`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    async getMetrics() {
        try {
            const response = await axiosInstance.get(`/goals/metrics`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    async update(goal) {
        try {
            const response = await axiosInstance.patch(`/goals/${goal.id}`, goal);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    async delete(goalId) {
        try {
            const response = await axiosInstance.delete(`/goals/${goalId}`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
}

export default goalsService;
