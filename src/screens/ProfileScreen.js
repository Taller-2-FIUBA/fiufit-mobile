import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert} from 'react-native';
import {primaryColor, secondaryColor, tertiaryColor, whiteColor, greyColor} from "../consts/colors";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {UserService} from "../services/userService";
import {useNavigation} from "@react-navigation/native";
import {Avatar, useTheme} from "react-native-paper";
import {showImage} from "../services/imageService";
import {validateHeight, validateLocation, validateName, validateUsername, validateWeight} from "../utils/validations";
import {fiufitStyles} from "../consts/fiufitStyles";


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
                        <Image source={{uri: showImage(image)}} style={{
                            width: 80,
                            height: 80,
                            borderRadius: 50,
                            marginTop: 20,
                            marginBottom: 20,
                        }}/>
                    ) : (
                        <Avatar.Text size={80} color={theme.colors.secondary}
                                     style={{
                                         backgroundColor: theme.colors.primary
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
    const [editable, setEditable] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log("Fetching user profile...");
        getUserData();
    }, []);

    const validateProfile = (profile) => {
        let valid = true;

        if (!validateName(profile.name)) {
            valid = false;
            setError("Please enter a valid name");
        }

        if (!validateName(profile.surname)) {
            valid = false;
            setError("Please enter a valid surname");
        }

        if (!validateUsername(profile.username)) {
            valid = false;
            setError("Please enter a valid username");
        }

        if (!validateLocation(profile.location)) {
            valid = false;
            setError("Please enter a valid location");
        }

        if (!validateHeight(profile.height)) {
            valid = false;
            setError("Please enter a valid height");
        }

        if (!validateWeight(profile.weight)) {
            valid = false;
            setError("Please enter a valid weight");
        }

        return valid;
    }

    const updateProfile = () => {
        let copyProfile = {...userProfile};
        delete copyProfile.email
        if (!validateProfile(copyProfile)) {
            getUserData();
            setEditable(false);
            Alert.alert("Error updating data", error);
            return;
        }
        console.log("Updating user profile...");
        UserService.updateUser(copyProfile)
            .then(() => {
                getUserData();
            })
            .catch((error) => {
                console.log(error);
                Alert.alert("Error", "Something went wrong while updating user profile. Please try again later.");
            });
    };

    const getUserData = () => {
        UserService.getUser()
            .then((profile) => {
                setUserProfile(profile);
                UserService.getUserByUsername(profile.username)
                    .then((userData) => {
                        setImage(userData.image);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleEditAction = () => {
        setEditable(true);
    }

    const handleSaveAction = () => {
        setEditable(false);
        updateProfile();
    };

    const handleCancelAction = () => {
        setEditable(false);
    };

    const handleInputChange = (key, value) => {
        setUserProfile({...userProfile, [key]: value});
    };

    return (
        <View style={fiufitStyles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, paddingHorizontal: 20}}>
                <ProfileAvatar
                    image={image}
                    name={userProfile.name}
                    surname={userProfile.surname}
                />
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
                <ProfileItem
                    iconName="account"
                    value={userProfile.username}
                    editable={editable}
                    onChange={(text) => handleInputChange("username", text)}
                />
                <ProfileItem
                    iconName="email"
                    value={userProfile.email}
                    editable={false}
                    onChange={(text) => handleInputChange("email", text)}
                />
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

                {!editable &&
                    <TouchableOpacity style={{...styles.button, width: '100%'}} onPress={handleEditAction}>
                        <Text style={styles.buttonText}>{'Edit profile'}</Text>
                    </TouchableOpacity>
                }
                {editable &&
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={{...styles.button, marginRight: 5}} onPress={handleSaveAction}>
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
        </View>
    );
}

const styles = StyleSheet.create({
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

