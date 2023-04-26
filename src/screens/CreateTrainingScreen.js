import {
    SafeAreaView, ScrollView,
    Text,
    View
} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import {TextInput} from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import React, {useState} from "react";
import {fiufitStyles} from "../consts/fiufitStyles";
import {primaryColor, secondaryColor, tertiaryColor} from "../consts/colors";
import Button from "../components/Button";

const CreateTrainingScreen = () => {
    const navigation = useNavigation();

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

        /* Keyboard.dismiss();

        if (errorDate) {
            setErrorDate(false);
        }

        if (validateForm()) {
            const updatedUser
                = { ...user, height: parseFloat(meters + '.' + centimeters), weight: parseInt(weight) };

            signUpUser(updatedUser);
        } */
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
            <Text style={fiufitStyles.buttonText}>
                Trainings Screen
            </Text>
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
                        Enter your details to register a Training
                    </Text>
                    <View style={{marginVertical: 20}}>
                        <TextInput
                            label="Title"
                            mode='flat'
                            value={training.title}
                            onChangeText={text => handleInputChange('title', text)}
                        />
                        <TextInput
                            label="Description"
                            mode='flat'
                            value={training.description}
                            onChangeText={text => handleInputChange('description', text)}
                        />
                        <TextInput
                            label="Type"
                            mode='flat'
                            value={training.type}
                            onChangeText={text => handleInputChange('type', text)}
                        />
                        <Picker
                            selectedValue={training.difficulty}
                            style={[{
                                backgroundColor: secondaryColor,
                                color: tertiaryColor
                            },fiufitStyles.pickerSelect, { height: 50, width: 150 }]}
                            onValueChange={(itemValue, itemIndex) => handleInputChange('difficulty', itemValue)}
                        >
                            <Picker.Item label="easy" value="easy" />
                            <Picker.Item label="medium" value="medium" />
                            <Picker.Item label="hard" value="hard" />
                        </Picker>
                        <TextInput
                            label="Media"
                            mode='flat'
                            value={training.media}
                            onChangeText={text => handleInputChange('media', text)}
                        />
                        <TextInput
                            label="Goals"
                            mode='flat'
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