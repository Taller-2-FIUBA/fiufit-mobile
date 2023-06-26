import React, {useEffect, useState} from 'react';
import {Linking, View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {primaryColor, secondaryColor, tertiaryColor, whiteColor, greyColor} from "../consts/colors";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from "@react-navigation/native";
import {UserService} from "../services/userService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendNotification } from '../utils/notification';
import {showImage} from "../services/imageService";
import {Avatar, useTheme} from "react-native-paper";


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

const ProfileAvatar = ({image, name, surname}) => {
    const theme = useTheme();
    return (
        <View style={styles.profileAvatarContainer}>
            {image ? (
                <Image
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 50,
                    }}
                    source={{uri: showImage(image)}}
                />
            ) : (
                <Avatar.Text size={80} color={theme.colors.secondary}
                             label={name?.charAt(0) + surname?.charAt(0)}
                />
            )}
        </View>
    )
}

const FollowButton = ({ onPress, isFollowing }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.followingContainer}>
            <Text style={styles.buttonText}>
                {isFollowing ? 'Following' : 'Follow'}
            </Text>
            <Icon
            name={isFollowing ? 'check' : 'plus'}
            size={30}
            color={isFollowing ? 'green' : 'blue'}
            />
        </TouchableOpacity>
    );
  };

const ProfilePublicScreen = ({ route }) => {
    const { user } = route.params;
    const navigation = useNavigation();

    const [isFollowed, setIsFollowed] = useState(false);
    const [image, setImage] = useState(null);
    const [name, setName] = useState(null);
    const [surname, setSurname] = useState(null);

    useEffect(() => {
        UserService.getUserByUsername(user.username)
            .then((userData) => {
                setName(user.name);
                setSurname(user.surname);
                setImage(userData.image);
            });

        const fetchGetFolloweds = async () => {
            let userId = await AsyncStorage.getItem('@fiufit_userId');

            UserService.getFolloweds(userId).then(async (followers) => {
                const id = user.id;

                if (followers.length > 0 && followers.some((item) => item.id === id)) {
                    setIsFollowed(true);
                }
            }).catch((error) => {
                console.log(error);
            });
        };

        fetchGetFolloweds();
    }, []);

    const handleFollowPress = async () => {
        let userId = await AsyncStorage.getItem('@fiufit_userId');
        const username = await AsyncStorage.getItem('@fiufit_username');
        const followedId = user.id;

        if(isFollowed) {
            UserService.deleteFollowed(userId, followedId).then(async (followers) => {
                setIsFollowed(false);
            }).catch((error) => {
                console.log(error);
            });
        } else {
            UserService.followUser(userId, followedId).then(async (followers) => {
                setIsFollowed(true);
                sendNotification(followedId, {
                    title: "New Follower",
                    message: `${username} is now following you!`,
                    body: {
                        type: "Follower"
                    }
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    };

    return (
        <ScrollView style={styles.profileContainer}>
            <ProfileAvatar image={image} name={name} surname={surname}/>
            <FollowButton onPress={handleFollowPress} isFollowing={isFollowed}/>
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
            {user.location && <ProfileItem
                iconName="map-marker"
                value={user.location}
            />}
            <View style={styles.followersContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.followingButton]}
                    onPress={() => navigation.navigate('FollowTabs', { user: user })}
                >
                    <Text style={styles.buttonText}>Following</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('FollowTabs', { user: user })}
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
        width: '49%'
    },
    buttonText: {
        color: whiteColor,
        fontSize: 16
    },
    followersContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    followingButton: {
        marginRight: 5,
    },
    followingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: secondaryColor,
        borderRadius: 10,
        padding: 5,
        marginBottom: 5,
        width: '30%',
        justifyContent: 'flex-end',
    },
});

export default ProfilePublicScreen;

