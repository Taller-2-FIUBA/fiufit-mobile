import {ScrollView, Text, View, TouchableOpacity} from "react-native";
import React, { useEffect } from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, secondaryColor} from "../consts/colors";
import { Searchbar, Avatar, useTheme} from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import { UserService } from "../services/userService";
import { doc, onSnapshot} from "firebase/firestore";
import { db } from "../utils/firebase"
import AsyncStorage from "@react-native-async-storage/async-storage";


const ChatScreen = () => {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [chatsInfo, setChatsInfo] = React.useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        getUserChats();
    }, []);

    const ChatMessageIntro = ({chatInfo}) => {
        const {user} = chatInfo;

        return (
            <TouchableOpacity style={fiufitStyles.chatMessageIntro} onPress={event => handleGoToChat(event, chatInfo)}>
                <Avatar.Icon size={60} icon="account-circle"
                    color={theme.colors.primary}
                    style={{
                        marginLeft: 2,
                        backgroundColor: primaryColor,
                    }}
                />
                <Text style={{color: theme.colors.tertiary, fontSize: 18}}>{user.username}</Text>
            </TouchableOpacity>   
        )
    }

    const getUserChats = async () => {
        console.log("Buscar chats del usuario");
        const userId =  await AsyncStorage.getItem('@fiufit_userId');
        console.log("UserId --> ", userId);
        onSnapshot(doc(db, "usersChats", userId), async (doc) => {
            let chatsDocInfo = [];
            if (doc.exists()) {
                for (const chat of doc.data().chats) {
                    console.log("Chat --> ", chat);
                    const user = await getUserInfoFromId(chat.userId);
                    chatsDocInfo.push({user: user, conversationId: chat.conversationId});
                }
            }
            setChatsInfo(chatsDocInfo);
        });
    }

    const getUserInfoFromId = async (userId) => {
        const response = await UserService.getUserById(userId);
        return response;
    }

    const onChangeSearch = query => setSearchQuery(query);

    const handleSearch= async () => {
        const response = await UserService.getUserByUsername(searchQuery);
        if (Object.keys(response).length === 0) {
            //TODO mostrar mensaje de que no se encontro el usuario
        } else {
            let conversationId = null;
            console.log("Response --> ", response);
            for (const chat of chatsInfo) {
                console.log("Chat --> ", chat);
                if (chat.userId == response.id) {
                    conversationId = chat.conversationId;
                }
            }
            const chatInfo = {user: response, conversationId: conversationId};
            console.log("ChatInfo --> ", chatInfo);
            navigation.navigate("PrivateChat", {chatInfo});
        }
    };

    const handleGoToChat = async (event, chatInfo) => {
        event.preventDefault();
        navigation.navigate("PrivateChat", { chatInfo });
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
            {chatsInfo && chatsInfo.length > 0 && chatsInfo.map((chatInfo, index) => (
              <ChatMessageIntro key={index}  chatInfo={chatInfo} />
            ))}
        </ScrollView>
    )
}

export default ChatScreen
