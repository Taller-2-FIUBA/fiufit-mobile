import {View, Text} from "react-native";
import React from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import { Searchbar } from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";


const SearchTrainingsScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigation = useNavigation();

  const onChangeSearch = query => setSearchQuery(query);

  const handleSearch= () => {
    navigation.navigate('SearchResult');
  };

  return (
    <Searchbar
      placeholder="Search"
      onSubmitEditing={handleSearch}
      onChangeText={onChangeSearch}
      value={searchQuery}
    />
  );
};

export default SearchTrainingsScreen