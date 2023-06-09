import {BASE_URL} from "@env";

const requests = {
    BASE_URL: process.env.BASE_URL,
    LOGIN: '/users/login',
    SIGNUP: '/users',
    USER: '/users',
    TRAINING: '/trainings',
    GOALS: '/goals',
    METRICS: '/goals/metrics',
    WALLET: '/wallet/',
    DEPOSIT: '/users/deposit',
}

export default requests;
