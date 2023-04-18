import {
    Alert,
    Keyboard,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";
import {greyColor, primaryColor, secondaryColor, tertiaryColor} from "../consts/colors";
import {useNavigation} from "@react-navigation/native";
import React, {useRef, useState} from "react";
import {Picker} from "@react-native-picker/picker";
import {fiufitStyles} from "../consts/fiufitStyles";
import {parseHeight, parseWeight} from "../utils/utils";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import Button from "../components/Button";
import {validateBirthDate, validateHeight, validateWeight} from "../utils/validations";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {baseURL, signUpURI} from "../consts/requests";

const UserBiologicsScreen = ({route}) => {
    const navigation = useNavigation();
    const rolePickerRef = useRef();

    const [weightError, setWeightError] = useState(false);

    const [height, setHeight] = useState('');
    const [heightError, setHeightError] = useState(false);
    const [isPickerVisible, setPickerVisibility] = useState(false);

    const togglePicker = () => {
        handleInputChange('height', parseHeight(height));
        setPickerVisibility(!isPickerVisible);
    };

    const heightOptions = [];
    for (let i = 30; i <= 250; i++) {
        heightOptions.push(i + ' cm');
    }

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

    const [date, setDate] = useState(null);
    const [errorDate, setErrorDate] = useState(false);

    const showDatepicker = () => {
        showMode('date');
    };

    const onChange = (event, selectedDate) => {
        setDate(selectedDate);
        handleInputChange('birth_date', selectedDate.toISOString().split('T')[0]);
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

    const handleInputChange = (key, value) => {
        if (key === 'weight') {
            value = parseWeight(value);
        }

        setUser({...user, [key]: value});
    };

    const handleSignUp = () => {
        Keyboard.dismiss();
        if (weightError) {
            setWeightError(false);
        }

        if (heightError) {
            setHeightError(false);
        }

        if (errorDate) {
            setErrorDate(false);
        }

        if (validateForm()) {
            signUpUser(user);
            navigation.navigate('Login');
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
        let valid = true;

        if (!validateWeight(user.weight)) {
            setWeightError(true);
            valid = false;
        }

        if (!validateHeight(user.height)) {
            setHeightError(true);
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
                <Text style={{marginVertical: 20, fontSize: 14, color: greyColor, marginLeft: 5}}>Pick a Role</Text>
                <View style={{
                    borderRadius: 10,
                    overflow: 'hidden',
                    height: 50,
                    marginLeft: 5,
                    marginTop: -5
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
                <Text style={{fontSize: 14, color: greyColor, marginLeft: 5, marginTop: 15}}>
                    Enter your weight in kg
                </Text>
                {!weightError ?
                    <TextInput
                        placeholder={"Weight"}
                        placeholderTextColor={greyColor}
                        value={user.weight === 0 ? "" : user.weight.toString()}
                        onChangeText={(text) => handleInputChange('weight', text)}
                        style={fiufitStyles.inputWeight}
                        keyboardType={"numeric"}
                    />
                    :
                    <View>
                        <TextInput
                            placeholder={"Weight"}
                            placeholderTextColor={greyColor}
                            value={user.weight === 0 ? "" : user.weight.toString()}
                            onChangeText={(text) => handleInputChange('weight', text)}
                            style={[fiufitStyles.inputWeight, {borderColor: 'red', borderWidth: 1}]}
                            keyboardType={"numeric"}
                        />
                        <Text style={{color: 'red', fontSize: 12, marginLeft: 5, marginTop: 5}}>Invalid weight</Text>
                    </View>
                }
                <Text style={{fontSize: 14, color: greyColor, marginLeft: 5, marginTop: 15}}>Enter your
                    height</Text>
                {!heightError ?
                    <View style={{marginBottom: 10}}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: secondaryColor,
                                borderRadius: 10,
                                height: 51,
                                marginTop: 15,
                                marginLeft: 5,
                                marginBottom: 15,
                                justifyContent: 'center',
                                paddingHorizontal: 10,
                            }}
                            onPress={togglePicker}
                        >
                            <Text style={{color: height ? tertiaryColor : greyColor, marginLeft: 5}}>
                                {height ? height: 'Height'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{marginBottom: 10}}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: secondaryColor,
                                borderRadius: 10,
                                height: 51,
                                marginTop: 15,
                                marginLeft: 5,
                                justifyContent: 'center',
                                paddingHorizontal: 10,
                                borderColor: 'red',
                                borderWidth: 1
                            }}
                            onPress={togglePicker}
                        >
                            <Text style={{color: height ? tertiaryColor : greyColor, marginLeft: 5}}>
                                {height ? height: 'Height'}
                            </Text>
                        </TouchableOpacity>
                        <Text style={{color: 'red', fontSize: 12, marginLeft: 5, marginBottom: 15, marginTop: 5}}>Invalid height</Text>
                    </View>
                }
                {!isPickerVisible && (
                    <View style={{marginTop: -10, marginBottom: 5}}>
                        <Text style={{color: greyColor, flex: 1, marginLeft: 5}}>
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
                )}
                {!isPickerVisible && (
                    <Button onPress={handleSignUp} title="Register"/>
                )}
            </ScrollView>
            {isPickerVisible && (
                <View
                    style={{
                        marginLeft: 100,
                    }}>
                    <WheelPickerExpo
                        initialSelectedIndex={140}
                        items={heightOptions.map(name => ({ label: name, value: '' }))}
                        onChange={({ item }) => setHeight(item.label)}
                        backgroundColor={secondaryColor}
                        selectedStyle={{
                            borderColor: tertiaryColor,
                            borderWidth: 1
                        }}
                    />
                </View>
            )}
            {isPickerVisible && (
                <TouchableOpacity
                    style={fiufitStyles.heightInputConfirmButton}
                    onPress={togglePicker}
                >
                    <Text style={fiufitStyles.buttonOutlineText}>Confirm</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    )
}

export default UserBiologicsScreen;
