import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert} from 'react-native';
import {primaryColor, secondaryColor, tertiaryColor, whiteColor, greyColor} from "../consts/colors";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {UserService} from "../services/userService";
import {useNavigation} from "@react-navigation/native";
import {Avatar, useTheme} from "react-native-paper";
import {showImage} from "../services/imageService";
import FastImage from 'react-native-fast-image';
import InputProfile from "../components/InputProfile";
import {fiufitStyles} from "../consts/fiufitStyles";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {
    validateName, validateNameLength,
    validateBirthDate, validateHeight,
    validateHeightCentimeters,
    validateHeightMeters,
    validateWeight
} from "../utils/validations";
import {Picker} from '@react-native-picker/picker';
import Utils from "../utils/Utils";

const ProfileItem = ({iconName, value, editable, onChange}) => {
    return (
        <View style={styles.profileItemContainer}>
            <Icon name={iconName} style={{
                fontSize: 22,
                color: iconName === "email" ? greyColor : tertiaryColor,
                marginRight: 10,
            }}/>
            <TextInput
                style={editable ? styles.input : styles.notEditableInpunt}
                value={value}
                onChangeText={onChange}
                editable={editable}
            />
        </View>
    )
}

const ProfileAvatar = ({image, name, surname, editable}) => {
    const theme = useTheme();
    return (
        <View style={{alignItems: 'center',}}>
            {editable ? (
                <TouchableOpacity style={{
                    width: 80,
                    height: 80,
                    borderRadius: 50,
                    marginTop: 20,
                    marginBottom: 20,
                }}>
                    <Icon name="pencil"></Icon>
                </TouchableOpacity>
                ) : (
                   <View>
                       {image ? (
                            <FastImage 
                                source={{
                                    uri: showImage(image),
                                    priority: FastImage.priority.normal
                                }} 
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 50,
                                    marginTop: 20,
                                    marginBottom: 20,
                                }}
                            />
                       ) : (
                           <Avatar.Text size={80} color={theme.colors.secondary}
                                        style={{
                                            backgroundColor: theme.colors.primary, marginBottom: 10,
                                        }}
                                        label={name?.charAt(0) + surname?.charAt(0)}
                           />
                       )}
                   </View>
                )}
        </View>
    )
}


const ProfileScreen = () => {
    const navigation = useNavigation();

    const [userProfile, setUserProfile] = useState({
        id: 0,
        name: '',
        surname: '',
        username: '',
        email: '',
        birth_date: '',
        location: '',
        height: undefined,
        weight: undefined,
        is_athlete: false,
        is_blocked: false,
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editable, setEditable] = useState(false);
    const [meters, setMeters] = useState('');
    const [centimeters, setCentimeters] = useState('');
    const [weight, setWeight] = useState('');
    const [date, setDate] = useState(null);
    const [error, setError] = useState(null);
    const [errorDate, setErrorDate] = useState(false);
    const [errors, setErrors] = useState({});
    const [locations, setLocations] = useState([]);
    const [locationIndex, setLocationIndex] = useState(0);

    useEffect(() => {
        console.log("Fetching user profile...");
        setLoading(true);
        UserService.getUser()
            .then(async (profile) => {
                console.log("User profile: ", profile);
                const metersInfo = profile.height.toString().split('.')[0];
                const centimetersInfo = profile.height.toString().split('.')[2];
                setDate(profile.birth_date);
                setWeight(profile.weight);
                setMeters(metersInfo);
                setCentimeters(centimetersInfo);
                setUserProfile(profile);

                setLoading(false);

                UserService.getUserByUsername(profile.username)
                    .then((userProfile) => {
                        setImage(userProfile.image);
                    });
            })
            .catch((error) => {
                setLoading(false);
                setError(error);
                console.log(error);
            });
    }, []);

    useEffect(() => {
        getLocations();
    }, []);

    const getLocations = async () => {
        try {
            const response = await UserService.getLocations();
            response.unshift({"coordinates": [0, 0], "location": "Select your location"});
            setLocations(response);
        } catch(error) {
            console.error("Something went wrong while fetching locations. Please try again later.");
        }
    }  

    const validateForm = () => {
        if (errorDate) {
            setErrorDate(false);
        }
        let valid = true;

        const validationData = [
            {value: userProfile.name, validator: validateName, errorMessage: 'Invalid name', field: 'name'},
            {value: userProfile.name, validator: validateNameLength, errorMessage: 'Name must be at least 2 characters long', field: 'name'},
            {value: userProfile.surname, validator: validateName, errorMessage: 'Invalid surname', field: 'surname'},
            {
                value: userProfile.surname,
                validator: validateNameLength,
                errorMessage: 'Surname must be at least 2 characters long',
                field: 'surname'
            },            
        ];

        for (const {value, validator, errorMessage, field} of validationData) {
            if (!validator(value)) {
                handleError(errorMessage, field);
                valid = false;
            }
        }

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

        if (!validateBirthDate(userProfile.birth_date)) {
            setErrorDate(true);
            valid = false;
        }

        return valid;
    }

    const showDatepicker = () => {
        showMode('date');
    };

    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
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

    const handleWeight = (value) => {
        setWeight(Utils.parseWeight(value));
    }

    const trimUserData = (userProfile) => {
        let trimableFields = ['name', 'surname'];
        for (const key of trimableFields) {
            userProfile[key] = userProfile[key].trim();
        }
    }

    const handleNext = async () => {
        handleError(null, 'name')
        handleError(null, 'surname')
        handleError(null, 'username')
        handleError(null, 'weight');
        handleError(null, 'heightMeters');
        handleError(null, 'heightCentimeters');
        trimUserData(userProfile);
        if (!validateForm(userProfile)) {
            return;
        }

        let copyProfile = {...userProfile, height: parseFloat(meters + '.' + centimeters),
        weight: parseInt(weight)
        };
        setUserProfile(copyProfile);

        let userToSave = {...userProfile, height: parseFloat(meters + '.' + centimeters),
        weight: parseInt(weight)
        };
        delete userToSave.email;
        console.log('User to update: ', userToSave);        
        await UserService.updateUser(copyProfile).then((profile) => {
            setUserProfile(profile);
        }).catch((error) => {
            console.log(error);
        });
        setEditable(false);
    }

    const handleEditAction = () => {
        setEditable(true);
    }


    const handleCancelAction = () => {
        setEditable(false);
    };

    const handleInputChange = (key, value) => {
        setUserProfile({...userProfile, [key]: value});
    };

    const handleLocationInputChange = (value) => {
        const locationInfo = locations[value];
        console.log(locationInfo);
        if(locationInfo.location !== "Select your location") {
            setLocationIndex(value);
            const newUserData = {...userProfile, ['location']: locationInfo.location, ['coordinates']: locationInfo.coordinates};
            console.log(newUserData);
            setUserProfile(newUserData);
        }
    };


    return (
        <ScrollView style={styles.profileContainer}>
            <ProfileAvatar
                image={image}
                name={userProfile.name}
                surname={userProfile.surname}
            />
            <ProfileItem
                iconName="account"
                value={userProfile.username}
                editable={false}
                onChange={(text) => handleInputChange("username", text)}
            />
            <ProfileItem
                iconName="email"
                value={userProfile.email}
                editable={false}
                onChange={(text) => handleInputChange("email", text)}
            />
            {!editable &&
                <View>
                    <ProfileItem
                        iconName="account"
                        value={userProfile.name}
                        editable={editable}
                        onChange={(text) => handleInputChange("name", text)}
                    />
                    <ProfileItem
                        iconName="account"
                        value={userProfile.surname}
                        editable={editable}
                        onChange={(text) => handleInputChange("surname", text)}
                    />
                </View>
            }
            {editable &&
                <View>
                    <InputProfile
                        iconName={"account-outline"}
                        placeholder={userProfile.name}
                        onChangeText={text => handleInputChange('name', text)}
                        error={errors.name}
                    />
                    <InputProfile
                        iconName={"account-outline"}
                        placeholder={userProfile.surname}
                        onChangeText={text => handleInputChange('surname', text)}
                        error={errors.surname}
                    />
                    {/* {locations && locations.length > 0 &&
                        <Picker
                            label="Location"
                            selectedValue={locationIndex}
                            style={fiufitStyles.locationEditPickerSelect}
                            onValueChange={(itemValue) => handleLocationInputChange(itemValue)}
                        >
                            {locations.map((locationInfo, index) => 
                                <Picker.Item label={locationInfo.location} value={index} key={index}/>
                            )}
                        </Picker>
                    } */}
                </View>
            }
            {!editable &&
                <View>
                    <ProfileItem
                        iconName="map-marker"
                        value={userProfile.location}
                        editable={editable}
                        onChange={(text) => handleInputChange("location", text)}
                    />
                    <ProfileItem
                        iconName="human-male-height"
                        value={userProfile.height?.toString()}
                        editable={editable}
                        onChange={(text) => handleInputChange("height", text)}
                    />
                    <ProfileItem
                        iconName="weight-kilogram"
                        value={userProfile.weight?.toString()}
                        editable={editable}
                        onChange={(text) => handleInputChange("weight", text)}
                    />
                </View>
            }
            {editable &&
             <View>
           
                <View style={{
                    marginLeft: 5,
                }}>
                    <InputProfile
                        placeholder={userProfile.weight?.toString()}
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
                        <InputProfile
                            placeholder={meters}
                            onChangeText={text => setMeters(text)}
                            iconName={'human-male-height'}
                            keyboardType={'numeric'}
                            error={errors.heightMeters}
                        />
                    </View>
                    <View style={{flex: 1, marginLeft: 5}}>
                        <InputProfile
                            placeholder={centimeters}
                            onChangeText={text => setCentimeters(text)}
                            iconName={'human-male-height'}
                            keyboardType={'numeric'}
                            error={errors.heightCentimeters}
                        />
                    </View>
                </View>
            </View>
            }
            <View>
                <ProfileItem
                    iconName="calendar-range"
                    value={userProfile.birth_date}
                    editable={false}
                    onChange={(text) => handleInputChange("birth_date", text)}
                />
            </View>
            {!editable &&
                <TouchableOpacity style={{...styles.button, width: '100%'}} onPress={handleEditAction}>
                    <Text style={styles.buttonText}>{'Edit profile'}</Text>
                </TouchableOpacity>
            }
            {editable &&
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={{...styles.button, marginRight: 5}} onPress={handleNext}>
                        <Text style={styles.buttonText}>{'Save'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleCancelAction}>
                        <Text style={styles.buttonText}>{'Cancel'}</Text>
                    </TouchableOpacity>
                </View>
            }
            <View style={styles.followersContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.followingButton]}
                    onPress={() => navigation.navigate('FollowTabs', {user: userProfile})}
                >
                    <Text style={styles.buttonText}>Following</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('FollowTabs', {user: userProfile})}
                >
                    <Text style={styles.buttonText}>Followers</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: primaryColor
    },
    profileItemContainer: {
        height: 55,
        backgroundColor: secondaryColor,
        flexDirection: 'row',
        borderWidth: 0.5,
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 10
    },
    profileAvatarContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20
    },
    profileAvatar: {
        height: 50,
        width: 50
    },
    input: {
        fontSize: 12,
        borderColor: secondaryColor,
        borderWidth: 0.8,
        color: tertiaryColor,
        paddingHorizontal: 5
    },
    notEditableInpunt: {
        fontSize: 14,
        borderColor: secondaryColor,
        borderWidth: 0.8,
        color: "#888",
        paddingHorizontal: 10
    },
    button: {
        backgroundColor: tertiaryColor,
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 5,
        width: '49%'
    },
    buttonText: {
        color: primaryColor,
        fontSize: 16
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    followersContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20
    },
    followingButton: {
        marginRight: 5,
    },
});

export default ProfileScreen;

