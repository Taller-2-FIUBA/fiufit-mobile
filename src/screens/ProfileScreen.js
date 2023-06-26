import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert} from 'react-native';
import {primaryColor, secondaryColor, tertiaryColor, whiteColor, greyColor} from "../consts/colors";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {UserService} from "../services/userService";
import {useNavigation} from "@react-navigation/native";
import {Avatar, useTheme} from "react-native-paper";
import {showImage} from "../services/imageService";


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
    const [loading, setLoading] = useState(true);
    const [editable, setEditable] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Fetching user profile...");
        setLoading(true);
        UserService.getUser()
            .then(async (profile) => {
                setLoading(false);
                setUserProfile(profile);
                UserService.getUserByUsername(profile.username)
                    .then((userData) => {
                        setImage(userData.image);
                    });
            })
            .catch((error) => {
                setLoading(false);
                setError(error);
                console.log(error);
            });
    }, []);


    const updateProfile = () => {
        let copyProfile = {...userProfile};
        delete copyProfile.email
        UserService.updateUser(copyProfile).then((profile) => {
            setUserProfile(profile);
        }).catch((error) => {
            console.log(error);
            Alert.alert("Error", "Something went wrong while updating user profile. Please try again later.");
        });
    };

    const handleEditAction = () => {
        setEditable(true);
    }

    const handleSaveAction = () => {
        updateProfile();
        setEditable(false);
    };

    const handleCancelAction = () => {
        setEditable(false);
    };

    const handleInputChange = (key, value) => {
        setUserProfile({...userProfile, [key]: value});
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
        marginBottom: 5
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
        fontSize: 12,
        borderColor: secondaryColor,
        borderWidth: 0.8,
        color: "#888",
        paddingHorizontal: 10
    },
    button: {
        backgroundColor: secondaryColor,
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: 10,
        width: '50%'
    },
    buttonText: {
        color: whiteColor,
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
    },
    followingButton: {
        marginRight: 5,
    },
});

export default ProfileScreen;

