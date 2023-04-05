import React, { Component } from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {primaryColor} from "../consts/colors";
import {baseURL, userURI} from "../consts/requests";

class ProfileScreen extends Component {
    state = {
        profile: null,
        loading: true,
        error: null,
    };

    componentDidMount() {
        console.log("Fetching user profile...");
        fetch(baseURL + userURI + '999')
            .then((response) => response.json())
            .then((profile) =>
                this.setState({ profile: profile, loading: false, error: null })
            )
            .catch((error) =>
                this.setState({ profile: null, loading: false, error: error })
            );
    }

    render() {
        const { profile, loading, error } = this.state;

        if (loading) {
            return <ActivityIndicator />;
        }

        if (error) {
            console.log("Error: ", error.message);
            return <Text>{error.message}</Text>;
        }

        return (
            <View>
                {profile && (
                    <>
                        <Text>{profile.username}</Text>
                        <Text>{profile.email}</Text>
                        <Text>{profile.name}</Text>
                        <Text>{profile.surname}</Text>
                        <Text>{profile.height}</Text>
                        <Text>{profile.weight}</Text>
                        <Text>{profile.birth_date}</Text>
                        <Text>{profile.location}</Text>
                        <Text>{profile.registration_date}</Text>
                    </>
                )}
            </View>
        );
    }
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: primaryColor,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})
