import {axiosInstance} from "./config/axiosConfig";

const goalsService = {
    async create(goal) {
        try {
            const response = await axiosInstance.post("test", goal);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    async getByUserId(userId) {
        try {
            const response = await axiosInstance.get(`/users/${userId}/goals`, userId);
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

    async deleteById(goalId) {
        try {
            const response = await axiosInstance.delete(`/goals/${goalId}`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
}

export default goalsService;
