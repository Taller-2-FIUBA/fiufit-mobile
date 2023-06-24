import * as Notifications from 'expo-notifications';
import {Alert, ToastAndroid} from "react-native";
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const registerForPushNotificationsAsync = async () => {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }
    token = (await Notifications.getDevicePushTokenAsync()).data;
    console.log(token);

  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
}

const sendPushNotification = async (token, message) => {
    const messageToSend = {
        to: token,
        priority: 'normal',
        data: {
            title: message.title,
            message: message.message,
            experienceId: '@fiufit_grupo_5/fiufit_mobile',
            scopeKey:'@fiufit_grupo_5/fiufit_mobile',
            body: message.body,
        }
      };
    
    await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
                Authorization: `key=${process.env.FIREBASE_SERVER_KEY}`,
        },
        body: JSON.stringify(messageToSend),
    });
}

export const sendNotification =  async (userId, message) => {
    const docRef = doc(db, "notificationTokens", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const tokens = docSnap.data().tokens;
        tokens.forEach(token => {
            sendPushNotification(token, message);
        });
    }
}
  

export const removeNotificationSubscription = (ref) => {
    Notifications.removeNotificationSubscription(ref);
}


export const notificationListenerSubscriber = () => {
    return Notifications.addNotificationReceivedListener(notification => {
        ToastAndroid.showWithGravity(notification.request.content.title + ": "+ notification.request.content.body , ToastAndroid.SHORT, ToastAndroid.TOP);
    });
}

export const responseListenerSubscriber = (navigation) => {
    return Notifications.addNotificationResponseReceivedListener(response => {
        if (response.notification.request.content.data?.type === 'PrivateChat') {
            const chatInfo = response.notification.request.content.data?.chatInfo;
            if (chatInfo) {
                navigation.navigate("PrivateChat", {chatInfo});
            }
        }
    });
}

export const registerToken = async (user) => {
    const token = await registerForPushNotificationsAsync();
    if (token) {
        const docRef = doc(db, "notificationTokens", user.id.toString());
        const docSnap = await getDoc(docRef);
        let tokens = [];

        if (docSnap.exists()) {
            tokens = docSnap.data().tokens;
            if (!tokens.includes(token)) {
                tokens.push(token);
            }
            await updateDoc(docRef, {tokens: tokens});
        } else {
            await setDoc(docRef, {tokens: [token]});
        }
        await AsyncStorage.setItem('@actual_notification_token', token);
        await AsyncStorage.setItem('@notification_tokens', tokens.join(','));
    } else {
        Alert.alert("Error", "Something went wrong while registering for push notifications. Please try again later.");
    }
}

export const unregisterToken = async (user) => {
    const token = await AsyncStorage.getItem('@actual_notification_token');
    const docRef = doc(db, "notificationTokens", user.id.toString());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const tokens = docSnap.data().tokens;
        if (tokens.includes(token)) {
            const index = tokens.indexOf(token);
            tokens.splice(index, 1);
            await updateDoc(docRef, {tokens: tokens});
        }
    }
    await AsyncStorage.removeItem('@actual_notification_token');
    await AsyncStorage.removeItem('@notification_tokens');
}
