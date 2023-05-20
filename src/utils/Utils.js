import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from "react-native";

const Utils = {
    parseWeight(value) {
        if (value.length > 0) {
            const regex = /^[0-9]*$/;
            if (!regex.test(value)) {
                return value.substring(0, value.length - 1);
            }
        }

        return value;
    },

    async handleUnauthorized(navigation) {
        await AsyncStorage.removeItem('@fiufit_token');
        await AsyncStorage.removeItem('@fiufit_userId');
        Alert.alert("Session expired", "Please login again");
        navigation.replace("Login");
    },

    async getUserId() {
        return await AsyncStorage.getItem('@fiufit_userId');
    }
}

export default Utils;
