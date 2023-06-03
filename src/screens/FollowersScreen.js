import React, {useEffect} from 'react';
import {Button, Text, View, ScrollView, TouchableOpacity} from "react-native";
import {primaryColor, secondaryColor, tertiaryColor, whiteColor, greyColor} from "../consts/colors";
import { Searchbar } from 'react-native-paper';
import { UserService } from "../services/userService";
import {useNavigation} from "@react-navigation/native";
import {fiufitStyles} from "../consts/fiufitStyles";

const FollowersScreen = ({ route }) => {
    const { user } = route.params;

    const [usersSearch, setUsersSearch] = React.useState(null);
    const [notFound, setNotFound] = React.useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const getFolloweds = async () => {
            const response = await UserService.getFolloweds(user.id);
            setUsersSearch(response)
            if (Object.keys(response).length === 0) {
                setNotFound(true);
            }
        };
    
        getFolloweds();
    }, []);

    return (
        <ScrollView style={{backgroundColor: primaryColor}}>
            {notFound && (
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <Text>There are no results for your search.</Text>
                </View>
            )}
            {usersSearch && usersSearch.length > 0 && usersSearch.map(user => (
                <TouchableOpacity
                    style={fiufitStyles.userContainer}
                    onPress={() => navigation.navigate("ProfilePublic", {user: user})}>
                        <Text style={fiufitStyles.userName}>{user.username}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};


export default FollowersScreen;
