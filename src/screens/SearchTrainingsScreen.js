import {View, Text, ScrollView} from "react-native";
import React, {useEffect, useState} from "react";
/* import { Searchbar } from 'react-native-paper'; */
import {useNavigation} from "@react-navigation/native";
import { getTrainingsTypes, getTrainingByTypeAndDifficulty } from "../services/TrainingsService";
import {Picker} from '@react-native-picker/picker';
import Button from "../components/Button";
import {fiufitStyles} from "../consts/fiufitStyles";



const SearchTrainingsScreen = () => {
  /* const [searchQuery, setSearchQuery] = React.useState(''); */
  const [notFound, setNotFound] = React.useState(false);
  const [trainingTypes, setTrainingTypes] = React.useState({});
  const [trainingType, setTrainingType] = React.useState('');
  const [trainingDifficulty, setTrainingDifficulty] = React.useState('Easy');
  const [trainings, setTrainings] = React.useState([]);

 /*  const navigation = useNavigation(); */

  /* const onChangeSearch = query => setSearchQuery(query); */

  const handleSearch= async () => {
    const response = await getTrainingByTypeAndDifficulty(trainingType, trainingDifficulty);
    console.log("response trainings search: ", response);
    setTrainings(response.items);
  };

  useEffect(() => {
    const fetchTrainingTypes = async () => {
        console.log("Fetching trainings types...");
        const response = await getTrainingsTypes();
        setTrainingTypes(response);
    };

    fetchTrainingTypes();
  }, []);

  return (
    <ScrollView>
     {/*  <Searchbar
        placeholder="Search"
        onSubmitEditing={handleSearch}
        onChangeText={onChangeSearch}
        value={searchQuery}
      /> */}
      <Picker
          label="Type"
          selectedValue={trainingType}
          style={fiufitStyles.trainingPickerSelect}
          onValueChange={(itemValue) => setTrainingType(itemValue)}
      >
          {trainingTypes && trainingTypes.length > 0 && trainingTypes.map(trainingType => (
              <Picker.Item key={trainingType} label={trainingType} value={trainingType} />
          ))}
      </Picker>
      <Picker
          label="difficulty"
          selectedValue={trainingDifficulty}
          style={fiufitStyles.trainingPickerSelect}
          onValueChange={(itemValue) => setTrainingDifficulty(itemValue)}
      >
          <Picker.Item label="Easy" value="Easy" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="Hard" value="Hard" />
      </Picker>
      <Button onPress={handleSearch} title="Search"/>

      {notFound && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text>There is no result for your search.</Text>
        </View>
      )}
      {trainings && trainings.length > 0 && trainings.map(training => (
        <View key={training.id} style={{ alignItems: "center", marginTop: 20 }}>
            <Text>{training.tittle}</Text>
        </View>
      ))
      }
    </ScrollView>
  );
};

export default SearchTrainingsScreen