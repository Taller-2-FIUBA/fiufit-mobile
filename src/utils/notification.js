import * as Notifications from 'expo-notifications';
import {Alert} from "react-native";
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});
  
const sendPushNotification = async (expoPushToken, message) => {
    const messageToSend = {
        to: expoPushToken,
        sound: 'default',
        title: message.title,
        body: message.body,
        data: message.data
      };
    
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
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
  
export const registerForPushNotificationsAsync = async () => {
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
    token = (await Notifications.getExpoPushTokenAsync()).data;
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

export const removeNotificationSubscription = (ref) => {
    Notifications.removeNotificationSubscription(ref);
}


export const notificationListenerSubscriber = () => {
    return Notifications.addNotificationReceivedListener(notification => {
        Alert.alert(notification.request.content.title, notification.request.content.body);
    });
}

export const responseListenerSubscriber = (navigation) => {
    return Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response.notification.request.content.data);
        if (response.notification.request.content.data?.type === 'PrivateChat') {
            const chatInfo = response.notification.request.content.data?.chatInfo;
            if (chatInfo) {
                navigation.navigate("PrivateChat", {chatInfo});
            }
        }
    });
}