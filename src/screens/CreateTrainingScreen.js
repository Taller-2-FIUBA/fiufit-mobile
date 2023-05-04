import {
    SafeAreaView, ScrollView,
    Text,
    View
} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import {TextInput} from 'react-native-paper';
import React, {useState} from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, secondaryColor, tertiaryColor} from "../consts/colors";
import Button from "../components/Button";

const CreateTrainingScreen = (navigation) => {
    const [training, setTraining] = useState({
        title: '',
        description: '',
        type: '',
        difficulty: 'easy',
        media: '',
        goal: '',
    });

    const handleInputChange = (key, value) => {
        setTraining({...training, [key]: value});
    };

    const handleCreate = () => {
        navigation.navigate('Trainings');
    }

    const createTraining = (training) => {
        fetch(baseURL + trainings, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    Alert.alert(data.error);
                }

                ToastAndroid.show("Training created successfully", ToastAndroid.SHORT);
                navigation.navigate('Trainings');
            })
            .catch(error => {
                console.log(error);
                Alert.alert(error.message);
                navigation.navigate('Login');
            });
    }

    return (
        <View style={fiufitStyles.container}>
            <SafeAreaView style={{
            backgroundColor: primaryColor,
            flex: 1,
        }}>
                <ScrollView contentContainerStyle={{
                    paddingTop: 50, paddingHorizontal: 20,
                }}>
                    <Text style={[fiufitStyles.titleText, {marginTop: -25}]}>
                        Training
                    </Text>
                    <Text style={fiufitStyles.detailsText}>
                        Enter your details to register a training
                    </Text>
                    <View style={{marginVertical: 20}}>
                        <TextInput
                            style={fiufitStyles.createTrainingInput}
                            label="Title"
                            value={training.title}
                            onChangeText={text => handleInputChange('title', text)}
                        />
                        <TextInput
                            style={fiufitStyles.createTrainingInput}
                            label="Description"
                            value={training.description}
                            onChangeText={text => handleInputChange('description', text)}
                        />
                        <TextInput
                            style={fiufitStyles.createTrainingInput}
                            label="Type"
                            value={training.type}
                            onChangeText={text => handleInputChange('type', text)}
                        />
                        <Picker
                            selectedValue={training.difficulty}
                            style={fiufitStyles.trainingPickerSelect}
                            onValueChange={(itemValue) => handleInputChange('difficulty', itemValue)}
                        >
                            <Picker.Item label="easy" value="easy" />
                            <Picker.Item label="medium" value="medium" />
                            <Picker.Item label="hard" value="hard" />
                        </Picker>
                        <TextInput
                            style={fiufitStyles.createTrainingInput}
                            label="Media"
                            value={training.media}
                            onChangeText={text => handleInputChange('media', text)}
                        />
                        <TextInput
                            style={fiufitStyles.createTrainingInput}
                            label="Goals"
                            value={training.media}
                            onChangeText={text => handleInputChange('goal', text)}
                        />
                        <Button onPress={handleCreate} title="Register"/>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default CreateTrainingScreen