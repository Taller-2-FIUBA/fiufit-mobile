import {Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import {buttonTextColor, outlineColor, primaryColor, secondaryColor, textBoxColor, textColor} from '../consts/colors';
import {onAuthStateChanged, signInWithEmailAndPassword} from 'firebase/auth';
import {validateEmail} from "../utils/validations";
import {useNavigation} from "@react-navigation/native";
import {auth} from "../config/firebase";
import { Image } from 'react-native';

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation();

    useEffect(() => {
        return onAuthStateChanged(auth, user => {
            if (user) {
                navigation.navigate('Home');
            }
        });
    }, [auth, navigation]);


    const handleSignUpPress = () => {
        navigation.navigate('SignUp');
    }

    const handleLogin = () => {
        if (!validateEmail(email)) {
            Alert.alert('Please enter a valid email address');
            return;
        }

        if (!password) {
            Alert.alert('Please enter your password');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                console.log('User logged in');
                const user = userCredential.user;
                console.log("Logged in with: ", user.email);
            })
            .catch(error => {
                console.log(error);
                Alert.alert(error.message);
            })
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            keyboardVerticalOffset={-200}>
            <Image
                source={require('../../resources/logo.png')}
                style={styles.logo}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder={"Email"}
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder={"Password"}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSignUpPress}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen
const styles = StyleSheet.create({
    logo: {
        height: 150,
        width: 150,
        paddingVertical: 100,
        marginBottom: 40,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: primaryColor,
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: textBoxColor,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        color: textColor,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: secondaryColor,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonOutline: {
        backgroundColor: primaryColor,
        marginTop: 5,
        borderColor: outlineColor,
        borderWidth: 2,
    },
    buttonText: {
        color: buttonTextColor,
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: outlineColor,
        fontWeight: '700',
        fontSize: 16,
    }
})
