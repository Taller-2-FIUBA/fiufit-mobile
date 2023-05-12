import {BASE_URL} from '@env';

const requests = {
    BASE_URL: process.env.BASE_URl,
    LOGIN: '/users/login',
    GOOGLE_LOGIN: '/login/usersIDP',
    SIGNUP: '/users',
    GOOGLE_SIGNUP: '/usersIDP',
    USER: '/users',
    TRAINING: '/trainings',
}

export default requests;
