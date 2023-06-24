import {Text, View, ScrollView, TouchableOpacity} from "react-native";
import {primaryColor, secondaryColor, tertiaryColor, whiteColor} from "../consts/colors";
import React, { useEffect } from "react";
import { Searchbar, ActivityIndicator, useTheme } from 'react-native-paper';
import { UserService } from "../services/userService";
import {useNavigation} from "@react-navigation/native";
import {fiufitStyles} from "../consts/fiufitStyles";
import * as Location from 'expo-location';

const SearchUsersScreen = () => {
  const [usersSearch, setUsersSearch] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [notFound, setNotFound] = React.useState(false);
  const [nearUsers , setNearUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigation = useNavigation();
  const theme = useTheme();

  const onChangeSearch = query => setSearchQuery(query);

  const handleSearch= async () => {
    setUsersSearch(null);
    const response = await UserService.getUserByUsername(searchQuery);
    if (Object.keys(response).length === 0) {
        setNotFound(true);
    } else {
      response['username'] = searchQuery;
      setUsersSearch(response)
    }
  };

  const initNearUsers = async () => {
    const location = await getLocation();
    try {
      const response = await UserService.getUsersByLocation(location.coords.latitude, location.coords.longitude);
      console.log("Near users: ", response.items);
      setNearUsers(response.items);
    } catch (error) {
      console.log("Error cannot get near users: ", error);
    }
    setLoading(false);
  }

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    let userLocation = await Location.getCurrentPositionAsync({});
    console.log("Your location is: ", userLocation.coords.latitude, userLocation.coords.longitude);
    return userLocation;
  }

  useEffect(() => {
    initNearUsers();
  }, []);

  const NearUsers = () => {
    const hasNearUsers = nearUsers.length > 0;
    return (
      <View>
        {hasNearUsers && nearUsers.map((nearUser, index) => (
          <TouchableOpacity
            key = {index}
            style={fiufitStyles.userContainer}
            onPress={() => navigation.navigate("ProfilePublic", {user: nearUser})}>
              <Text style={fiufitStyles.userName}>{nearUser.username}</Text>
          </TouchableOpacity>
        ))}
        {!hasNearUsers && (
          <Text style={{
            alignSelf: 'center',
            marginTop: 10,
            color: tertiaryColor,
            fontSize: 20,
          }}>
            There are no users near you.
          </Text>
        )}
      </View>
    )
  }

  return (
    <ScrollView style={{backgroundColor: primaryColor}}>
        <Searchbar
            placeholder="Search"
            onSubmitEditing={handleSearch}
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={{backgroundColor: tertiaryColor, marginTop: 5}}
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
              <Text style={{
                alignSelf: 'center',
                marginTop: 10,
                color: tertiaryColor,
                fontSize: 20,
              }}>
                There are no results for your search.
              </Text>
            </View>
        )}

        <Text style={{
          alignSelf: 'center',
          marginTop: 10,
          color: whiteColor,
          fontSize: 32,
        }}>
          Users near you
        </Text>
        {loading 
          ? <ActivityIndicator size="large" color={theme.colors.secondary} style={{flex: 1}}/>
          : <NearUsers/>
        }
    </ScrollView>
  );
};

export default SearchUsersScreen