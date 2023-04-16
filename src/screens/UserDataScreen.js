import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import {
    validateBirthDate, validateHeight,
    validateLocation,
    validateName, validateNameLength,
    validateUsername, validateUsernameLength, validateWeight
} from "../utils/validations";
import {useNavigation} from "@react-navigation/native";
import {useRef, useState} from "react";
import {baseURL, signUpURI} from "../consts/requests";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {Picker} from "@react-native-picker/picker";
import {fiufitStyles} from "../consts/fiufitStyles";
import {whiteColor} from "../consts/colors";
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import {parseHeight, parseWeight} from "../utils/utils";

const UserDataScreen = ({route}) => {
    const navigation = useNavigation();
    const datePickerRef = useRef();
    const [isPickerVisible, setPickerVisibility] = useState(false);
    const [date, setDate] = useState(null);
    const [height, setHeight] = useState('');

    const togglePicker = () => {
        handleInputChange('height', parseHeight(height));
        setPickerVisibility(!isPickerVisible);
    };

    const onChange = (event, selectedDate) => {
        setDate(selectedDate);
        handleInputChange('birth_date', selectedDate.toISOString().split('T')[0]);
    };

    const heightOptions = [];
    for (let i = 30; i <= 250; i++) {
        heightOptions.push(i + ' cm');
    }

    const showMode = (currentMode) => {
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - 13);
        DateTimePickerAndroid.open({
            value: date || new Date(),
            onChange,
            mode: currentMode,
            is24Hour: true,
            minimumDate: new Date(1940, 0, 1),
            maximumDate: maxDate,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const [user, setUser] = useState(  {
        email: route.params.email,
        password: route.params.password,
        is_athlete: true,
        username: '',
        name: '',
        surname: '',
        height: 0.0,
        weight: 0,
        birth_date: '',
        location: '',
        registration_date: new Date().toISOString().split('T')[0],
    });

    const handleInputChange = (key, value) => {
        if (key === 'weight') {
            value = parseWeight(value);
        }
        setUser({ ...user, [key]: value });
    };

    const validateForm = (user) => {
        const validationData = [
            {value: user.name, validator: validateNameLength, errorMessage: 'Name must be at least 2 characters long'},
            {value: user.name, validator: validateName, errorMessage: 'Invalid name'},
            {value: user.surname, validator: validateNameLength, errorMessage: 'Surname must be at least 2 characters long'},
            {value: user.surname, validator: validateName, errorMessage: 'Invalid surname'},
            {value: user.username, validator: validateUsernameLength, errorMessage: 'Username must be at least 4 characters long'},
            {value: user.username, validator: validateUsername, errorMessage: 'Invalid username'},
            {value: user.height, validator: validateHeight, errorMessage: 'Please select a height'},
            {value: user.weight, validator: validateWeight, errorMessage: 'Weight must be a number between 20 and 400'},
            {value: user.birth_date, validator: validateBirthDate, errorMessage: 'Invalid birth date'},
            {value: user.location, validator: validateLocation, errorMessage: 'Invalid location'},
        ];

        for (const {value, validator, errorMessage} of validationData) {
            if (!validator(value)) {
                Alert.alert(errorMessage);
                return false;
            }
        }

        return true;
    }

    const trimUserData = (user) => {
        for (const key in user) {
            if (user.hasOwnProperty(key) && key !== 'is_athlete' && key !== 'height' && key !== 'weight') {
                user[key] = user[key].trim();
            }
        }
    }

    const handleSignUp = () => {
        trimUserData(user);
        if (!validateForm(user)) {
            return;
        }

        signUpUser(user);
    }

    const signUpUser = (user) => {
        fetch(baseURL + signUpURI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    Alert.alert(data.error);
                    navigation.navigate('Login');
                } else {
                    navigation.navigate('Trainings');
                }
            })
            .catch(error => {
                console.log(error);
                Alert.alert(error.message);
                navigation.navigate('Login');
            });
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
                    placeholder={"Name"}
                    value={user.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                    style={fiufitStyles.input}
                />
                <TextInput
                    placeholder={"Surname"}
                    value={user.surname}
                    onChangeText={(text) => handleInputChange('surname', text)}
                    style={fiufitStyles.input}
                />
                <TextInput
                    placeholder={"Username"}
                    value={user.username}
                    onChangeText={(text) => handleInputChange('username', text)}
                    style={fiufitStyles.input}
                />
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <TouchableOpacity
                        style={fiufitStyles.buttonDate}
                        onPress={togglePicker}
                    >
                        <Text style={{opacity: height ? 1 : 0.6}}>
                            {height ? height: 'Height'}
                        </Text>
                    </TouchableOpacity>
                    <TextInput
                        placeholder={"Weight"}
                        value={user.weight === 0 ? "" : user.weight.toString()}
                        onChangeText={(text) => handleInputChange('weight', text)}
                        style={{
                            ...fiufitStyles.inputHorizontal,
                            marginLeft: 2.5
                        }}
                        keyboardType={"numeric"}
                    />
                </View>
                {!isPickerVisible && (
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                            style={fiufitStyles.buttonDate}
                            onPress={showDatepicker}
                        >
                            <Text style={{ opacity: date ? 1 : 0.6 }}>
                                {date ? date.toISOString().split("T")[0] : "Birthdate"}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1, borderRadius: 10, overflow: 'hidden', height: 50, marginTop: 5, marginLeft: 5 }}>
                            <Picker
                                ref={datePickerRef}
                                selectedValue={user.is_athlete}
                                onValueChange={(itemValue, itemIndex) =>
                                    handleInputChange("is_athlete", itemValue)
                                }
                                style={{
                                    backgroundColor: whiteColor,
                                }}
                            >
                                <Picker.Item label="Athlete" value={true} />
                                <Picker.Item label="Trainer" value={false} />
                            </Picker>
                        </View>
                    </View>)}
                {!isPickerVisible && (
                    <TextInput
                        placeholder={"Location"}
                        value={user.location}
                        onChangeText={(text) => handleInputChange('location', text)}
                        style={fiufitStyles.input}
                    />
                )}
            </View>
            {isPickerVisible && (
                <View
                    style={{marginTop: 5}}>
                    <WheelPickerExpo
                        initialSelectedIndex={140}
                        items={heightOptions.map(name => ({ label: name, value: '' }))}
                        onChange={({ item }) => setHeight(item.label)}
                    />
                    <TouchableOpacity
                        style={fiufitStyles.heightInputConfirmButton}
                        onPress={togglePicker}
                    >
                        <Text style={fiufitStyles.buttonOutlineText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            )}
            {!isPickerVisible && (
                <View style={fiufitStyles.buttonContainer}>
                    <TouchableOpacity
                        onPress={handleSignUp}
                        style={fiufitStyles.button}
                    >
                        <Text style={fiufitStyles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    )
}

export default UserDataScreen
