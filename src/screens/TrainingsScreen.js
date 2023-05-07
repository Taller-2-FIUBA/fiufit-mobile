import {
    SafeAreaView, ScrollView,
    Text,
    TextInput,
    View,
    TouchableOpacity,
} from 'react-native'
import React, {useState} from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, secondaryColor, tertiaryColor} from "../consts/colors";
import { IconButton, List } from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';


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

const TrainingsScreen = (navigation) => {
    const [editable, setEditable] = useState(false);

    const [trainings, setTrainings] = useState([
        {
            title: 'Training 1',
            description: 'Description 1',
            type: 'Type 1',
            difficulty: 'easy',
            media: 'Media 1',
            goal: 'Goal 1',
        },
        {
            title: 'Training 2',
            description: 'Description 2',
            type: 'Type 2',
            difficulty: 'medium',
            media: 'Media 2',
            goal: 'Goal 2',
        },
        {
            title: 'Training 3',
            description: 'Description 3',
            type: 'Type 3',
            difficulty: 'hard',
            media: 'Media 3',
            goal: 'Goal 3',
        }
    ]);

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
            <Text style={[fiufitStyles.titleText, { marginTop: -25 }]}>
                Trainings
            </Text>
    
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
                    <TrainingItem
                        value={trainings[index].type}
                        editable={editable}
                        onChange={(text) => handleInputChange(index, "type", text)}
                    />
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
                    <TrainingItem
                        value={trainings[index].goal}
                        editable={editable}
                        onChange={(text) => handleInputChange(index, "goal", text)}
                    />
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
    
            <IconButton
                icon="plus"
                type="contained-tonal"
                iconColor={tertiaryColor}
                containerColor={secondaryColor}
                style={fiufitStyles.addTrainingButton}
                size={45}
                onPress={handleNext}
            />
        </ScrollView>
    );
  };
  
  export default TrainingsScreen;