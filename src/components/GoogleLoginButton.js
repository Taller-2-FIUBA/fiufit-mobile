import {Button, useTheme} from "react-native-paper";
import {useEffect, useState} from "react";
import * as Google from 'expo-auth-session/providers/google';
import {fiufitStyles} from "../consts/fiufitStyles";
import authService from "../services/authService";
import {Alert} from "react-native";
import {ANDROID_CLIENT_ID} from '@env';

const GoogleLoginButton = ({navigation}) => {
    const theme = useTheme();
    const [userInfo, setUserInfo] = useState(null);
    const [token, setToken] = useState(null);
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: process.env.ANDROID_CLIENT_ID
    });

    useEffect(() => {
        handleGetUserInfo();
    }, [response, token]);

    useEffect(() => {
        handleLogin()
            .catch(error => {
                console.log(error.message);
                Alert.alert("Error logging in", "Something went wrong. Please try again.");
            })
    }, [userInfo]);

    const handleGetUserInfo = () => {
        if (response?.type === 'success') {
            setToken(response.authentication.accessToken);
            getUserInfo(token)
                .catch(error => {
                    console.log(error.message);
                    Alert.alert("Error logging in", "Something went wrong. Please try again.");
                });
        }
    }

    const getUserInfo = async (token) => {
        if (!token) return;
        try {
            const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: {Authorization: `Bearer ${token}`},
            });
            setUserInfo(await response.json());
        } catch (e) {
            console.log(e);
        }
    }

    const handleLogin = async () => {
        if (userInfo) {
            authService.loginWithGoogle(userInfo.email, token)
                .then(r => {
                    console.log("Logged in with Google: ", r);
                    navigation.replace('Trainings');
                })
                .catch(error => {
                    if (error?.message === "Should register IDP user") {
                        handleRegister();
                    } else {
                        console.log(error.message);
                        Alert.alert("Error logging in", "Something went wrong. Please try again.");
                    }
                });
        }
    }

    const handleRegister = async () => {
        if (userInfo) {
            authService.registerWithGoogle(userInfo.email, token)
                .then(() => {
                    console.log("Registered with Google");
                    navigation.replace('Trainings');
                })
                .catch(error => {
                    console.log(error.message);
                    Alert.alert("Error signing up", "Something went wrong. Please try again.");
                });
        }
    }

    return (
        <Button
            style={fiufitStyles.googleButton}
            icon="google"
            mode="contained"
            textColor={theme.colors.secondary}
            onPress={async () => {
                await promptAsync();
            }}
            disabled={!request}
        >
            Sign in with Google
        </Button>
    )
}

export default GoogleLoginButton;
