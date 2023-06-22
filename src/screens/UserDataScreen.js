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
import React, {useContext, useEffect, useState} from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor} from "../consts/colors";
import Input from "../components/Input";
import Button from "../components/Button";
import UserDataContext from "../contexts/userDataContext";
import {Picker} from '@react-native-picker/picker';
import {UserService} from "../services/userService";

const UserDataScreen = ({navigation}) => {

    const {userData, setUserData} = useContext(UserDataContext);
    const [errors, setErrors] = useState({});
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        getLocations();
    }, []);

    const getLocations = async () => {
        try {
            const response = await UserService.getLocations();
            console.log('LOcations: ', response);
            setLocations(response);
        } catch(error) {
            console.error("Something went wrong while fetching locations. Please try again later.");
        }
    }        

    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
    };

    const handleInputChange = (key, value) => {
        console.log('handleInputChange: ', key, value);
        setUserData({...userData, [key]: value});
    };

    const handleLocationInputChange = (value) => {
        console.log('handleInputChange: ', key, value);
        setUserData({...userData, ['location']: value.location, ['coordinates']: value.coordinates});
    };

    const validateForm = (userData) => {
        let valid = true;
        const validationData = [
            {value: userData.name, validator: validateName, errorMessage: 'Invalid name', field: 'name'},
            {value: userData.name, validator: validateNameLength, errorMessage: 'Name must be at least 2 characters long', field: 'name'},
            {value: userData.surname, validator: validateName, errorMessage: 'Invalid surname', field: 'surname'},
            {
                value: userData.surname,
                validator: validateNameLength,
                errorMessage: 'Surname must be at least 2 characters long',
                field: 'surname'
            },
            {
                value: userData.username,
                validator: validateUsernameLength,
                errorMessage: 'Username must be at least 4 characters long',
                field: 'username'
            },
            {value: userData.username, validator: validateUsername, errorMessage: 'Invalid username', field: 'username'},
            {value: userData.location, validator: validateLocation, errorMessage: 'Invalid location', field: 'location'},
        ];

        for (const {value, validator, errorMessage, field} of validationData) {
            if (!validator(value)) {
                handleError(errorMessage, field);
                valid = false;
            }
        }

        return valid;
    }

    const trimUserData = (userData) => {
        let trimableFields = ['email', 'name', 'surname', 'username', 'location'];
        for (const key of trimableFields) {
            userData[key] = userData[key].trim();
        }
    }

    const handleNext = () => {
        handleError(null, 'name')
        handleError(null, 'surname')
        handleError(null, 'username')
        handleError(null, 'location')

        trimUserData(userData);
        if (!validateForm(userData)) {
            return;
        }

        navigation.navigate('UserBiologics');
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
                    <Picker
                        selectedValue={'location'}
                        style={fiufitStyles.trainingPickerSelect}
                        onValueChange={(itemValue) => handleLocationInputChange(itemValue)}
                    >
                        {locations && locations.map((location, index) => {
                            return <Picker.Item label={location.location} value={location} key={index}/>
                        }
                        )}
                    </Picker>
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
