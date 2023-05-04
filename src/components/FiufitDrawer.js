import {DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";
import {Alert, Text, TouchableOpacity, View} from "react-native";
import {Avatar, useTheme} from "react-native-paper";
import React, {useEffect, useState} from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import authService from "../services/authService";
import userService from "../services/userService";

const FiufitDrawer = (props) => {
    const theme = useTheme();
    const [userData, setUserData] = useState({
        name: '',
        surname: '',
        username: '',
    });

    useEffect(() => {
        userService.getUser().then((profile) => {
            setUserData(profile);
        }).catch((error) => {
            console.log(error);
            Alert.alert("Error", "Something went wrong while fetching user data. Please try again later.");
        });
    }, []);

    const handleLogout = () => {
        authService.logout().then(data => {
            props.navigation.replace('Login');
        }).catch(error => {
            console.log(error);
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
                    <Avatar.Text size={50} color={theme.colors.secondary}
                                 label={userData.name.charAt(0) + userData.surname.charAt(0)}
                                 style={{
                                     backgroundColor: theme.colors.primary,
                                     marginTop: 20,
                                     marginBottom: 10,
                                 }}/>
                </TouchableOpacity>
                <Text
                    style={{
                        color: theme.colors.tertiary,
                        fontSize: 15,
                        fontFamily: 'Roboto',
                        fontWeight: 'bold',
                        marginBottom: 20,
                    }}>
                    {userData.username}
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
