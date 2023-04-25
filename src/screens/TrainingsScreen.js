import {
    SafeAreaView, ScrollView,
    Text,
    View
} from 'react-native'
import {useNavigation} from "@react-navigation/native";
import React, {useState} from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, secondaryColor, tertiaryColor} from "../consts/colors";
import { IconButton, List } from 'react-native-paper';


const TrainingsScreen = () => {
    const navigation = useNavigation();

    const [training, setTraining] = useState({
        title: '',
        description: '',
        type: '',
        difficulty: 'easy',
        media: '',
        goal: '',
    });

    const [expanded, setExpanded] = React.useState(true);

    const handlePress = () => setExpanded(!expanded);

    const handleNext = () => {
        navigation.navigate('CreateTraining');
    }

    return (
        <View style={fiufitStyles.container}>
            <Text style={[fiufitStyles.titleText, {marginTop: -25}]}>
                Trainings
            </Text>
            <List.Accordion
                style={{ height: 50, width: 350 }}
                left={props => <List.Icon {...props} icon="bike" />}>
                <List.Item title="First item" />
                <List.Item title="Second item" />
            </List.Accordion>

            <List.Accordion
                style={{ height: 50, width: 350 }}
                left={props => <List.Icon {...props} icon="bike" />}
                expanded={expanded}
                onPress={handlePress}>
                <List.Item style={{color: tertiaryColor}} title="First item" />
                <List.Item title="Second item" />
            </List.Accordion>
            <IconButton
                icon="plus"
                type='contained-tonal'
                iconColor={tertiaryColor}
                containerColor={secondaryColor}
                style={{
                    position: 'absolute',
                    bottom: 20,  // ajusta la posición vertical del botón
                    right: 20,
                }}
                size={45}
                onPress={handleNext}
            />
        </View>
    )
}

export default TrainingsScreen
