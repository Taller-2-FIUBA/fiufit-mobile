import axios from "axios";

//TODO: Pasar
const create = async (goal) => {
    try {
        const response = await axios.post("test", goal);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

const getByUserId = async (userId) => {
    try {
        const response = await axios.get(`/users/${userId}/goals`, userId);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

const getMetrics = async () => {
    try {
        const response = await axios.get(`/goals/metrics`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

const update = async (goal) => {
    try {
        const response = await axios.patch(`/goals/${goal.id}`, goal);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

const deleteById = async (goalId) => {
    try {
        const response = await axios.delete(`/goals/${goalId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export {create, getByUserId, getMetrics, update, deleteById}
