import {Keyboard, SafeAreaView, ScrollView, Text, View} from 'react-native';
import {primaryColor} from "../consts/colors";
import Input from "../components/Input";
import Button from "../components/Button";
import {useNavigation} from "@react-navigation/native";
import {useContext, useState} from "react";
import {validateEmail, validatePassword} from "../utils/validations";
import {fiufitStyles} from "../consts/fiufitStyles";
import UserDataContext from "../contexts/userDataContext";

const SignUpScreen = () => {
    const navigation = useNavigation();
    const {userData, setUserData} = useContext(UserDataContext);

    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState({});

    const handleInputChange = (key, value) => {
        setUserData({ ...userData, [key]: value });
    };

    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
    };

    const handleNext = () => {
        Keyboard.dismiss();

        handleError(null, 'email')
        handleError(null, 'password1')
        handleError(null, 'password2')

        let valid = true;

        if (!validateEmail(userData.email)) {
            handleError('Invalid email', 'email');
            valid = false;
        }

        if (!validatePassword(password1)) {
            handleError('Invalid password', 'password1');
            valid = false;
        }

        if (!validatePassword(password2)) {
            handleError('Invalid password', 'password2');
            valid = false;
        } else if (password1 !== password2) {
            handleError('Passwords do not match', 'password2');
            valid = false;
        }

        if (valid) {
            handleInputChange('password', password1);
            navigation.navigate('UserData');
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
                <Text style={fiufitStyles.titleText}>
                    Register
                </Text>
                <Text style={fiufitStyles.detailsText}>
                    Enter your email and a password
                </Text>
                <View style={{marginVertical: 20}}>
                    <Input
                        label="Email"
                        iconName="email-outline"
                        placeholder="Email address"
                        onChangeText={text => handleInputChange('email', text.toLowerCase())}
                        keyboardType="email-address"
                        error={errors.email}
                    />
                    <Input
                        label="Password"
                        iconName="lock-outline"
                        placeholder="Password"
                        password
                        onChangeText={text => setPassword1(text)}
                        error={errors.password1}
                    />
                    <Input
                        label="Confirm password"
                        iconName="lock-outline"
                        placeholder="Password"
                        password
                        onChangeText={text => setPassword2(text)}
                        error={errors.password2}
                    />
                    <Button onPress={handleNext} title="Next"/>
                    <Text
                        onPress={() => navigation.navigate('Login')}
                        style={fiufitStyles.haveAccount}>Already have an account? Login</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignUpScreen;
