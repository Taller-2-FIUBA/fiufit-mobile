import React, { useEffect, useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator} from 'react-native';
import {secondaryColor } from "../consts/colors";
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

        fetch(baseURL + userURI + '/' + userId)
            .then((response) => response.json())
            .then((profile) => {
                //const profileAux = {"birth_date": "2023-04-14", "email": "valeria@gmail.com", "height": "1.70", "isAthlete": true, "location": "Bs. As.", "name": "Val", "password": "123412", "registration_date": "2023-04-14", "surname": "fiuba", "username": "valfiuba", "weight": "65"};
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

    toggleEditable = () => {
        if (editable) {
            updateProfile();
        } else {
            setEditable(true);
        }
    };

    const handleInputChange = (key, value) => {
        setUserProfile({ ...userProfile, [key]: value });
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
                        onChangeText={(text) => handleInputChange("name", text)}
                    />
                    <TextInput
                        style={styles.input}
                        value={userProfile.surname}
                        editable={editable}
                        onChangeText={(text) => handleInputChange("surname", text)}
                    />
                    <TextInput
                        style={styles.input}
                        value={userProfile.email}
                        editable={false}
                    />
                    <TextInput
                        style={styles.input}
                        value={userProfile.location}
                        editable={editable}
                        onChangeText={(text) => handleInputChange("location", text)}
                    />
                    <TextInput
                        style={styles.input}
                        value={userProfile.height?.toString()}
                        editable={editable}
                        onChangeText={(text) => handleInputChange("height", text)}
                    />
                    <TextInput
                        style={styles.input}
                        value={userProfile.weight?.toString()}
                        editable={editable}
                        onChangeText={(text) => handleInputChange("weight", text)}
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
        backgroundColor: secondaryColor,
        padding: 30,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
});

export default ProfileScreen;

