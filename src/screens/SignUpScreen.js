import {
    Alert,
    Image,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native'
import React, {useEffect, useState} from 'react'
import {validateEmail, validateName, validatePassword} from "../utils/validations";
import {createUserWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import {auth} from "../config/firebase";
import {useNavigation} from "@react-navigation/native";
import {buttonTextColor, primaryColor, secondaryColor, textBoxColor, textColor} from "../consts/colors";

const SignUpScreen = () => {
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
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

    const validateForm = (name, surname, email, password) => {
        const validationData = [
            {value: name, validator: validateName, errorMessage: 'Invalid name'},
            {value: surname, validator: validateName, errorMessage: 'Invalid surname'},
            {value: email, validator: validateEmail, errorMessage: 'Invalid email'},
            {value: password, validator: validatePassword, errorMessage: 'Password must be at least 6 characters long'},
        ];

        for (const {value, validator, errorMessage} of validationData) {
            if (!validator(value)) {
                ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
                return false;
            }
        }

        return true;
    }

    const handleSignUp = () => {
        if (!validateForm(name, surname, email, password)) {
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                console.log("Signed up with: ", user.email);
                //signUpUser(name, surname, email, user.uid);
            })
            .catch(error => {
                console.log(error);
                if (error.code === "auth/email-already-in-use") {
                    Alert.alert("The email address is already in use by another account.");
                } else {
                    Alert.alert(error.message);
                }
            })
    }

    const signUpUser = (name, surname, email, id,) => {
        const endpoint = '';  // TODO: Add endpoint
        const body = JSON.stringify({name, surname, email, id});

        // TODO: id, email, name, surname, date of birth, weight, username, location

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error sending user data');
                }
                console.log('User data sent successfully');
            })
            .catch(error => {
                console.log(error);
                Alert.alert(error.message);
            });
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
                    placeholder={"Name"}
                    value={name}
                    onChangeText={text => setName(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder={"Surname"}
                    value={surname}
                    onChangeText={text => setSurname(text)}
                    style={styles.input}
                />
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
