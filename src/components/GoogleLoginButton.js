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
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: process.env.ANDROID_CLIENT_ID
    });

    useEffect(() => {
        handleSignInWithGoogle().then(r => {console.log(r)});
    }, [response]);

    const handleSignInWithGoogle = async () => {
        if (response?.type === 'success') {
            await getUserInfo(response.authentication.accessToken);
            authService.loginWithGoogle(userInfo.email, response.authentication.accessToken).then(() => {
                console.log("logged in with google");
                navigation.replace('Trainings');
            }).catch(error => {
                if (error.message && error.message === "No IDP user with such an email") {
                    navigation.replace('Register');  // TODO: Pasar el email con un contexto
                }
                console.log(error);
                Alert.alert("Error logging in", "Something went wrong. Please try again.");
            });
        }
    }

    const getUserInfo = async (token) => {
        if (!token) {
            return;
        }
        try {
            const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const user = await response.json();
            setUserInfo(user);
            console.log(JSON.stringify(user));
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Button
            style={fiufitStyles.googleButon}
            icon="google"
            mode="contained"
            textColor={theme.colors.secondary}
            onPress={() => {
                promptAsync().then(() => {
                });
            }}
            disabled={!request}
        >
            Sign in with Google
        </Button>
    )
}

export default GoogleLoginButton;
