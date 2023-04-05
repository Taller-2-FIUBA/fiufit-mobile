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
import {buttonTextColor, primaryColor, secondaryColor, textBoxColor, textColor} from "../consts/colors";

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
        <KeyboardAvoidingView style={styles.container}
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
                    value={password1}
                    onChangeText={text => setPassword1(text)}
                    style={styles.input}
                    secureTextEntry
                />
                <TextInput
                    placeholder={"Repeat password"}
                    value={password2}
                    onChangeText={text => setPassword2(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleSignUp}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default SignUpScreen
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
    buttonText: {
        color: buttonTextColor,
        fontWeight: '700',
        fontSize: 16,
    },
})
