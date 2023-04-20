import {
    Alert,
    Keyboard,
    SafeAreaView,
    ScrollView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";
import {greyColor, primaryColor, secondaryColor, tertiaryColor} from "../consts/colors";
import {useNavigation} from "@react-navigation/native";
import React, {useRef, useState} from "react";
import {Picker} from "@react-native-picker/picker";
import {fiufitStyles} from "../consts/fiufitStyles";
import {parseWeight} from "../utils/utils";
import Button from "../components/Button";
import {
    validateBirthDate,
    validateHeight,
    validateHeightCentimeters,
    validateHeightMeters,
    validateWeight
} from "../utils/validations";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {baseURL, signUpURI} from "../consts/requests";
import Input from "../components/Input";

const UserBiologicsScreen = ({route}) => {
    const navigation = useNavigation();
    const rolePickerRef = useRef();

    const [meters, setMeters] = useState('');
    const [centimeters, setCentimeters] = useState('');
    const [weight, setWeight] = useState('');
    const [date, setDate] = useState(null);
    const [errorDate, setErrorDate] = useState(false);
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState({
        email: route.params.user.email,
        password: route.params.user.password,
        name: route.params.user.name,
        surname: route.params.user.surname,
        username: route.params.user.username,
        location: route.params.user.location,
        is_athlete: true,
        height: 0.0,
        weight: 0,
        birth_date: '',
        registration_date: new Date().toISOString().split('T')[0],
    });

    const handleInputChange = (key, value) => {
        setUser({ ...user, [key]: value });
    }

    const showDatepicker = () => {
        showMode('date');
    };

    const onChange = (event, selectedDate) => {
        setDate(selectedDate);
        handleInputChange('birth_date', selectedDate.toISOString().split('T')[0]);
    };

    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
    };

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

    const handleWeight = (value) => {
        setWeight(parseWeight(value));
    }

    const handleSignUp = () => {
        Keyboard.dismiss();

        if (errorDate) {
            setErrorDate(false);
        }

        if (validateForm()) {
            const updatedUser
                = { ...user, height: parseFloat(meters + '.' + centimeters), weight: parseInt(weight) };

            signUpUser(updatedUser);
        }
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
                }

                ToastAndroid.show("User created successfully", ToastAndroid.SHORT);
                navigation.navigate('Login');
            })
            .catch(error => {
                console.log(error);
                Alert.alert(error.message);
                navigation.navigate('Login');
            });
    }

    const validateForm = () => {
        handleError(null, 'weight');
        handleError(null, 'heightMeters');
        handleError(null, 'heightCentimeters');
        let valid = true;

        if (!validateHeightMeters(meters)) {
            handleError('Meters should be a number between 0 and 2', 'heightMeters');
            valid = false;
        }

        if (!validateHeightCentimeters(centimeters)) {
            handleError('Centimeters should be a number between 0 and 99', 'heightCentimeters');
            valid = false;
        }

        if (valid) {
            if (!validateHeight(meters + '.' + centimeters)) {
                handleError('Height should be a number between 0.5 and 2.5', 'heightMeters');
                valid = false;
            }
        }

        if (!validateWeight(weight)) {
            handleError('Weight should be a number between 20 and 400', 'weight');
            valid = false;
        }

        if (!validateBirthDate(user.birth_date)) {
            setErrorDate(true);
            valid = false;
        }

        return valid;
    }

    return (
        <SafeAreaView style={{
            backgroundColor: primaryColor,
            flex: 1,
        }}>
            <ScrollView contentContainerStyle={{
                paddingTop: 25, paddingHorizontal: 20,
            }}>
                <Text style={fiufitStyles.titleText}>
                    Register
                </Text>
                <Text style={fiufitStyles.detailsText}>
                    Last step! Please enter your data
                </Text>
                <Text style={{marginTop: 20, marginBottom: 5, fontSize: 14, color: greyColor, marginLeft: 5}}>
                    Pick a Role
                </Text>
                <View style={{
                    borderRadius: 10,
                    overflow: 'hidden',
                    height: 50,
                    marginLeft: 5,
                    marginBottom: 20,
                }}>
                    <Picker
                        ref={rolePickerRef}
                        selectedValue={user.is_athlete}
                        onValueChange={(itemValue) =>
                            handleInputChange("is_athlete", itemValue)
                        }
                        dropdownIconColor={tertiaryColor}
                        style={{
                            backgroundColor: secondaryColor,
                            color: tertiaryColor,
                        }}
                        mode={'dropdown'}
                        prompt={'Select your role'}
                    >
                        <Picker.Item style={{
                            backgroundColor: secondaryColor,
                            color: tertiaryColor
                        }} label="Athlete" value={true}/>
                        <Picker.Item style={{
                            backgroundColor: secondaryColor,
                            color: tertiaryColor
                        }} label="Trainer" value={false}/>
                    </Picker>
                </View>

                <View style={{
                    marginLeft: 5,
                }}>
                    <Input
                        placeholder="Weight"
                        label={'Enter your weight'}
                        onChangeText={text => handleWeight(text)}
                        value={weight}
                        keyboardType={'numeric'}
                        iconName={'weight-kilogram'}
                        error={errors.weight}
                    />
                </View>


                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'center',
                }}>
                    <View style={{flex: 1, marginLeft: 5, marginBottom: 5}}>
                        <Input
                            label={'Enter your height'}
                            placeholder="Meters"
                            onChangeText={text => setMeters(text)}
                            iconName={'human-male-height'}
                            keyboardType={'numeric'}
                            error={errors.heightMeters}
                        />
                    </View>
                    <View style={{flex: 1, marginLeft: 5}}>
                        <Input
                            placeholder="Centimeters"
                            onChangeText={text => setCentimeters(text)}
                            iconName={'human-male-height'}
                            keyboardType={'numeric'}
                            error={errors.heightCentimeters}
                        />
                    </View>
                </View>

                <View style={{marginBottom: 5}}>
                    <Text style={{color: greyColor, flex: 1, marginLeft: 5, marginBottom: -10}}>
                        Enter your birthdate
                    </Text>
                    {!errorDate ?
                        <View style={{marginLeft: 5}}>
                            <TouchableOpacity
                                style={fiufitStyles.buttonDate}
                                onPress={showDatepicker}
                            >
                                <Icon name={"calendar-range"} style={fiufitStyles.iconStyle}/>
                                <Text style={{color: date ? tertiaryColor : greyColor, marginLeft: 33, marginTop: -20}}>
                                    {date ? date.toISOString().split("T")[0] : "Birthdate"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View>
                            <TouchableOpacity
                                style={fiufitStyles.buttonDateError}
                                onPress={showDatepicker}
                            >
                                <Icon name={"calendar-range"} style={fiufitStyles.iconStyle}/>
                                <Text style={{color: date ? tertiaryColor : greyColor, marginLeft: 33, marginTop: -20}}>
                                    {date ? date.toISOString().split("T")[0] : "Birthdate"}
                                </Text>
                            </TouchableOpacity>
                            <Text style={{color: 'red', marginTop: -10, fontSize: 12, marginLeft: 5, marginBottom: 15}}>
                                Invalid birthdate
                            </Text>
                        </View>
                    }
                </View>

                <Button onPress={handleSignUp} title="Register"/>
            </ScrollView>
        </SafeAreaView>
    )
}

export default UserBiologicsScreen;
