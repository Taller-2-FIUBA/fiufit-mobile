import {Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import React, {useState} from 'react'
import {validateEmail} from "../utils/validations"
import {useNavigation} from "@react-navigation/native"
import { Image } from 'react-native'
import {baseURL, loginURI} from "../consts/requests";
import {fiufitStyles} from "../consts/fiufitStyles";

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
            style={fiufitStyles.container}
            behavior="padding"
            keyboardVerticalOffset={-200}>
            <Image
                source={require('../../resources/logo.png')}
                style={fiufitStyles.logo}
            />
            <View style={fiufitStyles.inputContainer}>
                <TextInput
                    placeholder={"Email"}
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={fiufitStyles.input}
                />
                <TextInput
                    placeholder={"Password"}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={fiufitStyles.input}
                    secureTextEntry
                />
            </View>

            <View style={fiufitStyles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleLogin}
                    style={fiufitStyles.button}
                >
                    <Text style={fiufitStyles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSignUpPress}
                    style={[fiufitStyles.button, fiufitStyles.buttonOutline]}
                >
                    <Text style={fiufitStyles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen
