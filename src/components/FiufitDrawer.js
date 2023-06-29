import {DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";
import {Alert, Image, Text, TouchableOpacity, View} from "react-native";
import {Avatar, useTheme} from "react-native-paper";
import React, {useEffect, useState} from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import authService from "../services/authService";
import {UserService} from "../services/userService";
import {decode} from "base-64";
import {showImage} from "../services/imageService";
import FastImage from "react-native-fast-image";

const FiufitDrawer = (props) => {
    const theme = useTheme();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [userName, setUserName] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        UserService.getUserUsername()
            .then((username) => {
                UserService.getUserByUsername(username)
                    .then((userData) => {
                        setUserName(username?.toString());
                        setName(userData.name);
                        setSurname(userData.surname);
                        setImage(userData.image);
                    });
            })
            .catch(() => {
                Alert.alert("Error", "Something went wrong while fetching user data. Please try again later.");
            });
    }, []);

    const handleLogout = () => {
        authService.logout().then(() => {
            props.navigation.replace('Login');
        }).catch(() => {
            Alert.alert("Error", "Something went wrong while logging out. Please try again later.");
        });
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.colors.background,
        }}>
            <View style={{
                backgroundColor: theme.colors.background,
                marginLeft: 20,
                marginRight: 20,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.primary,
            }}>
                <TouchableOpacity onPress={() => props.navigation.navigate("Profile")}>
                    {image ? (
                        <FastImage 
                            source={{
                                uri: showImage(image),
                                priority: FastImage.priority.normal,    
                            }} 
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                marginTop: 20,
                                marginBottom: 10,
                        }}/>
                    ) : (
                        <Avatar.Text size={100} color={theme.colors.secondary}
                                     label={name?.charAt(0) + surname?.charAt(0)}
                                     style={{
                                         backgroundColor: theme.colors.primary,
                                         marginTop: 20,
                                         marginBottom: 10,
                                     }}/>
                    )}
                </TouchableOpacity>
                <Text
                    style={{
                        color: theme.colors.tertiary,
                        fontSize: 15,
                        fontFamily: 'Roboto',
                        fontWeight: 'bold',
                        marginBottom: 20,
                    }}>
                    {userName}
                </Text>
            </View>
            <DrawerContentScrollView {...props} contentContainerStyle={{
                backgroundColor: theme.colors.background,
                flex: 1
            }}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <View style={{
                borderTopWidth: 1,
                borderTopColor: theme.colors.primary,
                marginLeft: 20,
                marginRight: 20,
                flexDirection: 'row',
                justifyContent: 'flex-end',
            }}>
                <TouchableOpacity onPress={handleLogout} style={{
                    marginTop: 10,
                    marginBottom: 10,
                    alignContent: 'flex-end',
                    justifyContent: 'flex-start',
                    width: '40%',
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{marginRight: 10, color: theme.colors.secondary}}>Logout</Text>
                        <Icon name="logout" size={30} color={theme.colors.secondary}/>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default FiufitDrawer;
