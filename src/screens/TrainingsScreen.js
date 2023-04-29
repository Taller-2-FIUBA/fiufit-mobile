import {
    SafeAreaView, ScrollView,
    Text,
    TouchableOpacity,
} from 'react-native'
import {useNavigation} from "@react-navigation/native";
import React, {useState} from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, secondaryColor, tertiaryColor} from "../consts/colors";
import { IconButton, List } from 'react-native-paper';

const TrainingsScreen = () => {
    const navigation = useNavigation();

    const trainings = [
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
    ];

    const [expandedList, setExpandedList] = useState(trainings.map(() => false));

    const handlePress = (index) => {
        const newList = [...expandedList];
        newList[index] = !newList[index];
        setExpandedList(newList);
    }

    const handleNext = () => {
        navigation.navigate('CreateTraining');
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={fiufitStyles.container}>
            <Text style={[fiufitStyles.titleText, { marginTop: -25 }]}>
                Trainings
            </Text>
    
            {trainings.map((training, index) => (
                <List.Accordion
                key={index}
                style={{ height: 50, width: 350, backgroundColor: tertiaryColor }}
                left={(props) => <List.Icon {...props} icon="bike" />}
                title={training.title}
                titleStyle={{ color: primaryColor }}
                expanded={expandedList[index]}
                onPress={() => handlePress(index)}
                >
                <List.Item
                    title={`Description: ${training.description}`}
                    titleStyle={{ color: tertiaryColor }}
                />
                <List.Item
                    title={`Type: ${training.type}`}
                    titleStyle={{ color: tertiaryColor }}

                />
                <List.Item
                    title={`Difficulty: ${training.difficulty}`}
                    titleStyle={{ color: tertiaryColor }}
                />
                <List.Item
                    title={`Media: ${training.media}`}
                    titleStyle={{ color: tertiaryColor }}
                />
                <List.Item
                    title={`Goal: ${training.goal}`}
                    titleStyle={{ color: tertiaryColor }}
                />
                <TouchableOpacity
                    style={fiufitStyles.editButton}
                    onPress={handleNext}
                >
                    <IconButton
                        icon="pencil"
                        iconColor={tertiaryColor}
                        style={{backgroundColor: secondaryColor}}
                        size={30}
                    />
                </TouchableOpacity>
                </List.Accordion>
            ))}
    
            <IconButton
                icon="plus"
                type="contained-tonal"
                iconColor={tertiaryColor}
                containerColor={secondaryColor}
                style={fiufitStyles.trainingButton}
                size={45}
                onPress={handleNext}
            />
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default TrainingsScreen;