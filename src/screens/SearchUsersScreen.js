import {Button, Text, View, ScrollView, TouchableOpacity} from "react-native";
import {primaryColor, secondaryColor, tertiaryColor, whiteColor, greyColor} from "../consts/colors";
import React from "react";
import { Searchbar } from 'react-native-paper';
import { UserService } from "../services/userService";
import {useNavigation} from "@react-navigation/native";
import {fiufitStyles} from "../consts/fiufitStyles";

const SearchUsersScreen = () => {
  const [usersSearch, setUsersSearch] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [notFound, setNotFound] = React.useState(false);
  const navigation = useNavigation();

  const onChangeSearch = query => setSearchQuery(query);

  const handleSearch= async () => {
    const response = await UserService.getUserByUsername(searchQuery);
    console.log('getUserByUsername response: ', response);
    if (Object.keys(response).length === 0) {
        setNotFound(true);
    } else {
      response['username'] = searchQuery;
      setUsersSearch(response)
    }
  };

  return (
    <ScrollView style={{backgroundColor: primaryColor}}>
        <Searchbar
            placeholder="Search"
            onSubmitEditing={handleSearch}
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={{backgroundColor: secondaryColor, marginTop: 5}}
        />
        {usersSearch && (
            <TouchableOpacity
              style={fiufitStyles.userContainer}
              onPress={() => navigation.navigate("ProfilePublic", {user: usersSearch})}>
                  <Text style={fiufitStyles.userName}>{usersSearch.username}</Text>
            </TouchableOpacity>
        )}
        {notFound && (
            <View style={{ alignItems: "center", marginTop: 20 }}>
                <Text>There are no results for your search.</Text>
            </View>
            )}
    </ScrollView>
  );
};

export default SearchUsersScreen