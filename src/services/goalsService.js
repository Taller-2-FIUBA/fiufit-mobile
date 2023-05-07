import axios from "axios";

const goalsService = {
    async create(goal) {
        try {
            const response = await axios.post("test", goal);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    async getByUserId(userId) {
        try {
            const response = await axios.get(`/users/${userId}/goals`, userId);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    async getMetrics() {
        try {
            const response = await axios.get(`/goals/metrics`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    async update(goal) {
        try {
            const response = await axios.patch(`/goals/${goal.id}`, goal);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    async deleteById(goalId) {
        try {
            const response = await axios.delete(`/goals/${goalId}`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
}
