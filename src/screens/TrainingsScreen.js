import {
    ScrollView,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {fiufitStyles} from "../consts/fiufitStyles";
import {redColor, primaryColor, secondaryColor, tertiaryColor, greyColor, whiteColor} from "../consts/colors";
import { ActivityIndicator, FAB, IconButton, List, useTheme, Button as PapperButton, Searchbar } from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import {
    getTrainingsByTrainerId, updateTraining, getValidationData, trimUserData, getTrainingsTypes, getTrainingByTrainerTypeDifficultyAndTitle
} from "../services/TrainingsService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {UserService} from "../services/userService";
import {getTrainingById} from "../services/TrainingsService";
import {useIsFocused} from "@react-navigation/core";
import {pickImageFromGallery, showImage} from "../services/imageService";
import FastImage from "react-native-fast-image";
import Button from "../components/Button";

const TrainingItem = ({value, editable, onChange}) => {
    return (
    <View style={fiufitStyles.trainingItemContainer}>
        <TextInput
            style={fiufitStyles.trainingNotEditableInpunt}
            value={value}
            onChangeText={onChange}
            editable={editable}
        />
    </View>
    )
}

const TrainingEditableItem = ({value, editable, onChange, error, onFocus = () => {}, ...props}) => {
        const [isFocused, setIsFocused] = useState(false);

        return (
            <View>
            <View style={
            [fiufitStyles.trainingItemContainer, {borderColor: error ? redColor : isFocused ? tertiaryColor : secondaryColor,
            }]}>
            <TextInput
                style={[editable ? styles.trainingInput : styles.trainingNotEditableInpunt,
                    ]}
                autoCorrect={false}
                onFocus={() => {
                    onFocus();
                    setIsFocused(true);
                }}
                onBlur={() => setIsFocused(false)}
                value={value}
                onChangeText={onChange}
                editable={editable}
                {...props}
            />
            </View>
            {error &&
            <Text style={{color: redColor, marginLeft: 15, fontSize: 12, marginTop: 1, marginBottom: 2}}>{error}</Text>
            }
            </View>
        )
}

const TrainingsScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [editable, setEditable] = useState(false);
    const [errors, setErrors] = useState({});
    const [isTrainer, setIsTrainer] = useState(true);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();
    const [trainings, setTrainings] = useState([]);
    const [trainingsToShow, setTrainingsToShow] = useState([]);
    const [expandedList, setExpandedList] = useState(trainings && trainings.map(() => false));
    const [trainingTypes, setTrainingTypes] = useState({});
    const [trainingType, setTrainingType] = React.useState('');
    const [trainingDifficulty, setTrainingDifficulty] = useState('Easy');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [notFound, setNotFound] = useState(false);
    const [firstFetch, setFirstFetch] = useState(true);

    useEffect(() => {
        initTrainings();
    }, []);

    useEffect(() => {
        if (isFocused) {
            if (firstFetch) {
                setFirstFetch(false);
            } else {
                setLoading(true);
                console.log("Start fetching trainings by id");
                fetchGetTrainingsById(isTrainer)
                    .catch(error => {  
                        console.log("An error in fetching: ", error);
                    }).finally(() => {
                        setLoading(false);
                    })
            }
        }
    }, [isFocused]);

    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
    };
    const handleResetFilters = () => {
        if (trainingTypes && trainingTypes.length > 0) {
            setTrainingType(trainingTypes[0]);
        }
        setTrainingDifficulty('Easy');
        setSearchQuery('');
        setTrainingsToShow(trainings);
        setNotFound(false);
    };

    const fetchTrainingTypes = async () => {
        const response = await getTrainingsTypes();
        setTrainingTypes(response);
        if (response.length > 0) {
            setTrainingType(response[0]);
        }
    };

    const enhanceRatings = async (trainings) => {
        for (let training of trainings) {
            const myRating = await UserService.getUserRaiting(training.id);
            training.myRating = myRating.rate;
        }
    };

    const fetchGetTrainingsById = async (isTrainerResult) => {
        const userId = await AsyncStorage.getItem('@fiufit_userId');
        const trainingResponse = isTrainerResult
            ? await getTrainingsByTrainerId(userId)
            : await UserService.getTrainingsByUserId(userId);
        
        if(!isTrainerResult) {
            await enhanceRatings(trainingResponse);
        }
        setTrainings(trainingResponse);
        setTrainingsToShow(trainingResponse);
    }

    const initTrainings = async () => {
        console.log("Init Trainings");
        try {
            const isTrainerResult = await AsyncStorage.getItem('@fiufit_is_trainer');
            await fetchTrainingTypes();
            await fetchGetTrainingsById(isTrainerResult === 'true');
            setIsTrainer(isTrainerResult === 'true');
            setLoading(false)
        } catch (error) {
            console.error('Error while fetching trainings: ', error);
        }
    };

    const onChangeSearch = query => setSearchQuery(query);

    const handleSearch= async () => {
        setLoading(true);
        const trainerId = await AsyncStorage.getItem('@fiufit_userId');
        const response = await getTrainingByTrainerTypeDifficultyAndTitle(trainingType, trainingDifficulty, searchQuery, trainerId);
        setNotFound(response?.length === 0);
        setTrainingsToShow(response);
        setLoading(false);
    };

    const toogleExpanded = (index) => {
        const newList = [...expandedList];
        newList[index] = !newList[index];
        setExpandedList(newList);
    }

    const handleInputChange = (index, field, text) => {
        const newTrainings = [...trainings];
        newTrainings[index][field] = text;
        setTrainings(newTrainings);
      };

    const handleEditAction = (event, index) => {
        setEditable(true);
    }

    const handleDeleteTrainingAction = async (event, index) => {
        event.stopPropagation();
        const trainingId = trainings[index]?.id;
        try {
            setLoading(true);
            await UserService.deleteFavouriteTraining(trainingId);
            await fetchGetTrainingsById(isTrainer);
        } catch (error) {
            console.log('Error while deleting favourite trainings: ', error);
        } finally {
            setLoading(false);
        }
    }

    // Validate form
    const validateForm = async (training) => {
        let valid = true;
        try {
            const validationData = getValidationData(training)
            for (const {value, validator, errorMessage, field} of validationData) {
                if (!validator(value)) {
                    handleError(errorMessage, field);
                    valid = false;
                }
            }
        } catch (error) {
            console.log('Error while updating trainings: ', error);
        }
        console.log('Success validation: ', valid);
        return valid;
    }

    const handleSaveAction = async (index) => {
        handleError(null, 'title')
        handleError(null, 'description')

        trimUserData(trainings[index]);
        const validForm = await validateForm(trainings[index]);
        if (!validForm) {
            return;
        }
        updateTrainingInfo(index);
        setEditable(false);
    };

    const handleCancelAction = () => {
        setEditable(false);
    };

    const handleNext = () => {
        navigation.navigate('CreateTraining');
    }

    const pickImage = async (index) => {
        let image = await pickImageFromGallery();

        if (image) {
            handleInputChange(index, "media", image);
        }
    };

    const updateTrainingInfo = async (index) => {
        const copyTraining = {title: trainings[index].title, description: trainings[index].description, media: trainings[index].media};    
        try {
            await updateTraining(copyTraining, trainings[index].id);
            await fetchGetTrainingsById(isTrainer);
        } catch (error) {
            console.log(error);
        }
    }

    const handleStarPress = async (index, myRating, starNumber) => { 
        let training = trainings[index];
        if (myRating === starNumber) {
            myRating = 0;
        } else {
            myRating = starNumber;
        }

        try {
            await UserService.rateTraining(training.id, myRating);
            training = await getTrainingById(training.id)
        } catch (error) {
            console.error("Error on chaning training rating: ", error);
        }
        training.myRating = myRating;
        trainings[index] = training;
        setTrainings([...trainings]);
    };

    const Star = ({index, rating, starNumber}) => {
        const isSelected = rating >= starNumber;
        const iconName = isSelected ? 'star' : 'star-outline';
        const color = isSelected ? tertiaryColor : greyColor;
      
        return (
          <TouchableOpacity onPress={() => handleStarPress(index, rating, starNumber)}>
            <Icon name={iconName} size={20} color={color} />
          </TouchableOpacity>
        );
    };

    const RenderRating = ({index, training}) => {
        const stars = [1, 2, 3, 4, 5];

        return (
            <View style={{alignItems: 'flex-start'}}>
                {training.rating >= 0 &&
                    <View style={{flexDirection: 'row', marginBottom: 10, marginTop: 10}}>
                        <Text style={styles.ratingText}>Global training rating: </Text>
                        <Text style={{
                            backgroundColor: theme.colors.secondary, 
                            paddingHorizontal: 5, 
                            borderRadius: 50,
                        }}>
                            {training.rating}
                        </Text>
                    </View>
                }
                {!isTrainer &&
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>My rating: </Text>
                        {stars.map((starNumber) => (
                            <Star key={starNumber} index={index} 
                                rating={training.myRating} starNumber={starNumber} />
                        ))}
                    </View>
                }       
            </View>
        );
    }

    const TrainingItemHeader = ({index, training}) => {
        const showEdit = isTrainer && !editable;
        const showDelete = !isTrainer;
        const handlePressAction = showEdit ? handleEditAction : handleDeleteTrainingAction;
        return (
            <View style={styles.trainingItemHeader}>
                <RenderRating index={index} training={training}/>
                {(showEdit || showDelete) &&
                    <TouchableOpacity onPress={event => handlePressAction(event, index)}>
                        <IconButton
                            icon={showEdit ? "pencil" : "heart"}
                            iconColor={tertiaryColor}
                            style={{backgroundColor: secondaryColor}}
                            size={20}
                        />
                    </TouchableOpacity>
                }  
            </View>
        );
    }

    return (
        <View style={fiufitStyles.container}>
            <Text style={{...fiufitStyles.titleText,
                alignSelf: 'center',
                marginTop: 10,
                }}>
                Trainings
            </Text>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
            {isTrainer && trainings?.length > 0 && (
                <View style={{width: 350}}>
                    <Searchbar
                        placeholder="Search"
                        onSubmitEditing={handleSearch}
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        style={{backgroundColor: tertiaryColor, marginTop: 5}}
                    />
                    <View style={{justifyContent: 'space-evenly', flexDirection: 'row',  paddingTop: 10}}>
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
                    </View>
                    <Button onPress={handleSearch} title="Search"/>
                    <Button onPress={handleResetFilters} title="Reset Filters"/>
                </View>
            )}       

            {loading 
                ?  <ActivityIndicator size="large" color={theme.colors.secondary} style={{flex: 1}}/>
                :  <ScrollView contentContainerStyle={{flexGrow: 1}}>

                        {trainings?.length === 0 && (
                            <Text style={{
                                alignSelf: 'center',
                                marginTop: 10,
                                color: tertiaryColor,
                                fontSize: 20
                            }}>
                                You have no trainings yet, add one!
                            </Text>
                        )}

                        {notFound && !loading && (
                            <Text style={{ 
                                alignSelf: 'center',
                                marginTop: 10,
                                color: whiteColor,
                                fontSize: 20
                            }}>
                                There are no results for your search.
                            </Text>
                        )}
                    
                        {trainingsToShow && trainingsToShow.map((training, index) => (
                            <List.Accordion
                                key={index}
                                style={[fiufitStyles.trainingsList, {alignSelf: 'center'}]}
                                left={(props) => <List.Icon {...props} icon="bike" />}
                                title={training.title}
                                titleStyle={{ color: primaryColor }}
                                expanded={expandedList[index]}
                                onPress={() => toogleExpanded(index)}
                            >
                                
                                <TrainingItemHeader index={index} training={training}/>
                                <TrainingEditableItem
                                    value={training.title}
                                    editable={editable}
                                    onChange={(text) => handleInputChange(index, "title", text)}
                                    rating={training.rating}
                                    error={errors.title}
                                />
                                <TrainingEditableItem
                                    value={training.description}
                                    editable={editable}
                                    onChange={(text) => handleInputChange(index, "description", text)}
                                    error={errors.description}
                                />
                                <TrainingItem
                                    value={training.type}
                                    editable={false}
                                />
                                {isTrainer && editable && 
                                    <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly', alignContent: 'center'}}>
                                        <Picker
                                            selectedValue={training.difficulty}
                                            style={{...fiufitStyles.trainingPickerSelect, alignSelf: 'center'}}
                                            onValueChange={(itemValue) => handleInputChange(index, 'difficulty', itemValue)}
                                        >
                                            <Picker.Item label="Easy" value="Easy" />
                                            <Picker.Item label="Medium" value="Medium" />
                                            <Picker.Item label="Hard" value="Hard" />
                                        </Picker>
                                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{
                                                color: tertiaryColor,
                                                marginBottom: -7,
                                                marginTop: 10,
                                            }}>Image (optional)</Text>
                                            <PapperButton onPress={() => pickImage(index)}
                                                    style={fiufitStyles.imagePickerButton}>
                                                <Icon name={"camera"} style={{
                                                    fontSize: 22,
                                                    color: secondaryColor,
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                }}/>
                                            </PapperButton>
                                        </View>
                                        
                                    </View>
                                }
                                {!editable && <TrainingItem
                                    value={trainings[index].difficulty}
                                    editable={editable}
                                    onChange={(text) => handleInputChange(index, "difficulty", text)}
                                />
                                }
                                {!editable &&
                                    <View key={training.id}>
                                        <Text style={{color: greyColor,
                                            fontSize: 18,
                                            marginVertical: 10,
                                            marginRight: 1,
                                        }}>
                                            Exercises:
                                        </Text>
                                        {training.exercises.map((exercise, index) => (
                                            <View key={index} style={{paddingBottom: 10}}>
                                                <Text style={{ color: greyColor }}>{exercise.name} {exercise.unit ? `[${exercise.unit}]` : ''}</Text>
                                                <View style={fiufitStyles.exerciseDetails}>
                                                    <Text style={{ color: greyColor }}>{`Count: ${exercise.count}`}</Text>
                                                    <Text style={{ color: greyColor }}>{`Series: ${exercise.series}`}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                }
                                {!editable && training.media &&
                                    <FastImage 
                                        source={{
                                            uri: showImage(training.media),
                                            priority: FastImage.priority.normal,
                                        }}
                                        style={{
                                            width: 120,
                                            height: 120,
                                            marginTop: 10,
                                            marginBottom: 5,
                                            borderRadius: 5,
                                            alignSelf: 'center',
                                        }}
                                    />
                                }
                                {isTrainer && editable && training.media &&
                                    <FastImage
                                        source={{
                                            uri: showImage(training.media, true),
                                            priority: FastImage.priority.normal,
                                        }}
                                        style={{
                                            width: 120,
                                            height: 120,
                                            marginTop: 10,
                                            borderRadius: 5,
                                            alignSelf: 'center',
                                        }}
                                    />
                                }
                                {isTrainer && editable && 
                                    <View style={fiufitStyles.trainingButtonContainer}>
                                        <TouchableOpacity style={fiufitStyles.trainingActionButton} onPress={() => handleSaveAction(index)}>
                                            <Text style={fiufitStyles.trainingActionButtonText}>{'Save'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={fiufitStyles.trainingActionButton} onPress={handleCancelAction}>
                                            <Text style={fiufitStyles.trainingActionButtonText}>{'Cancel'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </List.Accordion>
                        ))}
            
                        {isTrainer && !editable && <FAB
                            icon="plus"
                            type="contained-tonal"
                            style={fiufitStyles.addTrainingButton}
                            size={45}
                            onPress={handleNext}
                            color={tertiaryColor}
                            />
                        }
                    </ScrollView> 
                }
            </ScrollView>
        </View>
    );
  };
  
  const styles = StyleSheet.create({
    ratingContainer: {
        paddingBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 5
    },
    ratingText: {
        color: greyColor,
        justifyContent: 'flex-start',
    },
    trainingItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    trainingInput: {
        fontSize: 14,
        borderColor: secondaryColor,
        borderWidth: 0.8,
        color: tertiaryColor,
        paddingHorizontal: 5
    },
    trainingNotEditableInpunt: {
        fontSize: 14,
        borderColor: secondaryColor,
        borderWidth: 0.8,
        color: secondaryColor,
        paddingHorizontal: 10,
    },
});

  export default TrainingsScreen;