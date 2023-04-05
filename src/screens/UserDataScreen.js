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
    validateDate,
    validateHeight, validateLocation,
    validateName,
    validateUsername,
    validateWeight
} from "../utils/validations";
import {useNavigation} from "@react-navigation/native";
import {buttonTextColor, primaryColor, secondaryColor, textBoxColor, textColor} from "../consts/colors";
import {useState} from "react";
import {baseURL, signUpURI} from "../consts/requests";

const UserDataScreen = ({route}) => {
    const navigation = useNavigation();

    const [user, setUser] = useState(  {
        email: route.params.email,
        password: route.params.password,
        username: '',
        name: '',
        surname: '',
        height: '',
        weight: '',
        birth_date: '',  // TODO: Definir formatos para fechas y forma de ingreso
        location: '',  // TODO: Definir formatos para ubicaciones y forma de ingreso
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
            {value: user.birth_date, validator: validateDate, errorMessage: 'Invalid birth date'},
            {value: user.location, validator: validateLocation, errorMessage: 'Invalid location'},
            {value: user.registration_date, validator: validateDate, errorMessage: 'Invalid registration date'},
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
        if (!validateForm(user)) {
            return;
        }
        navigation.navigate('Home', {user: user});
        signUpUser(user);
    }

    const signUpUser = (user) => {
        fetch(baseURL + signUpURI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user})
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    Alert.alert(data.error);
                } else {
                    navigation.navigate('Home', {userId: data.id});
                }
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
                <TextInput
                    placeholder={"Height"}
                    value={user.height}
                    onChangeText={(text) => handleInputChange('height', text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder={"Weight"}
                    value={user.weight}
                    onChangeText={(text) => handleInputChange('weight', text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder={"Birth date"}
                    value={user.birth_date}
                    onChangeText={(text) => handleInputChange('birth_date', text)}
                    style={styles.input}
                />
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
