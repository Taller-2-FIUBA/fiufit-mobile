import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert} from 'react-native';
import {primaryColor, secondaryColor, tertiaryColor, whiteColor, greyColor} from "../consts/colors";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {UserService} from "../services/userService";


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

const ProfileAvatar = ({userName, onChange}) => {
    return (
        <View style={styles.profileAvatarContainer}>
            <Image
                style={styles.profileAvatar}
                source={require('../../resources/profile.jpg')}
            />
        </View>
    )
}

const ProfileScreen = ({ route }) => {
    const { user } = route.params;

    return (
        <ScrollView style={styles.profileContainer}>
            <ProfileAvatar
                userName={user.name}
            />
            <ProfileItem
                iconName="account"
                value={user.name}
            />
            <ProfileItem
                iconName="account"
                value={user.surname}
            />
            <ProfileItem
                iconName="account"
                value={user.username}
            />
            <ProfileItem
                iconName="email"
                value={user.email}
            />
            <ProfileItem
                iconName="map-marker"
                value={user.location}
            />
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

