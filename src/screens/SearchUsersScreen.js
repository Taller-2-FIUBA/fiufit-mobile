import {Button, Text, View, ScrollView} from "react-native";
import React from "react";
import { Searchbar } from 'react-native-paper';
import { UserService } from "../services/userService";
import {useNavigation} from "@react-navigation/native";

const SearchUsersScreen = () => {
  const [usersSearch, setUsersSearch] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [notFound, setNotFound] = React.useState(false);
  const navigation = useNavigation();

  const onChangeSearch = query => setSearchQuery(query);

  const handleSearch= async () => {
    console.log("searchQuery: ", searchQuery);
    const response = await UserService.getUserByUsername(searchQuery);
    setUsersSearch(response)
    if (usersSearch === 'NOT_FOUND 404') {
        console.log("NOT_FOUND 404");
        setNotFound(true);
    } else {
        navigation.navigate("ProfilePublic", {user: response});
    }
  };

  const handleUserClick = (user) => {
    if (usersSearch === ' NOT_FOUND 404') {
        setNotFound(true);
    } else {
        navigation.navigate("ProfilePublic", {user: user});
    }
  }

  return (
    <ScrollView>
        <Searchbar
            placeholder="Search"
            onSubmitEditing={handleSearch}
            onChangeText={onChangeSearch}
            value={searchQuery}
        />
        {notFound && (
            <View style={{ alignItems: "center", marginTop: 20 }}>
                <Text>No hay resultados para su búsqueda.</Text>
            </View>
            )}
    </ScrollView>
  );
};

export default SearchUsersScreen