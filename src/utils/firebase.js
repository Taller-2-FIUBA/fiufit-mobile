import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";


const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_API_ID
}

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const getFirebaseToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: process.env.FIREBASE_VAPID_KEY });
    if (!currentToken) {
      console.log("No registration token available. Request permission to generate one.");
    }
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }
};

export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await getFirebaseToken();
    }
  } catch (error) {
    console.log("An error occurred while getting user permission. ", error);
  }
};

export const db = getFirestore(app);
export const isSupported = messaging.isSupported();

