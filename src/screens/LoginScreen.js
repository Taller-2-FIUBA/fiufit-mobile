import {Alert, Image, Keyboard, SafeAreaView, ScrollView, Text, View} from "react-native";
import {primaryColor, tertiaryColor} from "../consts/colors";
import {useNavigation} from "@react-navigation/native";
import React, {useState} from "react";
import {validateEmail} from "../utils/validations";
import Input from "../components/Input";
import Button from "../components/Button";
import {fiufitStyles} from "../consts/fiufitStyles";
import {baseURL, loginURI} from "../consts/requests";

let userId = null;
export {userId};

const LoginScreen = () => {
    const navigation = useNavigation();

    const [inputs, setInputs] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (key, value) => {
        setInputs({ ...inputs, [key]: value });
    };

    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
    };

    const handleLogin = () => {
        Keyboard.dismiss();
        handleError(null, 'email');
        handleError(null, 'password');

        let valid = true;
        if (!validateEmail(inputs.email)) {
            handleError('Invalid email', 'email');
            valid = false;
        }

        if (!inputs.password) {
            handleError('Invalid password', 'password');
            valid = false;
        }

        if (valid) {
            //login(inputs);
            navigation.navigate('Trainings');
        }
    }

    const login = (inputs) => {
        console.log("Logging in");
        fetch(baseURL + loginURI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputs)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.error) {
                    Alert.alert(data.error);
                } else if (data.id) {
                    userId = data.id;
                    console.log("Login successful");
                    navigation.navigate('Trainings');
                } else {
                    Alert.alert(data.detail);
                }
            })
            .catch(error => {
                console.log(error);
                Alert.alert(error.message);
            });
    }

    return (
        <SafeAreaView style={{
            backgroundColor: primaryColor,
            flex: 1,
        }}>
            <ScrollView contentContainerStyle={{
                paddingTop: 50, paddingHorizontal: 20,
            }}>
                <Image
                    source={require('../../resources/logo.png')}
                    style={[fiufitStyles.logo, {alignSelf: 'center', marginBottom: 20}]}
                />
                <Text style={{
                    color: tertiaryColor,
                    fontSize: 20,
                    fontWeight: 'bold',
                }}>
                    Login
                </Text>
                <Text style={fiufitStyles.detailsText}>
                    Enter your details to login
                </Text>
                <View style={{marginVertical: 20}}>
                    <Input
                        label="Email"
                        iconName="email-outline"
                        placeholder="Email address"
                        onChangeText={text => handleInputChange('email', text)}
                        error={errors.email}
                        keyboardType="email-address"
                    />
                    <Input
                        label="Password"
                        iconName="lock-outline"
                        placeholder="Password"
                        password
                        onChangeText={text => handleInputChange('password', text)}
                        error={errors.password}
                    />
                    <Button onPress={handleLogin} title="Login"/>
                    <Text
                        onPress={() => navigation.navigate('SignUp')}
                        style={fiufitStyles.haveAccount}>Do not have an account? Sign up</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default LoginScreen;
