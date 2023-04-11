import React, { Component, useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator} from 'react-native';
import { Avatar, Card, CardContent, Box, Stack, Paper, styled } from '@mui/material';
import {primaryColor, secondaryColor} from "../consts/colors";
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


    toggleEditable = () => {
        setEditable(!editable);
    };

    return (
        <View>
            {loading && <ActivityIndicator />}
            {!loading && error && <Text>{error.message}</Text>}
            {!loading && !error && 
                <View style={styles.profile_container}>
                    <TextInput
                        style={styles.input}
                        value={name}
                        editable={editable}
                        onChangeText={(text) =>  setUserProfile(...userProfile, {name: text})}
                    />
                    <TextInput
                        style={styles.input}
                        value={surname}
                        editable={editable}
                        onChangeText={(text) => setUserProfile(...userProfile, {surname: text})}
                    />
                    <TextInput
                        style={styles.input}
                        value={email}
                        editable={editable}
                        onChangeText={(text) => setUserProfile(...userProfile, {email: text})}
                    />
                    <TextInput
                        style={styles.input}
                        value={location}
                        editable={editable}
                        onChangeText={(text) => setUserProfile(...userProfile, {location: text})}
                    />
                    <TextInput
                        style={styles.input}
                        value={height.toString()}
                        editable={editable}
                        onChangeText={(text) => setUserProfile(...userProfile, {height: text})}
                    />
                    <TextInput
                        style={styles.input}
                        value={weight.toString()}
                        editable={editable}
                        onChangeText={(text) => setUserProfile(...userProfile, {weight: text})}
                    />
            
                    <TouchableOpacity style={styles.button} onPress={this.toggleEditable}>
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

