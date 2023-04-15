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
import {
    validateHeight, validateLocation,
    validateName,
    validateUsername,
    validateWeight
} from "../utils/validations";
import {useNavigation} from "@react-navigation/native";
import {primaryColor, secondaryColor, tertiaryColor, whiteColor} from "../consts/colors";
import {useRef, useState} from "react";
import {baseURL, signUpURI} from "../consts/requests";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {Picker} from "@react-native-picker/picker";

const UserDataScreen = ({route}) => {
    const navigation = useNavigation();
    const pickerRef = useRef();

    const [date, setDate] = useState(null);

    const onChange = (event, selectedDate) => {
        setDate(selectedDate);
        handleInputChange('birth_date', selectedDate.toISOString().split('T')[0]);
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date || new Date(),
            onChange,
            mode: currentMode,
            is24Hour: true,
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
        setUser({ ...user, [key]: value });
    };

    const validateForm = (user) => {
        const validationData = [
            {value: user.name, validator: validateName, errorMessage: 'Invalid name'},
            {value: user.surname, validator: validateName, errorMessage: 'Invalid surname'},
            {value: user.username, validator: validateUsername, errorMessage: 'Invalid username'},
            {value: user.height, validator: validateHeight, errorMessage: 'Invalid height'},
            {value: user.weight, validator: validateWeight, errorMessage: 'Invalid weight'},
            {value: user.location, validator: validateLocation, errorMessage: 'Invalid location'},
        ];

        for (const {value, validator, errorMessage} of validationData) {
            if (!validator(value)) {
                ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
                return false;
            }
        }

        return true;
    }

    const trimUserData = (user) => {
        for (const key in user) {
            if (user.hasOwnProperty(key) && key !== 'is_athlete') {
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
        navigation.navigate('Home', {user: user});
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
                    navigation.navigate('Home', {userId: data.id});
                }
            })
            .catch(error => {
                console.log(error);
                Alert.alert(error.message);
                navigation.navigate('Login');
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
                    value={user.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder={"Surname"}
                    value={user.surname}
                    onChangeText={(text) => handleInputChange('surname', text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder={"Username"}
                    value={user.username}
                    onChangeText={(text) => handleInputChange('username', text)}
                    style={styles.input}
                />
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <TextInput
                        placeholder={"Height"}
                        value={user.height === 0 ? "" : user.height.toString()}
                        onChangeText={(text) => handleInputChange('height', text)}
                        style={{
                            ...styles.inputHorizontal,
                            marginRight: 2.5
                        }}
                    />
                    <TextInput
                        placeholder={"Weight"}
                        value={user.weight === 0 ? "" : user.weight.toString()}
                        onChangeText={(text) => handleInputChange('weight', text)}
                        style={{
                            ...styles.inputHorizontal,
                            marginLeft: 2.5
                        }}
                    />
                </View>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        style={styles.buttonDate}
                        onPress={showDatepicker}
                    >
                        <Text style={{ opacity: date ? 1 : 0.6 }}>
                            {date ? date.toISOString().split("T")[0] : "Birthdate"}
                        </Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1, borderRadius: 10, overflow: 'hidden', height: 50, marginTop: 5, marginLeft: 5 }}>
                        <Picker
                            ref={pickerRef}
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
                </View>
                <TextInput
                    placeholder={"Location"}
                    value={user.location}
                    onChangeText={(text) => handleInputChange('location', text)}
                    style={styles.input}
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

export default UserDataScreen
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
        backgroundColor: whiteColor,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        color: tertiaryColor,
    },
    inputHorizontal: {
        backgroundColor: whiteColor,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        color: tertiaryColor,
        flex: 1,
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
    buttonDate: {
        backgroundColor: whiteColor,
        width: '49%',
        padding: 15,
        marginTop: 5,
        borderRadius: 10,
    },
    buttonText: {
        color: whiteColor,
        fontWeight: '700',
        fontSize: 16,
    },
})
