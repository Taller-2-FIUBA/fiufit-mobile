import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {primaryColor, secondaryColor} from "../consts/colors";
import {userId} from "./LoginScreen";

const HomeScreen = () => {
    const navigation = useNavigation()

    const handleSignOut = () => {
        navigation.navigate("Login")
        // TODO: Pegarle al back.
    }

    return (
        <View style={styles.container}>
            <Text style={styles.buttonText}>
                userId: {userId}
            </Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleSignOut}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Sign out</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: primaryColor,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: secondaryColor,
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})