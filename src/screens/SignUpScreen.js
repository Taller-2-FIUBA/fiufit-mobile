import {Keyboard, SafeAreaView, ScrollView, Text, View} from 'react-native';
import {greyColor, primaryColor, tertiaryColor} from "../consts/colors";
import Input from "../components/Input";
import Button from "../components/Button";
import {useNavigation} from "@react-navigation/native";
import {useState} from "react";
import {validateEmail, validatePassword} from "../utils/validations";
import {fiufitStyles} from "../consts/fiufitStyles";

const SignUpScreen = () => {
    const navigation = useNavigation();

    const [inputs, setInputs] = useState({
        email: '',
        password1: '',
        password2: '',
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (key, value) => {
        setInputs({ ...inputs, [key]: value });
    };

    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
    };

    const handleSignUp = () => {
        Keyboard.dismiss();
        let valid = true;

        if (!validateEmail(inputs.email)) {
            handleError('Invalid email', 'email');
            valid = false;
        }

        if (!validatePassword(inputs.password1)) {
            handleError('Invalid password', 'password1');
            valid = false;
        }

        if (!validatePassword(inputs.password2)) {
            handleError('Invalid password', 'password2');
            valid = false;
        } else if (inputs.password1 !== inputs.password2) {
            handleError('Passwords do not match', 'password2');
            valid = false;
        }

        if (valid) {
            navigation.navigate('UserData', {email: inputs.email, password: inputs.password1});
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
                <Text style={{
                    color: tertiaryColor,
                    fontSize: 40,
                    fontWeight: 'bold',
                }}>
                    Register
                </Text>
                <Text style={{
                    color: greyColor,
                    fontSize: 18,
                    marginVertical: 10
                }}>
                    Enter your details to register
                </Text>
                <View style={{marginVertical: 20}}>
                    <Input
                        label="Email"
                        iconName="email-outline"
                        placeholder="Email address"
                        onChangeText={text => handleInputChange('email', text)}
                        error={errors.email}
                        onFocus={() => handleError(null, 'email')}
                    />
                    <Input
                        label="Password"
                        iconName="lock-outline"
                        placeholder="Password"
                        password
                        onChangeText={text => handleInputChange('password1', text)}
                        error={errors.password1}
                        onFocus={() => handleError(null, 'password1')}
                    />
                    <Input
                        label="Password"
                        iconName="lock-outline"
                        placeholder="Confirm password"
                        password
                        onChangeText={text => handleInputChange('password2', text)}
                        error={errors.password2}
                        onFocus={() => handleError(null, 'password2')}
                    />
                    <Button onPress={handleSignUp} title="Register"/>
                    <Text
                        onPress={() => navigation.navigate('Login')}
                        style={fiufitStyles.haveAccount}>Already have an account? Login</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignUpScreen;
