import React, {useEffect} from 'react';
import {Text, View, ScrollView, TouchableOpacity} from "react-native";
import {primaryColor, tertiaryColor} from "../consts/colors";
import { UserService } from "../services/userService";
import {useNavigation} from "@react-navigation/native";
import {fiufitStyles} from "../consts/fiufitStyles";

const FollowedsScreen = ({ route }) => {
    const { user } = route.params;

    const [followeds, setFolloweds] = React.useState(null);
    const [notFound, setNotFound] = React.useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const getFolloweds = async () => {
            const response = await UserService.getFolloweds(user.id);
            setFolloweds(response)
            if (Object.keys(response).length === 0) {
                setNotFound(true);
            }
        };
    
        getFolloweds();
    }, []);

    return (
        <ScrollView style={{backgroundColor: primaryColor}}>
            {notFound && (
                <Text style={{ 
                    alignSelf: 'center',
                    marginTop: 20,
                    color: tertiaryColor,
                    fontSize: 20
                }}>
                    No followeds found
                </Text>
            )}
            {followeds && followeds.length > 0 && followeds.map((user, index) => (
                <TouchableOpacity
                    key={index}
                    style={fiufitStyles.userContainer}
                    onPress={() => navigation.navigate("ProfilePublic", {user: user})}>
                        <Text style={fiufitStyles.userName}>{user.username}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};


export default FollowedsScreen;
