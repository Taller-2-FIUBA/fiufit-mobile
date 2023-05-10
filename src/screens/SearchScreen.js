import {View, Text} from "react-native";
import React from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import { Searchbar } from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";


const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const navigation = useNavigation();

  const onChangeSearch = query => setSearchQuery(query);

  const handleSearch= () => {
    navigation.navigate('SearchResult');
  };

  return (
    <Searchbar
      placeholder="Search"
      onChangeText={handleSearch}
      value={searchQuery}
    />
  );
};

export default SearchScreen
