import {ScrollView, Text} from "react-native";
import React, { useEffect } from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, secondaryColor, tertiaryColor, whiteColor, greyColor} from "../consts/colors";
import { Searchbar } from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import { UserService } from "../services/userService";



const ChatScreen = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const navigation = useNavigation();

    useEffect(() => {
        //TODO agregar buscar chats del usuario en firebase
    }, []);
    

    const onChangeSearch = query => setSearchQuery(query);

    const handleSearch= async () => {
        const response = await UserService.getUserByUsername(searchQuery);
        if (Object.keys(response).length === 0) {
            setNotFound(true);
        } else {
            navigation.navigate("PrivateChat", {user: response});
        }
    };

    return (
        <ScrollView style={{backgroundColor: primaryColor}}>
            <Searchbar
                placeholder="Search"
                onSubmitEditing={handleSearch}
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={{backgroundColor: secondaryColor, marginTop: 5, color: whiteColor}}
            />
        </ScrollView>
    )
}

export default ChatScreen
