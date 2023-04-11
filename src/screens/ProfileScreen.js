import React, { Component } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator} from 'react-native';
import { Avatar, Card, CardContent, Box, Stack, Paper, styled } from '@mui/material';
import {primaryColor, secondaryColor} from "../consts/colors";
import {baseURL, userURI} from "../consts/requests";


const ProfileScreen = ({route}) => {
    state = {
        profile: null,
        loading: true,
        error: null,
        name: 'John',
        surname: 'Doe',
        email: 'johndoe@gmail.com',
        location: 'Bs. As',
        height: 1.90,
        weight: 45,
        editable: false,
    };

    useEffect(() => {
        console.log("Fetching user profile...");
        const { userId } = route.params;

        fetch(baseURL + userURI + userId)
            .then((response) => response.json())
            .then((profile) =>
                this.setState({ profile: profile, loading: false, error: null })
            )
            .catch((error) =>
                this.setState({ profile: null, loading: false, error: error })
            );
      }, []);


    toggleEditable = () => {
        this.setState({ editable: !this.state.editable });
      };

      const { profile, loading, error } = this.state;
        const { name, surname, email, location, height, weight, editable } = this.state;

        if (loading) {
            return <ActivityIndicator />;
        }

        if (error) {
            console.log("Error: ", error.message);
            return <Text>{error.message}</Text>;
        }

      return (
            <View style={styles.profile_container}>
              <TextInput
                style={styles.input}
                value={name}
                editable={editable}
                onChangeText={(text) => this.setState({ name: text })}
              />
              <TextInput
                style={styles.input}
                value={surname}
                editable={editable}
                onChangeText={(text) => this.setState({ surname: text })}
              />
              <TextInput
                style={styles.input}
                value={email}
                editable={editable}
                onChangeText={(text) => this.setState({ email: text })}
              />
              <TextInput
                style={styles.input}
                value={location}
                editable={editable}
                onChangeText={(text) => this.setState({ location: text })}
              />
              <TextInput
                style={styles.input}
                value={height.toString()}
                editable={editable}
                onChangeText={(text) => this.setState({ height: number })}
              />
              <TextInput
                style={styles.input}
                value={weight.toString()}
                editable={editable}
                onChangeText={(text) => this.setState({ weight: number })}
              />
      
              <TouchableOpacity style={styles.button} onPress={this.toggleEditable}>
                <Text style={styles.buttonText}>{editable ? 'Save' : 'Edit'}</Text>
              </TouchableOpacity>
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

