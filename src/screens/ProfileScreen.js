import React, { useEffect, useState } from 'react';
import {View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator} from 'react-native';
import {primaryColor, secondaryColor, tertiaryColor, whiteColor, greyColor } from "../consts/colors";
import {baseURL, userURI} from "../consts/requests";
import {userId} from "./LoginScreen";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {fiufitStyles} from "../consts/fiufitStyles";



const ProfileItem = ({iconName, value, editable, onChange}) => {
    return (
        <View style={styles.profileItemContainer}>
            <Icon name={iconName} style={{
                fontSize: 22,
                color: iconName == "email" ? greyColor : tertiaryColor,
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

const ProfileAvatar = ({userName, onChange}) => {
    return (
        <View style={styles.profileAvatarContainer}>
            <Image
                style={styles.profileAvatar}
                source={require('../profile.jpg')}
            />
        </View>
    )
}


const ProfileScreen = () => {
    const [userProfile, setUserProfile] = useState({
        name: '',
        surname: '',
        email: '',
        location: '',
        height: undefined,
        weight: undefined
    });
    const [loading, setLoading] = useState(true);
    const [editable, setEditable] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Fetching user profile...");

        fetch(baseURL + userURI + '/' + userId)
            .then((response) => response.json())
            .then((profile) => {
                setLoading(false);
                setUserProfile(profile);
            })
            .catch((error) => {
                setLoading(false);
                setError(error);
                console.log("Error: ", error.message);
            });
    }, []);


    const updateProfile = () => {
        console.log("Update profile: ", userProfile);
        let copyProfile = {...userProfile};
        delete copyProfile.email
        delete copyProfile.isAthlete
        fetch(baseURL + userURI + '/' + userId, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(copyProfile)
        })
        .then((response) => response.json())
        .then(() => {
            setEditable(false);
        })
        .catch((error) => {
            console.log("Error: ", error.message);
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
        setUserProfile({ ...userProfile, [key]: value });
    };

    return (
        <ScrollView style={styles.profileContainer}>
            <ProfileAvatar
                userName={userProfile.name}
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
    }
});

export default ProfileScreen;

