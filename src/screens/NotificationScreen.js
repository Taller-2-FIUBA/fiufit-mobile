import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import React, { useEffect } from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, whiteColor} from "../consts/colors";
import { ActivityIndicator, Avatar, useTheme} from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import { doc, onSnapshot} from "firebase/firestore";
import { db } from "../utils/firebase"
import AsyncStorage from "@react-native-async-storage/async-storage";


const NotificationScreen = () => {
    const theme = useTheme();
    const [notifications, setNotifications] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        getNotifications();
    }, []);

    const NotificationViewer = () => {
        const hasNotifications = notifications && notifications.length > 0;
        return (  
            <ScrollView style={{backgroundColor: primaryColor}} >
                {hasNotifications && notifications.map((notification, index) => (
                    <Notification key={index}  notification={notification} />
                ))}
            </ScrollView>
        )
    }

    const getIcon = (type) => {
        switch (type) {
            case "PrivateChat":
                return "forum"
            case "CompletedGoal":
                return "flag-checkered"
            case "Follower":
                return "account-circle"
        }
    }

    const Notification = ({notification}) => {
        const {title, message, type} = notification;

        return (
            <TouchableOpacity style={{...fiufitStyles.notificationContainer, backgroundColor: theme.colors.primary}} onPress={event => handleGoToNotification(event, notification)}>
                <Avatar.Icon size={30} icon={getIcon(type)}
                    color={theme.colors.white}
                    style={{marginLeft: 5, borderWidth: 1, borderColor: primaryColor}}
                />
                <View style={fiufitStyles.notificationInfo}>
                    <Text style={{color: whiteColor, fontSize: 18, fontWeight: 500}}>{title}</Text>
                    <Text style={{color: whiteColor, fontSize: 12}}>{message}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const getNotifications= async () => {
        const userId =  await AsyncStorage.getItem('@fiufit_userId');
        onSnapshot(doc(db, "notifications", userId), async (doc) => {
            let notificationsOnDemand = [];
            if (doc.exists()) {
                for (const notification of doc.data().notifications) {
                    notificationsOnDemand.unshift(notification);
                }
            }
            setNotifications(notificationsOnDemand);
            setIsLoading(false);
        });
    }

    const handleGoToNotification = async (event, notification) => {
        event.preventDefault();
        switch (notification.type) {
            case "PrivateChat":
                const chatInfo = notification.chatInfo
                navigation.navigate("PrivateChat", { chatInfo });
                break;
            case "CompletedGoal":
                navigation.navigate("Goals");
            case "Follower":
                navigation.navigate("Profile");
        }
        
    }

    return (
        <View style={fiufitStyles.container} >
            {isLoading 
                ? <ActivityIndicator size="large" color={theme.colors.secondary} style={{flex: 1, alignSelf: 'center'}}/> 
                : notifications && notifications.length > 0 
                    ? <NotificationViewer/>
                    : <Text style={fiufitStyles.buttonText}>No tienes notificaciones</Text>
            }
        </View>
    )
}

export default NotificationScreen