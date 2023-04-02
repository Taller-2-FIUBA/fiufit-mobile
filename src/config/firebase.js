// Your web app's Firebase configuration
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "",
    authDomain: "fiufit-auth.firebaseapp.com",
    projectId: "fiufit-auth",
    storageBucket: "fiufit-auth.appspot.com",
    messagingSenderId: "711198003874",
    appId: "1:711198003874:web:da1704e26986895647bdfb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
