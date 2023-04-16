import {
    Image,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native'
import React, {useState} from 'react'
import {validateEmail, validatePassword} from "../utils/validations";
import {useNavigation} from "@react-navigation/native";
import {fiufitStyles} from "../consts/fiufitStyles";

const SignUpScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const handleSignUp = () => {
        if (!validateEmail(email)) {
            ToastAndroid.show('Invalid email', ToastAndroid.SHORT);
            return;
        }

        if (!validatePassword(password1) || !validatePassword(password2)) {
            ToastAndroid.show('Password must be at least 6 digits long', ToastAndroid.SHORT);
            return;
        }

        if (password1 !== password2) {
            ToastAndroid.show('Passwords don\'t match', ToastAndroid.SHORT);
            return;
        }

        navigation.navigate('UserData', {email: email, password: password1});
    }

    return (
        <KeyboardAvoidingView style={fiufitStyles.container}
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
                    value={password1}
                    onChangeText={text => setPassword1(text)}
                    style={fiufitStyles.input}
                    secureTextEntry
                />
                <TextInput
                    placeholder={"Repeat password"}
                    value={password2}
                    onChangeText={text => setPassword2(text)}
                    style={fiufitStyles.input}
                    secureTextEntry
                />
            </View>
            <View style={fiufitStyles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleSignUp}
                    style={fiufitStyles.button}
                >
                    <Text style={fiufitStyles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default SignUpScreen
