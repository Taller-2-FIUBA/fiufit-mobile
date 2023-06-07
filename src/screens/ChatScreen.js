import {ScrollView, Text, View, TouchableOpacity} from "react-native";
import React, { useEffect } from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, secondaryColor} from "../consts/colors";
import { Searchbar, Avatar, useTheme} from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import { UserService } from "../services/userService";
import { color } from "react-native-reanimated";


const ChatScreen = () => {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [userChats, setUserChats] = React.useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        //TODO agregar buscar chats del usuario en firebase
        getUserChats();
    }, []);

    const ChatMessageIntro = ({user}) => {
        return (
            <View >
                <TouchableOpacity style={fiufitStyles.chatMessageIntro} onPress={user => handleGoToChat(user)}>
                    <Avatar.Icon size={60} icon="account-circle"
                        color={theme.colors.primary}
                        style={{
                            marginLeft: 2,
                            backgroundColor: primaryColor,
                        }}
                    />
                    <Text style={{color: theme.colors.tertiary, fontSize: 18}}>{user.username}</Text>
                </TouchableOpacity>   
            </View>
        )
    }

    const getUserChats = async () => {
        console.log("Buscar chats del usuario");
        const usersIds = [6, 4];
        let users = [];
        for (const userId of usersIds) {
            const user = await getUserInfoFromId(userId)
            users.push(user);
        }
        console.log("Users --> ", users);
        setUserChats(users);
    }

    const getUserInfoFromId = async (userId) => {
        const response = await UserService.getUserById(userId);
        return response;
    }

    const onChangeSearch = query => setSearchQuery(query);

    const handleSearch= async () => {
        const response = await UserService.getUserByUsername(searchQuery);
        if (Object.keys(response).length === 0) {
            setNotFound(true);
        } else {
            navigation.navigate("PrivateChat", {user: response});
        }
    };

    const handleGoToChat = async (user) => {
        navigation.navigate("PrivateChat", {user: user});
    }

    return (
        <ScrollView style={{backgroundColor: primaryColor}}>
            <Searchbar
                placeholder="Search..."
                placeholderTextColor={theme.colors.tertiary}
                onSubmitEditing={handleSearch}
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={{backgroundColor: secondaryColor, marginTop: 5, color: theme.colors.tertiary, marginBottom: 5}}
            />
            {userChats && userChats.length > 0 && userChats.map((userChat, index) => (
              <ChatMessageIntro key={index}  user={userChat} />
            ))}
        </ScrollView>
    )
}

export default ChatScreen
