import {Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import React, {useState} from 'react'
import {validateEmail} from "../utils/validations"
import {useNavigation} from "@react-navigation/native"
import { Image } from 'react-native'
import {baseURL, loginURI} from "../consts/requests";
import {styles} from "../consts/styles";

let userId = null;
export {userId};

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation();

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

        console.log("Logging in");
        fetch(baseURL + loginURI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    Alert.alert(data.error);
                } else {
                    userId = data.id;
                    navigation.navigate('Trainings');
                }
            })
            .catch(error => {
                console.log(error);
                Alert.alert(error.message);
            });
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
