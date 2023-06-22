import {BASE_URL} from "@env";

const requests = {
    BASE_URL: process.env.BASE_URL,
    LOGIN: '/users/login',
    GOOGLE_LOGIN: '/users/login/usersIDP',
    SIGNUP: '/users',
    GOOGLE_SIGNUP: '/users/usersIDP',
    USER: '/users',
    TRAINING: '/trainings',
    GOALS: '/goals',
    METRICS: '/goals/metrics',
    WALLET: '/wallet',
    DEPOSIT: '/users/deposit',
    BALANCE: '/balance',
    WITHDRAW: '/users/extraction',
}

export default requests;
