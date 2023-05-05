import {Alert, Image, Keyboard, SafeAreaView, ScrollView, Text, View} from "react-native";
import {primaryColor, tertiaryColor} from "../consts/colors";
import {useNavigation} from "@react-navigation/native";
import React, {useState} from "react";
import {validateEmail} from "../utils/validations";
import Input from "../components/Input";
import Button from "../components/Button";
import {fiufitStyles} from "../consts/fiufitStyles";
import authService from "../services/authService";

const LoginScreen = () => {
    const navigation = useNavigation();

    const [inputs, setInputs] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (key, value) => {
        setInputs({...inputs, [key]: value});
    };

    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
    };

    const validateInputs = () => {
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
        return valid;
    }

    const handleLogin = () => {
        if (validateInputs()) {
            console.log("Logging in");
            authService.login(inputs).then(() => {
                navigation.navigate('Trainings');
            }).catch(error => {
                console.log(error);
                Alert.alert("Error logging in", "Something went wrong. Please try again.");
            });
        }
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
                        onPress={() => navigation.navigate('Registration')}
                        style={fiufitStyles.haveAccount}>Do not have an account? Sign up</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default LoginScreen;
