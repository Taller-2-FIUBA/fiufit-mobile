import React, { Component, useEffect, useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator} from 'react-native';
import {primaryColor } from "../consts/colors";
import {baseURL, userURI} from "../consts/requests";


const ProfileScreen = ({route}) => {
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
        const { userId } = route.params;

        fetch(baseURL + userURI + userId)
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
        const { userId } = route.params;

        fetch(baseURL + userURI + userId, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userProfile)
        })
        .then((response) => response.json())
        .then((updatedProfile) => {
            setUserProfile(updatedProfile);
            setEditable(false);
        })
        .catch((error) => {
            console.log("Error: ", error.message);
        });
    };

    toggleEditable = () => {
        if (editable) {
            updateProfile();
        } else {
            setEditable(true);
        }
    };

    return (
        <View>
            {loading && <ActivityIndicator />}
            {!loading && error && <Text>{error.message}</Text>}
            {!loading && !error && 
                <View style={styles.profile_container}>
                    <TextInput
                        style={styles.input}
                        value={userProfile.name}
                        editable={editable}
                        onChangeText={(text) =>  setUserProfile(...userProfile, {name: text})}
                    />
                    <TextInput
                        style={styles.input}
                        value={userProfile.surname}
                        editable={editable}
                        onChangeText={(text) => setUserProfile(...userProfile, {surname: text})}
                    />
                    <TextInput
                        style={styles.input}
                        value={userProfile.email}
                        editable={editable}
                        onChangeText={(text) => setUserProfile(...userProfile, {email: text})}
                    />
                    <TextInput
                        style={styles.input}
                        value={userProfile.location}
                        editable={editable}
                        onChangeText={(text) => setUserProfile(...userProfile, {location: text})}
                    />
                    <TextInput
                        style={styles.input}
                        value={userProfile.height?.toString()}
                        editable={editable}
                        onChangeText={(text) => setUserProfile(...userProfile, {height: number})}
                    />
                    <TextInput
                        style={styles.input}
                        value={userProfile.weight?.toString()}
                        editable={editable}
                        onChangeText={(text) => setUserProfile(...userProfile, {weight: number})}
                    />
            
                    <TouchableOpacity style={styles.button} onPress={toggleEditable}>
                        <Text style={styles.buttonText}>{editable ? 'Save' : 'Edit'}</Text>
                    </TouchableOpacity>
                </View>
            }   
        </View>
    );
}
      
const styles = StyleSheet.create({
    profile_container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: primaryColor,
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ProfileScreen;

