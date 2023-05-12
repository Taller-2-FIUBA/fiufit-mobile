import {
    SafeAreaView, ScrollView,
    Text,
    TextInput,
    View,
    TouchableOpacity,
} from 'react-native'
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, secondaryColor, tertiaryColor, redColor} from "../consts/colors";
import { FAB, IconButton, List } from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import {
    getTrainingsTypes, 
    validateForm, trimUserData
} from "../services/TrainingsService";

const TrainingItem = ({value, editable, onChange}) => {
    return (
        <View style={fiufitStyles.trainingItemContainer}>
            <TextInput
                style={editable ? fiufitStyles.trainingInput : fiufitStyles.trainingNotEditableInpunt}
                value={value}
                onChangeText={onChange}
                editable={editable}
            />
        </View>
    )
}

const TrainingsScreen = () => {
    const navigation = useNavigation();
    const [editable, setEditable] = useState(false);
    const [errors, setErrors] = useState({});
    const [trainingTypes, setTrainingTypes] = useState({});

    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
    };

    const exercises = [["walk", "km"], ["walk", "minute"], ["jumping jacks", "repetitions"]];

    const [trainings, setTrainings] = useState([
        {
            title: 'Training 1',
            description: 'Description 1',
            type: 'Type 1',
            difficulty: 'easy',
            media: 'Media 1',
            exercises: 'walk',
        },
        {
            title: 'Training 2',
            description: 'Description 2',
            type: 'Type 2',
            difficulty: 'medium',
            media: 'Media 2',
            exercises: 'walk',
        },
        {
            title: 'Training 3',
            description: 'Description 3',
            type: 'Type 3',
            difficulty: 'hard',
            media: 'Media 3',
            exercises: 'walk',
        }
    ]);

    useEffect(() => {
        const fetchTrainingTypes = async () => {
            console.log("Fetching trainings types...");
            const response = await getTrainingsTypes();
            setTrainingTypes(response);
        };
    
        fetchTrainingTypes();
    }, []);

    const [expandedList, setExpandedList] = useState(trainings.map(() => false));

    const handlePress = (index) => {
        const newList = [...expandedList];
        newList[index] = !newList[index];
        setExpandedList(newList);
    }

    const handleInputChange = (index, field, text) => {
        const newTrainings = [...trainings];
        newTrainings[index][field] = text;
        setTrainings(newTrainings);
      };

    const handleEditAction = (index) => {
        setEditable(true);
    }

    const handleSaveAction = (index) => {
        //updateTraining();
        handleError(null, 'title')
        handleError(null, 'media')

        trimUserData(trainings[index]);
        if (!validateForm(trainings[index])) {
            return;
        }        
        setEditable(false);
    };

    const handleCancelAction = () => {
        setEditable(false);
    };

    const handleNext = () => {
        navigation.navigate('CreateTraining');
    }

    /*
    const updateTraining = (index) => {
         console.log("Update profile: ", expandedList[index]);
        let copyTraining = {...userProfile};

        fetch(baseURL + trainingURI + '/' + trainingId, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(copyTraining)
        })
        .then((response) => response.json())
        .then(() => {
            setEditable(false);
        })
        .catch((error) => {
            console.log("Error: ", error.message);
        });
    }; */

    return (
            <ScrollView contentContainerStyle={fiufitStyles.container}>
            <Text style={{
                        ...fiufitStyles.titleText,
                        alignSelf: 'center',
                        marginTop: 10,
                    }}>
                        Trainings
                    </Text>
                    {trainings.length === 0 && (
                        <Text style={{
                            alignSelf: 'center',
                            marginTop: 10,
                            color: theme.colors.tertiary,
                            fontSize: 20,
                        }}>
                            You have no trainings yet, add one!
                        </Text>
                    )}
    
            {trainings.map((training, index) => (
                <List.Accordion
                key={index}
                style={fiufitStyles.trainingsList}
                left={(props) => <List.Icon {...props} icon="bike" />}
                title={training.title}
                titleStyle={{ color: primaryColor }}
                expanded={expandedList[index]}
                onPress={() => handlePress(index)}
                >
                    <TrainingItem
                        value={training.description}
                        editable={editable}
                        onChange={(text) => handleInputChange(index, "description", text)}
                    />
                    {editable && 
                        <Picker
                                selectedValue={trainings[index].type}
                                style={fiufitStyles.trainingPickerSelect}
                                onValueChange={(index) => handleInputChange(index, "type", text)}
                            >
                                {trainingTypes && trainingTypes.length > 0 && trainingTypes.map(trainingType => (
                                    <Picker.Item key={trainingType} label={trainingType} value={trainingType} />
                                ))}
                            </Picker>
                    }
                    {!editable && <TrainingItem
                        value={trainings[index].type}
                        editable={editable}
                        onChange={(text) => handleInputChange(index, "type", text)}
                    />
                    }
                    {editable && 
                        <Picker
                            selectedValue={training.difficulty}
                            style={fiufitStyles.trainingPickerSelect}
                            onValueChange={(itemValue) => handleInputChange(index, 'difficulty', itemValue)}
                        >
                            <Picker.Item label="easy" value="easy" />
                            <Picker.Item label="medium" value="medium" />
                            <Picker.Item label="hard" value="hard" />
                        </Picker>
                    }
                    {!editable && <TrainingItem
                        value={trainings[index].difficulty}
                        editable={editable}
                        onChange={(text) => handleInputChange(index, "difficulty", text)}
                    />
                    }
                    <TrainingItem
                        value={trainings[index].media}
                        editable={editable}
                        onChange={(text) => handleInputChange(index, "media", text)}
                    />
                    {errors.media &&
                        <Text style={{color: redColor, fontSize: 14, paddingBottom: 10, textAlign: 'left'}}>{errors.media}</Text>
                    }
                    
                    {editable && 
                        <Picker
                            selectedValue={trainings[index].exercises}
                            style={fiufitStyles.trainingPickerSelect}
                            onValueChange={(text) => handleInputChange(index, 'exercise', text)}
                        >
                            {exercises.map(([exercise, measure], index) => {
                                const label = `${exercise} ${measure}`;
                                return (
                                    <Picker.Item key={index} label={label} value={`${exercise},${measure}`}/>
                                );
                            })}
                        </Picker>
                    }
                    {!editable && <TrainingItem
                        value={trainings[index].exercises}
                        editable={editable}
                        onChange={(text) => handleInputChange(index, "exercises", text)}
                    />
                    }
                    {!editable && 
                        <TouchableOpacity
                            style={fiufitStyles.editButton}
                            onPress={handleEditAction}
                        >
                            <IconButton
                                icon="pencil"
                                iconColor={tertiaryColor}
                                style={{backgroundColor: secondaryColor}}
                                size={30}
                            />
                        </TouchableOpacity>
                    }   
                    {editable && 
                        <View style={fiufitStyles.trainingButtonContainer}>
                            <TouchableOpacity style={{...fiufitStyles.trainingActionButton, marginRight: 5}} onPress={() => handleSaveAction(index)}>
                                <Text style={fiufitStyles.trainingActionButtonText}>{'Save'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={fiufitStyles.trainingActionButton} onPress={handleCancelAction}>
                                <Text style={fiufitStyles.trainingActionButtonText}>{'Cancel'}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </List.Accordion>
            ))}
    
            <FAB
                icon="plus"
                type="contained-tonal"
                style={fiufitStyles.addTrainingButton}
                size={45}
                onPress={handleNext}
                color={tertiaryColor}
            />
        </ScrollView>
    );
  };
  
  export default TrainingsScreen;