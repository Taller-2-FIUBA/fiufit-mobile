import {View, FlatList, SafeAreaView, TouchableOpacity, Text, ScrollView} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import Goal from "../components/Goal";
import {
    useTheme,
    Button,
    FAB,
    Portal,
    Dialog,
    Paragraph,
    Card,
    HelperText
} from "react-native-paper";
import {validateGoalDescription, validateGoalObjective, validateGoalTitle} from "../utils/validations";
import Input from "../components/Input";
import {greyColor, secondaryColor, tertiaryColor} from "../consts/colors";
import {Picker} from "@react-native-picker/picker";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {fiufitStyles} from "../consts/fiufitStyles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// TODO: Hardcodeadad las metras y las unidades, hay que ver como llegan del backend
const METRICS_DATA = [["Walk", "Steps"], ["Run", "Km"]]

const GoalsScreen = () => {
    const theme = useTheme();
    const rolePickerRef = useRef();

    const [goals, setGoals] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [newGoalFormVisible, setNewGoalFormVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // New goal form fields
    const [goalTitle, setGoalTitle] = useState('');
    const [goalDescription, setGoalDescription] = useState('');
    const [goalMetric, setGoalMetric] = useState(METRICS_DATA[0][0]);
    const [goalUnit, setGoalUnit] = useState(METRICS_DATA[0][1]);
    const [goalObjective, setGoalObjective] = useState('');
    const [goalTimeLimit, setGoalTimeLimit] = useState(null);

    // Dialog to confirm the deletion of selected goals
    const [visible, setVisible] = useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    // Hook to change automatically the goal unit when the goal metric changes
    useEffect(() => {
        const selectedTuple = METRICS_DATA.find(tuple => tuple[0] === goalMetric);
        if (selectedTuple) {
            setGoalUnit(selectedTuple[1]);
        } else {
            const selectedOption = metricsOptions.find(option => option.value === goalMetric);
            if (selectedOption) {
                setGoalUnit(selectedOption.value);
            }
        }
    }, [goalMetric]);

    // Mapped the METRICS_DATA to the format required by the Picker component
    const metricsOptions = METRICS_DATA.map((tuple) => {
        return {
            label: tuple[0],
            value: tuple[1],
        };
    });

    // Delete selected goals when user confirms
    const handleConfirm = () => {
        deleteSelectedGoals();
        hideDialog();
    };

    const deleteSelectedGoals = () => {
        setGoals(goals.filter(card => !selectedIds.includes(card.id)));
        setSelectedIds([]);
    }

    const handleSelectedChange = (id, selected) => {
        if (selected) {
            setSelectedIds(prevSelectedIds => [...prevSelectedIds, id]);
        } else {
            setSelectedIds(prevSelectedIds => prevSelectedIds.filter(selectedId => selectedId !== id));
        }
    };

    // Calendar to select the time limit of the goal
    const showDatepicker = () => {
        showMode('date');
    };

    const showMode = (currentMode) => {
        const minDate = new Date();
        const maxDate = new Date();
        maxDate.setDate(new Date().getDate() + 7);
        DateTimePickerAndroid.open({
            value: goalTimeLimit || new Date(),
            onChange,
            mode: currentMode,
            is24Hour: true,
            minimumDate: minDate,
            maximumDate: maxDate,
        });
    };

    const onChange = (event, selectedDate) => {
        setGoalTimeLimit(selectedDate.toISOString().split('T')[0]);
    };

    // Activates edit mode and retrieves the data of the selected goal
    const handleEdit = () => {
        const cardIndex = goals.findIndex(card => card.id === selectedIds[0]);
        if (cardIndex !== -1) {
            const card = goals[cardIndex];
            setGoalTitle(card.title);
            setGoalDescription(card.description);
            setGoalMetric(card.activity);
            setGoalObjective(card.objective.toString());
            setGoalTimeLimit(card.timeLimit);
            setEditMode(true);
        }
    }

    // Saves the changes made to the selected goal
    const editSelectedGoal = () => {
        const cardIndex = goals.findIndex(card => card.id === selectedIds[0]);
        if (cardIndex !== -1) {
            const card = goals[cardIndex];
            card.title = goalTitle;
            card.description = goalDescription;
            card.activity = goalMetric;
            card.objective = goalObjective;
            setGoals(prevCardData => [...prevCardData]);
            setEditMode(false);
        }
        resetNewGoalForm();
    }

    const createGoal = () => {
        function createNewCard() {
            setGoals(prevCardData => [...prevCardData, {
                id: Math.random().toString(),
                title: goalTitle,
                description: goalDescription,
                activity: goalMetric,
                objective: goalObjective,
                unit: goalUnit,
                progress: Math.round(goalObjective / (Math.floor(Math.random() * 10) + 1)),  // TODO: El progreso está puedo aleatorio
                timeLimit: goalTimeLimit,
            }]);
        }

        function validateNewGoal() {
            if (goalTitle === '') {
                alert('Title cannot be empty');
                return false;
            }
            if (goalDescription === '') {
                alert('Description cannot be empty');
                return false;
            }
            return true;
        }

        if (validateNewGoal()) {
            createNewCard();
            resetNewGoalForm();
        }
    }

    const titleHasErrors = () => {
        if (goalTitle === '') {
            return false;
        }
        return !validateGoalTitle(goalTitle);
    };

    const descriptionHasErrors = () => {
        if (goalDescription === '') {
            return false;
        }
        return !validateGoalDescription(goalDescription);
    }

    const objectiveHasErrors = () => {
        if (goalObjective === '') {
            return false;
        }
        return !validateGoalObjective(goalObjective);
    }

    const resetNewGoalForm = () => {
        setNewGoalFormVisible(false)
        setGoalTitle('');
        setGoalDescription('');
        setGoalObjective('');
        setGoalTimeLimit(null);
        setGoalMetric(METRICS_DATA[0][0]);
        setSelectedIds([]);
    }

    const renderGoals = ({item}) => {
        return (
            <Goal
                title={item.title}
                description={item.description}
                activity={item.activity}
                unit={item.unit}
                objective={item.objective}
                progress={item.progress}
                timeLimit={item.timeLimit}
                onSelectedChange={(selected) => handleSelectedChange(item.id, selected)}
                changedSelection={selectedIds.length > 0}
            />
        );
    }

    return (
        <SafeAreaView style={{
            backgroundColor: theme.colors.background,
            flex: 1
        }}>
            {!newGoalFormVisible && !editMode && (
                <View>
                    <Text style={{
                        ...fiufitStyles.titleText,
                        alignSelf: 'center',
                        marginTop: 10,
                    }}>
                        Goals
                    </Text>
                    {goals.length === 0 && (
                        <Text style={{
                            alignSelf: 'center',
                            marginTop: 10,
                            color: theme.colors.tertiary,
                            fontSize: 20,
                        }}>
                            You have no goals yet, add one!
                        </Text>
                    )}
                    <FlatList data={goals} renderItem={renderGoals} keyExtractor={item => item.id}/>
                </View>
            )}
            <FAB
                icon={'delete'}
                onPress={showDialog}
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                    borderRadius: 30,
                    backgroundColor: theme.colors.primary,
                }}
                color={theme.colors.secondary}
                visible={selectedIds.length > 0}
            />
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog} style={{
                    backgroundColor: theme.colors.background,
                }}>
                    <Dialog.Title style={{
                        color: theme.colors.secondary,
                    }}>
                        Delete selected goals
                    </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={{
                            color: theme.colors.tertiary,
                        }}>
                            Are you sure you want to delete the selected goals?
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions style={{
                        justifyContent: 'space-around',
                    }}>
                        <Button onPress={handleConfirm}
                                textColor={theme.colors.secondary}
                                style={{
                                    backgroundColor: theme.colors.background,
                                    width: 120,
                                    borderWidth: 1,
                                    borderColor: theme.colors.secondary,
                                }}>Confirm</Button>
                        <Button onPress={hideDialog}
                                textColor={theme.colors.background}
                                style={{
                                    backgroundColor: theme.colors.primary,
                                    width: 120,
                                }}>Cancel</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <FAB
                icon={'pencil'}
                onPress={handleEdit}
                style={{
                    position: 'absolute',
                    margin: 16,
                    marginBottom: 90,
                    right: 0,
                    bottom: 0,
                    borderRadius: 30,
                }}
                visible={selectedIds.length === 1 && !newGoalFormVisible}
            />
            <FAB
                icon={'plus'}
                onPress={() => setNewGoalFormVisible(true)}
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                    borderRadius: 30,
                    backgroundColor: theme.colors.primary,
                }}
                visible={selectedIds.length === 0 && !newGoalFormVisible}
                color={theme.colors.secondary}
            />
            {editMode && (
                <View style={{
                    justifyContent: 'center',
                    position: 'absolute',
                    width: '100%',
                }}>
                    <Card style={{
                        margin: 10,
                        borderRadius: 5,
                        elevation: 5,
                        backgroundColor: theme.colors.background,
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: theme.colors.secondary,
                    }}>
                        <Card.Content>
                            <Input label="Title"
                                   placeholder="Enter title"
                                   value={goalTitle}
                                   onChangeText={text => setGoalTitle(text)}
                            />
                            <HelperText type="error" visible={titleHasErrors()}
                                        style={{
                                            marginTop: -20,
                                            marginBottom: titleHasErrors() ? 0 : -20,
                                        }}>
                                Title should be between 1 and 15 characters long
                            </HelperText>
                            <Input label="Description"
                                   placeholder="Enter description"
                                   value={goalDescription}
                                   onChangeText={text => setGoalDescription(text)}
                            />
                            <HelperText type="error" visible={descriptionHasErrors()} style={{
                                marginTop: -20,
                                marginBottom: descriptionHasErrors() ? 0 : -40,
                            }}>
                                Description should be between 1 and 30 characters long
                            </HelperText>
                            <Input label={`Objective ${goalUnit ? `(${goalUnit})` : ''}`}
                                   placeholder="Enter objective"
                                   keyboardType={'numeric'}
                                   value={goalObjective}
                                   onChangeText={text => setGoalObjective(text)}
                            />
                            <HelperText type="error" visible={objectiveHasErrors()}
                                        style={{
                                            marginTop: -20,
                                            marginBottom: objectiveHasErrors() ? 0 : -20,
                                        }}>
                                Objective should be a natural number
                            </HelperText>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                marginTop: 15,
                            }}>
                                <Button onPress={() => {
                                    setEditMode(false);
                                    resetNewGoalForm();
                                }}
                                        textColor={theme.colors.background}
                                        style={{
                                            backgroundColor: theme.colors.primary,
                                            width: 100,
                                            alignSelf: 'center',
                                        }}>Cancel</Button>
                                <Button onPress={editSelectedGoal}
                                        textColor={theme.colors.secondary}
                                        style={{
                                            backgroundColor: theme.colors.background,
                                            borderWidth: 1,
                                            borderColor: theme.colors.secondary,
                                            width: 100,
                                            alignSelf: 'center',
                                        }}>Save</Button>
                            </View>
                        </Card.Content>
                    </Card>
                </View>
            )}
            {newGoalFormVisible && (
                <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                }}>
                    <View style={{
                        justifyContent: 'center',
                        position: 'relative',
                        width: '100%',
                    }}>
                        <Card style={{
                            margin: 10,
                            borderRadius: 5,
                            elevation: 5,
                            backgroundColor: theme.colors.background,
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: theme.colors.secondary,
                        }}>
                            <Card.Content>
                                <Input label="Title"
                                       placeholder="Enter title"
                                       value={goalTitle}
                                       onChangeText={text => setGoalTitle(text)}
                                />
                                <HelperText type="error" visible={titleHasErrors()}
                                            style={{
                                                marginTop: -20,
                                                marginBottom: titleHasErrors() ? 0 : -20,
                                            }}>
                                    Title should be between 1 and 15 characters long
                                </HelperText>
                                <Input label="Description"
                                       placeholder="Enter description"
                                       value={goalDescription}
                                       onChangeText={text => setGoalDescription(text)}
                                />
                                <HelperText type="error" visible={descriptionHasErrors()} style={{
                                    marginTop: -20
                                }}>
                                    Description should be between 1 and 30 characters long
                                </HelperText>
                                <Text style={{
                                    color: theme.colors.tertiary,
                                    marginBottom: 5,
                                    marginTop: descriptionHasErrors() ? 10 : -35,
                                }}>Activity</Text>
                                <View style={{
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    height: 55,
                                    marginBottom: 10,
                                }}>
                                    <Picker
                                        ref={rolePickerRef}
                                        onValueChange={(itemValue) => setGoalMetric(itemValue)}
                                        selectedValue={goalMetric}
                                        dropdownIconColor={tertiaryColor}
                                        style={{
                                            backgroundColor: secondaryColor,
                                            color: tertiaryColor,
                                            marginBottom: 10,
                                            height: 55,
                                        }}
                                        mode={'dropdown'}
                                        prompt={'Select an activity'}
                                    >
                                        {metricsOptions.map((option, index) => (
                                            <Picker.Item style={{
                                                backgroundColor: secondaryColor,
                                                color: tertiaryColor
                                            }} label={option.label} value={option.label} key={index}/>
                                        ))}
                                    </Picker>
                                </View>
                                <Input label={`Objective ${goalUnit ? `(${goalUnit})` : ''}`}
                                       placeholder="Enter objective"
                                       keyboardType={'numeric'}
                                       value={goalObjective}
                                       onChangeText={text => setGoalObjective(text)}
                                />
                                <HelperText type="error" visible={objectiveHasErrors()}
                                            style={{
                                                marginTop: -20,
                                                marginBottom: objectiveHasErrors() ? 0 : -20,
                                            }}>
                                    Objective should be a natural number
                                </HelperText>
                                <View>
                                    <Text style={{
                                        color: theme.colors.tertiary,
                                        marginBottom: -10,
                                        marginTop: objectiveHasErrors() ? 10 : 5,
                                    }}>Time limit</Text>
                                    <TouchableOpacity
                                        style={fiufitStyles.buttonDate}
                                        onPress={showDatepicker}
                                    >
                                        <Icon name={"calendar-range"} style={fiufitStyles.iconStyle}/>
                                        <Text style={{
                                            color: goalTimeLimit ? tertiaryColor : greyColor,
                                            marginLeft: 33,
                                            marginTop: -20
                                        }}>
                                            {goalTimeLimit ? goalTimeLimit : "Enter time limit (optional)"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    marginTop: 15,
                                }}>
                                    <Button onPress={resetNewGoalForm}
                                            textColor={theme.colors.background}
                                            style={{
                                                backgroundColor: theme.colors.primary,
                                                width: 100,
                                                alignSelf: 'center',
                                            }}>Cancel</Button>
                                    <Button onPress={createGoal}
                                            textColor={theme.colors.secondary}
                                            style={{
                                                backgroundColor: theme.colors.background,
                                                borderWidth: 1,
                                                borderColor: theme.colors.secondary,
                                                width: 100,
                                                alignSelf: 'center',
                                            }}>Save</Button>
                                </View>
                            </Card.Content>
                        </Card>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default GoalsScreen
