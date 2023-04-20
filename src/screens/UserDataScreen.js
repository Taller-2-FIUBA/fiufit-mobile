import {
    SafeAreaView, ScrollView,
    Text,
    View
} from 'react-native'
import {
    validateLocation,
    validateName, validateNameLength,
    validateUsername, validateUsernameLength
} from "../utils/validations";
import {useNavigation} from "@react-navigation/native";
import React, {useState} from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor} from "../consts/colors";
import Input from "../components/Input";
import Button from "../components/Button";

const UserDataScreen = ({route}) => {
    const navigation = useNavigation();

    const [errors, setErrors] = useState({});

    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
    };

    const [user, setUser] = useState({
        email: route.params.email,
        password: route.params.password,
        name: '',
        surname: '',
        username: '',
        location: '',
    });

    const handleInputChange = (key, value) => {
        setUser({...user, [key]: value});
    };

    const validateForm = (user) => {
        let valid = true;
        const validationData = [
            {value: user.name, validator: validateName, errorMessage: 'Invalid name', field: 'name'},
            {value: user.name, validator: validateNameLength, errorMessage: 'Name must be at least 2 characters long', field: 'name'},
            {value: user.surname, validator: validateName, errorMessage: 'Invalid surname', field: 'surname'},
            {
                value: user.surname,
                validator: validateNameLength,
                errorMessage: 'Surname must be at least 2 characters long',
                field: 'surname'
            },
            {
                value: user.username,
                validator: validateUsernameLength,
                errorMessage: 'Username must be at least 4 characters long',
                field: 'username'
            },
            {value: user.username, validator: validateUsername, errorMessage: 'Invalid username', field: 'username'},
            {value: user.location, validator: validateLocation, errorMessage: 'Invalid location', field: 'location'},
        ];

        for (const {value, validator, errorMessage, field} of validationData) {
            if (!validator(value)) {
                handleError(errorMessage, field);
                valid = false;
            }
        }

        return valid;
    }

    const trimUserData = (user) => {
        for (const key in user) {
            user[key] = user[key].trim();
        }
    }

    const handleNext = () => {
        handleError(null, 'name')
        handleError(null, 'surname')
        handleError(null, 'username')
        handleError(null, 'location')

        trimUserData(user);
        if (!validateForm(user)) {
            return;
        }

        navigation.navigate('UserBiologics', {user: user});
    }

    return (
        <SafeAreaView style={{
            backgroundColor: primaryColor,
            flex: 1,
        }}>
            <ScrollView contentContainerStyle={{
                paddingTop: 50, paddingHorizontal: 20,
            }}>
                <Text style={[fiufitStyles.titleText, {marginTop: -25}]}>
                    Register
                </Text>
                <Text style={fiufitStyles.detailsText}>
                    Enter your details to register
                </Text>
                <View style={{marginVertical: 20}}>
                    <Input
                        label="Name"
                        iconName={"account-outline"}
                        placeholder="Enter your name"
                        onChangeText={text => handleInputChange('name', text)}
                        error={errors.name}
                    />
                    <Input
                        label="Surname"
                        iconName={"account-outline"}
                        placeholder="Enter your surname"
                        onChangeText={text => handleInputChange('surname', text)}
                        error={errors.surname}
                    />
                    <Input
                        label="Username"
                        iconName={"account-tie"}
                        placeholder="Enter your username"
                        onChangeText={text => handleInputChange('username', text)}
                        error={errors.username}
                    />

                    <Input
                        label="Location (optional)"
                        iconName={"map-marker"}
                        placeholder="Enter your location"
                        onChangeText={text => handleInputChange('location', text)}
                        error={errors.location}
                    />
                    <Button onPress={handleNext} title="Next"/>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default UserDataScreen
