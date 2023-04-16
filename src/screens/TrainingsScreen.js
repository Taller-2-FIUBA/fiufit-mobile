import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {primaryColor, secondaryColor} from "../consts/colors";

const TrainingsScreen = () => {
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <Text style={styles.buttonText}>
                Trainings Screen
            </Text>
        </View>
    )
}

export default TrainingsScreen

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
