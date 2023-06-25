import React, {useEffect} from 'react';
import {Text, View, ScrollView, TouchableOpacity} from "react-native";
import {primaryColor} from "../consts/colors";
import { UserService } from "../services/userService";
import {useNavigation} from "@react-navigation/native";
import {fiufitStyles} from "../consts/fiufitStyles";

const FollowersScreen = ({ route }) => {
    const { user } = route.params;

    const [usersSearch, setUsersSearch] = React.useState(null);
    const [notFound, setNotFound] = React.useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const getFollowers = async () => {
            const response = await UserService.getFollowers(user.id);
            console.log('fetching followers for: ', user.id, response);
            setUsersSearch(response)
            if (Object.keys(response).length === 0) {
                setNotFound(true);
            }
        };
    
        getFollowers();
    }, []);

    return (
        <ScrollView style={{backgroundColor: primaryColor}}>
            {notFound && (
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <Text>No followers found.</Text>
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
